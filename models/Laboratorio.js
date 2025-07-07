const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Laboratorios extends Model {
        static associate(models) {
            this.belongsTo(models.Usuarios, { foreignKey: 'lab_resp_usuid_fk', as: 'responsavel' });
        }
    }
    Laboratorios.init( {
        labid: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        labnome: {
            type: DataTypes.STRING
        },
        lab_resp_usuid_fk: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Laboratorios',
        tableName: 'laboratorios',
        timestamps: true,
        createdAt: 'labcreatedAt',
        updatedAt: 'labupdatedAt'
    });

    return  Laboratorios;
};