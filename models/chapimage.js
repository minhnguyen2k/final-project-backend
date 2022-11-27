'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChapImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChapImage.belongsTo(models.Chap, {
        foreignKey: 'chapId',
      });
    }
  }
  ChapImage.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      chapId: DataTypes.UUID,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ChapImage',
      tableName: 'Chap_Image',
    }
  );
  return ChapImage;
};
