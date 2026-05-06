import { Component, inject, signal } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Course } from '../models/types';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  template: `
    <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="relative">
        <div class="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">Gestión de Cursos</h1>
        <p class="text-slate-500 mt-1 font-medium text-lg">Curaduría de contenidos y arquitectura pedagógica</p>
      </div>
      <button (click)="openAddModal()" class="group bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-3 shadow-xl shadow-slate-200">
        <mat-icon class="group-hover:rotate-90 transition-transform duration-500">add</mat-icon> Iniciar Nuevo Currículo
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      @for (course of courseService.courses(); track course.id) {
        <div class="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col group hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
          <div class="h-56 overflow-hidden relative">
            <img [src]="course.imageUrl" [alt]="course.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
            
            <div class="absolute top-6 left-6 flex gap-2">
               <span class="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-[10px] font-black text-white uppercase tracking-widest">
                 {{ course.level }}
               </span>
               @if (course.modules.length > 5) {
                 <span class="px-3 py-1.5 bg-indigo-600/80 backdrop-blur-md rounded-xl border border-indigo-400/20 text-[10px] font-black text-white uppercase tracking-widest">
                   Extenso
                 </span>
               }
            </div>

            <div class="absolute bottom-6 left-6 right-6">
               <div class="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">
                 <mat-icon class="text-xs">layers</mat-icon>
                 {{ course.modules.length }} Módulos Activos
               </div>
               <h3 class="text-xl font-black text-white tracking-tight leading-tight">{{ course.title }}</h3>
            </div>
          </div>

          <div class="p-8 flex-1 flex flex-col">
            <p class="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 mb-8 flex-1 italic">"{{ course.shortDescription }}"</p>
            
            <div class="flex items-center justify-between pt-6 border-t border-slate-50">
              <div class="flex flex-col">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duración Estimada</span>
                <span class="text-sm font-black text-slate-700 flex items-center gap-1">
                  <mat-icon class="text-xs text-indigo-500">timer</mat-icon> 
                  {{ course.duration }}
                </span>
              </div>
              <div class="flex gap-2">
                <button (click)="openEditModal(course)" class="w-11 h-11 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all duration-300" title="Configurar">
                  <mat-icon class="scale-90">settings</mat-icon>
                </button>
                <button (click)="confirmDelete(course)" class="w-11 h-11 flex items-center justify-center bg-rose-50 text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all duration-300" title="Eliminar">
                  <mat-icon class="scale-90">delete_outline</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Add/Edit Modal Redesigned -->
    @if (showModal()) {
      <div class="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500">
        <div class="bg-white rounded-[3rem] p-12 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 animate-in zoom-in-95 duration-300">
          <div class="flex justify-between items-center mb-12">
            <div class="flex items-center gap-5">
               <div class="w-14 h-14 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-100">
                 <mat-icon class="text-3xl">{{ isEditing() ? 'auto_stories' : 'library_add' }}</mat-icon>
               </div>
               <div>
                  <h3 class="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{{ isEditing() ? 'Perfeccionar Curso' : 'Protocolo de Nuevo Curso' }}</h3>
                  <p class="text-slate-400 font-bold text-xs mt-1">Configuración técnica de activos pedagógicos</p>
               </div>
            </div>
            <button (click)="showModal.set(false)" class="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 transition-colors"><mat-icon>close</mat-icon></button>
          </div>
          
          <form class="space-y-8" (submit)="saveCourse($event)">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-2 space-y-2">
                <label for="courseTitle" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Denominación del Curso</label>
                <input id="courseTitle" type="text" [(ngModel)]="currentCourse.title" name="title" required class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
              </div>
              <div class="space-y-2">
                <label for="courseDuration" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ventana Temporal</label>
                <input id="courseDuration" type="text" [(ngModel)]="currentCourse.duration" name="duration" placeholder="ej: 3 meses" required class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
              </div>
            </div>

            <div class="space-y-2">
              <label for="courseImage" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identidad Visual (URL Cover)</label>
              <input id="courseImage" type="url" [(ngModel)]="currentCourse.imageUrl" name="imageUrl" required class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
            </div>

            <div class="space-y-2">
              <label for="courseShortDesc" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Síntesis Ejecutiva</label>
              <input id="courseShortDesc" type="text" [(ngModel)]="currentCourse.shortDescription" name="shortDescription" required class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
            </div>

            <div class="space-y-2">
              <label for="courseFullDesc" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Manifiesto Completo del Curso</label>
              <textarea id="courseFullDesc" [(ngModel)]="currentCourse.fullDescription" name="fullDescription" rows="4" required class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"></textarea>
            </div>

            <div class="space-y-2">
              <label for="courseTemplate" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Maquetación de Diploma Sugerida</label>
              <div class="relative">
                <select id="courseTemplate" [(ngModel)]="currentCourse.certificateTemplate" name="certificateTemplate" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer">
                  <option value="default">Diseño Predeterminado (Verde Bosque)</option>
                  <option value="red">Diseño Ejecutivo (Rojo Imperial)</option>
                  <option value="blue">Diseño Tecnológico (Azul Eléctrico)</option>
                </select>
                <mat-icon class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</mat-icon>
              </div>
            </div>

            <div class="flex gap-4 pt-8 border-t border-slate-50">
              <button type="button" (click)="showModal.set(false)" class="flex-1 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 border border-slate-200 hover:bg-slate-50 transition-colors">Cancelar</button>
              <button type="submit" class="flex-1 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-slate-900 hover:bg-indigo-600 shadow-2xl shadow-slate-200 transition-all">Publicar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    }

    <!-- Delete Confirmation Modal Redesigned -->
    @if (showDeleteConfirm()) {
      <div class="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500">
        <div class="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 animate-in zoom-in-95 duration-200 text-center">
          <div class="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-rose-100">
            <mat-icon class="text-5xl">gpp_maybe</mat-icon>
          </div>
          <h3 class="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4 leading-tight">Archivar Curso</h3>
          <p class="text-slate-500 font-medium mb-10 px-4 leading-relaxed">¿Estás seguro de que deseas eliminar este activo pedagógico de forma permanente? Esta acción borrará todas las inscripciones asociadas.</p>
          <div class="flex gap-4">
            <button (click)="showDeleteConfirm.set(false)" class="flex-1 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 border border-slate-200 hover:bg-slate-50 transition-colors">Retractar</button>
            <button (click)="executeDelete()" class="flex-1 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-700 shadow-2xl shadow-rose-100 transition-all">Confirmar Baja</button>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminCoursesComponent {
  courseService = inject(CourseService);
  
  showModal = signal(false);
  showDeleteConfirm = signal(false);
  isEditing = signal(false);
  
  courseToDelete: string | null = null;
  
  currentCourse: Partial<Course> = {};

  openAddModal() {
    this.isEditing.set(false);
    this.currentCourse = {
      title: '',
      shortDescription: '',
      fullDescription: '',
      imageUrl: '',
      duration: '',
      level: 'Básico',
      learningObjectives: [],
      modules: []
    };
    this.showModal.set(true);
  }

  openEditModal(course: Course) {
    this.isEditing.set(true);
    // clone course to avoid mutating until save
    this.currentCourse = JSON.parse(JSON.stringify(course));
    this.showModal.set(true);
  }

  saveCourse(event: Event) {
    event.preventDefault();
    if (!this.currentCourse.title || !this.currentCourse.shortDescription) return;

    if (this.isEditing() && this.currentCourse.id) {
      this.courseService.updateCourse(this.currentCourse.id, this.currentCourse);
    } else {
      this.courseService.addCourse(this.currentCourse as Omit<Course, 'id'>);
    }
    this.showModal.set(false);
  }

  confirmDelete(course: Course) {
    this.courseToDelete = course.id;
    this.showDeleteConfirm.set(true);
  }

  executeDelete() {
    if (this.courseToDelete) {
      this.courseService.deleteCourse(this.courseToDelete);
    }
    this.showDeleteConfirm.set(false);
    this.courseToDelete = null;
  }
}
