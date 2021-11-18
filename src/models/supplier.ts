import Seq, {
    Sequelize,
    Model,
    Optional,
    HasManyGetAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManyCreateAssociationMixin,
} from "sequelize";
import {PurchaseAttributes, PurchaseInstance} from "./purchase.js";

const {DataTypes} = Seq;

export interface SupplierAttributes {
    id: string;
    name: string;
    phone: string;
    email?: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    // to access associations when eager loading
    purchases?: PurchaseAttributes[] | PurchaseAttributes["id"][];
}

interface SupplierCreationAttributes extends Optional<SupplierAttributes, "id"> {}

export interface SupplierInstance extends Model<SupplierAttributes, SupplierCreationAttributes>, SupplierAttributes {
    dataValues?: any;

    // model associations
    getPurchases: HasManyGetAssociationsMixin<PurchaseInstance>;
    countPurchases: HasManyCountAssociationsMixin;
    hasPurchase: HasManyHasAssociationMixin<PurchaseInstance, PurchaseInstance["id"]>;
    hasPurchases: HasManyHasAssociationsMixin<PurchaseInstance, PurchaseInstance["id"]>;
    setPurchases: HasManySetAssociationsMixin<PurchaseInstance, PurchaseInstance["id"]>;
    addPurchase: HasManyAddAssociationMixin<PurchaseInstance, PurchaseInstance["id"]>;
    addPurchases: HasManyAddAssociationsMixin<PurchaseInstance, PurchaseInstance["id"]>;
    removePurchase: HasManyRemoveAssociationMixin<PurchaseInstance, PurchaseInstance["id"]>;
    removePurchases: HasManyRemoveAssociationsMixin<PurchaseInstance, PurchaseInstance["id"]>;
    createPurchase: HasManyCreateAssociationMixin<PurchaseAttributes>;
}

export const SupplierFactory = (sequelize: Sequelize) => {
    const Supplier = sequelize.define<SupplierInstance>("Supplier", {
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
    });

    // @ts-ignore
    Supplier.associate = (models: any) => {
        Supplier.hasMany(models.Purchase, {
            as: "purchases",
            foreignKey: {
                name: "supplierId",
                allowNull: false
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });
    }
    return Supplier;
}

