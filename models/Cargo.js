const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cargos extends Model {
        static associate(models) {
            this.hasMany(models.Usuarios,{ foreignKey: 'usucargo' });
        }
    }
    Cargos.init({
        cargid: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        cargnome: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'Cargos',
        tableName: 'cargos',
        timestamps: false
    });

    return Cargos;
};
