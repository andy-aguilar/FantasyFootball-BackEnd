'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlayerSeason extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PlayerSeason.init({
    seasonId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER,
    espnId: DataTypes.STRING,
    teamId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PlayerSeason',
  });
  return PlayerSeason;
};