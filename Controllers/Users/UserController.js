import {Users} from "../../settings/db.js";
import {validationResult} from "express-validator";

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
}

export default new UsersController();