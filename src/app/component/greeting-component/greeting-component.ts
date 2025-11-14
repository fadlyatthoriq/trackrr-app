import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-greeting-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './greeting-component.html',
  styleUrls: ['./greeting-component.scss']
})
export class GreetingComponent {
  constructor(private auth: Auth) {}

  // expose user name for template binding
  get userName(): string {
    const u = this.auth.getCurrentUser();
    return u?.name ?? 'Pengguna';
  }

  logout(): void {
    this.auth.logout();
  }
}
