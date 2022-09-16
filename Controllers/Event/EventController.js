import {Events} from "../../settings/db.js";
import {validationResult} from "express-validator";

class EventController {

    async createEvent(req, res) {
        try {
            const oldEvent = Events.findOne({ where: { eventStatusId: 2 || 3 || 4 || 5 || 6 || 7 || 8 } })
            if (oldEvent) {
                console.log(oldEvent)
                res.status(500).json({error: 'Мероприятие уже создано'})
            } else {
                const err = validationResult(req);
                if (!err.isEmpty()) {
                    return res.status(500).json(err.array());
                }
                const {title, start} = req.body
                const event = await Events.create({
                    title: title,
                    start: start
                })
                res.status(200).json({success: `Создано новое мероприятие ${title}!`})
            }
        } catch (e) {
            res.status(500).json({error: e})
        }
    }
}

export default new EventController()