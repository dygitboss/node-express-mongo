/* eslint-disable func-names */
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

import { ROLES } from '../config/constants';
import config from '../config';

const SCHEMA = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM(...Object.values(ROLES)),
    allowNull: false,
    defaultValue: ROLES.USER,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

export default (sequelize) => {
  const User = sequelize.define('User', SCHEMA, {
    underscored: true,
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
  });

  User.associate = (models) => {
    // associations can be defined here
  };
  User.beforeCreate((userObj, options) => {
    // eslint-disable-next-line no-param-reassign
    userObj.password = bcrypt.hashSync(userObj.password, config.app.salt);
  });
  return User;
};
