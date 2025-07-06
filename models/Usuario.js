const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Usuarios extends Model {
        static associate(models) {
            this.belongsTo(models.Cargos, { foreignKey: 'usucargo', as: 'cargo' });
            this.belongsTo(models.Turmas, { foreignKey: 'usuturma', as: 'turmaDoAluno' });
            this.belongsToMany(models.Turmas, {
                through: 'professor_turmas',
                foreignKey: 'pt_professor_usuid_fk',
                otherKey: 'pt_turma_id_fk',
                as: 'turmasDoProfessor'
            });
            this.hasMany(models.HorarioTurma, { foreignKey: 'ht_professor_usuid_fk', as: 'horariosDoProfessor' });
            this.hasMany(models.Laboratorios, { foreignKey: 'lab_resp_usuid_fk', as: 'laboratoriosResponsaveis' });
        }
        static async verificarLogin(email, senha) {
            try {
                const query = `
                SELECT usuid, usunome, usucargo, usufoto_perfil
                FROM usuarios
                WHERE usuemail = :p_email
                  AND ususenha = AES_ENCRYPT(:p_senha, 'CHAVE')
            `;
                const [usuario] = await this.sequelize.query(query, {
                    replacements: {p_email: email, p_senha: senha},
                    type: this.sequelize.QueryTypes.SELECT
                });
                return usuario;
            } catch (error) {
                console.error('Erro na verificação de login:', error);
                throw error;
            }
        }
    }

    Usuarios.init({
        usuid: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        usunome: {
            type: DataTypes.STRING
        },
        usufoto_perfil: {
            type: DataTypes.STRING
        },
        usucargo: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        usuturma: {
            type: DataTypes.INTEGER.UNSIGNED
        },
        usuemail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        ususenha: {
            type: DataTypes.BLOB,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Usuarios',
        tableName: 'usuarios',
        timestamps: true,
        createdAt: 'usucreatedAt',
        updatedAt: 'usuupdatedAt'
    });

    return Usuarios;
};