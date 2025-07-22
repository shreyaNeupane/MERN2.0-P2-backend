import OrderDetail from "../database/models/OrderDetails";
import Payment from "./../database/models/Payment";

export interface OrderData {
  phoneNumber: string;
  shippingAddress: string;
  totalAmount: number;
  PaymentDetails: {
    paymentMethod: PaymentMethod;
    paymentStatus?: PaymentStatus;
    pidx?: string;
  };
  items: OrderDetails[];
}

export interface OrderDetails {
  quantity: number;
  productId: string;
}

export enum PaymentMethod {
  Cod = "cod",
  khalti = "khalti",
}

enum PaymentStatus {
  Paid = "paid",
  Unpaid = "unpaid",
}

export interface KhaltiResponse {
  pidx: string;
  payment_url: string;
  expires_at: Date | string;
  expires_in: number;
  user_fee: number;
}

export interface TransactionVerificationResponse {
  pidx: string;
  total_amount: number;
  status: TransactionStatus;
  transaction_id: string;
  fee: number;
  refunded: boolean;
}

export enum TransactionStatus {
  Completed = "Completed",
  Refunded = "Refunded",
  Pending = "Pending",
  Initiated = "Initiated",
}
