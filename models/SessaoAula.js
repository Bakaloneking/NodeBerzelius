const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SessoesAula extends Model {
        static associate(models) {
            this.belongsTo(models.HorarioTurma, { foreignKey: 'sa_horario_id_fk', as: 'horario' });
        }
    }
    SessoesAula.init( {
        sa_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        sa_horario_id_fk: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        sa_data: {
            type: DataTypes.DATEONLY, // Usar DATEONLY é melhor para datas sem hora
            allowNull: false
        },
        sa_tema_especifico: {
            type: DataTypes.TEXT
        },
        sa_observacoes: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        modelName: 'Sessoes_aula',
        tableName: 'sessoes_aula',
        timestamps: true,
        updatedAt: false,
        createdAt: 'sa_created_at'
    });
    return SessoesAula;
};