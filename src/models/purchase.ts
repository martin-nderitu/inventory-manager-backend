import {
    Association,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,
    DataTypes,
    Optional,
    Sequelize,
    Model,
} from "sequelize";
import {Product} from "./product.js";
import {Supplier} from "./supplier.js";
import {Sale} from "./sale";
import {Transfer} from "./transfer";
import {Models} from "./types.js";

interface PurchaseAttributes {
    id: string;
    quantity: number;
    unitCost: number;
    unitPrice: number;
    location: string;

    // foreign keys
    productId?: string;
    supplierId?: string;
}

interface PurchaseCreationAttributes extends Optional<PurchaseAttributes, "id"> {}

export class Purchase extends Model<PurchaseAttributes, PurchaseCreationAttributes>
    implements PurchaseAttributes {
    declare id: string;
    declare quantity: number;
    declare unitCost: number;
    declare unitPrice: number;
    declare location: string;

    // timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
    
    // foreign keys
    productId?: string;
    supplierId?: string;

    declare dataValues?: Purchase;

    // model associations
    declare getProduct: BelongsToGetAssociationMixin<Product>;
    declare setProduct: BelongsToSetAssociationMixin<Product, Product["id"]>;
    declare createProduct: BelongsToCreateAssociationMixin<Product>;

    declare getSupplier: BelongsToGetAssociationMixin<Supplier>;
    declare setSupplier: BelongsToSetAssociationMixin<Supplier, Supplier["id"]>;
    declare createSupplier: BelongsToCreateAssociationMixin<Supplier>;


    // possible inclusions
    declare readonly products?: Product[];
    declare readonly suppliers?: Supplier[];
    declare readonly sales?: Sale[];
    declare readonly transfers?: Transfer[];

    // associations
    declare static associations: {
        products: Association<Purchase, Product>;
        suppliers: Association<Purchase, Supplier>;
        sales: Association<Purchase, Sale>;
        transfers: Association<Purchase, Transfer>;
    }

    static associate (models: Models) {
        this.belongsTo(models.Product, {
            as: "product",
            foreignKey: {
                name: "productId",
                allowNull: false
            }
        });

        this.belongsTo(models.Supplier, {
            as: "supplier",
            foreignKey: {
                name: "supplierId",
                allowNull: false
            }
        });
    }
}

export const PurchaseFactory = (sequelize: Sequelize) => {
    return Purchase.init({
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
        sequelize,
    });
}
