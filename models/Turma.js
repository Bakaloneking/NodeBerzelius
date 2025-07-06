const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Turmas extends Model {
        static associate(models) {
            this.hasMany(models.Aulas, { foreignKey: 'aula_turma_id_fk', as: 'aulas' });
            this.hasMany(models.Usuarios, { foreignKey: 'usuturma', as: 'alunos' });
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