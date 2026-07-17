import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { IconComponent } from '../../shared/icon/icon.component';
import { HeaderDropdownComponent } from './header-dropdown.component';
import { HeaderMenuService } from '../../core/services/header-menu.service';
import { NavigationWorkspaceService, QuickNavItem } from '../../core/services/navigation-workspace.service';
import { RailStateService } from '../../core/services/rail-state.service';
import { ThemeService } from '../../core/services/theme.service';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { ThemeId } from '../../core/models/theme.model';

interface AppTile {
  name: string;
  icon: string;
}

const SSO_APPS: AppTile[] = [
  { name: 'Case Management', icon: 'folder' },
  { name: 'Document Vault', icon: 'document' },
  { name: 'Risk Analytics', icon: 'bar-chart' },
  { name: 'HR Portal', icon: 'users' },
  { name: 'Loan Origination', icon: 'percent' },
  { name: 'Audit Console', icon: 'search' },
  { name: 'Reporting Suite', icon: 'trend' },
  { name: 'Admin Portal', icon: 'gear' },
  { name: 'Helpdesk', icon: 'help' }
];

const SEARCH_TYPES = ['Customer Name', 'National ID', 'Passport', 'Phone', 'Case Number', 'T Code'] as const;

const SEARCH_PLACEHOLDERS: Record<(typeof SEARCH_TYPES)[number], string> = {
  'Customer Name': 'Search by customer name...',
  'National ID': 'Search by national ID...',
  Passport: 'Search by passport number...',
  Phone: 'Search by phone number...',
  'Case Number': 'Search by case number...',
  'T Code': 'Enter T-code...'
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, TranslocoModule, IconComponent, UpperCasePipe, HeaderDropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  protected readonly rail = inject(RailStateService);
  protected readonly menu = inject(HeaderMenuService);
  protected readonly workspace = inject(NavigationWorkspaceService);
  protected readonly theme = inject(ThemeService);
  private readonly breadcrumb = inject(BreadcrumbService);
  private readonly transloco = inject(TranslocoService);
  private readonly router = inject(Router);

  protected readonly searchTypes = SEARCH_TYPES;
  protected readonly searchType = signal<(typeof SEARCH_TYPES)[number]>('Customer Name');
  protected readonly searchQuery = signal('');
  protected readonly invalidTCode = signal(false);
  protected readonly searchPlaceholder = computed(() => (this.invalidTCode() ? 'Invalid T-code' : SEARCH_PLACEHOLDERS[this.searchType()]));
  protected readonly tcodeOptions = computed(() => {
    if (this.searchType() !== 'T Code' || this.workspace.findExactCode(this.searchQuery())) {
      return [];
    }
    return this.workspace.matches(this.searchQuery());
  });
  @ViewChild('searchInput') private searchInputElement?: ElementRef<HTMLInputElement>;

  protected readonly apps = SSO_APPS;
  protected readonly tenants = ['Prime Bank Ltd.', 'Northgate Finance', 'Meridian Trust Co.'];
  protected readonly activeTenant = signal(this.tenants[0]);

  protected readonly languages: { code: string; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'ar', label: 'العربية' }
  ];

  runSearch(): void {
    if (!this.rail.expanded()) {
      this.rail.toggle();
      return;
    }
    const query = this.searchQuery().trim();
    if (!query) {
      return;
    }
    if (this.searchType() === 'T Code') {
      const item = this.workspace.findTCode(query);
      if (!item) {
        this.rejectTCode();
        return;
      }
      this.navigateToQuickItem(item);
      this.searchQuery.set(item.code);
      return;
    }
    this.breadcrumb.set(['Search'], `Results for "${query}" — ${this.searchType()}`);
    // Wire to a real search service/route here — the POC only simulated this.
    console.info('Searching', this.searchType(), query);
  }

  selectSearchType(type: string): void {
    if (!SEARCH_TYPES.includes(type as (typeof SEARCH_TYPES)[number])) {
      return;
    }
    this.searchType.set(type as (typeof SEARCH_TYPES)[number]);
    this.searchQuery.set('');
    this.invalidTCode.set(false);
  }

  handleSearchQueryChange(value: string): void {
    this.searchQuery.set(value);
    this.invalidTCode.set(false);
    if (this.searchType() !== 'T Code') {
      return;
    }
    const item = this.workspace.findExactCode(value);
    if (item) {
      this.navigateToQuickItem(item);
      this.searchQuery.set(item.code);
    }
  }

  openFavorite(item: QuickNavItem): void {
    this.navigateToQuickItem(item);
    this.menu.close();
  }

  private navigateToQuickItem(item: QuickNavItem): void {
    this.workspace.select(item);
    this.rail.selectFeature(item.path);
    this.breadcrumb.set(item.labels.slice(0, -1), item.label);
    this.rail.expandAll();
    this.routerNavigate(item.routeSegments);
  }

  private rejectTCode(): void {
    this.searchQuery.set('');
    this.invalidTCode.set(true);
    queueMicrotask(() => this.searchInputElement?.nativeElement.focus());
  }

  private routerNavigate(routeSegments: string[]): void {
    this.router.navigate(routeSegments);
  }

  selectTenant(name: string): void {
    this.activeTenant.set(name);
    this.menu.close();
  }

  selectLanguage(code: string): void {
    this.transloco.setActiveLang(code);
    this.menu.close();
  }

  selectTheme(id: ThemeId): void {
    this.theme.select(id);
    this.menu.close();
  }

  launchApp(name: string): void {
    this.menu.close();
    this.breadcrumb.set(['Apps'], `Redirecting to ${name} via SSO…`);
    // Real implementation redirects through the SSO broker with a signed token.
    console.info('Redirecting to', name, 'via SSO');
  }

  logout(): void {
    this.menu.close();
    this.breadcrumb.reset('Signed out');
    // Real implementation clears the session and redirects to the IdP logout endpoint.
    console.info('Logging out');
  }
}
