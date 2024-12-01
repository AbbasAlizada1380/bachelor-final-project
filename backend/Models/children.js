import sequelize from "../dbconnection.js";
import { DataTypes } from "sequelize";

const Children = sequelize.define('children', {
    // Define attributes (columns)
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birthPlace: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parentId: {
        type: DataTypes.STRING,
        allowNull: false
    }

});
export default Children;