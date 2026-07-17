import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './layout/header/header.component';
import { RailNavComponent } from './layout/rail-nav/rail-nav.component';
import { StatusBarComponent } from './layout/status-bar/status-bar.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { DirectionService } from './core/services/direction.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RailNavComponent, StatusBarComponent, BreadcrumbComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  // Injected purely for its side effect (keeping <html dir/lang> in sync) —
  // instantiating it here at the root guarantees it's active app-wide.
  private readonly direction = inject(DirectionService);
  protected readonly auth = inject(AuthService);
}
