import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

import config from '../config';

const basename = path.basename(__filename);
const models = {};

export const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  dialect: config.db.dialect,
  host: config.db.host,
  define: { timestamps: false },
  logging: false,
});

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    models[model.name] = model;
  });

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export default models;
