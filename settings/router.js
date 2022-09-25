import {Router} from 'express'
import UsersController from '../Controllers/User/UserController.js'
import EventController from "../Controllers/Admin/Event/EventController.js";
import RequestController from "../Controllers/Request/RequestController.js";
import {check} from "express-validator";
import verifyToken from './middleware/Auth.js'
import HasAdmin from "./middleware/HasAdmin.js";
import InviteController from "../Controllers/Invite/InviteController.js";

const router = new Router();

router.get('/cabinet',
    verifyToken,
    UsersController.getUser
)

router.get('/admin/users',
    HasAdmin,
    UsersController.getAllUsers
)

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
    UsersController.createUser
)

router.post('/admin/register',
    HasAdmin,
    check('login')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    check('password')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    UsersController.createAdmin
)

router.post('/user/login',
    check('email', 'Не верная почта')
        .isEmail()
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    check('password')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    UsersController.loginUser
)

router.post('/admin/login',
    check('login')
        .isEmail()
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    check('password')
        .notEmpty()
        .withMessage('Поле обязательное для заполнения'),
    UsersController.loginAdmin
)

router.post('/user/update',
    verifyToken,
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

router.post('/admin/event/create',
    HasAdmin,
    check('title')
        .notEmpty()
        .withMessage('Поле "title" обязательное для заполнения'),
    check('start')
        .notEmpty()
        .withMessage('Поле "start" обязательное для заполнения'),
    EventController.createEvent
)

router.post('/admin/event/start',
    HasAdmin,
    check('id')
        .notEmpty()
        .withMessage('Поле "id" обязательное для заполнения'),
    EventController.EventStart
)
router.post('/admin/event/next',
    HasAdmin,
    check('id')
        .notEmpty()
        .withMessage('Поле "id" обязательное для заполнения'),
    EventController.EventNext
)

router.post('/request/create',
    verifyToken,
    check('dance')
        .notEmpty()
        .withMessage('Поле "dance" обязательное для заполнения'),
    RequestController.createRequest
)
router.post('/request/send',
    verifyToken,
    check('requestId')
        .notEmpty()
        .withMessage('"requestId" обязательное для заполнения'),
    RequestController.sendRequest
)
router.post('/request/member/out',
    verifyToken,
    check('requestId')
        .notEmpty()
        .withMessage('"requestId" обязательное для заполнения'),
    RequestController.outUserRequest
)
router.post('/request/capitan/out',
    verifyToken,
    check('requestId')
        .notEmpty()
        .withMessage('"requestId" обязательное для заполнения'),
    RequestController.outCapitanRequest
)


router.post('/invite/create',
    verifyToken,
    check('userId')
        .notEmpty()
        .withMessage('"userId" обязательное для заполнения'),
    InviteController.createInvite
)
router.post('/invite/confirm',
    verifyToken,
    check('requestId')
        .notEmpty()
        .withMessage('"requestId" обязательное для заполнения'),
    InviteController.inviteConfirm
)
router.post('/invite/reject',
    verifyToken,
    check('requestId')
        .notEmpty()
        .withMessage('"requestId" обязательное для заполнения'),
    InviteController.inviteReject
)
router.post('/invite/delete',
    verifyToken,
    check('userId')
        .notEmpty()
        .withMessage('"userId" обязательное для заполнения'),
    InviteController.inviteDelete
)

export default router;