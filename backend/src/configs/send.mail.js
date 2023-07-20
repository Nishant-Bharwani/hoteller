const nodemailer = require('nodemailer');
const { NODEMAILER_EMAIL_ADDRESS, NODEMAILER_APP_GENERATED_PASSWORD } = require('../../config');
const { successResponse, errorResponse } = require('../configs/api.response');
const { SERVER_ERROR } = require('../../errors');

const sendEmail = async (res, user, url, subjects, message, title) => {


    try {

        const transpoter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: NODEMAILER_EMAIL_ADDRESS,
                pass: NODEMAILER_APP_GENERATED_PASSWORD
            }
        });
        const mailOptions = {
            // from: 'nbtaylor1031@gmail.com',
            to: user.email,
            subject: subjects,
            text: message,
            html: `<div>
            <h4>${title}</h4>
            <a href="${url}" target="_blank">Click Here</a>
          </div>`
        };

        await transpoter.sendMail(mailOptions);

        return res.status(200).json(successResponse(
            0,
            'SUCCESS',
            `Email sent to ${user.email} successful`
        ));
    } 
    catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return res.status(500).json(errorResponse(
            2,
            SERVER_ERROR,
            err
        ));
    }

};

module.exports = sendEmail;