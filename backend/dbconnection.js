import { Sequelize } from "sequelize";

const sequelize= new Sequelize("nextschema",'root','Abbasjan123@',{
    host:'localhost',
    port:3001,
    dialect:'mysql'
});
export default sequelize;