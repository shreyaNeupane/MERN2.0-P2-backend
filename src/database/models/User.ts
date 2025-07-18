import { Table, Column, Model, DataType, NotNull } from "sequelize-typescript";

@Table({
  tableName: "users",
  modelName: "User",
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
  })
  declare email: string;

  @Column({
    type: DataType.ENUM("customer", "admin"),
    defaultValue: "customer",
  })
  declare role: "customer" | "admin";

  @Column({
    type: DataType.STRING,
  })
  declare password: string;
}
export default User;
