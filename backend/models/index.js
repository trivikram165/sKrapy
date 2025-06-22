const { Sequelize } = require('sequelize');
const config =require('../config');

const sequelize = new Sequelize(
  config.DB.database,
  config.DB.username,
  config.DB.password,
  {
    host: config.DB.host,
    dialect: config.DB.dialect,
  }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize);
db.PasswordResetToken = require('./passwordResetToken')(sequelize);
db.Cart = require('./cart')(sequelize);
db.Order = require('./order')(sequelize);


db.User.hasMany(db.PasswordResetToken, { foreignKey: 'userId' });
db.PasswordResetToken.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasOne(db.Cart, { foreignKey: 'userId' });
db.Cart.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasMany(db.Order, { foreignKey: 'userId' });
db.Order.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;