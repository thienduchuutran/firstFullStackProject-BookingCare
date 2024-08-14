'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('markdowns', {
      // id: DataTypes.INTEGER,
      // firstName: DataTypes.STRING,
      // lastName: DataTypes.STRING,
      // email: DataTypes.STRING,
      // address: DataTypes.STRING,
      // gender: DataTypes.BOOLEAN,
      // roleid: DataTypes.STRING
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contentHTML: {
        allowNull: false,
        type: Sequelize.TEXT('long')
      },
      contentMarkdown: {
        allowNull: false,
        type: Sequelize.TEXT('long')
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT('long')
      },
      doctorId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      specialtyId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      clinicId: {
        allowNull: true,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('markdowns');
  }
};