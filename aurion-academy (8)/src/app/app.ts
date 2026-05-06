import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar.component';
import { FooterComponent } from './layout/footer.component';
import { AdminComponent } from './pages/admin.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, AdminComponent],
  template: `
    <div class="flex flex-col min-h-screen font-sans transition-colors duration-300">
      <app-navbar></app-navbar>
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
    
    <!-- Admin Global Overlay -->
    <app-admin></app-admin>
  `
})
export class AppComponent {
  themeService = inject(ThemeService);
}
