import {Router} from 'express'
import UsersController from '../Controllers/User/UserController.js'
import EventController from "../Controllers/Event/EventController.js";
import RequestController from "../Controllers/Request/RequestController.js";
import {Users, Requests, requestsStatuses, Events} from "./db.js";
import {check} from "express-validator";
import verifyToken from './middleware/auth.js'
import InviteController from "../Controllers/Invite/InviteController.js";

const router = new Router();

router.get('/cabinet', verifyToken, async (req, res) => {
    const id = req.user.user_id
    const user = await Users.findOne({
        where: {id: id}
    })
    if (user) {
        if (user.roleId === 2) {
            const requests = await Requests.findAll({
                include: [
                    {model: Users, required: true},
                    {model: requestsStatuses, required: true},
                    {model: Events, required: true}
                ]
            })
            const data = []
            requests.forEach(request => {
                data.push({
                    id: request.id,
                    dance: request.dance,
                    User: {
                        email: request.User.email,
                        login: request.User.login
                    },
                    quantity: request.quantity,
                    Event: request.Event.title,
                    requestsStatus: request.requestsStatus.title
                })
            })
            console.log(data)
            res.json(data)
        } else {
            res.json(user)
        }
    }
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
        .withMessage('Поле "title" обязательное для заполнения'),
    check('start')
        .notEmpty()
        .withMessage('Поле "start" обязательное для заполнения'),
    EventController.createEvent
)

router.post('/event/start',
    check('id')
        .notEmpty()
        .withMessage('Поле "id" обязательное для заполнения'),
    EventController.EventStart
)
router.post('/event/next',
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

router.get('/users', UsersController.getAllUsers);

export default router;