import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('jobWithChat', 'root', 'Password123#@!', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});



export default sequelize;