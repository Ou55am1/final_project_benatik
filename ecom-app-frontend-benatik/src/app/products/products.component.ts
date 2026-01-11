import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsumerService } from '../services/consumer.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  newProduct = { name: '', price: 0, quantity: 0 };
  loading = false;
  saving = false;
  error?: string;
  success?: string;

  constructor(private consumerService: ConsumerService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = undefined;
    this.consumerService.getProducts().subscribe({
      next: (data) => {
        this.products = data._embedded?.products ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Impossible de charger les produits';
        console.error(err);
        this.loading = false;
      }
    });
  }

  addProduct() {
    this.error = undefined;
    this.success = undefined;
    if (!this.newProduct.name.trim()) {
      this.error = 'Nom requis';
      return;
    }
    this.saving = true;
    this.consumerService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.success = 'Produit ajouté';
        this.newProduct = { name: '', price: 0, quantity: 0 };
        this.saving = false;
        this.loadProducts();
      },
      error: (err) => {
        this.error = 'Échec de création du produit';
        console.error(err);
        this.saving = false;
      }
    });
  }
}