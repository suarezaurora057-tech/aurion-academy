import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AppSettingsService } from '../services/app-settings.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    <div class="bg-slate-50 min-h-screen py-24 relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div class="mb-20">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
            <span class="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>
            <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Atención Directa</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
            Estamos aquí para <br>
            <span class="text-indigo-600">impulsar tu futuro.</span>
          </h1>
          <p class="text-xl text-slate-500 max-w-2xl leading-relaxed">
            ¿Tienes dudas sobre los cursos? Nuestro equipo de expertos está listo para asesorarte en tu camino profesional.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Contact Info Cards -->
          <div class="lg:col-span-4 space-y-6">
            <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <mat-icon class="scale-110">location_on</mat-icon>
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-2">Visítanos</h3>
              <p class="text-slate-500 leading-relaxed">{{ settings.contactAddress() }}</p>
            </div>

            <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <mat-icon class="scale-110">phone</mat-icon>
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-2">Llámanos</h3>
              <p class="text-slate-500 leading-relaxed font-medium text-xl">{{ settings.contactPhone() }}</p>
              <p class="text-xs text-slate-400 mt-1">Lun - Vie: 9am a 6pm</p>
            </div>

            <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <mat-icon class="scale-110">mail</mat-icon>
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-2">Escríbenos</h3>
              <p class="text-slate-500 leading-relaxed font-medium">{{ settings.contactEmail() }}</p>
            </div>
            
            <div class="bg-slate-900 p-8 rounded-[2rem] text-white flex items-center justify-between">
              <div>
                <h3 class="font-bold mb-1">Redes Sociales</h3>
                <p class="text-xs text-slate-400">Síguenos para novedades</p>
              </div>
              <div class="flex gap-2">
                <a href="#" class="w-10 h-10 bg-white/10 hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-colors">
                  <mat-icon class="scale-75">facebook</mat-icon>
                </a>
                <a href="#" class="w-10 h-10 bg-white/10 hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-colors">
                   <mat-icon class="scale-75">photo_camera</mat-icon>
                </a>
              </div>
            </div>
          </div>

          <!-- Main Contact Area -->
          <div class="lg:col-span-8">
            <div class="bg-white rounded-[3rem] p-8 md:p-14 border border-slate-100 shadow-xl shadow-indigo-100/50 relative overflow-hidden">
              
              @if (submitted) {
                <div class="relative z-10 py-12 text-center">
                  <div class="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <mat-icon class="text-5xl w-12 h-12">check_circle</mat-icon>
                  </div>
                  <h3 class="text-4xl font-black text-slate-900 mb-4 tracking-tighter">¡Mensaje Recibido!</h3>
                  <p class="text-lg text-slate-500 max-w-sm mx-auto mb-10">
                    Gracias por contactarnos. Un asesor se comunicará contigo en menos de 24 horas hábiles.
                  </p>
                  <button (click)="resetForm()" class="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                    Enviar otro mensaje
                  </button>
                </div>
              } @else {
                <div class="mb-12">
                  <h2 class="text-3xl font-black text-slate-900 mb-2 tracking-tight">Envíanos un mensaje</h2>
                  <p class="text-slate-500 font-medium">Completa el formulario y nos pondremos en contacto.</p>
                </div>

                <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-6 relative z-10">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label for="name" class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                      <input 
                        type="text" id="name" formControlName="name" 
                        class="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 font-medium" 
                        placeholder="Juan Pérez">
                    </div>
                    <div class="space-y-2">
                      <label for="email" class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
                      <input 
                        type="email" id="email" formControlName="email" 
                        class="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 font-medium" 
                        placeholder="juan@ejemplo.com">
                    </div>
                  </div>
                  
                  <div class="space-y-2">
                    <label for="subject" class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Asunto</label>
                    <input 
                      type="text" id="subject" formControlName="subject" 
                      class="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 font-medium" 
                      placeholder="Ej. Soporte para inscripciones">
                  </div>
                  
                  <div class="space-y-2">
                    <label for="message" class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Tu Mensaje</label>
                    <textarea 
                      id="message" formControlName="message" rows="5" 
                      class="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-300 font-medium resize-none" 
                      placeholder="Cuéntanos cómo podemos ayudarte..."></textarea>
                  </div>
                  
                  <div class="pt-4 flex flex-col md:flex-row items-center gap-6">
                    <button 
                      type="submit" [disabled]="contactForm.invalid" 
                      class="w-full md:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-200">
                      <mat-icon>send</mat-icon>
                      Enviar Mensaje
                    </button>
                    <p class="text-xs text-slate-400 max-w-[200px] leading-tight">
                      Al enviar este formulario aceptas nuestra política de privacidad.
                    </p>
                  </div>
                </form>
              }

              <!-- Subtle background pattern -->
              <div class="absolute top-0 right-0 p-10 opacity-[0.03] select-none pointer-events-none">
                <mat-icon class="scale-[8] text-indigo-900 border-none">mail_outline</mat-icon>
              </div>
            </div>

            <!-- Integrated Mini Map -->
            <div class="mt-8 bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm h-64 overflow-hidden group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121175.76283626786!2d-70.7671192323315!3d19.451700200000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1cf63897b79a9%3A0x6b24d7807090886c!2sSantiago%20De%20Los%20Caballeros%2C%20Dominican%20Republic!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                class="w-full h-full rounded-[1.8rem] grayscale hover:grayscale-0 transition-all duration-700" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ContactComponent {
  fb = inject(FormBuilder);
  settings = inject(AppSettingsService);
  
  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  submitted = false;

  onSubmit() {
    if (this.contactForm.valid) {
      // Simulate API call
      setTimeout(() => {
        this.submitted = true;
      }, 500);
    }
  }

  resetForm() {
    this.submitted = false;
    this.contactForm.reset();
  }
}
