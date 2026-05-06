import { Component, inject, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { AuthService } from '../services/auth.service';
import { AppSettingsService } from '../services/app-settings.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden">
      <!-- Background Decorations -->
      <div class="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/50 rounded-l-[10rem] -z-10 translate-x-20"></div>
      <div class="absolute bottom-1/4 left-10 w-24 h-24 bg-emerald-100 rounded-full blur-3xl opacity-60 animate-float"></div>
      <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-200/30 rounded-full blur-[100px]"></div>

      <div class="section-container">
        <div class="flex flex-col lg:flex-row items-center gap-20">
          <div class="flex-1 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-100">
               <span class="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
               Líderes en Formación Técnica
            </div>
            
            <h1 class="text-6xl md:text-8xl font-extrabold text-slate-900 leading-[0.9] tracking-tighter mb-8">
              Tu Carrera <br> <span class="text-indigo-600">Empieza Aquí.</span>
            </h1>
            
            <p class="text-xl text-slate-600 mb-12 max-w-xl leading-relaxed font-medium">
              {{ settings.footerDescription() }}
            </p>
            
            <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
               <a routerLink="/courses" class="btn-primary flex items-center gap-3 px-10 py-5 text-lg group">
                 Ver Cursos
                 <mat-icon class="group-hover:translate-x-1 transition-transform">east</mat-icon>
               </a>
               <a routerLink="/about" class="btn-secondary flex items-center gap-3 px-10 py-5 text-lg">
                 Nuestra Misión
               </a>
            </div>

            <div class="mt-16 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partners Educativos</span>
              <div class="h-6 w-px bg-slate-300"></div>
              <div class="flex items-center gap-8">
                 <mat-icon class="text-3xl text-slate-400">assured_workload</mat-icon>
                 <mat-icon class="text-3xl text-slate-400">foundation</mat-icon>
                 <mat-icon class="text-3xl text-slate-400">verified</mat-icon>
              </div>
            </div>
          </div>

          <div class="flex-1 relative w-full max-w-xl">
             <div class="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img [src]="settings.bannerUrl()" alt="Banner Academia" class="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-1000">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                <div class="absolute bottom-10 left-10 text-white">
                   <p class="text-4xl font-extrabold leading-none tracking-tighter text-white/90">Aprende,<br>Aplica, Crece.</p>
                </div>
             </div>
             
             <!-- Floating Cards -->
             <div class="absolute -bottom-10 -right-10 glass-card p-6 rounded-3xl animate-float z-20 hidden md:block">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                      <mat-icon>trending_up</mat-icon>
                   </div>
                   <div>
                      <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Crecimiento Promedio</p>
                      <p class="text-2xl font-extrabold text-slate-900">+85%</p>
                   </div>
                </div>
             </div>

             <div class="absolute -top-6 -left-6 glass-card p-4 rounded-2xl z-20 hidden md:block" style="animation-delay: -3s;">
                <div class="flex items-center gap-3">
                   <div class="flex -space-x-3">
                      @for (i of [1,2,3]; track i) {
                        <div class="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                           <img [src]="'https://i.pravatar.cc/100?img=' + i" alt="User">
                        </div>
                      }
                   </div>
                   <p class="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">+{{ totalStudents() }} Estudiantes</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Metrics Section -->
    <section class="py-24 bg-white relative">
      <div class="section-container">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          @for (stat of [
            { label: 'Estudiantes Activos', val: totalStudents(), desc: 'Formando líderes regionales', icon: 'groups', color: 'indigo' },
            { label: 'Programas Técnicos', val: totalCourses(), desc: 'Excelencia en cada módulo', icon: 'auto_stories', color: 'sky' },
            { label: 'Contenido Multimedia', val: totalLessons(), desc: 'Lecciones de alto impacto', icon: 'video_library', color: 'emerald' }
          ]; track stat.label) {
            <div class="group p-8 rounded-[2.5rem] bg-slate-50 hover:bg-indigo-600 transition-all duration-500 hover:-translate-y-2">
              <div class="w-16 h-16 rounded-2xl mb-8 flex items-center justify-center transition-all duration-500" 
                   [class]="'bg-' + stat.color + '-100 text-' + stat.color + '-600 group-hover:bg-white/20 group-hover:text-white'">
                 <mat-icon class="text-3xl">{{ stat.icon }}</mat-icon>
              </div>
              <h3 class="text-5xl font-extrabold text-slate-900 mb-2 group-hover:text-white transition-colors tracking-tighter">{{ stat.val }}</h3>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 group-hover:text-white/60 transition-colors">{{ stat.label }}</p>
              <div class="h-1 w-12 bg-indigo-600 group-hover:bg-white transition-all"></div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Featured Courses -->
    <section class="py-32 bg-slate-50">
      <div class="section-container">
        <div class="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div class="max-w-2xl">
            <p class="text-indigo-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Selección Académica</p>
            <h2 class="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter leading-none mb-6">Programas <br><span class="text-indigo-600">Destacados</span></h2>
            <p class="text-lg text-slate-500 font-medium leading-relaxed">Cursos diseñados para una inserción laboral inmediata y efectiva.</p>
          </div>
          <a routerLink="/courses" class="btn-secondary flex items-center gap-3 group">
            Ver Todos los Cursos
            <mat-icon class="group-hover:translate-x-1 transition-transform">east</mat-icon>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (course of featuredCourses; track course.id) {
            <a [routerLink]="['/courses', course.id]" class="group block bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div class="relative aspect-square overflow-hidden">
                <img [src]="course.imageUrl" [alt]="course.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerpolicy="no-referrer">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="absolute top-6 left-6">
                   <span class="px-3 py-1 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider shadow-sm">
                     {{ course.level }}
                   </span>
                </div>
              </div>
                <div class="px-8 pb-8 pt-0 flex flex-col gap-3">
                  <h3 class="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{{ course.title }}</h3>
                  <div class="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                     <div class="flex items-center gap-1">
                        <mat-icon class="text-lg">schedule</mat-icon>
                        {{ course.duration }}
                     </div>
                     <div class="flex items-center gap-1">
                        <mat-icon class="text-lg">layers</mat-icon>
                        {{ course.modules.length }} Pasos
                     </div>
                  </div>
                  
                  @if (isEnrolled(course.id)) {
                    <button disabled class="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed">
                       <mat-icon class="text-sm">check_circle</mat-icon> Inscrito
                    </button>
                  } @else {
                    <button (click)="$event.preventDefault(); $event.stopPropagation(); enroll(course.id)" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100 group-hover:shadow-indigo-200">
                       <mat-icon class="text-sm">school</mat-icon> Inscribirme
                    </button>
                  }
                </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-32 bg-white overflow-hidden relative">
       <!-- Decoration -->
       <div class="absolute -right-20 top-20 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -z-10"></div>

       <div class="section-container">
          <div class="flex flex-col lg:flex-row items-center gap-24">
             <div class="flex-1 order-2 lg:order-1 relative">
                <div class="grid grid-cols-2 gap-4">
                   <div class="space-y-4 pt-12">
                      <div class="rounded-3xl overflow-hidden aspect-[4/5] shadow-xl">
                         <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop" alt="Workshop" class="w-full h-full object-cover">
                      </div>
                      <div class="bg-indigo-600 rounded-3xl aspect-square flex flex-col items-center justify-center text-white p-8 text-center">
                         <p class="text-5xl font-extrabold mb-2 tracking-tighter">10+</p>
                         <p class="text-[10px] font-bold uppercase tracking-widest opacity-80">Años de Trayectoria</p>
                      </div>
                   </div>
                   <div class="space-y-4">
                      <div class="bg-slate-900 rounded-3xl aspect-square flex flex-col items-center justify-center text-white p-8 text-center">
                         <mat-icon class="text-5xl mb-4 text-indigo-400">verified</mat-icon>
                         <p class="text-xs font-bold uppercase tracking-widest">Calidad Certificada</p>
                      </div>
                      <div class="rounded-3xl overflow-hidden aspect-[4/5] shadow-xl">
                         <img src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1470&auto=format&fit=crop" alt="Estudio" class="w-full h-full object-cover">
                      </div>
                   </div>
                </div>
             </div>

             <div class="flex-1 order-1 lg:order-2">
                <p class="text-indigo-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-6">Conócenos</p>
                <h2 class="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter leading-[0.95] mb-10">
                   Compromiso con la <br> <span class="text-indigo-600 underline decoration-indigo-200 underline-within offset-12">Excelencia Académica</span>
                </h2>
                <div class="space-y-6 text-xl text-slate-600 font-medium leading-relaxed">
                   <p class="whitespace-pre-wrap">{{ settings.aboutUsText() }}</p>
                </div>
                
                <div class="mt-12">
                   <a routerLink="/about" class="inline-flex items-center gap-4 text-indigo-600 font-bold uppercase tracking-widest text-sm hover:gap-6 transition-all group">
                      Leer Nuestra Historia
                      <mat-icon class="group-hover:translate-x-1 transition-transform">east</mat-icon>
                   </a>
                </div>
             </div>
          </div>
       </div>
    </section>
  `
})
export class HomeComponent {
  courseService = inject(CourseService);
  authService = inject(AuthService);
  settings = inject(AppSettingsService);
  router = inject(Router);
  
  featuredCourses = this.courseService.courses().slice(0, 4);

  totalCourses = computed(() => this.courseService.courses().length);
  totalLessons = computed(() => {
    let count = 0;
    this.courseService.courses().forEach(course => {
      course.modules?.forEach(module => {
        count += module.lessons?.length || 0;
      });
    });
    return count;
  });
  
  // Since we don't have a backend to fetch all students yet, we'll return a simulated number
  // combining the mock students and registered user base.
  // When a backend is connected, this should fetch the actual count from the users table.
  totalStudents = computed(() => {
    return 350 + this.authService.allUsers().length; // Simulated value + real accounts
  });

  isEnrolled(courseId: string): boolean {
    const user = this.authService.currentUser();
    if (!user) return false;
    return user.enrolledCourses.some(c => c.courseId === courseId);
  }

  enroll(courseId: string) {
    if (!this.authService.currentUser()) {
      this.router.navigate(['/register'], { queryParams: { courseId } });
      return;
    }
    this.authService.enroll(courseId);
  }
}
