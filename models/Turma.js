const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Turmas extends Model {
        static associate(models) {
            this.hasMany(models.Usuarios, { foreignKey: 'usuturma', as: 'alunos' });
            this.belongsToMany(models.Usuarios, {
                through: 'professor_turmas',
                foreignKey: 'pt_turma_id_fk',
                otherKey: 'pt_professor_usuid_fk',
                as: 'professores'
            });
            this.hasMany(models.HorarioTurma, { foreignKey: 'ht_turma_id_fk', as: 'horarios' });
        }
    }
    Turmas.init( {
        turmid: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        turnome: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'Turmas',
        tableName: 'turmas',
        timestamps: true,
        createdAt: 'turmcreatedAt',
        updatedAt: 'turmupdatedAt'
    });
    return Turmas;
};