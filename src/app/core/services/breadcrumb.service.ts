import { Injectable, signal } from '@angular/core';

export interface BreadcrumbSegment {
  label: string;
}

const HOME: BreadcrumbSegment = { label: 'Home' };

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  /** Always starts with Home, matching the POC's breadcrumb prefix. */
  readonly trail = signal<BreadcrumbSegment[]>([HOME]);
  readonly title = signal<string>('Dashboard');

  /**
   * Sets breadcrumb + title together — mirrors the original `sel(m, s)` function,
   * which always updated both in one call.
   */
  set(path: string[], title: string): void {
    this.trail.set([HOME, ...path.map((label) => ({ label }))]);
    this.title.set(title);
  }

  reset(title = 'Dashboard'): void {
    this.trail.set([HOME]);
    this.title.set(title);
  }
}
