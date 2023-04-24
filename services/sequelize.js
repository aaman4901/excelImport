const Sequelize = require('sequelize');
const config = require('../config/config');

module.exports = getSqlConnection = () => {
  let seqInstance = new Sequelize(
    config.DATABASE.NAME,
    config.DATABASE.USER,
    config.DATABASE.PASSWORD,
    {
      host: config.DATABASE.HOST,
      port: config.DATABASE.PORT,
      dialect: config.DATABASE.DIALECT,
      charset: config.DATABASE.CHARSET,
      collate: config.DATABASE.COLLATE,
      freezeTableName: true,
      // dialectOptions: {
      //   ssl: true,
      //   native: true
      // },
      hooks: {
        beforeCreate(rec, opts) {
          let creationDate = new Date();
          rec.dataValues.createdAt = creationDate;
          rec.dataValues.updatedAt = creationDate;
        },
        beforeUpdate(rec, options) {
          rec.dataValues.updatedAt = new Date();
        },
        beforeBulkCreate(rec, opts) {
          let creationDate = new Date();
          for (let i in rec) {
            rec[i].createdAt = creationDate;
            rec[i].updatedAt = creationDate;
          }
        },
        beforeBulkUpdate(rec, options) {
          rec.attributes.updatedAt = new Date();
          rec.fields.push('updatedAt');
        }
      },
      benchmark: false,
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
        acquire: 30000
      }
    }
  );
  seqInstance
    .authenticate()
    .then(() => {
      seqInstance.sync({ alter: false, force: false });
    })
    .catch((error) => {
      console.log('error occured in connecting with database: ', error);
    });
  return seqInstance;
};
