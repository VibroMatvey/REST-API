import {Router} from 'express'
import UsersController from '../Controllers/Users/UserController.js'
import {Users} from "./db.js";
import {check} from "express-validator";
import verifyToken from '../middleware/auth.js'

const router = new Router();

router.get('/home', verifyToken, (req, res) => {
    const info = req.user.user_id
    Users.findOne({where:{id:info}}).then(data=> {
        res.json(data)
    })
})

router.post('/user/register',
    check('email', 'Не верная почта')
        .isEmail()
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    check('login', 'Не верный логин')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    check('password', 'Не верный пароль')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    UsersController.createUser)

router.post('/user/login',
    check('email', 'Не верная почта')
        .isEmail()
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    check('password')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    UsersController.loginUser)

router.get('/users', UsersController.getAllUsers);

export default router;