import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';
import { AppSettingsService } from '../services/app-settings.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Background Shapes -->
      <div class="absolute top-1/4 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] -z-10 translate-x-1/2"></div>
      <div class="absolute bottom-1/4 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] -z-10 -translate-x-1/2"></div>

      <div class="max-w-xl w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 relative z-10">
        
        <div class="text-center mb-12">
            <a routerLink="/" class="inline-flex items-center gap-3 mb-8 group">
              <div class="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform">
                <mat-icon class="text-2xl">school</mat-icon>
              </div>
            </a>
          <h2 class="text-4xl font-extrabold text-slate-900 tracking-tighter leading-none mb-4 uppercase">Nueva Cuenta</h2>
          <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Únete a {{ settings.siteName() }} Academy
          </p>
        </div>

        @if (errorMsg) {
          <div class="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold">
            <mat-icon class="text-xl">report_problem</mat-icon>
            {{ errorMsg }}
          </div>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 ml-1">Nombre Completo</label>
              <div class="relative">
                <input type="text" id="name" formControlName="name" 
                       class="w-full bg-slate-50 border-transparent text-slate-900 font-bold rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all" placeholder="Ana Martínez">
                <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</mat-icon>
              </div>
            </div>

            <div>
              <label for="email" class="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 ml-1">Correo Electrónico</label>
              <div class="relative">
                <input type="email" id="email" formControlName="email" 
                       class="w-full bg-slate-50 border-transparent text-slate-900 font-bold rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all" placeholder="hola@ejemplo.com">
                <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">alternate_email</mat-icon>
              </div>
            </div>
          </div>

          <div>
            <label for="password" class="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 ml-1">Contraseña de Acceso</label>
            <div class="relative mb-4">
              <input type="password" id="password" formControlName="password" 
                     class="w-full bg-slate-50 border-transparent text-slate-900 font-bold rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all" placeholder="Crear contraseña segura">
              <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">vpn_key</mat-icon>
            </div>
            
            <!-- Real-time Requirements -->
            <div class="grid grid-cols-2 gap-2 px-2">
              <div class="flex items-center gap-2 text-[9px] font-bold uppercase tracking-tight" [class.text-emerald-500]="passwordRequirements.length" [class.text-slate-300]="!passwordRequirements.length">
                <mat-icon class="text-[14px] w-[14px] h-[14px] leading-[14px]">{{ passwordRequirements.length ? 'check_circle' : 'circle' }}</mat-icon>
                <span>8+ Caracteres</span>
              </div>
              <div class="flex items-center gap-2 text-[9px] font-bold uppercase tracking-tight" [class.text-emerald-500]="passwordRequirements.upper" [class.text-slate-300]="!passwordRequirements.upper">
                <mat-icon class="text-[14px] w-[14px] h-[14px] leading-[14px]">{{ passwordRequirements.upper ? 'check_circle' : 'circle' }}</mat-icon>
                <span>Mayúscula</span>
              </div>
              <div class="flex items-center gap-2 text-[9px] font-bold uppercase tracking-tight" [class.text-emerald-500]="passwordRequirements.number" [class.text-slate-300]="!passwordRequirements.number">
                <mat-icon class="text-[14px] w-[14px] h-[14px] leading-[14px]">{{ passwordRequirements.number ? 'check_circle' : 'circle' }}</mat-icon>
                <span>Un Número</span>
              </div>
              <div class="flex items-center gap-2 text-[9px] font-bold uppercase tracking-tight" [class.text-emerald-500]="passwordRequirements.special" [class.text-slate-300]="!passwordRequirements.special">
                <mat-icon class="text-[14px] w-[14px] h-[14px] leading-[14px]">{{ passwordRequirements.special ? 'check_circle' : 'circle' }}</mat-icon>
                <span>Carácter Especial</span>
              </div>
            </div>
          </div>

          <div>
            <label for="courseId" class="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 ml-1">Plan de Estudio Inicial</label>
            <div class="relative">
              <select id="courseId" formControlName="courseId" 
                      class="w-full bg-slate-50 border-transparent text-slate-900 font-bold rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all appearance-none">
                <option value="">Seleccionar programa técnico (opcional)</option>
                @for (course of courses(); track course.id) {
                  <option [value]="course.id">{{ course.title }}</option>
                }
              </select>
              <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">book</mat-icon>
              <mat-icon class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">expand_more</mat-icon>
            </div>
          </div>

          <button type="submit" [disabled]="registerForm.invalid" class="btn-primary w-full py-5 text-base font-bold uppercase tracking-[0.2em] mt-4 transform active:scale-95 disabled:opacity-50 transition-all">
            Crear Perfil Académico
          </button>
        </form>

        <div class="mt-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          ¿Ya eres miembro? 
          <a routerLink="/login" class="text-indigo-600 hover:text-indigo-700 ml-1">Inicia sesión</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  courseService = inject(CourseService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  settings = inject(AppSettingsService);

  courses = this.courseService.courses;
  errorMsg = '';

  passwordRequirements = {
    length: false,
    upper: false,
    number: false,
    special: false
  };

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required, 
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/)
    ]],
    courseId: ['']
  });

  ngOnInit() {
    const preselectedCourse = this.route.snapshot.queryParamMap.get('courseId');
    if (preselectedCourse) {
      this.registerForm.patchValue({ courseId: preselectedCourse });
    }

    // Real-time validation
    this.registerForm.get('password')?.valueChanges.subscribe(val => {
      const password = val || '';
      this.passwordRequirements = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
      };
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password, courseId } = this.registerForm.value;
      const result = await this.auth.register(name!, email!, password!, courseId || undefined);
      
      if (result.success) {
        this.router.navigate(['/profile']);
      } else {
        this.errorMsg = result.error || 'El correo electrónico ya está registrado o hubo un error.';
      }
    }
  }
}
