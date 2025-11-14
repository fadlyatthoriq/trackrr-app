import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

export interface PasswordReset {
  email: string;
  token: string;
  newPassword: string;
  expiryTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly USER_KEY = 'trackrr_users';
  private readonly CURRENT_USER_KEY = 'trackrr_current_user';
  private readonly RESET_KEY = 'trackrr_reset_tokens';
  private readonly MIN_PASSWORD_LENGTH = 6;
  private readonly RESET_TOKEN_EXPIRY = 15 * 60 * 1000;

  currentUser = signal<User | null>(this.getCurrentUserFromStorage());

  constructor(private router: Router) {}

  // 🔹 Check if running in browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // 🔹 Register User
  register(user: User): AuthResponse {
    // Validation
    const validation = this.validateUser(user);
    if (!validation.success) {
      return validation;
    }

    const users = this.getAllUsers();
    const exists = users.some((u) => u.email.toLowerCase() === user.email.toLowerCase());

    if (exists) {
      return { success: false, message: 'Email sudah terdaftar.' };
    }

    // Store user with trimmed data
    const newUser: User = {
      name: user.name.trim(),
      email: user.email.toLowerCase().trim(),
      password: user.password, // In production, hash this!
    };

    users.push(newUser);
    this.saveUsers(users);
    return { success: true, message: 'Registrasi berhasil! Silakan login.' };
  }

  // 🔹 Login User
  login(email: string, password: string): AuthResponse {
    if (!email || !password) {
      return { success: false, message: 'Email dan password harus diisi.' };
    }

    const users = this.getAllUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (!found) {
      return { success: false, message: 'Email atau password salah.' };
    }

    this.setCurrentUser(found);
    return { success: true, message: `Selamat datang kembali, ${found.name}!` };
  }

  // 🔹 Logout User
  logout(redirect: boolean = true): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUser.set(null);
    if (redirect) this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  // 🔹 Forgot Password - Generate Reset Token
  forgotPassword(email: string): AuthResponse {
    if (!email?.trim()) {
      return { success: false, message: 'Email harus diisi.' };
    }

    if (!this.isValidEmail(email)) {
      return { success: false, message: 'Format email tidak valid.' };
    }

    const users = this.getAllUsers();
    const userExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!userExists) {
      return { success: false, message: 'Email tidak terdaftar.' };
    }

    // Generate reset token
    const resetToken = this.generateResetToken();
    const expiryTime = Date.now() + this.RESET_TOKEN_EXPIRY;

    const resetData: PasswordReset = {
      email: email.toLowerCase().trim(),
      token: resetToken,
      newPassword: '',
      expiryTime: expiryTime,
    };

    // Save reset token to localStorage
    this.saveResetToken(resetData);

    return {
      success: true,
      message: `Link reset password telah dikirim ke ${email}. Token berlaku 15 menit.`,
    };
  }

  // 🔹 Reset Password with Token
  resetPassword(email: string, newPassword: string, token: string): AuthResponse {
    // Validation
    if (!email || !newPassword || !token) {
      return { success: false, message: 'Email, password baru, dan token harus diisi.' };
    }

    if (newPassword.length < this.MIN_PASSWORD_LENGTH) {
      return {
        success: false,
        message: `Password minimal ${this.MIN_PASSWORD_LENGTH} karakter.`,
      };
    }

    // Verify reset token
    const resetData = this.getResetToken(email, token);
    if (!resetData) {
      return { success: false, message: 'Token tidak valid atau sudah kadaluarsa.' };
    }

    if (Date.now() > resetData.expiryTime) {
      this.clearResetToken(email);
      return { success: false, message: 'Token sudah kadaluarsa. Silakan minta ulang.' };
    }

    // Update user password
    const users = this.getAllUsers();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
      return { success: false, message: 'User tidak ditemukan.' };
    }

    users[userIndex].password = newPassword;
    this.saveUsers(users);

    // Clear reset token
    this.clearResetToken(email);

    return { success: true, message: 'Password berhasil direset. Silakan login.' };
  }

  // 🔹 Private Methods
  private validateUser(user: User): AuthResponse {
    if (!user.name?.trim()) {
      return { success: false, message: 'Nama harus diisi.' };
    }

    if (!user.email?.trim()) {
      return { success: false, message: 'Email harus diisi.' };
    }

    if (!this.isValidEmail(user.email)) {
      return { success: false, message: 'Format email tidak valid.' };
    }

    if (!user.password) {
      return { success: false, message: 'Password harus diisi.' };
    }

    if (user.password.length < this.MIN_PASSWORD_LENGTH) {
      return {
        success: false,
        message: `Password minimal ${this.MIN_PASSWORD_LENGTH} karakter.`,
      };
    }

    return { success: true, message: '' };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private getAllUsers(): User[] {
    if (!this.isBrowser()) return [];
    try {
      return JSON.parse(localStorage.getItem(this.USER_KEY) || '[]');
    } catch (error) {
      console.error('Error parsing users from localStorage:', error);
      return [];
    }
  }

  private saveUsers(users: User[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  }

  private setCurrentUser(user: User): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      this.currentUser.set(user);
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  }

  private getCurrentUserFromStorage(): User | null {
    if (!this.isBrowser()) return null;
    try {
      const userData = localStorage.getItem(this.CURRENT_USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing current user from localStorage:', error);
      return null;
    }
  }

  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private saveResetToken(resetData: PasswordReset): void {
    if (!this.isBrowser()) return;
    try {
      const resetTokens: PasswordReset[] = JSON.parse(
        localStorage.getItem(this.RESET_KEY) || '[]'
      );
      // Remove old token for this email
      const filtered = resetTokens.filter((r) => r.email !== resetData.email);
      filtered.push(resetData);
      localStorage.setItem(this.RESET_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error saving reset token:', error);
    }
  }

  private getResetToken(email: string, token: string): PasswordReset | null {
    if (!this.isBrowser()) return null;
    try {
      const resetTokens: PasswordReset[] = JSON.parse(
        localStorage.getItem(this.RESET_KEY) || '[]'
      );
      return (
        resetTokens.find(
          (r) => r.email === email.toLowerCase() && r.token === token
        ) || null
      );
    } catch (error) {
      console.error('Error getting reset token:', error);
      return null;
    }
  }

  private clearResetToken(email: string): void {
    if (!this.isBrowser()) return;
    try {
      const resetTokens: PasswordReset[] = JSON.parse(
        localStorage.getItem(this.RESET_KEY) || '[]'
      );
      const filtered = resetTokens.filter((r) => r.email !== email.toLowerCase());
      localStorage.setItem(this.RESET_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error clearing reset token:', error);
    }
  }
}
