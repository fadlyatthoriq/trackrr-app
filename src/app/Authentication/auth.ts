import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly USER_KEY = 'trackrr_users';
  private readonly CURRENT_USER_KEY = 'trackrr_current_user';

  currentUser = signal<User | null>(this.getCurrentUserFromStorage());

  constructor(private router: Router) {}

  // 🔹 Register User
  register(user: User): { success: boolean; message: string } {
    const users = this.getAllUsers();
    const exists = users.some(u => u.email === user.email);

    if (exists) {
      return { success: false, message: 'Email sudah terdaftar.' };
    }

    users.push(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(users));
    return { success: true, message: 'Registrasi berhasil! Silakan login.' };
  }

  // 🔹 Login User
  login(email: string, password: string): { success: boolean; message: string } {
    const users = this.getAllUsers();
    const found = users.find(u => u.email === email && u.password === password);

    if (!found) {
      return { success: false, message: 'Email atau password salah.' };
    }

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(found));
    this.currentUser.set(found);
    return { success: true, message: `Selamat datang kembali, ${found.name}!` };
  }

  // 🔹 Logout User
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  private getAllUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USER_KEY) || '[]');
  }

  private getCurrentUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}
