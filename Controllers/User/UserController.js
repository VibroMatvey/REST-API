import {Users} from "../../settings/db.js";
import {validationResult} from "express-validator";
import {randomKeyGenerator} from "../../index.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import TOKEN_KEY from "../../config.js";

class UsersController {

    getAllUsers(req, res) {
        Users.findAll({}).then((data) => {
            const Users = []
            data.forEach(User => {
                Users.push({
                    id: User.id,
                    name: User.name,
                    surName: User.surName,
                    lastName: User.lastName,
                    email: User.email,
                    gender: User.gender,
                    login: User.login,
                    age: User.age,
                    password: User.password,
                    city: User.city,
                    social: User.social,
                    token: User.token,
                    avatar: User.avatar,
                })
            })
            res.status(200).json(Users)
        })
            .catch((err) => {
                res.status(500).json(err)
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
            res.status(201).json(user);
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
        const user = await Users.findOne({where: {email: body.email}});
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

                res.status(200).json({message: `Авторизован как ${user.email}`});
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
            const {name, surName, lastName, gender, city, age, social, avatar} = req.body
            Users.update({
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
            res.status(200).json({message: `${name}, Регистрация прошла успешно!`});
        } catch (e) {
            res.json(e)
        }
    }
}


export default new UsersController();