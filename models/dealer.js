const Sequelize = require('sequelize');

const Dealer = DATABASE.define(
  'dealers',
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: Sequelize.CHAR(50),
      allowNull: false
    },
    phone: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    email: {
      type: Sequelize.CHAR(250),
      allowNull: false
    },
    panNumber: {
      type: Sequelize.CHAR(20),
      allowNull: false
    },
    city: {
      type: Sequelize.CHAR(50),
      allowNull: false
    },
    address: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      type: Sequelize.DATE
    },
    updatedAt: {
      type: Sequelize.DATE
    }
  },
  {
    indexes: [
      {
        name: 'unique_phone',
        unique: true,
        fields: ['phone']
      },
      {
        name: 'index_name',
        unique: false,
        fields: ['name']
      }
    ]
  }
);
module.exports = Dealer;
