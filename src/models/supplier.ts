import {
    Association,
    HasManyGetAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManyCreateAssociationMixin,
    DataTypes,
    Sequelize,
    Model,
    Optional,
} from "sequelize";
import {Purchase} from "./purchase.js";
import {Models} from "./types";

interface SupplierAttributes {
    id: string;
    name: string;
    phone: string;
    email?: string;
}

interface SupplierCreationAttributes extends Optional<SupplierAttributes, "id"> {}

export class Supplier extends Model<SupplierAttributes, SupplierCreationAttributes>
    implements SupplierAttributes {
    declare id: string;
    declare name: string;
    declare phone: string;
    declare email?: string;

    // timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    declare dataValues?: Supplier;

    // model associations
    declare getPurchases: HasManyGetAssociationsMixin<Purchase>;
    declare countPurchases: HasManyCountAssociationsMixin;
    declare hasPurchase: HasManyHasAssociationMixin<Purchase, Purchase["id"]>;
    declare hasPurchases: HasManyHasAssociationsMixin<Purchase, Purchase["id"]>;
    declare setPurchases: HasManySetAssociationsMixin<Purchase, Purchase["id"]>;
    declare addPurchase: HasManyAddAssociationMixin<Purchase, Purchase["id"]>;
    declare addPurchases: HasManyAddAssociationsMixin<Purchase, Purchase["id"]>;
    declare removePurchase: HasManyRemoveAssociationMixin<Purchase, Purchase["id"]>;
    declare removePurchases: HasManyRemoveAssociationsMixin<Purchase, Purchase["id"]>;
    declare createPurchase: HasManyCreateAssociationMixin<Purchase>;


    // possible inclusions
    declare readonly purchases?: Purchase[];

    // associations
    declare static associations: {
        purchases: Association<Supplier, Purchase>;
    }

    static associate (models: Models) {
        this.hasMany(models.Purchase, {
            as: "purchases",
            foreignKey: {
                name: "supplierId",
                allowNull: false
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });
    }
}

export const SupplierFactory = (sequelize: Sequelize) => {
    return Supplier.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(10),
            unique: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
    }, {
        tableName: "suppliers",
        sequelize,
    });
}