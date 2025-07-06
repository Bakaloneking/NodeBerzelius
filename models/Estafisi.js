const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Estafisi extends Model {}
    Estafisi.init( {
        estafisiid: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false
        },
        estafisidescricao: {
            type: DataTypes.STRING(40),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Estafisi',
        tableName: 'estafisi',
        timestamps: false
    });

    return Estafisi;
};

