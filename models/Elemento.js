const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Elementos extends Model {
        static associate(models) {
            this.belongsTo(models.Serie, { foreignKey: 'eleserid', as: 'serie' });
            this.belongsTo(models.Estafisi, { foreignKey: 'eleesfiid', as: 'estadoFisico' }); // <-- 2. Adiciona a nova associação
            this.belongsTo(models.Serie, { foreignKey: 'eleserid' });
        }
    }
    Elementos.init( {
        eleid: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        elesimbolo: { type: DataTypes.STRING(3), allowNull: false },
        elenome: { type: DataTypes.STRING, allowNull: false, unique: true },
        eleprotons: { type: DataTypes.INTEGER.UNSIGNED },
        eleneutrons: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        eleeletrons: { type: DataTypes.INTEGER.UNSIGNED },
        eleserid: { type: DataTypes.INTEGER.UNSIGNED },
        eleesfiid: { type: DataTypes.INTEGER.UNSIGNED },
        elepfusa: { type: DataTypes.DOUBLE },
        elepebul: { type: DataTypes.DOUBLE },
        eledescricao: { type: DataTypes.TEXT }
    }, {
        sequelize,
        modelName: 'Elemento',
        tableName: 'elemento',
        timestamps: false
    });

    return Elementos;
};
