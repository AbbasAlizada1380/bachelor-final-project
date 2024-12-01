import { DataTypes } from 'sequelize';
import sequelize from '../dbconnection.js';

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        },
        // unique: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    zone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    mode: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},{
        timestamps: true
    });

export default User;



