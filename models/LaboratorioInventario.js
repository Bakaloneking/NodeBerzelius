const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LaboratorioInventario extends Model {
        static associate(models) {
            this.belongsTo(models.Substancias, { foreignKey: 'inv_substancia_id_fk', as: 'substancia' });
        }
    }
    LaboratorioInventario.init( {
        inv_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        inv_substancia_id_fk: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        inv_marca: { type: DataTypes.STRING },
        inv_lote: { type: DataTypes.STRING },
        inv_quantidade: { type: DataTypes.DECIMAL(10, 2) },
        inv_unidade: { type: DataTypes.STRING },
        inv_localizacao: { type: DataTypes.STRING },
        inv_data_validade: { type: DataTypes.DATE }
    }, {
        sequelize,
        modelName: 'LaboratorioInventario',
        tableName: 'laboratorio_inventario',
        timestamps: false

    });
    return LaboratorioInventario;
};