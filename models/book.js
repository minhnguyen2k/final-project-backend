'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsToMany(models.Author, {
        through: models.BookAuthor,
        foreignKey: 'bookId',
        onDelete: 'cascade',
      });
      Book.belongsToMany(models.Genre, {
        through: models.BookGenre,
        foreignKey: 'bookId',
        onDelete: 'cascade',
      });
      Book.hasMany(models.Chap, {
        foreignKey: 'bookId',
      });
      Book.hasMany(models.Comment, {
        foreignKey: 'bookId',
      });
    }
  }
  Book.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      image: DataTypes.STRING,
      viewCount: DataTypes.INTEGER,
      voteCount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Book',
    }
  );
  return Book;
};
