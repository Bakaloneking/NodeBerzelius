const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class HorarioTurma extends Model {
        static associate(models) {
            this.belongsTo(models.Turmas, {foreignKey: 'ht_turma_id_fk', as: 'turma'});
            this.belongsTo(models.Disciplinas, {foreignKey: 'ht_disciplina_id_fk', as: 'disciplina'});
            this.belongsTo(models.Usuarios, {foreignKey: 'ht_professor_usuid_fk', as: 'professor'});
            this.belongsTo(models.Laboratorios, {foreignKey: 'ht_laboratorio_id_fk', as: 'laboratorio'});
            this.belongsTo(models.HorariosPadrao, {foreignKey: 'ht_horario_padrao_id_fk', as: 'horario_padrao'});
        }

        static async listarHorariosComDetalhes() {
            try {
                const query = `
                    SELECT ht.ht_id,
                           t.turnome       AS turma,
                           d.disc_nome     AS disciplina,
                           u.usunome       AS professor,
                           l.labnome       AS laboratorio,
                           ht.ht_dia_semana,
                           hp.hp_descricao AS horario
                    FROM horario_turma AS ht
                             JOIN turmas AS t ON t.turmid = ht.ht_turma_id_fk
                             JOIN disciplinas AS d ON d.disc_id = ht.ht_disciplina_id_fk
                             JOIN usuarios AS u ON u.usuid = ht.ht_professor_usuid_fk
                             JOIN laboratorios AS l ON l.labid = ht.ht_laboratorio_id_fk
                             JOIN horarios_padrao AS hp ON hp.hp_id = ht.ht_horario_padrao_id_fk
                    ORDER BY t.turnome, ht.ht_dia_semana, hp.hp_hora_inicio;
                `;
                const horarios = await this.sequelize.query(query, {
                    type: DataTypes.QueryTypes.SELECT
                });
                return horarios;
            } catch (error) {
                console.error('Erro ao listar horários com detalhes:', error);
                throw error;
            }
        }
    }
    HorarioTurma.init( {
        ht_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        ht_turma_id_fk: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        ht_disciplina_id_fk: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        ht_professor_usuid_fk: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        ht_laboratorio_id_fk: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        ht_dia_semana: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        ht_horario_padrao_id_fk: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'HorarioTurma',
        tableName: 'horario_turma',
        timestamps: false

    });
    return HorarioTurma;
};