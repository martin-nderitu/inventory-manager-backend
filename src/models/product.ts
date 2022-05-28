import {
    Association,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyCountAssociationsMixin, HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManySetAssociationsMixin,
    DataTypes,
    Model,
    Optional,
    Sequelize,
} from "sequelize";
import {Category} from "./category.js";
import {Purchase} from "./purchase.js";
import {Sale} from "./sale.js";
import {Transfer} from "./transfer.js";
import {Models} from "./types.js";

interface ProductAttributes {
    id: string;
    name: string;
    unitCost: number;
    unitPrice: number;
    store: number;
    counter: number;
    description?: string;
    
    // foreign key
    categoryId?: string;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes>
    implements ProductAttributes {
    declare id: string;
    declare name: string;
    declare unitCost: number;
    declare unitPrice: number;
    declare store: number;
    declare counter: number;
    declare description?: string;

    // timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    
    // foreign key
    declare categoryId?: string;

    declare dataValues?: Product;

    // model associations
    declare getCategory: BelongsToGetAssociationMixin<Category>;
    declare setCategory: BelongsToSetAssociationMixin<Category, Category["id"]>;
    declare createCategory: BelongsToCreateAssociationMixin<Category>;

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

    declare getSales: HasManyGetAssociationsMixin<Sale>;
    declare countSales: HasManyCountAssociationsMixin;
    declare hasSale: HasManyHasAssociationMixin<Sale, Sale["id"]>;
    declare hasSales: HasManyHasAssociationsMixin<Sale, Sale["id"]>;
    declare setSales: HasManySetAssociationsMixin<Sale, Sale["id"]>;
    declare addSale: HasManyAddAssociationMixin<Sale, Sale["id"]>;
    declare addSales: HasManyAddAssociationsMixin<Sale, Sale["id"]>;
    declare removeSale: HasManyRemoveAssociationMixin<Sale, Sale["id"]>;
    declare removeSales: HasManyRemoveAssociationsMixin<Sale, Sale["id"]>;
    declare createSale: HasManyCreateAssociationMixin<Sale>;

    declare getTransfers: HasManyGetAssociationsMixin<Transfer>;
    declare countTransfers: HasManyCountAssociationsMixin;
    declare hasTransfer: HasManyHasAssociationMixin<Transfer, Transfer["id"]>;
    declare hasTransfers: HasManyHasAssociationsMixin<Transfer, Transfer["id"]>;
    declare setTransfers: HasManySetAssociationsMixin<Transfer, Transfer["id"]>;
    declare addTransfer: HasManyAddAssociationMixin<Transfer, Transfer["id"]>;
    declare addTransfers: HasManyAddAssociationsMixin<Transfer, Transfer["id"]>;
    declare removeTransfer: HasManyRemoveAssociationMixin<Transfer, Transfer["id"]>;
    declare removeTransfers: HasManyRemoveAssociationsMixin<Transfer, Transfer["id"]>;
    declare createTransfer: HasManyCreateAssociationMixin<Transfer>;


    // possible inclusions
    declare readonly category?: Category;
    declare readonly purchases?: Purchase[];
    declare readonly sales?: Sale[];
    declare readonly transfers?: Transfer[];

    // associations
    declare static associations: {
        category: Association<Product, Category>;
        purchases: Association<Product, Purchase>;
        sales: Association<Product, Sale>;
        transfers: Association<Product, Transfer>;
    }

    static associate (models: Models) {
        this.belongsTo(models.Category, {
            as: "category",
            foreignKey: {
                name: "categoryId",
                allowNull: false
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });

        this.hasMany(models.Purchase, {
            as: "purchases",
            foreignKey: {
                name: "productId",
                allowNull: false
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });

        this.hasMany(models.Sale, {
            as: "sales",
            foreignKey: {
                name: "productId",
                allowNull: false
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });

        this.hasMany(models.Transfer, {
            as: "transfers",
            foreignKey: {
                name: "productId",
                allowNull: false
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });
    }
}

export const ProductFactory = (sequelize: Sequelize) => {
    return Product.init({
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
        sequelize,
    });
}
