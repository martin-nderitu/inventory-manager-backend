import Seq, {
    Sequelize,
    Model,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,
    Optional,
} from "sequelize";
import {ProductAttributes, ProductInstance} from "./product.js";

const {DataTypes} = Seq;

export interface TransferAttributes {
    id: string;
    quantity: number;
    source: string;
    destination: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    // foreign key
    productId?: string;

    // to access associations when eager loading
    product?: ProductAttributes | ProductAttributes["id"][];
}

interface TransferCreationAttributes extends Optional<TransferAttributes, "id"> {}

export interface TransferInstance extends Model<TransferAttributes, TransferCreationAttributes>, TransferAttributes {
    dataValues?: any;

    // model associations
    getProduct: BelongsToGetAssociationMixin<ProductInstance>;
    setProduct: BelongsToSetAssociationMixin<ProductInstance, ProductInstance["id"]>;
    createProduct: BelongsToCreateAssociationMixin<ProductAttributes>;
}

export const TransferFactory = (sequelize: Sequelize) => {
    const Transfer = sequelize.define<TransferInstance>("Transfer", {
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
    });

    // @ts-ignore
    Transfer.associate = (models: any) => {
        Transfer.belongsTo(models.Product, {
            as: "product",
            foreignKey: {
                name: "productId",
                allowNull: false
            }
        });
    }
    return Transfer;
}

