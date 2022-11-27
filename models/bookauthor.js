'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookAuthor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  BookAuthor.init(
    {
      authorId: DataTypes.UUID,
      bookId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'BookAuthor',
      tableName: 'Book_Author',
      timestamps: false,
    }
  );
  return BookAuthor;
};
