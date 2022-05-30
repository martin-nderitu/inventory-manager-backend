import {
    Association,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
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
import {Product} from "./product.js";
import {Models} from "./types.js";

interface CategoryAttributes {
    id: string;
    name: string;
    description?: string;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, "id"> {}

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes>
    implements CategoryAttributes {
    declare id: string;
    declare name: string;
    declare description?: string;

    // timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    declare dataValues?: Category;

    // model associations
    declare getProducts: HasManyGetAssociationsMixin<Product>;
    declare countProducts: HasManyCountAssociationsMixin;
    declare hasProduct: HasManyHasAssociationMixin<Product, Product["id"]>;
    declare hasProducts: HasManyHasAssociationsMixin<Product, Product["id"]>;
    declare setProducts: HasManySetAssociationsMixin<Product, Product["id"]>;
    declare addProduct: HasManyAddAssociationMixin<Product, Product["id"]>;
    declare addProducts: HasManyAddAssociationsMixin<Product, Product["id"]>;
    declare removeProduct: HasManyRemoveAssociationMixin<Product, Product["id"]>;
    declare removeProducts: HasManyRemoveAssociationsMixin<Product, Product["id"]>;
    declare createProduct: HasManyCreateAssociationMixin<Product>;


    // possible inclusions
    declare readonly products?: Product[];

    // associations
    declare static associations: {
        products: Association<Category, Product>;
    }

    static associate (models: Models) {
        this.hasMany(models.Product, {
            as: "products",
            foreignKey: {
                name: "categoryId",
                allowNull: false,
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}

export const CategoryFactory = (sequelize: Sequelize) => {
    return Category.init({
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
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
        },
    }, {
        tableName: "categories",
        sequelize
    });
}
