import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  email: string = '';
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;
  step: 'email' | 'reset' = 'email'; // Step 1: Enter email, Step 2: Reset password

  newPassword: string = '';
  confirmPassword: string = '';
  resetToken: string = '';

  constructor(private auth: Auth, private router: Router) {}

  // 🔹 Step 1: Request Password Reset
  onForgotPassword() {
    if (!this.email.trim()) {
      this.isError = true;
      this.message = 'Email harus diisi.';
      return;
    }

    this.isLoading = true;
    const response = this.auth.forgotPassword(this.email);
    this.isLoading = false;

    this.isError = !response.success;
    this.message = response.message;

    if (response.success) {
      // Move to step 2 after 2 seconds
      setTimeout(() => {
        this.step = 'reset';
      }, 2000);
    }
  }

  // 🔹 Step 2: Reset Password with Token
  onResetPassword() {
    if (!this.newPassword || !this.confirmPassword || !this.resetToken) {
      this.isError = true;
      this.message = 'Semua field harus diisi.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.isError = true;
      this.message = 'Password tidak cocok.';
      return;
    }

    this.isLoading = true;
    const response = this.auth.resetPassword(this.email, this.newPassword, this.resetToken);
    this.isLoading = false;

    this.isError = !response.success;
    this.message = response.message;

    if (response.success) {
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }
  }

  // 🔹 Back to Email Form
  goBack() {
    this.step = 'email';
    this.newPassword = '';
    this.confirmPassword = '';
    this.resetToken = '';
    this.message = '';
  }
}
