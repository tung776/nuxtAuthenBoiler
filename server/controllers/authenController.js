const User = require('../models/user')
const jwt = require("jsonwebtoken");
const configEnv = require("../config/env")();

function jwtSignUser(_user) {
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return jwt.sign(_user, configEnv.authen.jwtSecret, {
        expiresIn: configEnv.sessionExpiresIn
    });
}
module.exports = {
    async register(req, res) {
        try {
            console.log('req.body = ', req.body)
            const {
                email,
                password
            } = req.body;
            const _user = new User(req.body);
            _user.password = _user.encryptPassword(password)
            const result = await _user.save();
            res.send(result.toJSON());

        } catch (err) {
            console.log("đã có lỗi: ", err);
            res.status(400).send({
                error: "Địa chỉ email này đã được đăng ký!"
            });
        }
    },
    async profile(req, res) {
        try {

            const _user = req.user;

            if (!_user) {
                return res.status(403).send({
                    error: "Người dùng chưa đăng ký"
                });
            }
            const userJson = _user.toJSON();
            res.send({
                user: userJson,
                token: jwtSignUser(userJson)
            });
        } catch (err) {
            console.log("đã có lỗi: ", err);
            res.status(400).send({
                error: "Địa chỉ email này đã được đăng ký!"
            });
        }
    },
    async login(req, res) {
        try {

            const {
                email,
                password
            } = req.body;
            const _user = await User.findOne({
                email: email
            });

            if (!_user) {
                return res.status(403).send({
                    error: "Người dùng chưa đăng ký"
                });
            }
            if (!_user.validPassword(password)) {
                return res.status(403).send({
                    error: "sai mật khẩu"
                });
            }
            const userToken = _user.toJSON();
            res.send({
                user: userToken,
                token: jwtSignUser(userToken)
            });
        } catch (err) {
            console.log("đã có lỗi: ", err);
            res.status(400).send({
                error: "Người dùng chưa đăng ký!"
            });
        }
    },
    async logout(req, res) {
        try {

            res.send({
                message: 'post logout'
            });
        } catch (err) {
            console.log("đã có lỗi: ", err);
            res.status(400).send({
                error: "Địa chỉ email này đã được đăng ký!"
            });
        }
    },
}