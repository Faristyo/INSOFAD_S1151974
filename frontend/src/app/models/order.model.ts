import { Product } from "./product.model";

export interface Order {
  orderDate: any;
  status: string;
  productQuantities:any;
  totalPrice:number;
}
