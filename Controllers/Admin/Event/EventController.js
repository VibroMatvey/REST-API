import {Events} from "../../../settings/db.js";
import {Op} from 'sequelize';

class EventController {

    async createEvent(req, res) {
        try {
            const oldEvent = await Events.findAll({
                where: {
                    eventStatusId: {
                        [Op.ne]: 9
                    }
                }
            })
            if (oldEvent[0]) {
                res.status(500).json({error: 'Мероприятие уже создано'})
            } else {
                const {title, start} = req.body
                await Events.create({
                    title: title,
                    start: start
                })
                res.status(200).json({success: `Успешно создано новое мероприятие ${title}! Начало в ${start}.`})
            }
        } catch (e) {
            res.status(500).json({error: e})
        }
    }

    async EventStart(req, res) {
        try {
            const id = req.body.id
            const event = await Events.findOne({
                where: {
                    id: id,
                    eventStatusId: 1
                }
            })
            if (event) {
                await Events.update({eventStatusId: 2}, {
                    where: {
                        id: event.id,
                    }
                })
                res.status(200).json({success: `Начало мероприятя. Выступления 1 этапа.`})
            } else {
                res.status(500).json({error: 'Мероприятие не найдено'})
            }
        } catch (e) {
            res.status(500).json({error: 'Мероприятие не найдено'})
        }
    }

    async EventNext(req, res) {
        try {
            const id = req.body.id
            const event = await Events.findOne({
                where: {
                    id: id,
                    eventStatusId: {
                        [Op.ne]: 9
                    }
                }
            })
            if (event) {
                let status = event.eventStatusId
                await Events.update({eventStatusId: status + 1}, {
                    where: {
                        id: id
                    }
                })
                res.status(200).json({success: `Этап был успешно переключен.`})
            } else {
                res.status(500).json({error: `Мероприяте завершено.`})
            }
        } catch (e) {
            res.status(500).json({error: `Мероприяте завершено.`})
        }
    }
}

export default new EventController()