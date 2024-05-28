import { Component } from "@angular/core";

import { CartService } from "../services/cart.service";
import { Product } from "../models/product.model";
import { ProductsService } from "../services/products.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrl: "./products.component.scss",
})
export class ProductsComponent {
  public products: Product[] = new Array<Product>();
  public loadingProducts: boolean = true;

  constructor(
    private productsService: ProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe((products: Product[]) => {
      this.loadingProducts = false;
      
      // Get all products in cart
      const productsInCart = this.cartService.allProductsInCart();
    
      // Create a map to keep track of quantities in cart
      const productQuantitiesInCart = productsInCart.reduce((acc:any, product) => {
        if (!acc[product.id]) {
          acc[product.id] = 0;
        }
        acc[product.id] += 1; // Assuming each product in the cart array represents one quantity
        return acc;
      }, {});
    
      // Adjust the stock of products based on quantities in cart
      this.products = products.map(product => {
        if (productQuantitiesInCart[product.id]) {
          product.stock -= productQuantitiesInCart[product.id];
        }
        return product;
      });
    
      console.log(this.cartService.allProductsInCart());
      console.log(this.products); // Verify the updated products
    });
    
  }

  public onBuyProduct(product: Product) {
    if (this.cartService.validate(product)) {
      this.cartService.addProductToCart(product);
    } else {
      alert("Stock unavailble of this book");
    }
  }
}
