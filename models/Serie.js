const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Series extends Model {
        static associate(models) {
            Series.hasMany(models.Elemento, { foreignKey: 'eleserid' });
        }
    }
    Series.init( {
         serid: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        serdescricao: {
            type: DataTypes.STRING(40), // Definimos o tamanho para corresponder ao VARCHAR(40)
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Serie',
        tableName: 'serie',
        timestamps: false
    });
    return Series;
};