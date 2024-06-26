import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Order } from '../models/order';
import { OrderItem } from '../models/order-item';
import { environment } from '@env/environment';
import { StripeService } from 'ngx-stripe';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    apiURLOrders = environment.apiUrl + 'orders';
    apiURLProducts = environment.apiUrl + 'products';

    constructor(private http: HttpClient, private stripeService: StripeService) {}

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiURLOrders);
    }

    getOrder(orderId: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiURLOrders}/${orderId}`);
    }

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this.apiURLOrders, order);
    }

    updateOrder(orderStaus: { status: string }, orderId: string): Observable<Order> {
        return this.http.put<Order>(`${this.apiURLOrders}/${orderId}`, orderStaus);
    }

    deleteOrder(orderId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiURLOrders}/${orderId}`);
    }
    getOrdersCount(): Observable<number> {
        return this.http.get<number>(`${this.apiURLOrders}/get/count`).pipe(map((objectValue: any) => objectValue.orderCount));
    }

    getTotalSales(): Observable<number> {
        return this.http.get<number>(`${this.apiURLOrders}/get/totalsales`).pipe(map((objectValue: any) => objectValue.totalsales));
    }

    getProduct(productId: string): Observable<any> {
        return this.http.get<any>(`${this.apiURLProducts}/${productId}`);
      }

    getOrdersByUserId(userId: string): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiURLOrders}/get/userorders/${userId}`);
    }

    createCheckoutSession(orderItem: OrderItem[]) {
        return this.http.post(`${this.apiURLOrders}/create-checkout-session`, orderItem).pipe(switchMap((session: {id:string}) => {
            return this.stripeService.redirectToCheckout({sessionId: session.id});
        }));
    }

    cacheOrderData(order: Order) {
        localStorage.setItem('orderData', JSON.stringify(order));
    }

    getCachedOrderData(): Order {
        return JSON.parse(localStorage.getItem('orderData'));
    }

    removeCachedOrderData() {
        localStorage.removeItem('orderData');
    }
}
