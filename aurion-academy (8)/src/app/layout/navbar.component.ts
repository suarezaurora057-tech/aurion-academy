import { Component, inject, signal, ElementRef, HostListener, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';
import { AppSettingsService } from '../services/app-settings.service';
import { AdminOverlayService } from '../services/admin-overlay.service';
import { ThemeService } from '../services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, FormsModule],
  template: `
    <nav class="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
          <div class="flex items-center gap-10">
            <!-- Global Admin Hamburger Toggle (Visible for Admins) -->
            @if (auth.currentUser()?.role === 'admin') {
              <button (click)="openAdminPanel()" class="text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none p-2 rounded-xl hover:bg-slate-100 hidden md:block" title="Panel de Administrador">
                <mat-icon>dashboard</mat-icon>
              </button>
            }

            <a routerLink="/" class="flex items-center gap-3 group">
               <div class="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform overflow-hidden p-1">
                  @if (settings.siteLogo()) {
                    <img [src]="settings.siteLogo()" alt="Logo" class="w-full h-full object-contain">
                  } @else {
                    <mat-icon class="text-xl">school</mat-icon>
                  }
               </div>
               <div class="flex flex-col">
                 <span class="text-slate-900 font-extrabold text-lg tracking-tighter leading-none uppercase">{{ settings.siteName() }}</span>
                 <span class="text-indigo-600 text-[10px] font-bold tracking-widest uppercase opacity-70">Plataforma Elite</span>
               </div>
            </a>
            
            <!-- Global Search Bar -->
            <div class="hidden lg:block relative w-72">
              <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="onSearch()" placeholder="Buscar conocimiento..." 
                     class="w-full bg-slate-100 border-transparent text-sm text-slate-600 rounded-2xl pl-12 pr-4 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all">
              <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</mat-icon>
            </div>
          </div>
          
          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-1">
            @for (link of [
              { path: '/', label: 'Inicio', exact: true },
              { path: '/courses', label: 'Cursos' },
              { path: '/about', label: 'Nosotros' },
              { path: '/contact', label: 'Contacto' }
            ]; track link.path) {
              <a [routerLink]="link.path" 
                 [routerLinkActive]="'bg-indigo-50 text-indigo-700'" 
                 [routerLinkActiveOptions]="{exact: link.exact || false}" 
                 class="px-4 py-2 rounded-xl font-semibold text-sm text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 hover:bg-slate-50 hover:text-indigo-600 transition-all capitalize">
                {{ link.label }}
              </a>
            }
            
            <!-- Theme Toggle Button -->
            <button (click)="themeService.toggleTheme()" 
                    class="p-2.5 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-all focus:outline-none" 
                    [title]="themeService.darkMode() ? 'Modo Claro' : 'Modo Oscuro'">
              <mat-icon>{{ themeService.darkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>
            
            @if (auth.currentUser()) {
              <div #userMenuContainer class="relative ml-4 pl-4 border-l border-slate-200">
                <button (click)="dropdownOpen.set(!dropdownOpen())" class="flex items-center gap-3 group focus:outline-none">
                  <div class="relative">
                    <img [src]="auth.currentUser()?.avatarUrl" alt="Avatar" class="w-10 h-10 rounded-2xl border-2 border-white shadow-md object-cover">
                    <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div class="flex flex-col items-start leading-none">
                    <span class="font-bold text-slate-900 text-sm tracking-tight">{{ auth.currentUser()?.name?.split(' ')?.[0] }}</span>
                    <span class="text-slate-400 text-[10px] font-medium uppercase tracking-wider">{{ auth.currentUser()?.role }}</span>
                  </div>
                  <mat-icon class="text-slate-400 transition-transform duration-300" [class.rotate-180]="dropdownOpen()">keyboard_arrow_down</mat-icon>
                </button>

                <!-- Dropdown Menu -->
                @if (dropdownOpen()) {
                  <div class="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl py-3 border border-slate-100 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div class="px-5 py-4 border-b border-slate-50 mb-2">
                       <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tu Cuenta</p>
                       <p class="text-sm font-bold text-slate-900 truncate">{{ auth.currentUser()?.email }}</p>
                    </div>

                    <a routerLink="/profile" (click)="dropdownOpen.set(false)" class="flex items-center gap-3 px-5 py-3 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all group">
                      <div class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                        <mat-icon class="text-lg">person</mat-icon>
                      </div>
                      <span class="font-bold text-sm">Mi Perfil</span>
                    </a>

                    @if (auth.currentUser()?.role === 'admin') {
                      <button (click)="openAdminPanel(); dropdownOpen.set(false)" class="w-full flex items-center gap-3 px-5 py-3 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all group">
                        <div class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                          <mat-icon class="text-lg">dashboard</mat-icon>
                        </div>
                        <span class="font-bold text-sm">Administración</span>
                      </button>
                      <button (click)="goToSettings(); dropdownOpen.set(false)" class="w-full flex items-center gap-3 px-5 py-3 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all group">
                        <div class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                          <mat-icon class="text-lg">settings</mat-icon>
                        </div>
                        <span class="font-bold text-sm">Ajustes Globales</span>
                      </button>
                    }

                    <div class="h-px bg-slate-50 my-2"></div>
                    
                    <button (click)="confirmLogout(); dropdownOpen.set(false)" class="w-full flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50 transition-all group">
                      <div class="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <mat-icon class="text-lg">power_settings_new</mat-icon>
                      </div>
                      <span class="font-bold text-sm">Cerrar sesión</span>
                    </button>
                  </div>
                }
              </div>
            } @else {
              <div class="flex items-center gap-2 ml-4">
                <a routerLink="/login" class="text-slate-600 hover:text-indigo-600 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all">
                  Acceder
                </a>
                <a routerLink="/register" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-100 active:scale-95">
                  Unirse
                </a>
              </div>
            }
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center md:hidden gap-3">
            @if (auth.currentUser()?.role === 'admin') {
              <button (click)="openAdminPanel()" class="text-slate-400 hover:text-indigo-600 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors">
                <mat-icon>dashboard</mat-icon>
              </button>
            }
            <button (click)="themeService.toggleTheme()" 
                    class="p-2.5 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-all focus:outline-none">
              <mat-icon>{{ themeService.darkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>
            <button (click)="mobileMenuOpen = !mobileMenuOpen" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-900 dark:bg-slate-700 text-white transition-all active:scale-90">
              <mat-icon>{{ mobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (mobileMenuOpen) {
        <div class="md:hidden bg-white border-b border-slate-100 animate-in slide-in-from-top-10 duration-300">
          <div class="flex flex-col space-y-1 p-6">
            <div class="relative w-full mb-6">
              <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="onSearch(); mobileMenuOpen = false" placeholder="Buscar..." 
                     class="w-full bg-slate-100 border-transparent text-sm text-slate-600 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100">
              <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</mat-icon>
            </div>
            
            @for (link of [
              { path: '/', label: 'Inicio', icon: 'home' },
              { path: '/courses', label: 'Cursos', icon: 'school' },
              { path: '/about', label: 'Sobre Nosotros', icon: 'info' },
              { path: '/contact', label: 'Contacto', icon: 'mail' }
            ]; track link.path) {
              <a [routerLink]="link.path" (click)="mobileMenuOpen = false" 
                 class="flex items-center gap-4 px-4 py-4 rounded-2xl text-base font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                <mat-icon class="text-slate-400">{{ link.icon }}</mat-icon>
                {{ link.label }}
              </a>
            }
            
            <div class="border-t border-slate-100 pt-6 mt-4">
              @if (auth.currentUser()) {
                <div class="flex items-center gap-4 px-4 py-4 mb-4">
                   <img [src]="auth.currentUser()?.avatarUrl" alt="Avatar" class="w-12 h-12 rounded-2xl object-cover shadow-lg">
                   <div class="flex flex-col">
                     <span class="font-extrabold text-slate-900">{{ auth.currentUser()?.name }}</span>
                     <span class="text-xs text-slate-400 font-bold uppercase tracking-widest">{{ auth.currentUser()?.role }}</span>
                   </div>
                </div>

                <a routerLink="/profile" (click)="mobileMenuOpen = false" class="flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-50">
                  <mat-icon>account_circle</mat-icon> Perfil
                </a>
                
                @if (auth.currentUser()?.role === 'admin') {
                  <button (click)="openAdminPanel(); mobileMenuOpen = false" class="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-indigo-600 hover:bg-indigo-50">
                    <mat-icon>dashboard</mat-icon> Administración
                  </button>
                }
                
                <button (click)="confirmLogout(); mobileMenuOpen = false" class="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 text-left">
                  <mat-icon>power_settings_new</mat-icon> Cerrar Sesión
                </button>
              } @else {
                <div class="grid grid-cols-2 gap-4">
                   <a routerLink="/login" (click)="mobileMenuOpen = false" class="flex items-center justify-center p-4 rounded-2xl font-bold text-slate-600 bg-slate-100">Acceder</a>
                   <a routerLink="/register" (click)="mobileMenuOpen = false" class="flex items-center justify-center p-4 rounded-2xl font-bold text-white bg-indigo-600 shadow-lg shadow-indigo-100">Unirse</a>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </nav>

    <!-- Logout Confirmation Modal -->
    @if (showLogoutConfirm()) {
      <div class="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
        <div class="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl shadow-indigo-200/50 animate-in zoom-in-95 duration-300 relative overflow-hidden group">
          <!-- Decorative Background -->
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-red-50 rounded-full blur-3xl opacity-60"></div>
          
          <div class="relative z-10 flex flex-col gap-6">
            <div class="flex items-start gap-6">
              <div class="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform duration-500">
                <mat-icon class="scale-125">logout</mat-icon>
              </div>
              <div class="pt-1">
                <h3 class="text-2xl font-black text-slate-900 mb-2 tracking-tighter leading-none">¿Cerrar sesión ahora?</h3>
                <p class="text-slate-500 font-medium leading-relaxed text-sm">
                  Tu progreso se guardará automáticamente. Tendrás que volver a ingresar tus credenciales para continuar con tus cursos.
                </p>
              </div>
            </div>
            
            <div class="flex items-center justify-end gap-3 pt-2 border-t border-slate-50">
              <button (click)="showLogoutConfirm.set(false)" class="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]">
                Seguir aprendiendo
              </button>
              <button (click)="executeLogout()" class="px-8 py-3 rounded-xl font-black text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-200 active:scale-[0.98]">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- User Info Modal -->
    @if (showUserInfo()) {
      <div class="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 relative">
          <button (click)="showUserInfo.set(false)" class="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 transition-colors">
            <mat-icon>close</mat-icon>
          </button>
          
          <div class="flex flex-col items-center mb-6">
            <img [src]="auth.currentUser()?.avatarUrl" alt="Avatar" class="w-24 h-24 rounded-full border-4 border-purple-100 object-cover mb-4">
            <h3 class="text-2xl font-bold text-zinc-900">{{ auth.currentUser()?.name }}</h3>
            <p class="text-zinc-500">{{ auth.currentUser()?.email }}</p>
            <span class="mt-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
              {{ auth.currentUser()?.role === 'admin' ? 'Administrador' : 'Estudiante' }}
            </span>
          </div>

          <div class="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
            <h4 class="font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <mat-icon class="text-purple-500 text-[20px] w-[20px] h-[20px]">menu_book</mat-icon>
              Cursos Inscritos ({{ auth.currentUser()?.enrolledCourses?.length || 0 }})
            </h4>
            
            @if (auth.currentUser()?.enrolledCourses?.length) {
              <ul class="space-y-3">
                @for (enrollment of auth.currentUser()?.enrolledCourses; track enrollment.courseId) {
                  <li class="flex justify-between items-center text-sm">
                    <span class="text-zinc-700 font-medium">{{ getCourseName(enrollment.courseId) }}</span>
                    <span class="text-purple-600 font-bold">{{ enrollment.progress }}%</span>
                  </li>
                }
              </ul>
            } @else {
              <p class="text-sm text-zinc-500 italic">No estás inscrito en ningún curso aún.</p>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class NavbarComponent {
  auth = inject(AuthService);
  courseService = inject(CourseService);
  router = inject(Router);
  settings = inject(AppSettingsService);
  adminOverlay = inject(AdminOverlayService);
  themeService = inject(ThemeService);
  
  mobileMenuOpen = false;
  dropdownOpen = signal(false);
  showLogoutConfirm = signal(false);
  showUserInfo = signal(false);
  
  userMenuContainer = viewChild<ElementRef>('userMenuContainer');

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    const container = this.userMenuContainer()?.nativeElement;
    if (this.dropdownOpen() && container && !container.contains(event.target as Node)) {
      this.dropdownOpen.set(false);
    }
  }

  searchQuery = '';

  confirmLogout() {
    this.showLogoutConfirm.set(true);
  }

  executeLogout() {
    this.auth.logout();
    this.showLogoutConfirm.set(false);
    this.adminOverlay.close();
    this.router.navigate(['/']);
  }

  openAdminPanel() {
    this.adminOverlay.open();
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  getCourseName(courseId: string): string {
    const course = this.courseService.getCourseById(courseId);
    return course ? course.title : 'Curso Desconocido';
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/courses'], { queryParams: { q: this.searchQuery.trim() } });
      this.searchQuery = ''; // Clear after search
    }
  }
}
