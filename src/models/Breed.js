const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("breed", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxHeight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    minHeight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    maxWeight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    minWeight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    lifeSpan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
