'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Favorite.belongsTo(models.Book, {
        foreignKey: 'bookId',
        onDelete: 'cascade',
      });
      Favorite.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  }
  Favorite.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      bookId: DataTypes.UUID,
      userId: DataTypes.UUID,
    },

    {
      sequelize,
      modelName: 'Favorite',
    }
  );
  return Favorite;
};
