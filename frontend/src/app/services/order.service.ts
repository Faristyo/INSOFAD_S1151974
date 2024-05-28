import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Order } from "../models/order.model";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OrderService{
    private baseUrl: string = environment.base_url + "orders";
    constructor(private http: HttpClient) {}

    public getOrderHistory():Observable<any> {
        return this.http.get<any[]>(this.baseUrl+'/history')
    }

    public placeOrder(data:Order) {
        return this.http.post<any[]>(this.baseUrl,data)
    }

    public returnBook(data:any): Observable<string>{
        return this.http.post(this.baseUrl+'/return', {status: data.status, ids: data.ids, product_id:data.product_id, description:data.description, date:data.date, quantity:data.quantity}, { responseType: 'text' });
    }

    public getAllHistory():Observable<any> {
        return this.http.get<any[]>(this.baseUrl+'/allhistory')
    }

    public approveRequest(data:any): Observable<string> {
        return this.http.post(this.baseUrl+'/approve', {status: data.status, id: data.id, quantity:data.quantity, productId:data.productId}, { responseType: 'text' });
    }

    
    public rejectRequest(data:any): Observable<string> {
        return this.http.post(this.baseUrl+'/reject', {status: data.status, id: data.id}, { responseType: 'text' });
    }

} 