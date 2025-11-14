import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email: string = '';
  password: string = '';
  message: string = '';
  isError: boolean = false;
  rememberMe: boolean = false;
  isLoading: boolean = false;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const remembered = localStorage.getItem('trackrr_remember');
      if (remembered) {
        const saved = JSON.parse(remembered);
        this.email = saved.email;
        this.password = saved.password;
        this.rememberMe = true;
      }
    }
  }

  onLogin() {
    this.isLoading = true;
    const result = this.auth.login(this.email.trim(), this.password.trim());

    this.message = result.message;
    this.isError = !result.success;
    this.isLoading = false;

    if (result.success) {
      if (this.rememberMe) {
        localStorage.setItem(
          'trackrr_remember',
          JSON.stringify({ email: this.email, password: this.password })
        );
      } else {
        localStorage.removeItem('trackrr_remember');
      }

      // Redirect immediately after successful login
      this.router.navigate(['home']);
    }
  }
}
