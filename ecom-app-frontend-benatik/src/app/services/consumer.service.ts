import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Customer } from '../models/customer.model';
import { Bill } from '../models/bill.model';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ConsumerService {
    private gatewayUrl = 'http://localhost:8888';

    private readonly useMock = false;
    private readonly networkDelay = 300;

    private mockCustomers: Customer[] = [
        { id: 1, name: 'Alice Dupont', email: 'alice.dupont@example.com' },
        { id: 2, name: 'Mohamed Benali', email: 'm.benali@example.com' },
        { id: 3, name: 'Sara El Amrani', email: 'sara.amrani@example.com' },
        { id: 4, name: 'Jean Martin', email: 'jean.martin@example.com' },
        { id: 5, name: 'Nadia Bouchra', email: 'nadia.bouchra@example.com' },
        { id: 6, name: 'Youssef Karim', email: 'youssef.karim@example.com' }
    ];

    private mockProducts: Product[] = [
        { id: 1, name: 'Laptop Pro 14"', price: 1499, quantity: 8 },
        { id: 2, name: 'Smartphone X', price: 899, quantity: 25 },
        { id: 3, name: 'USB-C Hub', price: 49, quantity: 120 },
        { id: 4, name: 'Wireless Mouse', price: 29, quantity: 200 },
        { id: 5, name: 'Mechanical Keyboard', price: 119, quantity: 60 },
        { id: 6, name: '27" 4K Monitor', price: 329, quantity: 15 }
    ];

    private mockBills: Bill[] = [
        {
            id: 1001,
            billingDate: new Date(new Date().getTime() - 86400000 * 3).toISOString(),
            customerId: 1,
            productItems: [
                { id: 1, productId: '1', unitPrice: 1499, quantity: 1, product: { id: 1, name: 'Laptop Pro 14"', price: 1499, quantity: 8 } },
                { id: 2, productId: '3', unitPrice: 49, quantity: 2, product: { id: 3, name: 'USB-C Hub', price: 49, quantity: 120 } }
            ],
            customer: { id: 1, name: 'Alice Dupont', email: 'alice.dupont@example.com' }
        },
        {
            id: 1002,
            billingDate: new Date(new Date().getTime() - 86400000 * 2).toISOString(),
            customerId: 2,
            productItems: [
                { id: 3, productId: '2', unitPrice: 899, quantity: 1, product: { id: 2, name: 'Smartphone X', price: 899, quantity: 25 } },
                { id: 4, productId: '4', unitPrice: 29, quantity: 1, product: { id: 4, name: 'Wireless Mouse', price: 29, quantity: 200 } }
            ],
            customer: { id: 2, name: 'Mohamed Benali', email: 'm.benali@example.com' }
        },
        {
            id: 1003,
            billingDate: new Date(new Date().getTime() - 86400000).toISOString(),
            customerId: 3,
            productItems: [
                { id: 5, productId: '6', unitPrice: 329, quantity: 2, product: { id: 6, name: '27" 4K Monitor', price: 329, quantity: 15 } }
            ],
            customer: { id: 3, name: 'Sara El Amrani', email: 'sara.amrani@example.com' }
        },
        {
            id: 1004,
            billingDate: new Date().toISOString(),
            customerId: 1,
            productItems: [
                { id: 6, productId: '5', unitPrice: 119, quantity: 1, product: { id: 5, name: 'Mechanical Keyboard', price: 119, quantity: 60 } },
                { id: 7, productId: '4', unitPrice: 29, quantity: 2, product: { id: 4, name: 'Wireless Mouse', price: 29, quantity: 200 } }
            ],
            customer: { id: 1, name: 'Alice Dupont', email: 'alice.dupont@example.com' }
        }
    ];

    private halResponse<T>(key: string, items: T[]): any {
        return { _embedded: { [key]: items } } as any;
    }

    constructor(private http: HttpClient) { }

    public getCustomers(): Observable<any> {
        if (this.useMock) {
            return of(this.halResponse<Customer>('customers', this.mockCustomers)).pipe(delay(this.networkDelay));
        }
        return this.http.get(`${this.gatewayUrl}/customer-service/api/customers`).pipe(
            catchError(() => of(this.halResponse<Customer>('customers', this.mockCustomers)).pipe(delay(this.networkDelay)))
        );
    }

    public createCustomer(payload: Partial<Customer>): Observable<Customer> {
        if (this.useMock) {
            return this.createMockCustomer(payload);
        }
        return this.http.post<Customer>(`${this.gatewayUrl}/customer-service/api/customers`, payload).pipe(
            catchError(() => this.createMockCustomer(payload))
        );
    }

    public getProducts(): Observable<any> {
        if (this.useMock) {
            return of(this.halResponse<Product>('products', this.mockProducts)).pipe(delay(this.networkDelay));
        }
        return this.http.get(`${this.gatewayUrl}/inventory-service/api/products`).pipe(
            catchError(() => of(this.halResponse<Product>('products', this.mockProducts)).pipe(delay(this.networkDelay)))
        );
    }

    public createProduct(payload: Partial<Product>): Observable<Product> {
        if (this.useMock) {
            return this.createMockProduct(payload);
        }
        return this.http.post<Product>(`${this.gatewayUrl}/inventory-service/api/products`, payload).pipe(
            catchError(() => this.createMockProduct(payload))
        );
    }

    public getBillsByCustomerID(customerId: number): Observable<any> {
        if (this.useMock) {
            const items = this.mockBills.filter(b => b.customerId === +customerId).map(b => ({ id: b.id, billingDate: b.billingDate, customerId: b.customerId } as Bill));
            return of(this.halResponse<Bill>('bills', items)).pipe(delay(this.networkDelay));
        }
        return this.http.get(`${this.gatewayUrl}/billing-service/api/bills/search/findByCustomerId?customerId=${customerId}&projection=fullBill`).pipe(
            catchError(() => {
                const items = this.mockBills.filter(b => b.customerId === +customerId).map(b => ({ id: b.id, billingDate: b.billingDate, customerId: b.customerId } as Bill));
                return of(this.halResponse<Bill>('bills', items)).pipe(delay(this.networkDelay));
            })
        );
    }

    public getAllBills(): Observable<any> {
        if (this.useMock) {
            const items = this.mockBills.map(b => ({ id: b.id, billingDate: b.billingDate, customerId: b.customerId } as Bill));
            return of(this.halResponse<Bill>('bills', items)).pipe(delay(this.networkDelay));
        }
        return this.http.get(`${this.gatewayUrl}/billing-service/api/bills?projection=fullBill`).pipe(
            catchError(() => {
                const items = this.mockBills.map(b => ({ id: b.id, billingDate: b.billingDate, customerId: b.customerId } as Bill));
                return of(this.halResponse<Bill>('bills', items)).pipe(delay(this.networkDelay));
            })
        );
    }

    public getBillDetails(id: number): Observable<Bill> {
        if (this.useMock) {
            return of(this.mockBillDetails(id)).pipe(delay(this.networkDelay));
        }
        return this.http.get<Bill>(`${this.gatewayUrl}/billing-service/bills/${id}`).pipe(
            catchError(() => of(this.mockBillDetails(id)).pipe(delay(this.networkDelay)))
        );
    }

    private createMockCustomer(payload: Partial<Customer>): Observable<Customer> {
        const nextId = (this.mockCustomers.at(-1)?.id ?? 0) + 1;
        const customer: Customer = { id: nextId, name: payload.name || 'Nouveau Client', email: payload.email || `client${nextId}@example.com` };
        this.mockCustomers = [...this.mockCustomers, customer];
        return of(customer).pipe(delay(this.networkDelay));
    }

    private createMockProduct(payload: Partial<Product>): Observable<Product> {
        const nextId = (this.mockProducts.at(-1)?.id ?? 0) + 1;
        const product: Product = { id: nextId, name: payload.name || 'Nouveau Produit', price: payload.price ?? 0, quantity: payload.quantity ?? 0 };
        this.mockProducts = [...this.mockProducts, product];
        return of(product).pipe(delay(this.networkDelay));
    }

    private mockBillDetails(id: number): Bill {
        const bill = this.mockBills.find(b => b.id === +id);
        if (!bill) {
            return { id, billingDate: new Date().toISOString(), customerId: 0, productItems: [] } as Bill;
        }
        const customer = this.mockCustomers.find(c => c.id === bill.customerId);
        const withRelations: Bill = {
            id: bill.id,
            billingDate: bill.billingDate,
            customerId: bill.customerId,
            productItems: bill.productItems.map(pi => ({
                id: pi.id,
                productId: pi.productId,
                unitPrice: pi.unitPrice,
                quantity: pi.quantity,
                product: this.mockProducts.find(p => String(p.id) === String(pi.productId))
            })),
            customer
        };
        return withRelations;
    }
}
