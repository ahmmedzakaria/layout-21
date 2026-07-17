import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly error = signal('');

  submit(): void {
    this.error.set('');
    if (!this.name().trim() || !this.email().trim() || this.password().length < 6) {
      this.error.set('Enter a name, email, and password of at least 6 characters.');
      return;
    }
    if (this.password() !== this.confirmPassword()) {
      this.error.set('Passwords do not match.');
      return;
    }
    const result = this.auth.register(this.name(), this.email(), this.password());
    if (!result.ok) {
      this.error.set(result.message ?? 'Registration failed.');
      return;
    }
    this.router.navigate(['/dashboard']);
  }
}
