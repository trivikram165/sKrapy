const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('PasswordResetToken', {
    token: { type: DataTypes.STRING, unique: true },
    userId: { type: DataTypes.INTEGER, allowNull: false }, 
    expiresAt: DataTypes.DATE
  });
};