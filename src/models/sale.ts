import {
    Sequelize,
    Model,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,
    DataTypes,
    Optional, Association,
} from "sequelize";
import {Product} from "./product.js";
import {Models} from "./types.js";

interface SaleAttributes {
    id: string;
    quantity: number;

    // foreign key
    productId?: string;
}

interface SaleCreationAttributes extends Optional<SaleAttributes, "id"> {}

export class Sale extends Model<SaleAttributes, SaleCreationAttributes>
    implements SaleAttributes {
    declare id: string;
    declare quantity: number;

    // timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    // foreign keys
    productId?: string;

    declare dataValues?: Sale;

    // model associations
    declare getProduct: BelongsToGetAssociationMixin<Product>;
    declare setProduct: BelongsToSetAssociationMixin<Product, Product["id"]>;
    declare createProduct: BelongsToCreateAssociationMixin<Product>;


    // possible inclusions
    declare readonly products?: Product[];

    // associations
    declare static associations: {
        products: Association<Sale, Product>;
    }

    static associate (models: Models) {
        this.belongsTo(models.Product, {
            as: "product",
            foreignKey: {
                name: "productId",
                allowNull: false
            }
        });
    }
}

export const SaleFactory = (sequelize: Sequelize) => {
    return Sale.init({
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
    }, {
        tableName: "sales",
        sequelize,
    });
}
