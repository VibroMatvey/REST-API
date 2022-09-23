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
            res.status(500).json( {error: 'Ошибка сервера'} )
        }
    }
}

export default new RequestController()