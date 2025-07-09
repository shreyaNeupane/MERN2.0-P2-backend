import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "payment",
  modelName: "Payment",
  timestamps: true,
})
class Payment extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.ENUM("COD", "Khalti", "esewa"),
    allowNull: false,
  })
  declare Paymentment: string;

  @Column({
    type: DataType.ENUM("paid", "unpaid"),
    defaultValue: "unpaid",
  })
  declare paymentStatus: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare pidx: string;
}
export default Payment;
