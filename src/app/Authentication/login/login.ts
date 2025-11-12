import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email: string = '';
  password: string = '';
  message: string = '';
  isError: boolean = false;
  rememberMe: boolean = false;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    const remembered = localStorage.getItem('trackrr_remember');
    if (remembered) {
      const saved = JSON.parse(remembered);
      this.email = saved.email;
      this.password = saved.password;
      this.rememberMe = true;
    }
  }

  onLogin() {
    const result = this.auth.login(this.email, this.password);

    this.message = result.message;
    this.isError = !result.success;

    if (result.success) {
      if (this.rememberMe) {
        localStorage.setItem(
          'trackrr_remember',
          JSON.stringify({ email: this.email, password: this.password })
        );
      } else {
        localStorage.removeItem('trackrr_remember');
      }

      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1000);
    }
  }
}
