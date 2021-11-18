import Seq, {
    Sequelize,
    Model,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,
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
import {CategoryAttributes, CategoryInstance} from "./category.js";
import {PurchaseAttributes, PurchaseInstance} from "./purchase.js";
import {SaleAttributes, SaleInstance} from "./sale.js";
import {TransferAttributes, TransferInstance} from "./transfer.js";

const {DataTypes} = Seq;

export interface ProductAttributes {
    id: string;
    name: string;
    unitCost: number;
    unitPrice: number;
    store: number;
    counter: number;
    description?: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    // foreign key
    categoryId?: string;

    // to access associations when eager loading
    category?: CategoryAttributes | CategoryAttributes["id"][];

    purchases?: PurchaseAttributes[] | PurchaseAttributes["id"][];
    sales?: SaleAttributes[] | SaleAttributes["id"][];
    transfers?: TransferAttributes[] | TransferAttributes["id"][];
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

export interface ProductInstance extends Model<ProductAttributes, ProductCreationAttributes>, ProductAttributes {
    dataValues?: any;

    // model associations
    getCategory: BelongsToGetAssociationMixin<CategoryInstance>;
    setCategory: BelongsToSetAssociationMixin<CategoryInstance, CategoryInstance["id"]>;
    createCategory: BelongsToCreateAssociationMixin<CategoryAttributes>;

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

    getSales: HasManyGetAssociationsMixin<SaleInstance>;
    countSales: HasManyCountAssociationsMixin;
    hasSale: HasManyHasAssociationMixin<SaleInstance, SaleInstance["id"]>;
    hasSales: HasManyHasAssociationsMixin<SaleInstance, SaleInstance["id"]>;
    setSales: HasManySetAssociationsMixin<SaleInstance, SaleInstance["id"]>;
    addSale: HasManyAddAssociationMixin<SaleInstance, SaleInstance["id"]>;
    addSales: HasManyAddAssociationsMixin<SaleInstance, SaleInstance["id"]>;
    removeSale: HasManyRemoveAssociationMixin<SaleInstance, SaleInstance["id"]>;
    removeSales: HasManyRemoveAssociationsMixin<SaleInstance, SaleInstance["id"]>;
    createSale: HasManyCreateAssociationMixin<SaleAttributes>;

    getTransfers: HasManyGetAssociationsMixin<TransferInstance>;
    countTransfers: HasManyCountAssociationsMixin;
    hasTransfer: HasManyHasAssociationMixin<TransferInstance, TransferInstance["id"]>;
    hasTransfers: HasManyHasAssociationsMixin<TransferInstance, TransferInstance["id"]>;
    setTransfers: HasManySetAssociationsMixin<TransferInstance, TransferInstance["id"]>;
    addTransfer: HasManyAddAssociationMixin<TransferInstance, TransferInstance["id"]>;
    addTransfers: HasManyAddAssociationsMixin<TransferInstance, TransferInstance["id"]>;
    removeTransfer: HasManyRemoveAssociationMixin<TransferInstance, TransferInstance["id"]>;
    removeTransfers: HasManyRemoveAssociationsMixin<TransferInstance, TransferInstance["id"]>;
    createTransfer: HasManyCreateAssociationMixin<TransferAttributes>;
}

export const ProductFactory = (sequelize: Sequelize) => {
    const Product = sequelize.define<ProductInstance>("Product", {
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
        store: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        counter: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        description: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
        },
    }, {
        tableName: "products",
    });

    // @ts-ignore
    Product.associate = (models: any) => {
        Product.belongsTo(models.Category, {
            as: "category",
            foreignKey: {
                name: "categoryId",
                allowNull: false
            }
        });

        Product.hasMany(models.Purchase, {
            as: "purchases",
            foreignKey: {
                name: "productId",
                allowNull: false
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });

        Product.hasMany(models.Sale, {
            as: "sales",
            foreignKey: {
                name: "productId",
                allowNull: false
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });

        Product.hasMany(models.Transfer, {
            as: "transfers",
            foreignKey: {
                name: "productId",
                allowNull: false
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });
    }
    return Product;
}

