const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    role: {
      type: DataTypes.ENUM('user', 'vendor'),
      allowNull: false
    },
    
    streetAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    evmAddress: { type: DataTypes.STRING, allowNull: true, unique: true },
    solanaAddress: { type: DataTypes.STRING, allowNull: true, unique: true },
    
    firstName: {
        type: DataTypes.STRING,
        allowNull: function() { return this.role === 'user'; }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: function() { return this.role === 'user'; }
    },
    
    businessName: {
        type: DataTypes.STRING,
        allowNull: function() { return this.role === 'vendor'; }
    },
  });
};