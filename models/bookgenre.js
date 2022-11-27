'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookGenre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BookGenre.init(
    {
      genreId: DataTypes.UUID,
      bookId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'BookGenre',
      tableName: 'Book_Genre',
      timestamps: false,
    }
  );
  return BookGenre;
};
