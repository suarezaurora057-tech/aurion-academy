import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';
import { MatIconModule } from '@angular/material/icon';
import { UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course, User } from '../models/types';
import { CertificateComponent } from './certificate.component';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, MatIconModule, UpperCasePipe, FormsModule, CertificateComponent],
  template: `
    <div class="bg-slate-50 min-h-screen py-20 relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[120px] -mr-64 -mt-64"></div>
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-50/40 rounded-full blur-[100px] -ml-32 -mb-32"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Header Profile: Executive Style -->
        <div class="bg-white rounded-[3rem] p-10 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-12 relative overflow-hidden">


          <div class="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <!-- Avatar Section -->
            <div class="relative group cursor-pointer" (click)="fileInput.click()" (keydown.enter)="fileInput.click()" tabindex="0">
              <div class="w-32 h-32 lg:w-40 lg:h-40 rounded-[2.5rem] overflow-hidden shadow-2xl ring-8 ring-indigo-50 group-hover:ring-indigo-100 transition-all duration-500">
                @if (user()?.avatarUrl) {
                  <img [src]="user()?.avatarUrl" alt="Avatar" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                } @else {
                  <div class="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-5xl font-black italic">
                    {{ user()?.name?.charAt(0) | uppercase }}
                  </div>
                }
              </div>
              <div class="absolute inset-0 bg-indigo-600/60 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm">
                <mat-icon class="text-white scale-125">photo_camera</mat-icon>
              </div>
              <input type="file" #fileInput class="hidden" accept="image/*" (change)="onFileSelected($event)">
              
              <!-- Status Badge -->
              <div class="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                <mat-icon class="scale-75">verified</mat-icon>
              </div>
            </div>

            <!-- Profile Info -->
            <div class="text-center md:text-left flex-1">
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">
                <mat-icon class="scale-75">workspace_premium</mat-icon> Miembro Elite
              </div>
              <h1 class="text-4xl lg:text-5xl font-black text-slate-900 mb-2 tracking-tighter leading-none">{{ user()?.name }}</h1>
              <div class="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-medium">
                <span class="flex items-center gap-1.5"><mat-icon class="scale-75">mail</mat-icon> {{ user()?.email }}</span>
                @if (user()?.phone) {
                  <span class="flex items-center gap-1.5"><mat-icon class="scale-75">phone</mat-icon> {{ user()?.phone }}</span>
                }
              </div>
              
              <div class="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
                <button (click)="openEditModal()" class="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                  <mat-icon class="scale-75">tune</mat-icon> Configurar Perfil
                </button>
                <button (click)="showLogoutConfirm.set(true)" class="px-6 py-3 bg-white text-rose-500 border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center gap-2">
                  <mat-icon class="scale-75">logout</mat-icon> Salir
                </button>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="hidden lg:grid grid-cols-2 gap-4">
              <div class="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center">
                <span class="block text-3xl font-black text-slate-900 leading-none mb-1">{{ user()?.enrolledCourses?.length || 0 }}</span>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cursos</span>
              </div>
              <div class="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 text-center">
                <span class="block text-3xl font-black text-indigo-600 leading-none mb-1">{{ completedCoursesCount() }}</span>
                <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Éxitos</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Dashboard Content -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <!-- Activity Area -->
          <div class="lg:col-span-8 space-y-12">
            <header class="flex items-center justify-between">
              <h2 class="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                <div class="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <mat-icon class="scale-75">auto_stories</mat-icon>
                </div>
                Progreso Académico
              </h2>
            </header>

            @if (user()?.enrolledCourses?.length === 0) {
              <div class="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
                <div class="w-24 h-24 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                  <mat-icon class="text-6xl w-12 h-12">local_library</mat-icon>
                </div>
                <h3 class="text-3xl font-black text-slate-900 mb-4 tracking-tight">Tu lista de cursos está vacía</h3>
                <p class="text-slate-500 mb-10 max-w-sm mx-auto font-medium leading-relaxed italic">
                  "El conocimiento es la única herramienta que crece cuanto más se comparte y se busca."
                </p>
                <a routerLink="/courses" class="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-200">
                  <mat-icon>explore</mat-icon> Descubrir Cursos
                </a>
              </div>
            } @else {
              <div class="space-y-6">
                @for (enrollment of user()?.enrolledCourses; track enrollment.courseId) {
                  @if (getCourseDetails(enrollment.courseId); as course) {
                    <div class="group bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 border border-slate-100 transition-all duration-500 flex flex-col md:flex-row items-center gap-8">
                      <div class="w-full md:w-56 aspect-[16/10] rounded-3xl overflow-hidden shadow-lg shrink-0">
                        <img [src]="course.imageUrl" [alt]="course.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerpolicy="no-referrer">
                      </div>
                      
                      <div class="flex-1 w-full">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <div>
                            <span class="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 block">{{ course.level }}</span>
                            <h3 class="text-2xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">{{ course.title }}</h3>
                          </div>
                          @if (enrollment.progress === 100) {
                            <div class="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100 shadow-sm">
                              <mat-icon class="scale-50">done_all</mat-icon> Completado
                            </div>
                          }
                        </div>
                        
                        <!-- Premium Progress -->
                        <div class="mb-8">
                          <div class="flex justify-between items-end mb-3">
                            <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Maestría alcanzada</span>
                            <span class="text-2xl font-black text-indigo-600 tracking-tighter">{{ enrollment.progress }}%</span>
                          </div>
                          <div class="w-full bg-slate-50 rounded-full h-3 overflow-hidden border border-slate-100 p-0.5">
                            <div class="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out shadow-md shadow-indigo-200" [style.width.%]="enrollment.progress"></div>
                          </div>
                        </div>

                        <div class="flex flex-wrap gap-3">
                          <a [routerLink]="['/courses', course.id]" class="flex-1 min-w-[140px] bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95">
                            <mat-icon class="scale-75">play_arrow</mat-icon> @if (enrollment.progress === 100) { Repasar } @else { Continuar }
                          </a>
                          @if (enrollment.progress === 100) {
                            <button (click)="openCertificate(course, enrollment.certificateTemplateId)" class="flex-1 min-w-[140px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all active:scale-95">
                              <mat-icon class="scale-75">workspace_premium</mat-icon> Obtener Diploma
                            </button>
                          }
                        </div>
                      </div>
                    </div>
                  }
                }
              </div>
            }

            <!-- Certificates Showcase -->
            <div class="pt-12">
              <h2 class="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3 mb-10">
                <div class="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-100">
                  <mat-icon class="scale-75">workspace_premium</mat-icon>
                </div>
                Honores y Diplomas
              </h2>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                @for (enrollment of user()?.enrolledCourses; track enrollment.courseId) {
                  @if (getCourseDetails(enrollment.courseId); as course) {
                    <div 
                      class="relative group bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-rose-100 transition-all duration-700 flex flex-col items-center text-center overflow-hidden" 
                      [class.opacity-40]="enrollment.progress < 100">
                      
                      @if (enrollment.progress < 100) {
                        <div class="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-slate-50 to-transparent flex flex-col justify-end items-center p-8 z-10">
                          <mat-icon class="text-slate-300 mb-2">lock</mat-icon>
                          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso insuficiente</p>
                        </div>
                      }
                      
                      <div class="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                        <mat-icon class="scale-[2]">verified</mat-icon>
                      </div>
                      
                      <h3 class="text-xl font-black text-slate-900 mb-2 leading-none tracking-tight">{{ course.title }}</h3>
                      <p class="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] mb-10">Acreditación Académica</p>
                      
                      <button 
                        [disabled]="enrollment.progress < 100" 
                        (click)="openCertificate(course, enrollment.certificateTemplateId)" 
                        class="w-full py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 disabled:bg-slate-50 disabled:text-slate-300 transition-all shadow-lg active:scale-95">
                        Ver Credenciales
                      </button>

                      <!-- Decorative Ribbons -->
                      <div class="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none opacity-20">
                        <div class="absolute top-0 right-0 w-24 h-8 bg-rose-500 rotate-45 translate-x-8 translate-y-4"></div>
                      </div>
                    </div>
                  }
                }
                @if (user()?.enrolledCourses?.length === 0) {
                  <div class="col-span-full py-20 text-center bg-slate-50/50 border-4 border-dashed border-slate-100 rounded-[3rem]">
                    <mat-icon class="text-slate-200 scale-[2.5] mb-8">military_tech</mat-icon>
                    <p class="text-slate-400 font-bold italic tracking-tight">Tus logros aparecerán aquí una vez completes tus primeros módulos.</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Sidebar: Analytics & Insights -->
          <div class="lg:col-span-4 space-y-12">
            <!-- Stats Hub -->
            <div class="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
              <h3 class="text-xl font-black text-slate-900 mb-10 tracking-tight flex items-center gap-2">
                <mat-icon class="text-indigo-600 scale-75">insights</mat-icon> Métricas de Éxito
              </h3>
              
              <div class="space-y-8">
                <div class="flex items-center gap-6 group/item">
                  <div class="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center shrink-0 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all duration-300">
                    <mat-icon>auto_awesome_motion</mat-icon>
                  </div>
                  <div>
                    <span class="text-sm font-black text-slate-900 block leading-none mb-1">{{ user()?.enrolledCourses?.length || 0 }}</span>
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inscripciones</span>
                  </div>
                </div>
                
                <div class="flex items-center gap-6 group/item">
                  <div class="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center shrink-0 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all duration-300">
                    <mat-icon>military_tech</mat-icon>
                  </div>
                  <div>
                    <span class="text-sm font-black text-slate-900 block leading-none mb-1">{{ completedCoursesCount() }}</span>
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Niveles Superados</span>
                  </div>
                </div>

                <div class="flex items-center gap-6 group/item">
                  <div class="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center shrink-0 group-hover/item:bg-amber-400 group-hover/item:text-white transition-all duration-300">
                    <mat-icon>stars</mat-icon>
                  </div>
                  <div>
                    <span class="text-sm font-black text-slate-900 block leading-none mb-1">{{ learningScore() }}</span>
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score de Aprendizaje</span>
                  </div>
                </div>
              </div>

              <!-- Abstract Decoration -->
              <div class="absolute -bottom-10 -right-10 w-32 h-32 border-8 border-slate-50 rounded-full group-hover:scale-150 transition-transform duration-1000 translate-x-4 translate-y-4"></div>
            </div>

            <!-- Support & Community -->
            <div class="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
              <div class="relative z-10">
                <div class="w-16 h-16 bg-white/10 text-indigo-400 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <mat-icon class="scale-125">headset_mic</mat-icon>
                </div>
                <h3 class="text-2xl font-black mb-4 tracking-tighter leading-tight">Canales de Soporte Elite</h3>
                <p class="text-slate-400 font-medium mb-10 leading-relaxed text-sm italic">
                  ¿Encontraste un desafío técnico? Nuestros expertos están listos para asistirte 24/7.
                </p>
                <a routerLink="/contact" class="flex items-center justify-center w-full px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl active:scale-95 gap-3">
                  <mat-icon>bolt</mat-icon> Abrir Ticket Directo
                </a>
              </div>
              
              <!-- Background Shape -->
              <div class="absolute -top-4 -right-4 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <div class="absolute bottom-0 right-0 w-full h-full border-b-4 border-r-4 border-white/5 rounded-[3rem] rotate-45 translate-x-1/2 translate-y-1/2"></div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Edit Profile Modal: Modern Redesign -->
    @if (isEditModalOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
        <div class="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] border border-slate-100 animate-in zoom-in-95 duration-300">
          <header class="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-black text-slate-900 tracking-tighter">Personalizar Perfil</h2>
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Configuración de usuario</p>
            </div>
            <button (click)="closeEditModal()" class="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all">
              <mat-icon>close</mat-icon>
            </button>
          </header>
          
          <div class="p-10 overflow-y-auto flex-1 custom-scrollbar">
            <div class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label for="nameInput" class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identidad Completa</label>
                  <div class="relative">
                    <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 scale-75">person</mat-icon>
                    <input id="nameInput" type="text" [(ngModel)]="editData.name" class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium">
                  </div>
                </div>
                <div class="space-y-2">
                  <label for="phoneInput" class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contacto Directo</label>
                  <div class="relative">
                    <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 scale-75">smartphone</mat-icon>
                    <input id="phoneInput" type="text" [(ngModel)]="editData.phone" placeholder="+0 (000) 000-0000" class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium">
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label for="addressInput" class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ubicación de Enlace</label>
                <div class="relative">
                  <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 scale-75">map</mat-icon>
                  <input id="addressInput" type="text" [(ngModel)]="editData.address" placeholder="Ej. Ciudad, País" class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label for="dobInput" class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha de Nacimiento</label>
                  <input id="dobInput" type="date" [(ngModel)]="editData.dob" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium">
                </div>
                <div class="space-y-2">
                  <label for="prefsInput" class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Modo de Aprendizaje</label>
                  <select id="prefsInput" [(ngModel)]="editData.learningPreferences" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium h-[60px]">
                    <option value="">Seleccionar preferencia...</option>
                    <option value="visual">Visual & Interactivo</option>
                    <option value="audiotory">Auditivo & Inmersivo</option>
                    <option value="reading">Teórico & Estructural</option>
                    <option value="kinesthetic">Práctico & Experimental</option>
                  </select>
                </div>
              </div>

              <div class="space-y-2">
                <label for="bioInput" class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manifiesto Profesional / Bio</label>
                <textarea id="bioInput" [(ngModel)]="editData.bio" rows="4" placeholder="Escribe tu trayectoria..." class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium resize-none"></textarea>
              </div>
            </div>
          </div>

          <footer class="px-10 py-8 border-t border-slate-50 flex justify-end gap-4">
            <button (click)="closeEditModal()" class="px-8 py-4 rounded-2xl text-slate-400 font-bold hover:text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
              Descartar
            </button>
            <button (click)="saveProfileInfo()" class="px-10 py-4 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">
              Aplicar Cambios
            </button>
          </footer>
        </div>
      </div>
    }

    <!-- Logout Confirmation Modal -->
    @if (showLogoutConfirm()) {
      <div class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
        <div class="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
          <div class="p-10 text-center">
            <div class="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <mat-icon class="scale-[1.5]">logout</mat-icon>
            </div>
            <h3 class="text-2xl font-black text-slate-900 mb-2 tracking-tight">¿Cerrar Sesión?</h3>
            <p class="text-slate-500 font-medium leading-relaxed italic mb-8">
              Tu progreso se guardará automáticamente. Te esperamos pronto para continuar tu aprendizaje.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <button (click)="showLogoutConfirm.set(false)" class="py-4 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all active:scale-95">
                Cancelar
              </button>
              <button (click)="logout()" class="py-4 bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 active:scale-95">
                Confirmar Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Certificate Overlay: Cinema Mode -->
    @if (selectedCertCourse()) {
      <div class="fixed inset-0 z-[110] flex items-center justify-center p-4 print:bg-white print:p-0 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-500">
        <div class="absolute inset-0 cursor-pointer print:hidden" tabindex="0" (keyup.enter)="selectedCertCourse.set(null)" (click)="selectedCertCourse.set(null)"></div>
        <div class="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl flex flex-col p-10 lg:p-14 print:p-0 print:shadow-none mx-auto max-h-[95vh] overflow-y-auto animate-in zoom-in-95 duration-500 transform-gpu">
          <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 print:hidden gap-6">
             <div>
               <div class="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2">
                 <mat-icon class="scale-50">verified_user</mat-icon> Documento Oficial
               </div>
               <h3 class="text-4xl font-black text-slate-900 tracking-tighter">Certificación Académica</h3>
             </div>
             <div class="flex items-center gap-3">
               <button (click)="exportToPDF()" class="text-white bg-indigo-600 hover:bg-indigo-700 px-8 py-4 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2 shadow-xl shadow-indigo-200 active:scale-95">
                 <mat-icon class="scale-75">picture_as_pdf</mat-icon> Exportar PDF
               </button>
               <button (click)="selectedCertCourse.set(null)" class="w-14 h-14 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"><mat-icon>close</mat-icon></button>
             </div>
          </header>
          <div class="overflow-x-auto print:overflow-visible flex justify-center pb-8 border-b-8 border-transparent">
            <div id="certificate-to-export" class="min-w-[800px] print:min-w-0 print:w-full shadow-none bg-white p-4" style="box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
              <app-certificate [templateId]="selectedCertTemplate() || 'default'" [studentName]="user()?.name || ''" [courseName]="selectedCertCourse()?.title || ''"></app-certificate>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ProfileComponent {
  auth = inject(AuthService);
  courseService = inject(CourseService);
  
  user = this.auth.currentUser;

  learningScore = computed(() => {
    const enrollments = this.user()?.enrolledCourses || [];
    if (enrollments.length === 0) return 0;
    
    // Calculate average progress
    const totalProgress = enrollments.reduce((sum, enroll) => sum + enroll.progress, 0);
    return Math.round((totalProgress / enrollments.length) * 10) / 10;
  });

  // Edit Modal State
  isEditModalOpen = false;
  editData: Partial<User> = {};
  showLogoutConfirm = signal(false);

  // Certificate State
  selectedCertCourse = signal<Course | null>(null);
  selectedCertTemplate = signal<string | null>(null);

  openCertificate(course: Course, templateId?: string) {
    this.selectedCertTemplate.set(templateId || course.certificateTemplate || 'default');
    this.selectedCertCourse.set(course);
  }

  openEditModal() {
    const currentUser = this.user();
    if (currentUser) {
      this.editData = { ...currentUser };
      this.isEditModalOpen = true;
    }
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  saveProfileInfo() {
    this.auth.updateUserInfo(this.editData);
    this.closeEditModal();
  }

  getCourseDetails(courseId: string) {
    return this.courseService.getCourseById(courseId);
  }

  completedCoursesCount() {
    return this.user()?.enrolledCourses.filter(c => c.progress === 100).length || 0;
  }

  logout() {
    this.auth.logout();
  }

  async exportToPDF() {
    const studentName = this.user()?.name || 'Estudiante';
    const courseName = this.selectedCertCourse()?.title || 'Curso';
    const element = document.getElementById('certificate-to-export');
    
    if (!element) return;

    try {
      // Show loading indicator or handle it in UI if needed
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Additional hardening: ensure the element's style is clean for export
          const el = clonedDoc.getElementById('certificate-to-export');
          if (el) {
            el.style.backgroundColor = '#ffffff';
            el.style.color = '#000000';
            el.style.boxShadow = 'none';
            el.style.border = 'none';
          }

          // COMPLETELY REMOVE ALL EXTERNAL AND INTERNAL STYLES
          // This prevents html2canvas from attempting to parse rules containing oklch()
          const styles = clonedDoc.getElementsByTagName('style');
          while (styles.length > 0) {
            styles[0].parentNode?.removeChild(styles[0]);
          }
          const links = clonedDoc.getElementsByTagName('link');
          while (links.length > 0) {
            links[0].parentNode?.removeChild(links[0]);
          }

          // Add a very basic reset to ensure fonts and basic layouts work
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            * { box-sizing: border-box; }
            body { font-family: sans-serif; background: white; margin: 0; padding: 0; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .relative { position: relative; }
            .absolute { position: absolute; }
            .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
            .w-full { width: 100%; }
            .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
            .rounded { border-radius: 0.25rem; }
            .z-10 { z-index: 10; }
            .mt-16 { margin-top: 4rem; }
          `;
          clonedDoc.head.appendChild(style);

          // Ensure our inner container is visible and clean
          const inner = clonedDoc.getElementById('certificate-inner-container');
          if (inner) {
            inner.style.display = 'flex';
            inner.style.backgroundColor = '#ffffff';
            inner.style.boxShadow = 'none';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions (Landscape)
      const pdf = new jspdf({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Certificado - ${courseName} - ${studentName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to browser print if JS generation fails
      window.print();
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Get the base64 string (0.7 quality to save more space)
          const result = canvas.toDataURL('image/jpeg', 0.7);
          this.auth.updateAvatar(result);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
