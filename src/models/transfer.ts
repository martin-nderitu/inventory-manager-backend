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
import {Models} from "./types";

interface TransferAttributes {
    id: string;
    quantity: number;
    source: string;
    destination: string;

    // foreign key
    productId?: string;
}

interface TransferCreationAttributes extends Optional<TransferAttributes, "id"> {}

export class Transfer extends Model<TransferAttributes, TransferCreationAttributes>
    implements TransferAttributes {
    declare id: string;
    declare quantity: number;
    declare source: string;
    declare destination: string;

    // timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    // foreign key
    productId?: string;

    declare dataValues?: Transfer;

    // model associations
    declare getProduct: BelongsToGetAssociationMixin<Product>;
    declare setProduct: BelongsToSetAssociationMixin<Product, Product["id"]>;
    declare createProduct: BelongsToCreateAssociationMixin<Product>;


    // possible inclusions
    declare readonly product?: Product;

    // associations
    declare static associations: {
        product: Association<Transfer, Product>;
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

export const TransferFactory = (sequelize: Sequelize) => {
    return Transfer.init({
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
        source: {
            type: DataTypes.ENUM("store", "counter"),
            allowNull: false
        },
        destination: {
            type: DataTypes.ENUM("store", "counter"),
            allowNull: false
        },
    }, {
        tableName: "transfers",
        sequelize,
    });
}
