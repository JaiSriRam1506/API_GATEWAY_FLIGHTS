'use strict';
/** @type {import('sequelize-cli').Migration} */
const {ENUMS}=require('../utils/common');
const {CUSTOMER,ADMIN,FLIGHT_COMPANY}=ENUMS.USER_ROLES_ENUMS;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.ENUM,
        allowNull:false,
        defaultValue:CUSTOMER,
        values:[CUSTOMER,ADMIN,FLIGHT_COMPANY]
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Roles');
  }
};