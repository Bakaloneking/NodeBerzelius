const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Vidrarias extends Model {}
    Vidrarias.init({
        vid_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        vid_nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        vid_imagem_path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        vid_descricao: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        modelName: 'Vidrarias',
        tableName: 'vidrarias',
        timestamps: false
    });
    return Vidrarias;
};