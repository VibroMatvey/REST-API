import jwt from "jsonwebtoken";
import TOKEN_KEY from "../../config.js";

const HasAdmin = (req, res, next) => {
    let key = '';
    if (req.headers.cookie === undefined || req.headers.cookie === null) {
        key = req.headers["x-access-token"];
    } else {
        key =  req.headers.cookie.slice(2);
    }
    if (!key) {
        return res.status(403).send("Нет ключа аутентификации");
    }
    try {
        req.user = jwt.verify(key, TOKEN_KEY);
        if (req.user.user_role === 2) {
            return next();
        } else {
            res.status(407).json({ error: 'Недостаточно прав' })
        }
    } catch (err) {
        return res.status(401).send("Просроченый либо неверный ключ");
    }

};

export default HasAdmin;