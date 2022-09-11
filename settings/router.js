import {Router} from 'express'
import UsersController from '../Controllers/Users/UserController.js'
import {check} from "express-validator";

const router = new Router();

router.get('/home', (req, res) => {
    res.send('Hello World!')
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

router.get('/users', UsersController.getAllUsers);

export default router;