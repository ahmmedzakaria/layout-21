import { Injectable, computed, signal } from '@angular/core';
import { NAV_TREE, NavFeature, pathKey } from '../models/nav-module.model';

export interface QuickNavItem {
  code: string;
  path: number[];
  pathKey: string;
  label: string;
  labels: string[];
  routeSegments: string[];
}

const FAVORITE_STORAGE_KEY = 'nexacore.favorite.navigation';

@Injectable({ providedIn: 'root' })
export class NavigationWorkspaceService {
  readonly quickNavItems = this.buildQuickNavItems();
  readonly selectedItem = signal<QuickNavItem | null>(null);
  readonly favorites = signal<ReadonlySet<string>>(this.loadFavorites());
  readonly favoriteItems = computed(() =>
    Array.from(this.favorites())
      .map((favoritePath) => this.findByPathKey(favoritePath))
      .filter((item): item is QuickNavItem => !!item)
  );

  private readonly byCode = new Map(this.quickNavItems.map((item) => [this.normalizeCode(item.code), item]));
  private readonly byPathKey = new Map(this.quickNavItems.map((item) => [item.pathKey, item]));

  matches(query: string, maxItems = 12): QuickNavItem[] {
    const value = query.trim();
    const normalized = this.normalizeCode(value);
    if (normalized.length < 2) {
      return [];
    }
    const lowered = value.toLowerCase();
    return this.quickNavItems
      .filter(
        (item) =>
          this.normalizeCode(item.code).includes(normalized) ||
          item.label.toLowerCase().includes(lowered) ||
          item.labels.join(' ').toLowerCase().includes(lowered)
      )
      .slice(0, maxItems);
  }

  findTCode(value: string): QuickNavItem | null {
    const normalized = this.normalizeCode(value);
    const lowered = value.trim().toLowerCase();
    return (
      this.byCode.get(normalized) ??
      this.quickNavItems.find(
        (item) =>
          this.normalizeCode(item.code).includes(normalized) ||
          item.label.toLowerCase().includes(lowered) ||
          item.labels.join(' ').toLowerCase().includes(lowered)
      ) ??
      null
    );
  }

  findExactCode(value: string): QuickNavItem | null {
    return this.byCode.get(this.normalizeCode(value)) ?? null;
  }

  findByPath(path: readonly number[]): QuickNavItem | null {
    return this.findByPathKey(pathKey(path));
  }

  findByPathKey(value: string): QuickNavItem | null {
    return this.byPathKey.get(value) ?? null;
  }

  select(item: QuickNavItem): void {
    this.selectedItem.set(item);
  }

  toggleFavorite(pathValue: string): void {
    if (!this.byPathKey.has(pathValue)) {
      return;
    }
    this.favorites.update((current) => {
      const next = new Set(current);
      next.has(pathValue) ? next.delete(pathValue) : next.add(pathValue);
      this.saveFavorites(next);
      return next;
    });
  }

  isFavorite(pathValue: string): boolean {
    return this.favorites().has(pathValue);
  }

  private buildQuickNavItems(): QuickNavItem[] {
    const items: QuickNavItem[] = [];
    const usedCodes = new Set<string>();
    NAV_TREE.forEach((moduleGroup, groupIndex) => {
      moduleGroup.children.forEach((module, moduleIndex) => {
        module.children.forEach((category, categoryIndex) => {
          category.children.forEach((featureGroup, featureGroupIndex) => {
            featureGroup.children.forEach((feature, featureIndex) => {
              const path = [groupIndex, moduleIndex, categoryIndex, featureGroupIndex, featureIndex];
              const labels = [moduleGroup.label, module.label, category.label, featureGroup.label, feature.label];
              items.push({
                code: this.makeTCode(labels, usedCodes),
                path,
                pathKey: pathKey(path),
                label: feature.label,
                labels,
                routeSegments: [moduleGroup.id, module.id, category.label.toLowerCase(), feature.path]
              });
            });
          });
        });
      });
    });
    return items;
  }

  private makeTCode(labels: string[], usedCodes: Set<string>): string {
    const base = `${this.codePart(labels[0], 3)}-${this.codePart(labels[1], 3)}-${this.codePart(labels[4], 4)}`;
    let code = base;
    let index = 2;
    while (usedCodes.has(this.normalizeCode(code))) {
      code = `${base}${index}`;
      index += 1;
    }
    usedCodes.add(this.normalizeCode(code));
    return code;
  }

  private codePart(label: string, maxLength: number): string {
    const words = label.match(/[A-Za-z0-9]+/g) ?? [];
    const value = words.length > 1 ? words.map((word) => word[0]).join('') : (words[0] ?? 'NAV');
    return value.toUpperCase().slice(0, maxLength);
  }

  private normalizeCode(code: string): string {
    return code.toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  private loadFavorites(): ReadonlySet<string> {
    try {
      const saved = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY) ?? '[]');
      return new Set(Array.isArray(saved) ? saved.filter((favoritePath) => typeof favoritePath === 'string') : []);
    } catch {
      return new Set();
    }
  }

  private saveFavorites(favorites: ReadonlySet<string>): void {
    localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
  }
}
