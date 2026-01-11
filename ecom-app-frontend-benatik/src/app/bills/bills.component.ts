import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerService } from '../services/consumer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.css'
})
export class BillsComponent implements OnInit {
  bills: any[] = [];
  customerId!: number;
  loading = false;
  error?: string;

  constructor(
    private consumerService: ConsumerService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['customerId'];
    this.loading = true;
    this.error = undefined;
    const obs = this.customerId
      ? this.consumerService.getBillsByCustomerID(this.customerId)
      : this.consumerService.getAllBills();
    obs.subscribe({
      next: (data) => {
        this.bills = data._embedded?.bills ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Impossible de charger les factures';
        this.loading = false;
      }
    });
  }

  handleBillDetails(bill: any) {
    this.router.navigate(['/bill-details', bill.id]);
  }
}
