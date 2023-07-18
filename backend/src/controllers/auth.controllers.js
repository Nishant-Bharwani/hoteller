const fs = require('fs');
const { SERVER_ERROR } = require("../../errors");
const { errorResponse, successResponse } = require("../configs/api.response");
const UserModel = require("../models/user.model");
const hashService = require("../services/hash.service");

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

                    return res.status(409).json(errorResponse(
                        9,
                        'ALREADY EXISTS',
                        'Sorry, Username already exists'
                    ));
                }

                if (emailExists) {
                    return res.status(409).json(errorResponse(
                        9,
                        'ALREADY EXIST',
                        'Sorry, Email already exists'
                    ));
                }

                if (phoneExists) {
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
                    dob,
                    address,
                    role
                });

                res.status(201).json(successResponse(
                    0,
                    'SUCCESS',
                    'User registered successful', {
                        userName: user.userName,
                        fullName: user.fullName,
                        email: user.email,
                        phone: user.phone,
                        avatar: process.env.APP_BASE_URL + user.avatar,
                        gender: user.gender,
                        dob: user.dob,
                        address: user.address,
                        role: user.role,
                        verified: user.verified,
                        status: user.status,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt
                    }
                ));





            } else {
                // Delete image

                res.status(500).json(errorResponse(
                    2,
                    SERVER_ERROR,
                    error
                ));
            }
        } catch (err) {
            // if (req ? .file ? .filename) {
            //     fs.unlink(`${appRoot}/public/uploads/users/${req.file.filename}`, (err) => {
            //         if (err) { logger.error(err); }
            //     });
            // }

            res.status(500).json(errorResponse(
                2,
                'SERVER SIDE ERROR',
                error
            ));
        }
    }
};

module.exports = new AuthController();