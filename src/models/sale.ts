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

export interface SaleAttributes {
    id: string;
    quantity: number;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    // foreign key
    productId?: string;

    // to access associations when eager loading
    product?: ProductAttributes | ProductAttributes["id"][];
}

interface SaleCreationAttributes extends Optional<SaleAttributes, "id"> {}

export interface SaleInstance extends Model<SaleAttributes, SaleCreationAttributes>, SaleAttributes {
    dataValues?: any;

    // model associations
    getProduct: BelongsToGetAssociationMixin<ProductInstance>;
    setProduct: BelongsToSetAssociationMixin<ProductInstance, ProductInstance["id"]>;
    createProduct: BelongsToCreateAssociationMixin<ProductAttributes>;
}

export const SaleFactory = (sequelize: Sequelize) => {
    const Sale = sequelize.define<SaleInstance>("Sale", {
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
    });

    // @ts-ignore
    Sale.associate = (models: any) => {
        Sale.belongsTo(models.Product, {
            as: "product",
            foreignKey: {
                name: "productId",
                allowNull: false
            }
        });
    }
    return Sale;
}

