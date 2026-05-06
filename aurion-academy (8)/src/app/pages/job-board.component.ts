import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-job-board',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50 pt-32 pb-20">
      <div class="section-container">
        <header class="text-center mb-20">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100">
            <mat-icon class="scale-75">work</mat-icon> Alianzas Estratégicas
          </div>
          <h1 class="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none italic">Bolsa de <span class="bg-blue-600 text-white px-6 inline-block -rotate-1 rounded-2xl">Empleo</span></h1>
          <p class="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
            Conectamos a nuestros estudiantes más destacados con empresas líderes en búsqueda de talento técnico especializado.
          </p>
        </header>

        <div class="bg-white p-12 md:p-20 rounded-[4rem] shadow-xl shadow-slate-200/50 border border-slate-100 mb-20 overflow-hidden relative">
          <div class="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
            <mat-icon class="scale-[10]">business_center</mat-icon>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 class="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter italic leading-tight">Tu carrera no termina al graduarte, <span class="text-blue-600">apenas comienza.</span></h2>
              <div class="space-y-6">
                <div class="flex gap-4">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <mat-icon class="scale-75">done</mat-icon>
                  </div>
                  <p class="text-slate-600 font-bold italic">Acceso exclusivo a vacantes de empresas aliadas.</p>
                </div>
                <div class="flex gap-4">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <mat-icon class="scale-75">done</mat-icon>
                  </div>
                  <p class="text-slate-600 font-bold italic">Talleres de preparación para entrevistas y CV.</p>
                </div>
                <div class="flex gap-4">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <mat-icon class="scale-75">done</mat-icon>
                  </div>
                  <p class="text-slate-600 font-bold italic">Recomendación directa basada en tu rendimiento académico.</p>
                </div>
              </div>
            </div>
            <div class="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop" alt="Team Work" class="w-full aspect-square object-cover">
            </div>
          </div>
        </div>

        <div class="text-center">
          <h3 class="text-2xl font-black text-slate-900 mb-10 tracking-tight uppercase">Solo para estudiantes graduados</h3>
          <button class="px-12 py-6 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-4 mx-auto shadow-xl shadow-slate-200">
            Postularse Ahora <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `
})
export class JobBoardComponent {}
