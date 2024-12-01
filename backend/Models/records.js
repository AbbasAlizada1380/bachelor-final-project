import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";

const records = sequelize.define('records', {
    // Define attributes (columns)
    Name: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    fatherName: { type: DataTypes.STRING, allowNull: false },
    GfatherName: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    birthDate: { type: DataTypes.STRING, allowNull: false, },
    birthPlace: { type: DataTypes.STRING, allowNull: false },
    residency: { type: DataTypes.STRING, allowNull: false },
    NIC: { type: DataTypes.STRING, allowNull: false },
    nation: { type: DataTypes.STRING, allowNull: false },
    religion: { type: DataTypes.STRING, allowNull: false },
    mode: { type: DataTypes.STRING, allowNull: false },
    coupleId: {
        type: DataTypes.STRING, allowNull: false,

    },

}, { timestamps: true });
export default records;