import jwt from "jsonwebtoken";
import TOKEN_KEY from "../config.js";

const verifyToken = (req, res, next) => {
    let token = '';
    if (req.headers.cookie === undefined || req.headers.cookie === null) {
        token = req.headers["x-access-token"];
    } else {
        token =  req.headers.cookie.slice(2);
    }
    if (!token) {
        return res.status(403).send("Нет ключа аутентификации");
    }
    try {
        req.user = jwt.verify(token, TOKEN_KEY);
    } catch (err) {
        return res.status(401).send("Просроченый либо неверный ключ");
    }
    return next();
};

export default verifyToken;