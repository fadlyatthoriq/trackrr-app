import { Component, signal, OnInit, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavComponent } from './component/nav-component/nav-component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  protected readonly title = signal('trackr-app');
  protected showNavbar = signal(true);

  private readonly hiddenNavbarRoutes = ['login', 'register', 'forgot-password', 'home'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateNavbarVisibility(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateNavbarVisibility(event.urlAfterRedirects);
      });
  }

  private updateNavbarVisibility(url: string): void {
    const shouldHide = this.hiddenNavbarRoutes.some(route => url.includes(route));
    this.showNavbar.set(!shouldHide);
  }
}
