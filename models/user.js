'use strict';
const { Model } = require('sequelize');
const hashPassword = require('../utils/hashPassword');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, {
        foreignKey: 'roleId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
      });
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      roleId: DataTypes.STRING,
    },

    {
      hooks: {
        beforeCreate: async (user, options) => {
          const hashedPassword = await hashPassword(user.password);
          user.password = hashedPassword;
        },
      },
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
