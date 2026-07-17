import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

import { IconComponent } from '../../shared/icon/icon.component';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { NavigationWorkspaceService } from '../../core/services/navigation-workspace.service';
import { RailStateService } from '../../core/services/rail-state.service';
import { NAV_TREE, NavCategoryNode, NavFeature, NavFeatureGroup, NavModule, NavModuleGroup } from '../../core/models/nav-module.model';

interface MegaContext {
  title: string;
  note: string;
  mark: string;
}

@Component({
  selector: 'app-rail-nav',
  standalone: true,
  imports: [TranslocoModule, IconComponent],
  templateUrl: './rail-nav.component.html',
  styleUrl: './rail-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RailNavComponent {
  protected readonly rail = inject(RailStateService);
  protected readonly workspace = inject(NavigationWorkspaceService);
  private readonly router = inject(Router);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly tree = NAV_TREE;
  protected readonly overlayTop = signal(66);
  protected readonly overlayLeft = signal(294);
  protected readonly overlayCategory = computed(() => {
    const path = this.rail.overlayCategoryPath();
    return path ? this.categoryAt(path) : null;
  });
  protected readonly overlayModuleGroup = computed(() => {
    const path = this.rail.overlayCategoryPath();
    return path ? this.tree[path[0]] : null;
  });
  protected readonly overlayModule = computed(() => {
    const path = this.rail.overlayCategoryPath();
    return path ? this.tree[path[0]]?.children[path[1]] : null;
  });
  protected readonly overlayContext = computed(() => {
    const category = this.overlayCategory();
    const group = this.overlayModuleGroup();
    const module = this.overlayModule();
    return category && group && module ? this.contextFor(group, module, category) : null;
  });

  protected toggleEnterpriseNavigation(event: Event): void {
    event.stopPropagation();
    this.rail.isExpandedToCategories() ? this.rail.collapseAll() : this.rail.expandAll();
  }

  protected openHome(): void {
    this.rail.activePath.set([]);
    this.rail.overlayCategoryPath.set(null);
    this.workspace.selectedItem.set(null);
    this.breadcrumb.set([], 'Dashboard');
    this.router.navigate(['/dashboard']);
  }

  protected isActive(path: readonly number[]): boolean {
    const active = this.rail.activePath();
    return active.length >= path.length && path.every((value, index) => active[index] === value);
  }

  protected moduleIconName(label: string): string {
    const key = label.toLowerCase();
    if (key.includes('banking')) return 'bank';
    if (key.includes('transaction monitoring') || key.includes('case management')) return 'monitor';
    if (key.includes('regulatory') || key.includes('policy')) return 'document-lines';
    if (key.includes('kyc') || key.includes('kyb') || key.includes('aml') || key.includes('diligence') || key.includes('compliance')) {
      return 'shield-list';
    }
    if (key.includes('survey')) return 'map';
    if (key.includes('pos')) return 'receipt';
    if (key.includes('clinic') || key.includes('pharmacy')) return 'medical';
    if (key.includes('student') || key.includes('fee')) return 'education';
    if (key.includes('marketplace') || key.includes('delivery')) return 'cart';
    if (key.includes('ledger') || key.includes('payable') || key.includes('receivable') || key.includes('budget') || key.includes('treasury')) {
      return 'ledger';
    }
    if (key.includes('human resource') || key.includes('employee')) return 'users';
    if (key.includes('payroll')) return 'payroll';
    if (key.includes('fixed asset') || key.includes('asset')) return 'layers';
    if (key.includes('administration')) return 'gear';
    if (key.includes('security') || key.includes('control')) return 'shield-check';
    if (key.includes('report') || key.includes('analytics')) return 'bar-chart';
    if (key.includes('retail') || key.includes('inventory')) return 'shopping-bag';
    return 'module-default';
  }

  protected openCategory(path: readonly number[], event: Event): void {
    const target = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    this.overlayTop.set(this.clampedOverlayTop(target?.getBoundingClientRect().top ?? 66));
    this.overlayLeft.set(this.railRight() + 8);
    this.rail.openCategory(path);
  }

  protected selectFeature(
    moduleGroup: NavModuleGroup,
    module: NavModule,
    category: NavCategoryNode,
    featureGroup: NavFeatureGroup,
    feature: NavFeature,
    path: readonly number[]
  ): void {
    this.rail.selectFeature(path);
    const item = this.workspace.findByPath(path);
    if (item) {
      this.workspace.select(item);
    }
    this.breadcrumb.set([moduleGroup.label, module.label, category.label, featureGroup.label], feature.label);
    this.router.navigate([moduleGroup.id, module.id, category.label.toLowerCase(), feature.path]);
  }

  protected featurePath(categoryPath: readonly number[], groupIndex: number, featureIndex: number): number[] {
    return [...categoryPath, groupIndex, featureIndex];
  }

  protected scheduleClose(): void {
    this.rail.scheduleOverlayClose();
  }

  protected cancelClose(): void {
    this.rail.cancelOverlayClose();
  }

  @HostListener('window:resize')
  protected repositionOverlay(): void {
    this.overlayTop.update((top) => this.clampedOverlayTop(top));
    this.overlayLeft.set(this.railRight() + 8);
  }

  @HostListener('document:click', ['$event'])
  protected closeOnOutsideClick(event: MouseEvent): void {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (target?.closest('app-rail-nav')) {
      return;
    }
    this.rail.closeOverlay();
  }

  private categoryAt(path: readonly number[]): NavCategoryNode | null {
    return this.tree[path[0]]?.children[path[1]]?.children[path[2]] ?? null;
  }

  private clampedOverlayTop(value: number): number {
    const minTop = 66;
    const maxTop = Math.max(minTop, window.innerHeight - 420);
    return Math.min(Math.max(value, minTop), maxTop);
  }

  private railRight(): number {
    const rail = this.host.nativeElement.querySelector('.rail');
    return rail?.getBoundingClientRect().right ?? 286;
  }

  private contextFor(group: NavModuleGroup, module: NavModule, category: NavCategoryNode): MegaContext {
    const notes: Record<string, string> = {
      Banking: 'Work through customer, account, loan, transaction, and compliance tasks from one operational surface.',
      Compliance: 'Manage KYC, AML screening, due diligence, monitoring, investigations, and regulatory workflows.',
      Survey: 'Capture field information, verify boundaries or assets, and continue into GIS-backed survey workflows.',
      POS: 'Move quickly through sales, cash desk, inventory, settlement, and retail service actions.',
      'Health & Medical': 'Access patient, appointment, clinic, and pharmacy operations grouped for front-desk teams.',
      Education: 'Manage student, academic, attendance, fee, and guardian workflows from the selected category.',
      'E-Commerce': 'Review marketplace, catalog, order, fulfillment, and delivery actions in a single panel.',
      Finance: 'Control ledger, payable, receivable, budgeting, treasury, and financial close workflows from one finance workspace.',
      Administration: 'Configure users, tenants, branches, roles, and platform settings for controlled operations.',
      Security: 'Review access, sessions, privileges, devices, and audit activity for secure administration.',
      Reporting: 'Open operational, management, compliance, and analytics reports by business area.'
    };
    const marks: Record<string, string> = {
      Banking: 'BNK',
      Compliance: 'KYC',
      Survey: 'MAP',
      POS: 'POS',
      'Health & Medical': 'MED',
      Education: 'EDU',
      'E-Commerce': 'ECM',
      Finance: 'FIN',
      Administration: 'ADM',
      Security: 'SEC',
      Reporting: 'RPT'
    };
    return {
      title: `${module.label} · ${category.label}`,
      note: notes[group.label] ?? 'Use these grouped actions to open the right workflow without leaving the current page context.',
      mark: marks[group.label] ?? 'NAV'
    };
  }
}
