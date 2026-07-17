import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal('amina.osei@nexacore.local');
  protected readonly password = signal('password');
  protected readonly error = signal('');

  submit(): void {
    this.error.set('');
    const ok = this.auth.login(this.email(), this.password());
    if (!ok) {
      this.error.set('Invalid email or password.');
      return;
    }
    this.router.navigate(['/dashboard']);
  }
}
