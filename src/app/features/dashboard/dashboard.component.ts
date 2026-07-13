import { ChangeDetectionStrategy, Component } from '@angular/core';

interface CustomerRecord {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'risk';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  protected readonly records: CustomerRecord[] = [
    { id: 'K-10441', name: 'John Ferreira', status: 'pending' },
    { id: 'K-10439', name: 'Maria Chen', status: 'approved' },
    { id: 'K-10432', name: 'Ahsan Karim', status: 'risk' }
  ];

  protected readonly statusLabel: Record<CustomerRecord['status'], string> = {
    pending: 'Pending',
    approved: 'Approved',
    risk: 'Elevated Risk'
  };
}
