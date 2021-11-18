import Seq, {
    Sequelize,
    Model,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,
    Optional,
} from "sequelize";
import {ProductAttributes, ProductInstance} from "./product.js";
import {SupplierAttributes, SupplierInstance} from "./supplier.js";

const {DataTypes} = Seq;

export interface PurchaseAttributes {
    id: string;
    quantity: number;
    unitCost: number;
    unitPrice: number;
    location: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    // foreign keys
    productId?: string;
    supplierId?: string;

    // to access associations when eager loading
    product?: ProductAttributes | ProductAttributes["id"][];
    supplier?: SupplierAttributes | SupplierAttributes["id"][];
}

interface PurchaseCreationAttributes extends Optional<PurchaseAttributes, "id"> {}

export interface PurchaseInstance extends Model<PurchaseAttributes, PurchaseCreationAttributes>, PurchaseAttributes {
    dataValues?: any;

    // model associations
    getProduct: BelongsToGetAssociationMixin<ProductInstance>;
    setProduct: BelongsToSetAssociationMixin<ProductInstance, ProductInstance["id"]>;
    createProduct: BelongsToCreateAssociationMixin<ProductAttributes>;

    getSupplier: BelongsToGetAssociationMixin<SupplierInstance>;
    setSupplier: BelongsToSetAssociationMixin<SupplierInstance, SupplierInstance["id"]>;
    createSupplier: BelongsToCreateAssociationMixin<SupplierAttributes>;
}

export const PurchaseFactory = (sequelize: Sequelize) => {
    const Purchase = sequelize.define<PurchaseInstance>("Purchase", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        unitCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        unitPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        location: {
            type: DataTypes.ENUM("store", "counter"),
            allowNull: false,
            defaultValue: "store"
        }
    }, {
        tableName: "purchases",
    });

    // @ts-ignore
    Purchase.associate = (models: any) => {
        Purchase.belongsTo(models.Product, {
            as: "product",
            foreignKey: {
                name: "productId",
                allowNull: false
            }
        });

        Purchase.belongsTo(models.Supplier, {
            as: "supplier",
            foreignKey: {
                name: "supplierId",
                allowNull: false
            }
        });
    }
    return Purchase;
}

