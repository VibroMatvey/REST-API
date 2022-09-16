import {Router} from 'express'
import UsersController from '../Controllers/User/UserController.js'
import EventController from "../Controllers/Event/EventController.js";
import {Users, Events} from "./db.js";
import {check} from "express-validator";
import verifyToken from '../middleware/auth.js'

const router = new Router();

router.get('/cabinet', verifyToken, (req, res) => {
    const info = req.user.user_id
    Users.findOne({ where: { id:info } }).then(data=> {
        if (data == null) {
            return res.status(500).json({Message: 'Такого пользователя не существует'})
        }
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

router.post('/user/update', verifyToken,
    check('name')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    check('surName')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    check('lastName')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    check('city')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    check('gender')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    check('social')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    check('avatar')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    check('age')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    UsersController.updateUser
    )

router.post('/event/create',
    check('title')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    check('start')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    EventController.createEvent
    )

router.get('/users', UsersController.getAllUsers);

export default router;