'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chap.belongsTo(models.Book, {
        foreignKey: 'bookId',
      });
      Chap.hasMany(models.ChapImage, {
        foreignKey: 'chapId',
      });
    }
  }
  Chap.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      bookId: DataTypes.UUID,
      chapName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Chap',
    }
  );
  return Chap;
};
