import { describe, expect, it } from 'vitest';
import { RailStateService } from './rail-state.service';

describe('RailStateService', () => {
  it('starts expanded in detail mode with no module open', () => {
    const service = new RailStateService();
    expect(service.expanded()).toBe(true);
    expect(service.openModuleId()).toBeNull();
    expect(service.activePath()).toEqual([]);
    expect(service.overlayCategoryPath()).toBeNull();
  });

  it('toggle() flips rail width state', () => {
    const service = new RailStateService();
    service.toggle();
    expect(service.expanded()).toBe(false);
    service.toggle();
    expect(service.expanded()).toBe(true);
  });

  it('toggleModule() opens a module, and re-toggling the same id closes it', () => {
    const service = new RailStateService();
    service.toggleModule('customers');
    expect(service.openModuleId()).toBe('customers');
    service.toggleModule('customers');
    expect(service.openModuleId()).toBeNull();
  });

  it('toggleModule() with a different id switches the open module (accordion behavior)', () => {
    const service = new RailStateService();
    service.toggleModule('customers');
    service.toggleModule('kyc');
    expect(service.openModuleId()).toBe('kyc');
  });

  it('togglePath() expands the rail, marks a path active, and toggles expansion', () => {
    const service = new RailStateService();
    service.togglePath([1]);
    expect(service.expanded()).toBe(true);
    expect(service.activePath()).toEqual([1]);
    expect(service.isExpanded([1])).toBe(true);

    service.togglePath([1]);
    expect(service.isExpanded([1])).toBe(false);
  });

  it('openCategory() stores the category path for the mega panel', () => {
    const service = new RailStateService();
    service.openCategory([1, 0, 0]);
    expect(service.expanded()).toBe(true);
    expect(service.activePath()).toEqual([1, 0, 0]);
    expect(service.overlayCategoryPath()).toEqual([1, 0, 0]);
  });

  it('selectFeature() closes the overlay and clears active rail highlighting like the POC', () => {
    const service = new RailStateService();
    service.openCategory([1, 0, 0]);
    service.selectFeature([1, 0, 0, 0, 1]);
    expect(service.activePath()).toEqual([]);
    expect(service.overlayCategoryPath()).toBeNull();
  });

  it('expandAll() and collapseAll() control the enterprise navigation depth', () => {
    const service = new RailStateService();
    service.expandAll();
    expect(service.expanded()).toBe(true);
    expect(service.isExpandedToCategories()).toBe(true);

    service.collapseAll();
    expect(service.isExpandedToCategories()).toBe(false);
    expect(service.overlayCategoryPath()).toBeNull();
  });
});
