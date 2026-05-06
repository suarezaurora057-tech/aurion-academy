import { Component, inject, signal } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Course, CourseModule, Lesson } from '../models/types';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-lessons',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  template: `
    <div class="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="relative">
        <div class="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">Currículo de Estudios</h1>
        <p class="text-slate-500 mt-1 font-medium text-lg">Arquitectura de contenidos y flujos de aprendizaje</p>
      </div>
    </div>

    <!-- Course Selection Tool -->
    <div class="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-10 mb-10 group hover:border-indigo-200 transition-all duration-500">
      <div class="flex flex-col md:flex-row md:items-center gap-8">
        <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
          <mat-icon class="text-3xl">auto_awesome_motion</mat-icon>
        </div>
        <div class="flex-1">
          <label for="courseSelector" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Selección de Proyecto Académico</label>
          <div class="relative">
            <select id="courseSelector" [(ngModel)]="selectedCourseId" (change)="onCourseSelect()" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-black focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer">
              <option value="" disabled>Especifique el curso para editar...</option>
              @for (course of courseService.courses(); track course.id) {
                <option [value]="course.id">{{ course.title }}</option>
              }
            </select>
            <mat-icon class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">unfold_more</mat-icon>
          </div>
        </div>
      </div>
    </div>

    @if (selectedCourse()) {
      <div class="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div class="flex justify-between items-center bg-slate-50 shadow-inner px-8 py-4 rounded-3xl border border-slate-100">
          <div class="flex items-center gap-3">
             <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
             <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Estructura de Módulos ({{ (selectedCourse()?.modules || []).length }})</h2>
          </div>
          <button (click)="openModuleModal()" class="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
            <mat-icon class="text-sm">add_box</mat-icon> Insertar Módulo
          </button>
        </div>

        <div class="grid grid-cols-1 gap-8">
          @for (module of selectedCourse()?.modules; track module.id; let mIndex = $index) {
            <div class="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden group/module hover:border-indigo-100 transition-all duration-300">
              <div class="bg-slate-50/50 p-8 border-b border-slate-50 flex justify-between items-center">
                <div class="flex items-center gap-6">
                  <span class="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-900 flex items-center justify-center font-black text-lg shadow-sm">{{ mIndex + 1 }}</span>
                  <div>
                     <h3 class="font-black text-slate-900 text-xl tracking-tight leading-none uppercase">{{ module.title }}</h3>
                     <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{{ module.lessons.length }} Lecciones Programadas</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button (click)="openModuleModal(module)" class="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all" title="Renombrar"><mat-icon class="scale-90 font-bold">edit_note</mat-icon></button>
                  <button (click)="deleteModule(module)" class="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all" title="Eliminar Módulo"><mat-icon class="scale-90 font-bold">delete_sweep</mat-icon></button>
                </div>
              </div>

              <div class="p-8">
                <div class="flex justify-between items-center mb-6 px-1">
                  <span class="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Secuencia de Aprendizaje</span>
                  <button (click)="openLessonModal(module.id)" class="text-indigo-600 hover:text-indigo-700 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl transition-all">
                    <mat-icon class="text-sm">add_circle</mat-icon> Añadir Actividad
                  </button>
                </div>

                @if (module.lessons.length > 0) {
                  <div class="space-y-4">
                    @for (lesson of module.lessons; track lesson.id; let lIndex = $index) {
                      <div class="flex items-center justify-between p-6 rounded-[1.5rem] bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group/lesson relative">
                        <div class="flex items-center gap-6">
                          <mat-icon class="text-slate-200 cursor-grab active:cursor-grabbing hover:text-indigo-400 transition-colors">apps</mat-icon>
                          <div class="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 border border-slate-100 flex items-center justify-center shrink-0 group-hover/lesson:bg-indigo-600 group-hover/lesson:text-white group-hover/lesson:border-indigo-600 transition-all duration-500 shadow-sm">
                            <mat-icon>{{ getIconForType(lesson.type) }}</mat-icon>
                          </div>
                          <div>
                            <p class="font-black text-slate-900 tracking-tight text-base">{{ lesson.title }}</p>
                            <div class="flex items-center gap-4 mt-2">
                              <span class="px-3 py-1 bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-100 group-hover/lesson:border-indigo-200 transition-all">{{ getTypeName(lesson.type) }}</span>
                              <span class="text-[10px] font-bold text-slate-400 flex items-center gap-1 group-hover/lesson:text-indigo-400 transition-colors"><mat-icon class="text-xs">query_builder</mat-icon> {{ lesson.duration }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="flex gap-2 opacity-0 group-hover/lesson:opacity-100 transition-all transform translate-x-4 group-hover/lesson:translate-x-0">
                          <button (click)="moveLessonUp(module, lIndex)" [disabled]="lIndex === 0" class="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-20 transition-all shadow-sm"><mat-icon class="scale-75">north</mat-icon></button>
                          <button (click)="moveLessonDown(module, lIndex)" [disabled]="lIndex === module.lessons.length - 1" class="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-20 transition-all shadow-sm"><mat-icon class="scale-75">south</mat-icon></button>
                          <div class="w-[1px] h-9 bg-slate-100 mx-1"></div>
                          <button (click)="openLessonModal(module.id, lesson)" class="w-9 h-9 flex items-center justify-center rounded-lg text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><mat-icon class="scale-75">settings</mat-icon></button>
                          <button (click)="deleteLesson(module, lesson.id)" class="w-9 h-9 flex items-center justify-center rounded-lg text-rose-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm"><mat-icon class="scale-75">delete_forever</mat-icon></button>
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-center p-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                    <mat-icon class="text-4xl text-slate-200 mb-2 font-light">playlist_add</mat-icon>
                    <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Inicie la producción de contenidos para este módulo</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    } @else {
       <div class="py-20 text-center animate-in fade-in zoom-in-95 duration-700">
          <div class="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto text-slate-100 mb-8 border border-white">
            <mat-icon class="text-7xl">view_kanban</mat-icon>
          </div>
          <h2 class="text-2xl font-black text-slate-300 uppercase tracking-[0.3em]">Seleccione un Proyecto</h2>
          <p class="text-slate-400 font-medium text-lg mt-2 italic px-8 max-w-lg mx-auto">Navegue por el listado de cursos para gestionar la estructura de sus activos educativos.</p>
       </div>
    }

    <!-- Module Modal Redesigned -->
    @if (showModuleModal()) {
      <div class="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
        <div class="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-white/20 animate-in zoom-in-95 duration-300">
          <div class="flex items-center gap-4 mb-10">
             <div class="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
               <mat-icon>view_module</mat-icon>
             </div>
             <h3 class="text-2xl font-black text-slate-900 tracking-tighter uppercase">{{ isEditingModule() ? 'Editar Módulo' : 'Inyectar Módulo' }}</h3>
          </div>

          <div class="space-y-6 mb-10">
            <div>
              <label for="moduleTitle" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Denominación Formal</label>
              <input id="moduleTitle" type="text" [(ngModel)]="currentModule.title" placeholder="Ej. Fundamentos de Arquitectura" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
            </div>
          </div>

          <div class="flex gap-4">
            <button (click)="showModuleModal.set(false)" class="flex-1 px-4 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 border border-slate-200 hover:bg-slate-50 transition-colors">Abortar</button>
            <button (click)="saveModule()" class="flex-1 px-4 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-white bg-slate-900 hover:bg-indigo-600 shadow-xl shadow-slate-100 transition-all tracking-widest">Sellar Módulo</button>
          </div>
        </div>
      </div>
    }

    <!-- Lesson Modal Redesigned -->
    @if (showLessonModal()) {
      <div class="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-xl animate-in fade-in duration-300">
        <div class="bg-white rounded-[3rem] p-12 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 animate-in zoom-in-95 duration-300">
          <div class="flex items-center gap-5 mb-12">
             <div class="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
               <mat-icon class="text-3xl">play_lesson</mat-icon>
             </div>
             <div>
                <h3 class="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{{ isEditingLesson() ? 'Optimizar Lección' : 'Nueva Unidad' }}</h3>
                <p class="text-slate-400 font-bold text-xs mt-1">Configuración técnica de unidad de aprendizaje</p>
             </div>
          </div>
          
          <div class="space-y-8 mb-12">
            <div>
              <label for="lessonTitle" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Título de la Unidad</label>
              <input id="lessonTitle" type="text" [(ngModel)]="currentLesson.title" placeholder="Describa el objetivo de la lección" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
            </div>
            
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label for="lessonType" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Ecosistema de Contenido</label>
                <div class="relative">
                  <select id="lessonType" [(ngModel)]="currentLesson.type" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer">
                    <option value="video">Transmisión Video</option>
                    <option value="reading">Asset Documento</option>
                    <option value="quiz">Módulo Evaluación</option>
                  </select>
                  <mat-icon class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">unfold_more</mat-icon>
                </div>
              </div>
              <div>
                <label for="lessonDuration" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Carga Horaria (Min)</label>
                <input id="lessonDuration" type="text" [(ngModel)]="currentLesson.duration" placeholder="ej: 15 min" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
              </div>
            </div>

            @if (currentLesson.type === 'video' || currentLesson.type === 'reading') {
              <div class="animate-in slide-in-from-top-2 duration-300">
                <label for="lessonUrl" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Dirección del Asset (URL)</label>
                <div class="relative">
                   <mat-icon class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">link</mat-icon>
                   <input id="lessonUrl" type="url" [(ngModel)]="currentLesson.url" placeholder="https://cdn.proeduca.cloud/..." class="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
                </div>
                <p class="text-[9px] font-bold text-slate-400 mt-3 px-1">Se aceptan CDN, YouTube, Vimeo, Drive o contenedores S3.</p>
              </div>
            }
          </div>

          <div class="flex gap-4">
            <button (click)="showLessonModal.set(false)" class="flex-1 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 border border-slate-200 hover:bg-slate-50 transition-colors">Retractar</button>
            <button (click)="saveLesson()" class="flex-1 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-slate-900 hover:bg-indigo-600 shadow-2xl shadow-slate-200 transition-all">Sellar Unidad</button>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminLessonsComponent {
  courseService = inject(CourseService);
  
  selectedCourseId = '';
  selectedCourse = signal<Course | null>(null);

  // Module state
  showModuleModal = signal(false);
  isEditingModule = signal(false);
  currentModule: Partial<CourseModule> = {};

  // Lesson state
  showLessonModal = signal(false);
  isEditingLesson = signal(false);
  targetModuleId = '';
  currentLesson: Partial<Lesson> = {};

  onCourseSelect() {
    const course = this.courseService.getCourseById(this.selectedCourseId);
    this.selectedCourse.set(course || null);
  }

  // --- Módulos ---
  openModuleModal(module?: CourseModule) {
    if (module) {
      this.isEditingModule.set(true);
      this.currentModule = { ...module };
    } else {
      this.isEditingModule.set(false);
      this.currentModule = { title: '' };
    }
    this.showModuleModal.set(true);
  }

  saveModule() {
    const course = this.selectedCourse();
    if (!course || !this.currentModule.title) return;
    
    // clone course deeply to avoid direct mutation
    const updatedCourse = JSON.parse(JSON.stringify(course)) as Course;

    if (!updatedCourse.modules) {
      updatedCourse.modules = [];
    }

    if (this.isEditingModule() && this.currentModule.id) {
       const idx = updatedCourse.modules.findIndex(m => m.id === this.currentModule.id);
       if (idx !== -1) updatedCourse.modules[idx].title = this.currentModule.title || '';
    } else {
       updatedCourse.modules.push({
         id: 'm_' + Date.now(),
         title: this.currentModule.title,
         lessons: []
       } as CourseModule);
    }

    this.courseService.updateCourse(course.id, updatedCourse);
    this.selectedCourse.set(updatedCourse);
    this.showModuleModal.set(false);
  }

  deleteModule(module: CourseModule) {
    if (!confirm(`¿Eliminar módulo "${module.title}" y todas sus lecciones?`)) return;
    const course = this.selectedCourse();
    if (!course) return;

    const updatedCourse = JSON.parse(JSON.stringify(course)) as Course;
    updatedCourse.modules = updatedCourse.modules.filter(m => m.id !== module.id);
    
    this.courseService.updateCourse(course.id, updatedCourse);
    this.selectedCourse.set(updatedCourse);
  }

  // --- Lecciones ---
  openLessonModal(moduleId: string, lesson?: Lesson) {
    this.targetModuleId = moduleId;
    if (lesson) {
      this.isEditingLesson.set(true);
      this.currentLesson = { ...lesson };
    } else {
      this.isEditingLesson.set(false);
      this.currentLesson = { title: '', type: 'video', duration: '' };
    }
    this.showLessonModal.set(true);
  }

  saveLesson() {
    const course = this.selectedCourse();
    if (!course || !this.currentLesson.title || !this.targetModuleId) return;

    const updatedCourse = JSON.parse(JSON.stringify(course)) as Course;
    const modIdx = updatedCourse.modules.findIndex(m => m.id === this.targetModuleId);
    if (modIdx === -1) return;

    const mod = updatedCourse.modules[modIdx];

    if (this.isEditingLesson() && this.currentLesson.id) {
      const lessIdx = mod.lessons.findIndex(l => l.id === this.currentLesson.id);
      if (lessIdx !== -1) mod.lessons[lessIdx] = { ...this.currentLesson } as Lesson;
    } else {
      mod.lessons.push({
        id: 'l_' + Date.now(),
        ...this.currentLesson
      } as Lesson);
    }

    this.courseService.updateCourse(course.id, updatedCourse);
    this.selectedCourse.set(updatedCourse);
    this.showLessonModal.set(false);
  }

  deleteLesson(module: CourseModule, lessonId: string) {
    if (!confirm('¿Eliminar esta lección?')) return;
    const course = this.selectedCourse();
    if (!course) return;

    const updatedCourse = JSON.parse(JSON.stringify(course)) as Course;
    const modIdx = updatedCourse.modules.findIndex(m => m.id === module.id);
    if (modIdx === -1) return;

    updatedCourse.modules[modIdx].lessons = updatedCourse.modules[modIdx].lessons.filter(l => l.id !== lessonId);

    this.courseService.updateCourse(course.id, updatedCourse);
    this.selectedCourse.set(updatedCourse);
  }

  moveLessonUp(module: CourseModule, index: number) {
     if (index <= 0) return;
     const course = this.selectedCourse();
     if (!course) return;

     const updatedCourse = JSON.parse(JSON.stringify(course)) as Course;
     const modIdx = updatedCourse.modules.findIndex(m => m.id === module.id);
     if (modIdx === -1) return;

     const lessons = updatedCourse.modules[modIdx].lessons;
     // swap
     [lessons[index - 1], lessons[index]] = [lessons[index], lessons[index - 1]];

     this.courseService.updateCourse(course.id, updatedCourse);
     this.selectedCourse.set(updatedCourse);
  }

  moveLessonDown(module: CourseModule, index: number) {
     const course = this.selectedCourse();
     if (!course) return;
     
     const updatedCourse = JSON.parse(JSON.stringify(course)) as Course;
     const modIdx = updatedCourse.modules.findIndex(m => m.id === module.id);
     if (modIdx === -1) return;

     const lessons = updatedCourse.modules[modIdx].lessons;
     if (index >= lessons.length - 1) return;

     // swap
     [lessons[index], lessons[index + 1]] = [lessons[index + 1], lessons[index]];

     this.courseService.updateCourse(course.id, updatedCourse);
     this.selectedCourse.set(updatedCourse);
  }

  getIconForType(type?: 'video'|'reading'|'quiz'): string {
    switch (type) {
      case 'video': return 'play_circle';
      case 'reading': return 'article';
      case 'quiz': return 'quiz';
      default: return 'menu_book';
    }
  }

  getTypeName(type?: 'video'|'reading'|'quiz'): string {
    switch (type) {
      case 'video': return 'Video';
      case 'reading': return 'Lectura';
      case 'quiz': return 'Examen';
      default: return 'Lección';
    }
  }
}
