import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-component',
  imports: [],
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.scss'
})
export class MenuComponent {

  constructor(private router: Router) {}

   navigateTo(page: string, event?: Event) {
    const target = event?.currentTarget as HTMLElement;
    if (target) {
      target.style.transform = 'scale(0.95)';

      setTimeout(() => {
        target.style.transform = 'scale(1)';
      }, 150);
    }

    // Navigasi Angular
    setTimeout(() => {
      this.router.navigate([`/${page}`]);
    }, 200);
  }
}
