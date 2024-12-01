
import sequelize from "../dbconnection.js";
import { DataTypes } from "sequelize";

const appointment = sequelize.define('appointment', {
    // Define attributes (columns)

    appointmentTime: {
        type: DataTypes.DATE,
        allowNull: true
    },  zone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    familyCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        defaultValue: 'Pending...',
        allowNull: false
    }
});
export default appointment;