'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Season extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Season.belongsTo(models.League,{
        foreignKey: "leagueId",
        onDelete: 'CASCADE'
      })
      Season.belongsToMany(models.Player, {
        through: "PlayerSeasons"
      })
    }
  };
  Season.init({
    year: DataTypes.INTEGER,
    leagueId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Season',
  });
  return Season;
};