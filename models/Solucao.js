const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Solucoes extends Model {
        static associate(models) {
            this.belongsTo(models.Substancias, {
                foreignKey: 'sol_solvente_id_fk',
                as: 'solvente' // Apelido para quando formos buscar os dados
            });
            this.belongsToMany(models.Substancias, {
                through: 'solucao_componentes',      // Nome da tabela de junção
                foreignKey: 'scomp_solucao_id_fk',   // Chave que aponta para Solucoes
                otherKey: 'scomp_substancia_id_fk',  // Chave que aponta para Substancias (o soluto)
                as: 'solutos',                       // Apelido para a lista de solutos
                timestamps: false
            });
        }
    }
    Solucoes.init( {
        sol_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        sol_nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sol_solvente_id_fk: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        // ADIÇÃO: Colunas que estavam faltando
        sol_concentracao: {
            type: DataTypes.DECIMAL(10, 5)
        },
        sol_unidade_conc: {
            type: DataTypes.STRING(20)
        },
        sol_descricao: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        modelName: 'Solucoes',
        tableName: 'solucoes',
        timestamps: false
    });
    return Solucoes;
};