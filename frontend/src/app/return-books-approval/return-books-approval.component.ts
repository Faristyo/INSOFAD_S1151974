import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, Renderer2 } from "@angular/core";
import { OrderService } from "../services/order.service";
import { AuthService } from "../auth/auth.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-return-books-approval",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./return-books-approval.component.html",
  styleUrls: ["./return-books-approval.component.scss"],
})
export class ReturnBooksApprovalComponent {
  orders: any[];
  returnReason: string = "";
  selectedOrder: any;
  orderGroups: any[] = []; // Array to hold groups of orders
  searchOrderId: string = ""; // Variable to hold the search order ID

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
    this.orderService.getAllHistory().subscribe(
        (orderHistory) => {
          this.orders = orderHistory;
          this.groupOrdersByOrderId();
          this.sortOrders(); // Sort orders after grouping
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
      if (!groupedOrders[orderId]) {
        groupedOrders[orderId] = [];
      }
      groupedOrders[orderId].push(order);
    });
    this.orderGroups = Object.values(groupedOrders);
  }

  sortOrders(): void {
    this.orderGroups.sort((a, b) => {
      const aHasReturn = a.some((order: any) => order[1].productStatus === 2);
      const bHasReturn = b.some((order: any) => order[1].productStatus === 2);

      if (aHasReturn && !bHasReturn) {
        return -1;
      } else if (!aHasReturn && bHasReturn) {
        return 1;
      } else {
        return new Date(b[0][0].createdAt).getTime() - new Date(a[0][0].createdAt).getTime();
      }
    });
  }

  request(selectedOrder: any, request: string): void {
    if (request === "approve") {
      const createdAtDate = new Date(selectedOrder[1].createdAt);
      const currentDate = new Date();
      const oneMonthAgo = new Date(currentDate);
      oneMonthAgo.setMonth(currentDate.getMonth() - 1);
      if (createdAtDate <= oneMonthAgo) {
        alert("You can't return this product, return period expired");
        return;
      }
      this.orderService
          .approveRequest({
            status: 3,
            id: selectedOrder[1]?.id,
            quantity: selectedOrder[1].quantity,
            productId: selectedOrder[1].product.id,
          })
          .subscribe((res) => {
            this.loadOrderHistory();
            this.changeDetector.detectChanges();
          });
    } else {
      this.orderService
          .rejectRequest({
            status: 4,
            id: selectedOrder[1]?.id,
          })
          .subscribe((res) => {
            this.loadOrderHistory();
            this.changeDetector.detectChanges();
          });
    }
  }
}
