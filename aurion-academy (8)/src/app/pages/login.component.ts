import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AppSettingsService } from '../services/app-settings.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Background Shapes -->
      <div class="absolute top-1/4 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] -z-10 translate-x-1/2"></div>
      <div class="absolute bottom-1/4 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] -z-10 -translate-x-1/2"></div>

      <div class="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 relative z-10 transition-all duration-500">
        
        <div class="text-center mb-12">
            <a routerLink="/" class="inline-flex items-center gap-3 mb-8 group">
              <div class="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform">
                <mat-icon class="text-2xl">school</mat-icon>
              </div>
            </a>
          <h2 class="text-4xl font-extrabold text-slate-900 tracking-tighter leading-none mb-4 uppercase">Bienvenido</h2>
          <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Ingresa a {{ settings.siteName() }} Academy
          </p>
        </div>

        @if (errorMsg) {
          <div class="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <mat-icon class="text-xl">report_problem</mat-icon>
            {{ errorMsg }}
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="email" class="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 ml-1">Correo Electrónico</label>
            <div class="relative">
              <input type="email" id="email" formControlName="email" 
                     class="w-full bg-slate-50 border-transparent text-slate-900 font-bold rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all" placeholder="tupersonaje@academy.com">
              <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">alternate_email</mat-icon>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-3 ml-1">
              <label for="password" class="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Contraseña</label>
              <a href="#" class="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">¿Olvidaste?</a>
            </div>
            <div class="relative">
              <input type="password" id="password" formControlName="password" 
                     class="w-full bg-slate-50 border-transparent text-slate-900 font-bold rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all" placeholder="••••••••">
              <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">vpn_key</mat-icon>
            </div>
          </div>

          <button type="submit" [disabled]="loginForm.invalid" class="btn-primary w-full py-5 text-base font-bold uppercase tracking-[0.2em] transform active:scale-95 disabled:opacity-50 disabled:grayscale transition-all mt-4">
            Ingresar
          </button>
        </form>

        <div class="mt-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          ¿Nuevo por aquí? 
          <a routerLink="/register" class="text-indigo-600 hover:text-indigo-700 ml-1">Regístrate</a>
        </div>
        
        <div class="mt-8 pt-8 border-t border-slate-50 text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest">
          <p>Admin: admin&#64;gmail.com / admin123</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  settings = inject(AppSettingsService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  errorMsg = '';

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const result = await this.auth.login(email!, password!);
      
      if (result.success) {
        const user = this.auth.currentUser();
        if (user?.role === 'admin' || user?.role === 'superadmin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/profile']);
        }
      } else {
        this.errorMsg = result.error || 'Credenciales incorrectas o usuario no registrado.';
      }
    }
  }
}
