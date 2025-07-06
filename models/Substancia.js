const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Substancias extends Model {
        static associate(models) {
            this.belongsTo(models.Elemento, { foreignKey: 'sub_elemento_id_fk', as: 'elementoPuro' });
            this.belongsToMany(models.Elemento, {
                through: 'composicao_compostos',
                foreignKey: 'comp_substancia_id_fk',
                otherKey: 'comp_elemento_id_fk',
                as: 'componentes',
                timestamps: false
            });
            this.hasMany(models.Solucoes, { foreignKey: 'sol_solvente_id_fk', as: 'solucoesOndeESolvente' });
            this.belongsToMany(models.Solucoes, {
                through: 'solucao_componentes',
                foreignKey: 'scomp_substancia_id_fk',
                otherKey: 'scomp_solucao_id_fk',
                as: 'solucoesOndeESoluto',
                timestamps: false
            });
            this.hasMany(models.LaboratorioInventario, { foreignKey: 'inv_substancia_id_fk', as: 'itensDeInventario' });
        }
    }
    Substancias.init( {
        sub_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        sub_nome: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        // ADIÇÃO: Colunas que estavam faltando
        sub_formula_quimica: {
            type: DataTypes.STRING(100)
        },
        sub_massa_molar: {
            type: DataTypes.DECIMAL(15, 5)
        },
        sub_tipo: {
            type: DataTypes.ENUM('Elemento', 'Composto'),
            allowNull: false
        },
        sub_elemento_id_fk: {
            type: DataTypes.INTEGER.UNSIGNED
        },
        sub_descricao: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        modelName: 'Substancias',
        tableName: 'substancias',
        timestamps: false
    });
    return Substancias;
};