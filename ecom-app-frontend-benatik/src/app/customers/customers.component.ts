import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsumerService } from '../services/consumer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  newCustomer = { name: '', email: '' };
  loading = false;
  saving = false;
  error?: string;
  success?: string;

  constructor(private consumerService: ConsumerService, private router: Router) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.error = undefined;
    this.consumerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data._embedded?.customers ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Impossible de charger les clients';
        console.error(err);
        this.loading = false;
      }
    });
  }

  addCustomer() {
    this.error = undefined;
    this.success = undefined;
    if (!this.newCustomer.name.trim() || !this.newCustomer.email.trim()) {
      this.error = 'Nom et email requis';
      return;
    }
    this.saving = true;
    this.consumerService.createCustomer(this.newCustomer).subscribe({
      next: () => {
        this.success = 'Client ajouté';
        this.newCustomer = { name: '', email: '' };
        this.saving = false;
        this.loadCustomers();
      },
      error: (err) => {
        this.error = 'Échec de création du client';
        console.error(err);
        this.saving = false;
      }
    });
  }

  handleViewBills(customer: any) {
    this.router.navigate(['/bills', customer.id]);
  }
}
