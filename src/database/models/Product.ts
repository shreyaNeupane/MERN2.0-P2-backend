import {
  Table,
  Column,
  Model,
  DataType,
  NotNull,
  AllowNull,
} from "sequelize-typescript";

@Table({
  tableName: "products",
  modelName: "Product",
  timestamps: true,
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare productName: string;

  @Column({
    type: DataType.TEXT,
  })
  declare productDescription: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare productPrice: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare productTotalstockQty: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare productImgUrl: number;
}
export default User;
