import {Sequelize, DataTypes} from "sequelize";

const sequelize = new Sequelize('API', 'root', '', {
    dialect: 'mysql',
    host: 'localhost',
    define: {
        timestamps: false,
    },
})

const Users = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: true
    },

    surName: {
        type: DataTypes.STRING,
        allowNull: true
    },

    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    gender: {
        type: DataTypes.ENUM( 'f', 'm'),
        allowNull: true,
    },

    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    social: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    avatar: {
        type: DataTypes.STRING,
        default: 'default.png',
        allowNull: false,
    },

    token: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

sequelize
    .sync()
    .then((data) => {
        console.log("Сервер успешно соеденился с БД");
    })
    .catch((err) => {
        console.log(err);
    });

export { Users }