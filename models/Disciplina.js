const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Disciplinas extends Model {}
    Disciplinas.init( {
        disc_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        disc_nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        disc_codigo: {
            type: DataTypes.STRING(20),
            unique: true
        },
        disc_descricao: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        modelName: 'Disciplinas',
        tableName: 'disciplinas',
        timestamps: false
    });

    return  Disciplinas;
};

