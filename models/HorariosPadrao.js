const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class HorariosPadrao extends Model {}
    HorariosPadrao.init( {
        hp_id: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true
        },
        hp_turno: {
            type: DataTypes.ENUM('Manhã', 'Tarde', 'Noite'),
            allowNull: false
        },
        hp_descricao: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        hp_hora_inicio: {
            type: DataTypes.TIME,
            allowNull: false
        },
        hp_hora_fim: {
            type: DataTypes.TIME,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'HorariosPadrao',
        tableName: 'horarios_padrao',
        timestamps: false
    });

    return HorariosPadrao;
};