import { Router } from 'express'
import UsersController from '../Controllers/Users/UserController.js'
const router = new Router();

router.get('/home', (req, res) => {
    res.send('Hello World!')
})

// router.post('/auth/register', )

router.get('/users', UsersController.getAllUsers);

export default router;