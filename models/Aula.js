'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Aulas extends Model {
        static associate(models) {
            this.belongsTo(models.Turmas, { foreignKey: 'aula_turma_id_fk', as: 'turma' });
            this.belongsTo(models.Disciplinas, { foreignKey: 'aula_disciplina_id_fk', as: 'disciplina' });
            this.belongsTo(models.Usuarios, { foreignKey: 'aula_professor_usuid_fk', as: 'professor' });
            this.belongsTo(models.Laboratorios, { foreignKey: 'aula_laboratorio_id_fk', as: 'laboratorio' });
            this.belongsTo(models.HorariosPadrao, { foreignKey: 'aula_horario_padrao_id_fk', as: 'horario' });
        }
    }
    Aulas.init({
        aula_id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        aula_data: { type: DataTypes.DATEONLY, allowNull: false },
        aula_horario_padrao_id_fk: { type: DataTypes.STRING(10), allowNull: false },
        aula_turma_id_fk: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        aula_disciplina_id_fk: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        aula_professor_usuid_fk: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        aula_laboratorio_id_fk: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        aula_tema: DataTypes.TEXT,
        aula_observacoes: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Aulas',
        tableName: 'aulas',
        timestamps: true,
        updatedAt: false,
        createdAt: 'aula_createdAt'
    });
    return Aulas;
};