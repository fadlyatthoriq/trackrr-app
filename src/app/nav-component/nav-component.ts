import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Auth } from '../Authentication/auth';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-component.html',
  styleUrls: ['./nav-component.scss']
})
export class NavComponent implements OnInit {
  protected isMenuOpen = signal(false);
  protected isFeaturePage = signal(false);
  protected showMainMenu = signal(false);

  constructor(protected auth: Auth, private router: Router) {}

  ngOnInit(): void {
    // 🔍 Pantau perubahan route
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;

      // jika berada di halaman menu utama
      this.showMainMenu.set(url.includes('/menu'));

      // jika berada di salah satu halaman fitur
      const featureRoutes = [
        '/daily-notes',
        '/weekly-planner',
        '/monthly-planner',
        '/mood-tracker',
        '/habit-tracker',
        '/budget-tracker',
        '/daily-saving'
      ];
      this.isFeaturePage.set(featureRoutes.some(route => url.includes(route)));
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.update(state => !state);
  }

  goBackToMenu(): void {
    this.router.navigate(['/menu']);
  }

  openHistoryModal(): void {
    // nanti kamu bisa ganti logic ini untuk benar-benar buka modal
    console.log('📜 History modal opened');
  }

  logout(): void {
    this.auth.logout(true);
  }
}
