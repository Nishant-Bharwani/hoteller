const fs = require('fs');
const { SERVER_ERROR } = require("../../errors");
const { errorResponse, successResponse } = require("../configs/api.response");
const UserModel = require("../models/user.model");
const hashService = require("../services/hash.service");
const logger = require('../middlewares/winston.logger');
const appRoot = require('app-root-path');
const moment = require('moment');
const loginResponse = require('../configs/login.response');
const { BASE_URL } = require('../../config');
const sendEmail = require('../configs/send.mail');
const UserDto = require('../dtos/user.dto');
const { log } = require('winston');
const crypto = require('crypto');


class AuthController {

    async register(req, res) {

        try {
            const { username, fullname, email, phone, password, dob, address, gender, role } = req.body;
            if (username && fullname && email && password && dob && address) {
                const usernameExists = await UserModel.findOne({ username });
                const emailExists = await UserModel.findOne({ email });
                const phoneExists = await UserModel.findOne({ phone });

                if (usernameExists) {
                    // Delete image
                    if (req?.file?.filename) {
                        fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
                            if (err) { logger.error(err); }
                        });
                    }

                    return res.status(409).json(errorResponse(
                        9,
                        'ALREADY EXISTS',
                        'Sorry, Username already exists'
                    ));
                }

                if (emailExists) {
                    if (req?.file?.filename) {
                        fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
                            if (err) { logger.error(err); }
                        });
                    }
                    return res.status(409).json(errorResponse(
                        9,
                        'ALREADY EXIST',
                        'Sorry, Email already exists'
                    ));
                }

                if (phoneExists) {
                    if (req?.file?.filename) {
                        fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
                            if (err) { logger.error(err); }
                        });
                    }
                    return res.status(409).json(errorResponse(
                        9,
                        'ALREADY EXIST',
                        'Sorry, Phone number already exists'
                    ));
                }

                const hashedPassword = await hashService.hashPassword(password);

                const user = await UserModel.create({
                    username,
                    fullname,
                    email,
                    phone,
                    password: hashedPassword,
                    avatar: req.file ? `/uploads/users/${req.file.filename}` : '/avatar.png',
                    gender,
                    dob: moment(dob, 'DD-MM_YYYY').toDate(),
                    address,
                    role
                });

                res.status(201).json(successResponse(
                    0,
                    'SUCCESS',
                    'User registered successful', new UserDto(user)
                ));

            } else {
                // Delete image
                if (req?.file?.filename) {
                    fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
                        if (err) { logger.error(err); }
                    });
                }
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    'Please enter all required fields'
                ));
            }
        } catch (err) {
            if (req?.file?.filename) {
                fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
                    if (err) { logger.error(err); }
                });
            }

            res.status(500).json(errorResponse(
                2,
                'SERVER SIDE ERROR',
                err
            ));
        }
    }

    async login(req, res) {
        try {
            const { usernameOrEmail, password } = req.body;
            const { loginType } = req.query;

            if (!usernameOrEmail || !password) {
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    'Please enter all necessary credentials'
                ));
            }

            const user = await UserModel.findOne({
                $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
            }).select('password');

            if (!user) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'User does not exist'
                ));
            }

            if (loginType === 'admin') {
                if (user.role !== 'admin') {
                    return res.status(406).json(errorResponse(
                        6,
                        'UNABLE TO ACCESS',
                        'Accessing the page or resource you were trying to reach is forbidden'
                    ));
                }
            }

            if (user.status === 'blocked') {
                return res.status(406).json(errorResponse(
                    6,
                    'UNABLE TO ACCESS',
                    'Accessing the page or resource you were trying to reach is forbidden'
                ));
            }

            const isPasswordMatch = await hashService.validateHashedPassword(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    'User credentials are incorrect'
                ));
            }

            const logUser = await UserModel.findByIdAndUpdate(
                user._id,
                { status: 'login' },
                { new: true }
            );

            loginResponse(res, logUser);

        } catch (err) {
            res.status(500).json(errorResponse(
                1,
                'FAILED',
                err
            ));
        }
    }

    async logout(req, res) {
        try {
            const { user } = req;
            if (!user) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'Unauthorized access. Please login to continue'
                ));
            }

            await UserModel.findByIdAndUpdate(
                user._id,
                { status: 'logout', updatedAt: Date.now() },
                { new: true }
            );

            // remove cookie
            res.clearCookie('AccessToken');
            res.clearCookie('RefreshToken');
            res.status(200).json(successResponse(
                0,
                'SUCCESS',
                'User logged out successful'
            ));
        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }
    }

    async forgotPassword(req, res) {
        try {
            logger.info(req.body.usernameOrEmail);
            const user = await UserModel.findOne({
                $or: [{ username: req.body.usernameOrEmail }, { email: req.body.usernameOrEmail }]
            });

            if (!user) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'User does not exist'
                ));
            }

            const resetToken = await user.getResetPasswordToken();
            await user.save({ validateBeforeSave: false });

            const url = `${BASE_URL}/auth/forgot-password/${resetToken}`;
            const subjects = 'Password Recovery Email';
            const message = 'Click below link to reset your password. If you have not requested this email simply ignore this email.';
            const title = 'Recover Your Password';

            sendEmail(res, user, url, subjects, message, title);
        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }
    }

    async resetPassword(req, res) {
        try {
            if (req.params.token && req.body.password && req.body.confirmPassword) {
                const resetPasswordToken = crypto
                    .createHash('sha256')
                    .update(req.params.token)
                    .digest('hex');

                const user = await UserModel.findOne({
                    resetPasswordToken,
                    resetPasswordExpire: { $gt: Date.now() }
                });


                if (!user) {
                    return res.status(404).json(errorResponse(
                        4,
                        'UNKNOWN ACCESS',
                        'Reset Password Token is invalid or has been expired'
                    ));
                }

                if (req.body.password !== req.body.confirmPassword) {
                    return res.status(400).json(errorResponse(
                        1,
                        'FAILED',
                        'Password and Confirm password does not match'
                    ));
                }

                const hashedPassword = await hashService.hashPassword(req.body.password);
                user.password = hashedPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                await user.save();

                res.status(200).json(successResponse(
                    0,
                    'SUCCESS',
                    'User password reset successful'
                ));
            } else {
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    'Please enter all required fields'
                ));
            }
        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }
    }

    async sendEmailVerificationLink(req, res) {
        try {
            const { user } = req;

            if (!user) {
                return res.status(404).json(errorResponse(
                    4,
                    'UNKNOWN ACCESS',
                    'User does not exist'
                ));
            }

            if (user.verified) {
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    'Ops! Your mail already verified'
                ));
            }

            const emailVerificationToken = user.getEmailVerificationToken();

            await user.save({ validateBeforeSave: false });

            const url = `${BASE_URL}/auth/verify-email/${emailVerificationToken}`;
            const subjects = 'User Email Verification';
            const message = 'Click below link to verify your email. If you have not requested this email simply ignore this email.';
            const title = 'Verify Your Email';

            sendEmail(res, user, url, subjects, message, title);

        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }
    }

    async verifyEmail(req, res) {
        try {
            if (req.params.token) {
                const emailVerificationToken = crypto
                    .createHash('sha256')
                    .update(req.params.token)
                    .digest('hex');
                const user = await UserModel.findOne({
                    emailVerificationToken,
                    emailVerificationExpire: { $gt: Date.now() }
                });

                if (!user) {
                    return res.status(404).json(errorResponse(
                        4,
                        'UNKNOWN ACCESS',
                        'Email verification token is invalid or has been expired'
                    ));
                }

                user.emailVerificationToken = undefined;
                user.emailVerificationExpire = undefined;
                user.verified = true;
                await user.save();

                res.status(200).json(successResponse(
                    0,
                    'SUCCESS',
                    'User email verification successful'
                ));
            } else {
                return res.status(400).json(errorResponse(
                    1,
                    'FAILED',
                    'Please enter all required fields'
                ));
            }
        } catch (err) {
            res.status(500).json(errorResponse(
                2,
                SERVER_ERROR,
                err
            ));
        }
    }
};

module.exports = new AuthController();