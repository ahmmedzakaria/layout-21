import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';

import { IconComponent } from '../../shared/icon/icon.component';
import { NAV_MODULES, NavCategory } from '../../core/models/nav-module.model';
import { RailStateService } from '../../core/services/rail-state.service';
import { RailFlyoutService } from '../../core/services/rail-flyout.service';

const CATEGORY_ICON: Record<NavCategory, string> = {
  Operation: 'bolt',
  Setup: 'gear',
  Report: 'bar-chart'
};

@Component({
  selector: 'app-rail-nav',
  standalone: true,
  imports: [TranslocoModule, IconComponent, OverlayModule],
  templateUrl: './rail-nav.component.html',
  styleUrl: './rail-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RailNavComponent {
  protected readonly rail = inject(RailStateService);
  protected readonly flyout = inject(RailFlyoutService);
  private readonly router = inject(Router);

  protected readonly modules = NAV_MODULES;
  protected readonly categoryIcon = CATEGORY_ICON;

  protected categories(moduleId: string): NavCategory[] {
    const mod = this.modules.find((m) => m.id === moduleId);
    return mod ? (Object.keys(mod.categories) as NavCategory[]) : [];
  }

  openCategory(moduleId: string, category: NavCategory, origin: CdkOverlayOrigin): void {
    const mod = this.modules.find((m) => m.id === moduleId);
    const items = mod?.categories[category] ?? [];
    this.flyout.open({ moduleId, moduleLabel: mod?.label ?? '', category, items }, origin);
  }

  selectItem(moduleId: string, path: string): void {
    this.router.navigate([moduleId, path]);
    this.flyout.close();
  }
}
