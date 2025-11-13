import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, User } from '../auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;

  constructor(private auth: Auth, private router: Router) {
    console.log('Register component initialized');
    console.log('Auth service:', this.auth);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  onRegister() {
    console.log('onRegister() called');

    // Reset message
    this.message = '';
    this.isError = false;

    // Frontend validation
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      console.log('Validation failed: empty fields');
      this.message = 'Semua field harus diisi.';
      this.isError = true;
      return;
    }

    if (this.password !== this.confirmPassword) {
      console.log('Validation failed: password mismatch');
      this.message = 'Password tidak cocok.';
      this.isError = true;
      return;
    }

    console.log('Frontend validation passed');

    // Set loading state
    this.isLoading = true;

    // Create user object
    const user: User = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password.trim(),
    };

    console.log('User object:', user);
    console.log('Calling auth.register()');

    // Call auth service
    try {
      const result = this.auth.register(user);
      console.log('Auth service result:', result);

      // Handle result
      if (result.success) {
        console.log('Registration successful!');
        this.message = result.message;
        this.isError = false;
        this.clearForm();

        // Show alert for success
        if (this.isBrowser()) {
          alert(result.message);
        }
        console.log('Register berhasil:', result);

        // Redirect to login after delay
        setTimeout(() => {
          console.log('Redirecting to login...');
          this.isLoading = false;
          this.router.navigate(['/login']);
        }, 1500);
      } else {
        console.log('Registration failed:', result.message);
        this.message = result.message;
        this.isError = true;
        this.isLoading = false;

        // Show alert for error
        if (this.isBrowser()) {
          alert(result.message);
        }
        console.error('Register gagal:', result);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      this.message = 'Terjadi kesalahan! Silakan coba lagi.';
      this.isError = true;
      this.isLoading = false;
      if (this.isBrowser()) {
        alert('Error: ' + error);
      }
    }
  }

  private clearForm() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }
}
