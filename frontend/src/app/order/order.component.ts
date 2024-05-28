import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef } from "@angular/core";
import { OrderService } from "../services/order.service";
import { AuthService } from "../auth/auth.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class OrderComponent implements OnInit {
  @ViewChild("returnBookModal") returnBookModal: ElementRef;
  returnReasons: string[] = ["Damaged", "Not as described", "Changed mind", "Duplicate order", "Other"];
  selectedReasons: { [key: string]: boolean } = {};

  orders: any[];
  returnReason: string = "";
  selecedOrder: any;
  orderProductIds: number[];
  orderGroups: any[] = []; // Array to hold groups of orders
  customReasons: { [key: string]: string } = {}; // Store custom reasons for each predefined reason
  returnQuantity: number = 1;

  constructor(
      private orderService: OrderService,
      private authService: AuthService,
      private renderer: Renderer2,
      private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.$userIsLoggedIn.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.loadOrderHistory();
      } else {
        console.log("bye");
      }
    });
  }

  public loadOrderHistory(): void {
    this.orderService.getOrderHistory().subscribe(
        (orderHistory) => {
          this.orders = orderHistory;
          this.groupOrdersByOrderId();
        },
        (error) => {
          console.error("Error fetching order history", error);
        }
    );
  }

  groupOrdersByOrderId(): void {
    const groupedOrders: any = {};

    this.orders?.forEach((order) => {
      const orderId = order[0].orderId;
      const productId = order[1].product.id;
      const productStatus = order[1].productStatus;

      if (!groupedOrders[orderId]) {
        groupedOrders[orderId] = { products: [], order_products_ids: [] };
      }

      const existingOrder = groupedOrders[orderId].products.find(
          (existing: any) => existing.product.id === productId && existing.productStatus === productStatus
      );

      if (existingOrder) {
        existingOrder.quantity += order[1].quantity; // Increment quantity
      } else {
        groupedOrders[orderId].products.push({
          ...order[1], // Include all order details
          quantity: order[1].quantity,
        });
      }

      groupedOrders[orderId].order_products_ids.push(order[1].id); // Add product ID to the array
    });

    // Group by entire orderId
    this.orderGroups = Object.values(groupedOrders).map((orderGroup: any) => ({
      orderId: orderGroup.products[0].orderId, // Access first order's orderId
      products: orderGroup.products, // Keep all products within the order
      order_products_ids: orderGroup.order_products_ids, // Add order_products_ids
    }));

    console.log(this.orderGroups); // Use console.log to verify grouping
  }

  openModal(order: any, ids: number[]): void {
    this.orderProductIds = ids;
    const createdAtDate = new Date(order.createdAt);
    const currentDate = new Date();
    const oneMonthAgo = new Date(currentDate);
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);
    if (createdAtDate <= oneMonthAgo) {
      alert("You can't return this product, return period expired");
      return;
    }
    this.selecedOrder = order;
    this.returnReason = "";
    this.customReasons = {}; // Reset custom reasons
    this.returnQuantity = 1;
    this.renderer.addClass(this.returnBookModal.nativeElement, "show");
  }

  closeModal(): void {
    this.selecedOrder = null;
    this.renderer.removeClass(this.returnBookModal.nativeElement, "show");
  }

  submitReturn(event: Event): void {
    event.preventDefault();

    if (!this.returnReason) {
      alert("Please provide a reason");
      return;
    }

    const customReason = this.customReasons[this.returnReason];
    if (!customReason || customReason.trim() === '') {
      alert("Please provide a description for the selected reason");
      return;
    }

    if (this.returnQuantity > this.selecedOrder.quantity) {
      alert("Return quantity is greater than purchased quantity");
      return;
    }
    if (this.returnQuantity == 0) {
      alert("Add a valid quantity");
      return;
    }

    if (this.returnQuantity < 0) {
      alert("Quantity should be a positive number");
      return;
    }

    const reason = `${this.returnReason} + ${customReason}`;

    this.orderService
        .returnBook({
          description: reason,
          status: 2,
          ids: this.orderProductIds,
          product_id: this.selecedOrder.product.id,
          date: this.selecedOrder.createdAt,
          quantity: this.returnQuantity
        }).subscribe((res) => {
      if (res !== 'Order Completed') {
        alert(res);
      }
      this.loadOrderHistory();
      this.changeDetector.detectChanges();
      this.closeModal();
    });
  }

  incrementQuantity(): void {
    if (this.returnQuantity < this.selecedOrder.quantity) {
      this.returnQuantity++;
    }
  }

  decrementQuantity(): void {
    if (this.returnQuantity > 1) {
      this.returnQuantity--;
    }
  }
}
