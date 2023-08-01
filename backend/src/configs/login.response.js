const currentDateTime = require('../lib/current.date.time');
const tokenService = require('../services/token.service');
const { JWT_TOKEN_COOKIE_EXPIRES } = require('../../config');
const UserDto = require('../dtos/user.dto');


const loginResponse = async (res, user, fromEmailVerification = false, maintenance) => {
    const { accessToken, refreshToken } = tokenService.generateTokens({ userId: user._id });

    const cookieOptions = {
        expires: new Date(Date.now() + JWT_TOKEN_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    await tokenService.storeRefreshToken(refreshToken, user._id);

    res
        .status(200)
        .cookie('AccessToken', accessToken, cookieOptions)
        .cookie('RefreshToken', refreshToken, cookieOptions)
        .json({
            result_code: 0,
            time: currentDateTime(),
            maintenance_info: maintenance || null,
            access_token: accessToken,
            refresh_token: refreshToken,
            result: {
                title: 'SUCCESS',
                message: !fromEmailVerification ? 'User login successful' : 'User email verification successful',
                data: new UserDto(user)
            }
        });

};

module.exports = loginResponse;