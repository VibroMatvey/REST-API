import {Requests} from "../../settings/db.js";
import {Invites} from "../../settings/db.js";
import {Events} from "../../settings/db.js";
import {Op} from "sequelize";

class InviteController {
    async createInvite(req, res) {
        try {
            const event = await Events.findOne({
                where: {
                    eventStatusId: 1
                }
            })
            if (event) {
                const capitanId = req.user.user_id
                const userId = req.body.userId
                const userRequest = await Requests.findOne({
                    where: {
                        capitanId: userId,
                        eventId: event.id
                    }
                })
                if (userRequest) {
                    res.status(400).json({error: 'Приглашение не было отправлено, т.к. у данного пользователя есть собственная заявка.'})
                } else {
                    const userInvite = await Invites.findOne({
                        where: {
                            userId: userId,
                            eventId: event.id,
                            capitanId: {
                                [Op.ne]: capitanId
                            },
                            inviteStatusId: {
                                [Op.ne]: 3
                            }
                        }
                    })
                    if (userInvite) {
                        if (userInvite.inviteStatusId === 1) {
                            res.status(400).json({error: 'Приглашение не было отправлено, т.к. у данного пользователя есть приглашение без ответа, необходимо оветить на предыдущее приглашение.'})
                        }
                        if (userInvite.inviteStatusId === 2) {
                            res.status(400).json({error: 'Приглашение не было отправлено, т.к. у данного пользователя есть принятое приглашение.'})
                        }
                    } else {
                        const capitanInvite = await Invites.findOne({
                            where: {
                                capitanId: capitanId,
                                userId: userId,
                                eventId: event.id
                            }
                        })
                        if (capitanInvite) {
                            res.status(400).json({error: 'Приглашение не было отправлено, т.к. Вы уже отправили приглашение этому пользователю.'})
                        } else {
                            const capitanRequest = await Requests.findOne({
                                where: {
                                    capitanId: capitanId
                                }
                            })
                            if (capitanRequest) {
                                await Invites.create({
                                    capitanId: capitanId,
                                    userId: userId,
                                    eventId: event.id,
                                    requestId: capitanRequest.id
                                })
                                res.status(200).json({success: 'Приглашение успешно отправлено!'})
                            } else {
                                res.status(400).json({error: 'Приглашение не было отправлено, т.к. заявка не найдена.'})
                            }
                        }
                    }
                }
            } else {
                res.status(400).json({error: 'Приглашение не было отправлено, т.к. активного мероприятия нет, либо подача заявок завершена.'})
            }

        } catch (e) {
            res.status(500).json({error: 'Ошибка сервера'})
        }
    }

    async inviteConfirm (req, res) {
        try {
            const event = await Events.findOne({
                where: {
                    eventStatusId: 1
                }
            })
            if (event) {
                const userId = req.user.user_id
                const requestId = req.body.requestId
                const invites = Invites.findAll({
                    where: {
                        userId: userId,
                        eventId: event.id,
                        inviteStatusId: 2
                    }
                })
                if (invites.length > 0) {
                    res.status(400).json({error: 'Приглашение не было принято, т.к. у Вас уже есть одно принятое приглашение.'})
                } else {
                    const userRequest = await Requests.findOne({
                        where: {
                            capitanId: userId,
                            eventId: event.id,
                            requestStatusId: {
                                [Op.ne]: 4
                            }
                        }
                    })
                    if (userRequest) {
                        console.log(userRequest)
                        if (userRequest.requestStatusId === 1) {
                            res.status(400).json({error: 'Приглашение не было принято, т.к. у Вас есть собственная, неотправленная заявка. Удалите ее для продолжения'})
                        }
                        if (userRequest.requestStatusId > 1) {
                            res.status(400).json({error: 'Приглашение не было принято, т.к. у Вас есть собственная, отправленная заявка. Удалите ее для продолжения'})
                        }
                    } else {
                        const capitanRequest = await Requests.findOne({
                            where: {
                                id: requestId,
                                requestStatusId: 1,
                                eventId: event.id,
                            }
                        })
                        if (capitanRequest) {
                            const invite = await Invites.findOne({
                                where: {
                                    requestId: requestId,
                                    userId: userId,
                                    capitanId: capitanRequest.capitanId,
                                    eventId: event.id,
                                    inviteStatusId: {
                                        [Op.ne]: 1
                                    }
                                }
                            })
                            if (invite) {
                                res.status(400).json({error: 'Приглашение уже принято Вами.'})
                            } else {
                                await Requests.update({
                                    quantity: capitanRequest.quantity + 1
                                }, {
                                    where: {
                                        id: requestId
                                    }
                                })

                                await Invites.update({
                                    inviteStatusId: 2
                                }, {
                                    where: {
                                        requestId: requestId,
                                        userId: userId,
                                        eventId: event.id,
                                        capitanId: capitanRequest.capitanId,
                                    }
                                })
                                res.status(200).json({error: 'Приглашение успешно принято!'})
                            }
                        } else {
                            res.status(400).json({error: 'Приглашение не было принято, т.к. заявка не найдена.'})
                        }
                    }
                }
            } else {
                res.status(400).json({error: 'Приглашение не было отправлено, т.к. у Вас есть собственная, неотправленная заявка. Удалите ее для продолжения'})
            }
        } catch (e) {
            res.status(400).json({error: 'Приглашение не было отправлено, т.к. активного мероприятия нет, либо подача заявок завершена.'})
        }
    }
}

export default new InviteController()