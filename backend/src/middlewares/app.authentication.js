const jwt = require('jsonwebtoken');
const { errorResponse } = require('../configs/api.response');
const UserModel = require('../models/user.model');
const { SERVER_ERROR } = require('../../errors');
const tokenService = require('../services/token.service');


exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        const { AccessToken } = req.cookies;
        if (!AccessToken) {
            return res.status(403).json(errorResponse(
                3,
                'ACCESS FORBIDDEN',
                'Authorization is required'
            ));
        }

        const userData = await tokenService.verifyAccessToken(AccessToken);

        if (!userData) {
            return res.status(404).json(errorResponse(
                11,
                'JWT TOKEN INVALID',
                'JWT token is expired/invalid. Please logout and login again'
            ));
        }

        const user = await UserModel.findById(userData.userId);
        if (!user) {
            return res.status(404).json(errorResponse(
                4,
                'UNKNOWN ACCESS',
                'Authorization is missing/invalid'
            ));
        }


        if (user.status === 'login') {
            req.user = user;
            next();
        } else {
            return res.status(401).json(errorResponse(
                1,
                'FAILED',
                'Unauthorized access. Please login to continue'
            ));
        }


    } catch (err) {
        res.status(500).json(errorResponse(
            2,
            SERVER_ERROR,
            err
        ));
    }
};

exports.isBlocked = async (req, res, next) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(404).json(errorResponse(
                4,
                'UNKNOWN ACCESS',
                'Sorry, User does not exist'
            ));
        }
        if (user.role !== 'blocked') {
            next();
        } else {
            return res.status(406).json(errorResponse(
                6,
                'UNABLE TO ACCESS',
                'Accessing the page or resource you were trying to reach is forbidden'
            ));
        }


    } catch (err) {
        res.status(500).json(errorResponse(
            2,
            SERVER_ERROR,
            err
        ));
    }
};

exports.isAdmin = (req, res, next) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(404).json(errorResponse(
                4,
                'UNKNOWN ACCESS',
                'Sorry, User does not exist'
            ));
        }

        if (user.role === 'admin') {
            next();
        } else {
            return res.status(406).json(errorResponse(
                6,
                'UNABLE TO ACCESS',
                'Accessing the page or resource you were trying to reach is forbidden'
            ));
        }



    } catch (err) {
        res.status(500).json(errorResponse(
            2,
            SERVER_ERROR,
            err
        ));
    }
};

exports.isRefreshTokenValid = async (req, res, next) => {
    try {
        const { RefreshToken } = req.cookies;

        if (!RefreshToken) {
            return res.status(403).json(errorResponse(
                3,
                'ACCESS FORBIDDEN',
                'Authorization is required'
            ));
        }

        let userData;

        userData = await tokenService.verifyRefreshToken(RefreshToken);
        if (!userData) {
            return res.status(404).json(errorResponse(
                11,
                'JWT TOKEN INVALID',
                'JWT token is expired/invalid. Please logout and login again'
            ));
        }

        userData = await tokenService.findRefreshToken(userData.userId, RefreshToken);
        if (!userData) {
            return res.status(404).json(errorResponse(
                11,
                'JWT TOKEN INVALID',
                'JWT token is expired/invalid. Please logout and login again'
            ));
        }

        const user = await UserModel.findById(userData.userId);
        if (!user) {
            return res.status(404).json(errorResponse(
                4,
                'UNKNOWN ACCESS',
                'Authorization is missing/invalid'
            ));
        }

        if (user.status === 'login') {
            req.user = user;
            next();
        } else {
            return res.status(401).json(errorResponse(
                1,
                'FAILED',
                'Unauthorized access. Please login to continue'
            ));
        }

    } catch (err) {
        res.status(500).json(errorResponse(
            2,
            SERVER_ERROR,
            err
        ));
    }
};