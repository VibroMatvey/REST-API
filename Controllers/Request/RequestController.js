import {Requests} from "../../settings/db.js";
import {Invites} from "../../settings/db.js";
import {Events} from "../../settings/db.js";
import {Op} from "sequelize";

class RequestController {
    async createRequest(req, res) {
        try {
            const event = await Events.findOne({
                where: {
                    eventStatusId: 1
                }
            })
            if (event) {
                const userId = req.user.user_id
                const request = await Requests.findOne({
                    where: {
                        capitanId: userId,
                        eventId: event.id,
                    }
                })
                if (request) {
                    res.status(400).json({error: 'У вас уже есть поданая заявка!'})
                } else {
                    const invites = await Invites.findOne({
                        where: {
                            userId: userId,
                            eventId: event.id,
                            inviteStatusId: {
                                [Op.ne]: 1
                            }
                        }
                    })
                    if (invites) {
                        res.status(400).json({error: 'Вы уже состоите в другой заявке'})
                    } else {
                        const {dance} = req.body
                        await Requests.create({
                            dance: dance,
                            quantity: 1,
                            capitanId: userId,
                            eventId: event.id
                        })
                        res.status(200).json({success: `Заявка "${dance}" успешно создана!`})
                    }
                }
            } else {
                res.status(400).json({error: 'Активного мероприятия нет, либо подача заявок завершена.'})
            }
        } catch (error) {
            res.status(500).json({error: 'Ошибка сервера'})
        }
    }

    async sendRequest(req, res) {
        try {
            const requestId = req.body.requestId
            const event = await Events.findOne({
                where: {
                    eventStatusId: 1
                }
            })
            if (event) {
                const confirmInvites = await Invites.findAll({
                    where: {
                        requestId: requestId,
                        eventId: event.id,
                        inviteStatusId: 2
                    }
                })
                const allInvites = await Invites.findAll({
                    where: {
                        requestId: requestId,
                        eventId: event.id,
                    }
                })
                if (confirmInvites.length === allInvites.length) {
                    await Requests.update({
                            requestStatusId: 2
                        },
                        {
                            where: {
                                id: requestId,
                                eventId: event.id,
                            }
                        })
                    res.status(200).json({error: 'Заявка успешно отправлена на модерацию.'})
                } else {
                    res.status(400).json({error: 'Не все приняли приглашение.'})
                }
            } else {
                res.status(400).json({error: 'Активного мероприятия нет, либо подача заявок завершена.'})
            }
        } catch (e) {
            res.status(500).json({error: 'Ошибка сервера'})
        }
    }

    async outUserRequest(req, res) {
        try {
            const userId = req.user.user_id
            const requestId = req.body.requestId
            const event = await Events.findOne({
                where: {
                    eventStatusId: 1
                }
            })
            if (event) {
                const request = await Requests.findOne({
                    where: {
                        id: requestId,
                        requestStatusId: 1,
                        eventId: event.id
                    }
                })
                if (request) {
                    await Invites.destroy({
                        where: {
                            userId: userId,
                            eventId: event.id,
                            requestId: requestId,
                            capitanId: request.capitanId
                        }
                    })

                    await Requests.update({
                        quantity: request.quantity - 1
                    }, {
                        where: {
                            id: requestId,
                            eventId: event.id,
                        }
                    })
                    res.status(200).json({success: 'Успешный выход из заявки!'})
                } else {
                    res.status(400).json({error: 'Не получилось выйти из заявки, т.к. заявка была отпралена'})
                }
            } else {
                res.status(400).json({error: 'Не получилось выйти из заявки, т.к. прием заявок завершен'})
            }
        } catch (e) {
            res.status(500).json({error: 'Ошибка сервера'})
        }
    }

    async outCapitanRequest (req, res) {
        try {
            const capitanId = req.user.user_id
            const requestId = req.body.requestId
            const event = await Events.findOne({
                where: {
                    eventStatusId: 1
                }
            })
            if (event) {
                const request = await Requests.findOne({
                    where: {
                        id: requestId,
                        requestStatusId: {
                          [Op.ne]: 3
                        },
                        eventId: event.id,
                        capitanId: capitanId
                    }
                })
                if (request) {
                    await Requests.destroy({
                        where: {
                            id: requestId,
                            eventId: event.id
                        }
                    })

                    await Invites.destroy({
                        where: {
                            requestId: requestId,
                            eventId: event.id
                        }
                    })
                    res.status(200).json({success: 'Заявка успешно удалена!'})
                } else {
                    res.status(400).json({error: 'Не получилось удалить заявку, т.к. заявка была отпралена'})
                }
            } else {
                res.status(400).json({error: 'Не получилось удалить заявку, т.к. прием заявок завершен'})
            }
        } catch (e) {
            res.status(500).json({error: 'Ошибка сервера'})
        }
    }
}

export default new RequestController()