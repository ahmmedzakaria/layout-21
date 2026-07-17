import { Injectable, computed, signal } from '@angular/core';

export interface AuthUser {
  name: string;
  email: string;
  role: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

const USERS_KEY = 'nexacore.auth.users';
const SESSION_KEY = 'nexacore.auth.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<AuthUser | null>(this.loadSession());
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly initials = computed(() => {
    const user = this.currentUser();
    if (!user) {
      return 'AO';
    }
    const parts = user.name.trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : user.name.slice(0, 2)).toUpperCase();
  });

  login(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.loadUsers().find((item) => item.email.toLowerCase() === normalizedEmail && item.password === password);
    if (!user) {
      return false;
    }
    const session = this.toAuthUser(user);
    this.currentUser.set(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  }

  register(name: string, email: string, password: string): { ok: boolean; message?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const users = this.loadUsers();
    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      return { ok: false, message: 'An account already exists for this email.' };
    }
    const user: StoredUser = {
      name: name.trim(),
      email: normalizedEmail,
      role: 'Compliance Officer',
      password
    };
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const session = this.toAuthUser(user);
    this.currentUser.set(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true };
  }

  signOut(): void {
    localStorage.removeItem(SESSION_KEY);
    this.currentUser.set(null);
  }

  private loadSession(): AuthUser | null {
    try {
      const saved = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as AuthUser | null;
      return saved?.email ? saved : null;
    } catch {
      return null;
    }
  }

  private loadUsers(): StoredUser[] {
    try {
      const saved = JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]') as StoredUser[];
      if (Array.isArray(saved) && saved.length) {
        return saved;
      }
    } catch {
      return [];
    }
    return [
      {
        name: 'Amina Osei',
        email: 'amina.osei@nexacore.local',
        role: 'Compliance Officer',
        password: 'password'
      }
    ];
  }

  private toAuthUser(user: StoredUser): AuthUser {
    return {
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
}
