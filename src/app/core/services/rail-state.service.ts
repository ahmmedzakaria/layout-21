import { Injectable, signal } from '@angular/core';
import { NAV_TREE, pathKey } from '../models/nav-module.model';

@Injectable({ providedIn: 'root' })
export class RailStateService {
  /** The ONLY control for rail width / header detail-view — driven by the hamburger toggle. */
  readonly expanded = signal(true);

  /** Kept for compatibility with existing tests and any shell code that still reads the old accordion state. */
  readonly openModuleId = signal<string | null>(null);

  readonly expandedPaths = signal<ReadonlySet<string>>(new Set<string>());
  readonly activePath = signal<readonly number[]>([]);
  readonly overlayCategoryPath = signal<readonly number[] | null>(null);
  private closeTimer: ReturnType<typeof setTimeout> | undefined;

  toggle(): void {
    this.expanded.update((v) => !v);
    if (this.expanded()) {
      return;
    }
    this.overlayCategoryPath.set(null);
  }

  toggleModule(id: string): void {
    this.openModuleId.update((current) => (current === id ? null : id));
  }

  togglePath(path: readonly number[]): void {
    this.expanded.set(true);
    this.activePath.set([...path]);
    const id = this.nodeId(path);
    if (id) {
      this.toggleModule(id);
    }
    this.expandedPaths.update((current) => {
      const next = new Set(current);
      const key = pathKey(path);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
    this.overlayCategoryPath.set(null);
  }

  openCategory(path: readonly number[]): void {
    this.cancelOverlayClose();
    this.expanded.set(true);
    this.activePath.set([...path]);
    this.overlayCategoryPath.set([...path]);
  }

  selectFeature(path: readonly number[]): void {
    this.activePath.set([]);
    this.overlayCategoryPath.set(null);
  }

  expandAll(): void {
    const keys = new Set<string>();
    NAV_TREE.forEach((group, groupIndex) => {
      keys.add(pathKey([groupIndex]));
      group.children.forEach((_, moduleIndex) => keys.add(pathKey([groupIndex, moduleIndex])));
    });
    this.expanded.set(true);
    this.expandedPaths.set(keys);
  }

  collapseAll(): void {
    this.expandedPaths.set(new Set());
    this.closeOverlay();
  }

  scheduleOverlayClose(delayMs = 220): void {
    this.cancelOverlayClose();
    this.closeTimer = setTimeout(() => this.closeOverlay(), delayMs);
  }

  cancelOverlayClose(): void {
    clearTimeout(this.closeTimer);
  }

  closeOverlay(): void {
    this.cancelOverlayClose();
    this.overlayCategoryPath.set(null);
  }

  isExpanded(path: readonly number[]): boolean {
    return this.expandedPaths().has(pathKey(path));
  }

  isExpandedToCategories(): boolean {
    return NAV_TREE.every((group, groupIndex) => {
      const groupPath = [groupIndex];
      return (
        this.expandedPaths().has(pathKey(groupPath)) &&
        group.children.every((_, moduleIndex) => this.expandedPaths().has(pathKey([...groupPath, moduleIndex])))
      );
    });
  }

  private nodeId(path: readonly number[]): string | null {
    if (path.length === 1) {
      return NAV_TREE[path[0]]?.id ?? null;
    }
    if (path.length === 2) {
      return NAV_TREE[path[0]]?.children[path[1]]?.id ?? null;
    }
    return null;
  }
}
