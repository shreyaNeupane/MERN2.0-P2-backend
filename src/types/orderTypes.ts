import OrderDetail from "../database/models/OrderDetails"



export interface OrderData{
    phoneNumber : string,
    shippingAddress : string,
    totalAmount : number,
    PaymentDetails : {
        paymentMethod : PaymentMethod,
        paymentStatus?:PaymentStatus,
        pidx?: string
    },
    items  : OrderDetails[]
}

export interface OrderDetails{
    quantity : number,
    productId : string,
}

export enum PaymentMethod{
    Cod = 'cod',
    khalti = 'khalti'
}

enum PaymentStatus{
    Paid = 'paid',
    Unpaid = 'unpaid'
}