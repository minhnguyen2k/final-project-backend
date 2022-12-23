'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Book_Author', {
      authorId: {
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Authors',
          },
          key: 'id',
        },
        allowNull: false,
      },
      bookId: {
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Books',
          },
          key: 'id',
        },
        onDelete: 'cascade',
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Book_Author');
  },
};
