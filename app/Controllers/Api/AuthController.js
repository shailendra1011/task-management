const { success, failed, validationFailedRes, notFoundMessage } = require('../../Helper/response.js');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var db = require('../../../models/mysql/index.js');
const { Validator } = require('node-input-validator');
const User = db.User

module.exports = {
    register: async (req, res) => {
        try {
            const valid = new Validator(req.body, {
                // username: 'required',
                email: 'required',
                password: 'required'
            });
            const matched = await valid.check()
            if (!matched)
                return validationFailedRes(res, valid);
            const user = await User.findOne({ where: { email: req.body.email } })

            if (user) {
                return success(res, "user already exist!");
            }
            req.body.password = await bcrypt.hash(req.body.password, 12);
            await User.create(req.body);

            return success(res, "Register successful!", {});

            console.log(token);
        } catch (error) {
            return failed(res, error, 500);
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return failed(res, 'User does not exist', 400);
            }                
            if (user && (await bcrypt.compare(password, user.password))) {  
                const token = jwt.sign({
                    user_id: user.id
                },
                    process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: "500h",
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

