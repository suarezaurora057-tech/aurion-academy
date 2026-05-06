import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppSettingsService } from '../services/app-settings.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="bg-slate-50 min-h-screen py-24 relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl -ml-48 -mt-48 opacity-60"></div>
      <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl -mr-64 -mb-64 opacity-60"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Hero Section -->
        <div class="mb-24">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-8">
            <span class="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>
            <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Nuestra Esencia</span>
          </div>
          <h1 class="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.95]">
            Innovando en la <br>
            <span class="text-indigo-600">educación técnica.</span>
          </h1>
          <p class="text-xl md:text-2xl text-slate-500 max-w-3xl leading-relaxed font-medium">
            En {{ settings.siteName() }}, no solo enseñamos habilidades; forjamos el futuro de los profesionales dominicanos con tecnología y excelencia.
          </p>
        </div>

        <!-- Story Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div class="order-2 lg:order-1">
            <div class="space-y-6">
              <h2 class="text-3xl font-black text-slate-900 tracking-tight">Nuestra Trayectoria</h2>
              <div class="w-20 h-1.5 bg-indigo-600 rounded-full"></div>
              <p class="text-slate-600 leading-relaxed text-lg lg:text-xl font-medium whitespace-pre-wrap">
                {{ settings.aboutUsText() }}
              </p>
              
              <div class="grid grid-cols-2 gap-6 pt-8">
                <div class="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <p class="text-4xl font-black text-indigo-600 mb-1">+10k</p>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Egresados</p>
                </div>
                <div class="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <p class="text-4xl font-black text-emerald-600 mb-1">95%</p>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Empleabilidad</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="order-1 lg:order-2 relative group">
            <div class="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div class="relative bg-white p-4 rounded-[3rem] shadow-2xl overflow-hidden">
              <img [src]="settings.aboutUsImageUrl()" alt="Sobre nosotros" class="rounded-[2rem] w-full aspect-square object-cover hover:scale-105 transition-transform duration-700" referrerpolicy="no-referrer">
              
              <!-- Floating badge -->
              <div class="absolute bottom-10 left-10 right-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                 <div class="flex items-center gap-4">
                   <div class="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shrink-0">
                     <mat-icon>workspace_premium</mat-icon>
                   </div>
                   <div>
                     <p class="text-sm font-black text-slate-900 uppercase tracking-tighter">Certificación Oficial</p>
                     <p class="text-xs text-slate-500">Avalados por las mejores instituciones.</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mission Vision Values -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Visión -->
          <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:-translate-y-2 transition-all duration-300">
            <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <mat-icon class="scale-125">visibility</mat-icon>
            </div>
            <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Visión</h3>
            <p class="text-slate-500 leading-relaxed font-medium">Ser la institución líder en educación técnica virtual, reconocida por la excelencia de sus egresados y su contribución al desarrollo social.</p>
          </div>

          <!-- Misión -->
          <div class="bg-slate-900 p-10 rounded-[2.5rem] text-white group hover:-translate-y-2 transition-all duration-300">
            <div class="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-500 transition-colors">
              <mat-icon class="scale-125">flag</mat-icon>
            </div>
            <h3 class="text-2xl font-black mb-4 tracking-tight">Misión</h3>
            <p class="text-slate-300 leading-relaxed font-medium">Formar profesionales técnicos competentes, éticos y emprendedores, mediante programas educativos innovadores y accesibles.</p>
          </div>

          <!-- Valores -->
          <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:-translate-y-2 transition-all duration-300">
            <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <mat-icon class="scale-125">favorite</mat-icon>
            </div>
            <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">Valores</h3>
            <p class="text-slate-500 leading-relaxed font-medium">Excelencia, Compromiso, Innovación, Ética profesional y Responsabilidad social en cada paso que damos.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent {
  settings = inject(AppSettingsService);
}
