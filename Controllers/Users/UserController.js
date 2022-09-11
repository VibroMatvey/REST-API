import {Users} from "../../settings/db.js";
import {validationResult} from "express-validator";
import { randomKeyGenerator } from "../../index.js";
import bcrypt from 'bcrypt';

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
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(500).json(err.array());
        }
        const { email, login, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10)
        await Users.create({
            login: login,
            email: email,
            password: hashedPassword,
            avatar: 'default.webp',
            token: randomKeyGenerator()
        })
            .then((data) => {
                res.status(200).json({ Message: `Успешная регистрация, ${login}!` });
            })
            .catch((err) => {
                res.status(500).json({ Message: err });
            });
    }
}



export default new UsersController();