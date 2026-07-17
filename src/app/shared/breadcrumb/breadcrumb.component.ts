import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {
  protected readonly breadcrumb = inject(BreadcrumbService);
}
