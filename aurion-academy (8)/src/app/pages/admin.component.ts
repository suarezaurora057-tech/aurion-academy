import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AppSettingsService } from '../services/app-settings.service';
import { AdminOverlayService } from '../services/admin-overlay.service';
import { MatIconModule } from '@angular/material/icon';
import { SettingsComponent } from './settings.component';
import { AdminCoursesComponent } from './admin-courses.component';
import { AdminLessonsComponent } from './admin-lessons.component';
import { AdminStudentsComponent } from './admin-students.component';
import { AdminOverviewComponent } from './admin-overview.component';
import { AdminEnrollmentsComponent } from './admin-enrollments.component';
import { AdminAdminsComponent } from './admin-admins.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatIconModule, SettingsComponent, AdminCoursesComponent, AdminLessonsComponent, AdminStudentsComponent, AdminOverviewComponent, AdminEnrollmentsComponent, AdminAdminsComponent],
  template: `
    @if (adminOverlay.isOpen()) {
      <div class="fixed inset-0 z-[200] flex bg-zinc-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Sidebar -->
        <!-- Mobile Backdrop -->
        @if (mobileMenuOpen()) {
          <div role="presentation" tabindex="-1" class="fixed inset-0 bg-zinc-900/50 z-20 md:hidden" (click)="mobileMenuOpen.set(false)" (keydown.escape)="mobileMenuOpen.set(false)"></div>
        }
        <aside class="fixed md:static inset-y-0 left-0 w-84 bg-white border-r border-slate-100 flex flex-col shrink-0 transition-all duration-500 z-30 md:translate-x-0 p-6"
               [class.-translate-x-full]="!mobileMenuOpen()"
               [class.translate-x-0]="mobileMenuOpen()">
          
          <div class="flex flex-col h-full bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative group">
            
            <!-- Aurion Academy Branding: Deep Purple & Modern -->
            <div class="px-8 pt-12 pb-8 relative overflow-hidden">
              <div class="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
              
              <div class="flex items-center gap-4 mb-2 relative">
                <div class="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_15px_30px_-5px_rgba(79,70,229,0.4)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                   <mat-icon class="text-white text-2xl">diamond</mat-icon>
                </div>
                <div class="flex flex-col">
                   <h2 class="text-2xl font-black text-slate-900 tracking-tighter leading-none">AURION</h2>
                   <div class="flex items-center gap-1.5 mt-1">
                     <div class="h-[2px] w-4 bg-indigo-600"></div>
                     <p class="text-[9px] font-black text-indigo-600 uppercase tracking-[0.5em] leading-none">ACADEMY</p>
                   </div>
                </div>
              </div>
            </div>
            
            <!-- Navigation Flux: Structured & Clean -->
            <nav class="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar scrollbar-hide">
              <div class="px-6 mb-4 mt-4">
                 <p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Gestión Maestro</p>
              </div>

              <button (click)="selectTab('overview')" 
                [class]="activeTab() === 'overview' ? 'bg-white text-indigo-600 shadow-[0_15px_30px_-10px_rgba(79,70,229,0.15)] border-slate-100' : 'text-slate-500 border-transparent hover:text-indigo-600 hover:bg-white/80'" 
                class="group w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-[11px] font-bold uppercase tracking-widest border relative">
                <mat-icon class="scale-90" [class.text-indigo-600]="activeTab() === 'overview'">analytics</mat-icon> 
                <span class="flex-1 text-left">Dashboard</span>
                @if (activeTab() === 'overview') {
                  <div class="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>
                }
              </button>

              <button (click)="selectTab('enrollments')" 
                [class]="activeTab() === 'enrollments' ? 'bg-white text-indigo-600 shadow-[0_15px_30px_-10px_rgba(79,70,229,0.15)] border-slate-100' : 'text-slate-500 border-transparent hover:text-indigo-600 hover:bg-white/80'" 
                class="group w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-[11px] font-bold uppercase tracking-widest border relative">
                <mat-icon class="scale-90" [class.text-indigo-600]="activeTab() === 'enrollments'">receipt_long</mat-icon> 
                <span class="flex-1 text-left">Inscripciones</span>
              </button>

              <div class="px-6 mt-10 mb-4 font-black">
                 <p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Academia</p>
              </div>

              <button (click)="selectTab('users')" 
                [class]="activeTab() === 'users' ? 'bg-white text-indigo-600 shadow-[0_15px_30px_-10px_rgba(79,70,229,0.15)] border-slate-100' : 'text-slate-500 border-transparent hover:text-indigo-600 hover:bg-white/80'" 
                class="group w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-[11px] font-bold uppercase tracking-widest border relative">
                <mat-icon class="scale-90" [class.text-indigo-600]="activeTab() === 'users'">person_search</mat-icon> 
                <span class="flex-1 text-left">Comunidad</span>
              </button>

              <button (click)="selectTab('courses')" 
                [class]="activeTab() === 'courses' ? 'bg-white text-indigo-600 shadow-[0_15px_30px_-10px_rgba(79,70,229,0.15)] border-slate-100' : 'text-slate-500 border-transparent hover:text-indigo-600 hover:bg-white/80'" 
                class="group w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-[11px] font-bold uppercase tracking-widest border relative">
                <mat-icon class="scale-90" [class.text-indigo-600]="activeTab() === 'courses'">layers</mat-icon> 
                <span class="flex-1 text-left">Cursos</span>
              </button>

              <button (click)="selectTab('lessons')" 
                [class]="activeTab() === 'lessons' ? 'bg-white text-indigo-600 shadow-[0_15px_30px_-10px_rgba(79,70,229,0.15)] border-slate-100' : 'text-slate-500 border-transparent hover:text-indigo-600 hover:bg-white/80'" 
                class="group w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-[11px] font-bold uppercase tracking-widest border relative">
                <mat-icon class="scale-90" [class.text-indigo-600]="activeTab() === 'lessons'">movie_filter</mat-icon> 
                <span class="flex-1 text-left">Contenido</span>
              </button>

              <div class="px-6 mt-10 mb-4 font-black">
                 <p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Sistema</p>
              </div>

              <button (click)="selectTab('admins')" 
                [class]="activeTab() === 'admins' ? 'bg-white text-indigo-600 shadow-[0_15px_30px_-10px_rgba(79,70,229,0.15)] border-slate-100' : 'text-slate-500 border-transparent hover:text-indigo-600 hover:bg-white/80'" 
                class="group w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-[11px] font-bold uppercase tracking-widest border relative">
                <mat-icon class="scale-90" [class.text-indigo-600]="activeTab() === 'admins'">verified_user</mat-icon> 
                <span class="flex-1 text-left">Privilegios</span>
              </button>

              <button (click)="selectTab('settings')" 
                [class]="activeTab() === 'settings' ? 'bg-white text-indigo-600 shadow-[0_15px_30px_-10px_rgba(79,70,229,0.15)] border-slate-100' : 'text-slate-500 border-transparent hover:text-indigo-600 hover:bg-white/80'" 
                class="group w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-[11px] font-bold uppercase tracking-widest border relative">
                <mat-icon class="scale-90" [class.text-indigo-600]="activeTab() === 'settings'">settings_suggest</mat-icon> 
                <span class="flex-1 text-left">Ajustes</span>
              </button>
            </nav>
            
            <!-- User Profile & Session: Executive White -->
            <div class="p-6 mt-auto">
              <div class="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] overflow-hidden relative">
                <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-50 rounded-full blur-2xl"></div>
                <div class="flex items-center gap-4 mb-5 relative">
                  <div class="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=f8fafc" alt="Avatar" class="w-full h-full object-cover">
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xs font-black text-slate-800 leading-none">ROOT ACCESS</span>
                    <span class="text-[9px] text-indigo-400 mt-1 uppercase font-black tracking-widest">Admin Global</span>
                  </div>
                </div>
                <button (click)="logout()" class="w-full flex items-center justify-center gap-3 px-4 py-4 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all text-[10px] font-bold uppercase tracking-widest group border border-slate-100 hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-200">
                  <mat-icon class="scale-75 group-hover:rotate-90 transition-transform">logout</mat-icon> 
                  Cerrar Sesión
                </button>
              </div>
            </div>

          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 h-screen overflow-y-auto bg-zinc-50 p-4 sm:p-8 md:pl-8 relative">
          
          <!-- Desktop close button -->
          <div class="hidden md:flex absolute top-8 right-8 z-20 mt-1">
             <button (click)="closeAdmin()" class="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-200 px-4 py-2 rounded-xl transition-all shadow-sm font-bold text-sm">
               <mat-icon class="text-[20px] w-[20px] h-[20px]">close</mat-icon> Cerrar Panel
             </button>
          </div>

          <!-- Mobile Header -->
          <div class="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 sticky top-0 z-10">
            <button class="text-zinc-500 flex items-center p-2 rounded-lg hover:bg-zinc-50" (click)="mobileMenuOpen.set(true)">
              <mat-icon>menu</mat-icon>
            </button>
            <h2 class="font-bold text-zinc-900">Admin</h2>
            <button (click)="closeAdmin()" class="text-zinc-500 hover:text-zinc-900 flex items-center p-2 rounded-lg hover:bg-zinc-50"><mat-icon>close</mat-icon></button>
          </div>

          @if (activeTab() === 'overview') {
            <app-admin-overview></app-admin-overview>
          }

          @if (activeTab() === 'enrollments') {
            <app-admin-enrollments></app-admin-enrollments>
          }

          @if (activeTab() === 'users') {
            <app-admin-students></app-admin-students>
          }

          @if (activeTab() === 'admins') {
            <app-admin-admins></app-admin-admins>
          }

          @if (activeTab() === 'settings') {
            <app-settings></app-settings>
          }

          @if (activeTab() === 'courses') {
            <app-admin-courses></app-admin-courses>
          }

          @if (activeTab() === 'lessons') {
            <app-admin-lessons></app-admin-lessons>
          }

        </main> <!-- End Main Content -->

        <!-- Logout Confirmation Modal -->
        @if (showLogoutConfirm()) {
          <div class="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div class="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
              <div class="p-10 text-center">
                <div class="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <mat-icon class="scale-[1.5]">logout</mat-icon>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-2 tracking-tight">¿Cerrar Sesión?</h3>
                <p class="text-slate-500 font-medium leading-relaxed italic mb-8 text-sm">
                  Tu progreso se guardará automáticamente. Te esperamos pronto para continuar tu aprendizaje.
                </p>
                <div class="grid grid-cols-2 gap-4">
                  <button (click)="showLogoutConfirm.set(false)" class="py-4 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all active:scale-95">
                    Cancelar
                  </button>
                  <button (click)="executeLogout()" class="py-4 bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-600 transition-all shadow-xl shadow-rose-100 active:scale-95">
                    Confirmar Salir
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `
})
export class AdminComponent {
  auth = inject(AuthService);
  settings = inject(AppSettingsService);
  adminOverlay = inject(AdminOverlayService);
  
  activeTab = signal<'overview'|'users'|'enrollments'|'admins'|'courses'|'lessons'|'settings'>('overview');
  mobileMenuOpen = signal(false);
  
  users = this.auth.allUsers;

  selectTab(tab: 'overview'|'users'|'enrollments'|'admins'|'courses'|'lessons'|'settings') {
    this.activeTab.set(tab);
    this.mobileMenuOpen.set(false);
  }

  logout() {
    this.showLogoutConfirm.set(true);
  }

  executeLogout() {
    this.auth.logout();
    this.adminOverlay.close();
    this.showLogoutConfirm.set(false);
  }

  closeAdmin() {
    this.adminOverlay.close();
  }

  showLogoutConfirm = signal(false);
}
