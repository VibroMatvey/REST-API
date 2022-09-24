import {Roles, Users} from "../../settings/db.js";
import {validationResult} from "express-validator";
import {randomKeyGenerator} from "../../index.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import TOKEN_KEY from "../../config.js";
import {Op} from "sequelize";

class UsersController {
    getAllUsers(req, res) {
        Users.findAll({
            where: {
                id: {
                    [Op.ne]: req.user.user_id
                }
            },
            include: [
                {model: Roles, required: true}
            ]
        }).then((data) => {
            const Users = []
            data.forEach(user => {
                Users.push({
                    id: user.id,
                    email: user.email,
                    login: user.login,
                    name: user.name,
                    surname: user.surName,
                    lastname: user.lastName,
                    city: user.city,
                    gender: user.gender,
                    age: user.age,
                    social: user.social,
                    avatar: user.avatar,
                    token: user.token,
                    Role: user.Role.title
                })
            })
            res.status(200).json(Users)
        })
            .catch((err) => {
                res.status(500).json(err)
            })
    }

    getUser(req, res) {
        const id = req.user.user_id
        Users.findOne({
            where: {id: id},
            include: [
                {model: Roles, required: true}
            ]
        }).then((user) => {
            res.status(200).json({
                email: user.email,
                login: user.login,
                name: user.name,
                surname: user.surName,
                lastname: user.lastName,
                city: user.city,
                gender: user.gender,
                age: user.age,
                social: user.social,
                avatar: user.avatar,
                token: user.token,
                Role: user.Role.title
            })
        })
    }

    async createUser(req, res) {
        try {
            const err = validationResult(req);
            if (!err.isEmpty()) {
                return res.status(500).json(err.array());
            }
            const {email, login, password} = req.body;
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await Users.create({
                login: login,
                email: email,
                password: hashedPassword,
                avatar: 'default.webp',
                token: randomKeyGenerator()
            })

            const key = jwt.sign(
                {
                    user_id: user.id,
                    user_role: user.roleId
                },
                TOKEN_KEY,
                {
                    expiresIn: "7d",
                }
            )
            res.cookie('k', key)
            res.status(201).json({success: 'Регистрация прошла успешно!'});
        } catch (err) {
            console.log(err);
        }
    }

    async createAdmin(req, res) {
        try {
            const {login, password} = req.body;
            const hashedPassword = await bcrypt.hash(password, 10)
            const admin = await Users.create({
                login: login,
                password: hashedPassword,
                email: login + '@admin.admin',
                avatar: 'default.webp',
                token: randomKeyGenerator(),
                roleId: 2
            })

            const key = jwt.sign(
                {
                    user_id: admin.id,
                    user_role: admin.roleId
                },
                TOKEN_KEY,
                {
                    expiresIn: "7d",
                }
            )
            res.cookie('k', key)
            res.status(201).json({success: 'Регистрация прошла успешно!'});
        } catch (err) {
            console.log(err);
        }
    }

    async loginUser(req, res) {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(500).json(err.array());
        }
        const body = req.body;
        const user = await Users.findOne({
            where: {
                email: body.email,
                roleId: {
                    [Op.ne]: 2
                }
            }
        });
        if (user) {
            const validPassword = await bcrypt.compare(body.password, user.password);
            if (validPassword) {
                const key = jwt.sign(
                    {
                        user_id: user.id,
                        user_role: user.roleId
                    },
                    TOKEN_KEY,
                    {
                        expiresIn: "7d",
                    }
                )
                res.cookie('k', key)

                res.status(200).json({success: `Авторизован как ${user.email}`});
            } else {
                res.status(400).json({error: "Неверный пароль"});
            }
        } else {
            res.status(401).json({error: "Такого пользователя не существует"});
        }
    }

    async loginAdmin(req, res) {
        const body = req.body;
        const admin = await Users.findOne({
            where: {
                login: body.login,
                roleId: 2
            }
        });
        if (admin) {
            const validPassword = await bcrypt.compare(body.password, admin.password);
            if (validPassword) {
                const key = jwt.sign(
                    {
                        user_id: admin.id,
                        user_role: admin.roleId
                    },
                    TOKEN_KEY,
                    {
                        expiresIn: "7d",
                    }
                )
                res.cookie('k', key)
                res.status(200).json({success: `Успешная авторизация!`});
            } else {
                res.status(400).json({error: "Неверный пароль"});
            }
        } else {
            res.status(401).json({error: "Такого пользователя не существует"});
        }
    }

    async updateUser(req, res) {
        try {
            const id = req.user.user_id
            const {email, login, name, surName, lastName, gender, city, age, social, avatar} = req.body
            Users.update({
                email: email,
                login: login,
                name: name,
                surName: surName,
                lastName: lastName,
                gender: gender,
                city: city,
                age: age,
                social: social,
                avatar: avatar
            }, {
                where: {
                    id: id
                }
            })
            res.status(200).json({success: 'Информация обновлена успешно!'});
        } catch (e) {
            res.json(e)
        }
    }
}


export default new UsersController();