import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-certifications-info',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50 pt-32 pb-20">
      <div class="section-container">
        <header class="text-center mb-20">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
            <mat-icon class="scale-75">verified</mat-icon> Reconocimiento Oficial
          </div>
          <h1 class="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none italic">Tus <span class="bg-emerald-500 text-white px-6 inline-block -rotate-1 rounded-2xl">Certificados</span></h1>
          <p class="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
            Validamos tus habilidades con certificaciones digitales de alto impacto, reconocidas por las mejores empresas del sector.
          </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div class="bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
            <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-10 shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <mat-icon class="scale-125">qr_code_2</mat-icon>
            </div>
            <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-none uppercase">Código QR Único</h3>
            <p class="text-slate-500 font-medium leading-relaxed italic">Cada certificado cuenta con un código de verificación único vinculado a tu perfil académico.</p>
          </div>

          <div class="bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
            <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-10 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <mat-icon class="scale-125">cloud_done</mat-icon>
            </div>
            <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-none uppercase">Acceso Eterno</h3>
            <p class="text-slate-500 font-medium leading-relaxed italic">Tus certificados nunca expiran y se almacenan en la nube para que los compartas cuando quieras.</p>
          </div>

          <div class="bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
            <div class="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-10 shadow-inner group-hover:bg-rose-500 group-hover:text-white transition-all">
              <mat-icon class="scale-125">share</mat-icon>
            </div>
            <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-none uppercase">Social Link</h3>
            <p class="text-slate-500 font-medium leading-relaxed italic">Integración directa con LinkedIn y otras plataformas para resaltar tu formación profesional.</p>
          </div>
        </div>

        <div class="mt-20 rounded-[4rem] overflow-hidden shadow-2xl relative group">
          <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1470&auto=format&fit=crop" alt="Certifications" class="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-1000">
          <div class="absolute inset-0 bg-slate-900/60 flex items-center justify-center p-12 text-center text-white">
            <div class="max-w-2xl">
              <h2 class="text-4xl md:text-5xl font-black mb-6 tracking-tighter italic">Comienza hoy y obtén tu primer certificado en semanas.</h2>
              <p class="text-white/80 text-lg font-medium italic mb-10">Entra al mercado laboral con el respaldo de una formación técnica superior.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CertificationsInfoComponent {}
