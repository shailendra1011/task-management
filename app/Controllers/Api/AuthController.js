const { success, failed, validationFailedRes, notFoundMessage } = require('../../Helper/response.js');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var db = require('../../../models/mysql/index.js');
const { Validator } = require('node-input-validator');
const User = db.User

module.exports = {
    //user registration function
    register: async (req, res) => {
        try {
            const valid = new Validator(req.body, {
                username: 'required',
                email: 'required|email',
                password: 'required'
            });
            const matched = await valid.check()
            if (!matched)
                return validationFailedRes(res, valid);

            //check user alredy exist or not
            const user = await User.findOne({ where: { email: req.body.email } })
            if (user) {
                return success(res, "user already exist!");
            }
            //password security using bcrypt package
            req.body.password = await bcrypt.hash(req.body.password, 12);
            //create user in mysql database
            await User.create(req.body);
            return success(res, "Register successful!", {});

        } catch (error) {
            return failed(res, error, 500);
        }
    },
    //user login function
    login: async (req, res) => {
        try {
            const valid = new Validator(req.body, {
                email: 'required|email',
                password: 'required'
            });
            const matched = await valid.check()
            if (!matched)
                return validationFailedRes(res, valid);

            //check user exist or not
            const user = await User.findOne({ where: { email: req.body.email } });
            if (!user) {
                return notFoundMessage(res, 'user not found', {});
            }
            //check password is match or not
            if (user && (await bcrypt.compare(req.body.password, user.password))) {
               //generate token using Jwt
                const token = jwt.sign({
                    user_id: user.id
                },
                    process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: "50h",
                });

                const data = {
                    token: token,
                };
                return success(res, "Login successful!", data);
            }
            return failed(res, 'Incorrect password', 400);
        } catch (error) {
            return failed(res, error, 500);
        }
    },
}

