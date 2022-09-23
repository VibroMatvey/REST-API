import {Sequelize, DataTypes} from "sequelize";

const sequelize = new Sequelize('api', 'root', '', {
    dialect: 'mysql',
    host: 'localhost',
    define: {
        timestamps: false,
    },
})

const Users = sequelize.define('Users', {
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
        type: DataTypes.ENUM('f', 'm'),
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
    },

    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
})

const Roles = sequelize.define('Roles', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

const Events = sequelize.define('Events', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    eventStatusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
})


const eventStatuses = sequelize.define('eventStatuses', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

const Requests = sequelize.define('Requests', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    capitanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dance: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    requestStatusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
})

const requestsStatuses = sequelize.define('requestsStatuses', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

const Invites = sequelize.define('invites', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    capitanId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    requestId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    inviteStatusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
})

const invitesStatuses = sequelize.define('invitesStatuses', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Roles.hasMany(Users, {
    foreignKey: 'roleId',
});
Users.belongsTo(Roles, {
    foreignKey: 'roleId',
});

eventStatuses.hasMany(Events, {
    foreignKey: 'eventStatusId',
});
Events.belongsTo(eventStatuses, {
    foreignKey: 'eventStatusId',
});

requestsStatuses.hasMany(Requests, {
    foreignKey: 'requestStatusId'
})
Requests.belongsTo(requestsStatuses, {
    foreignKey: 'requestStatusId'
})

Users.hasMany(Requests, {
    foreignKey: 'capitanId'
})
Requests.belongsTo(Users, {
    foreignKey: 'capitanId'
})
Events.hasMany(Requests, {
    foreignKey: 'eventId'
})
Requests.belongsTo(Events, {
    foreignKey: 'eventId',
});

invitesStatuses.hasMany(Invites, {
    foreignKey: 'inviteStatusId'
})
Invites.belongsTo(invitesStatuses, {
    foreignKey: 'inviteStatusId'
})
Events.hasMany(Invites, {
    foreignKey: 'eventId'
})
Invites.belongsTo(Events, {
    foreignKey: 'eventId',
});
Users.hasMany(Invites, {
    foreignKey: 'userId'
})
Invites.belongsTo(Users, {
    foreignKey: 'userId'
})
Requests.hasMany(Invites, {
    foreignKey: 'requestId'
})
Invites.belongsTo(Requests, {
    foreignKey: 'requestId'
})
Users.hasMany(Invites, {
    foreignKey: 'capitanId'
})
Invites.belongsTo(Users, {
    foreignKey: 'capitanId'
})

sequelize
    .sync()
    .then((data) => {
        console.log("Сервер успешно соеденился с БД");
    })
    .catch((err) => {
        console.log(err);
    });

export {Users, Events, eventStatuses, Roles, Requests, requestsStatuses, Invites, invitesStatuses}