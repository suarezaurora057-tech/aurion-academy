import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { AuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [RouterLink, MatIconModule, FormsModule],
  template: `
    <div class="bg-slate-50 min-h-screen py-24 relative overflow-hidden">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div class="absolute bottom-1/2 left-0 w-80 h-80 bg-emerald-50/50 rounded-full blur-3xl -ml-40 opacity-60"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Header Section -->
        <div class="mb-20">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
            <span class="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>
            <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Formación Elite</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
            Descubre tu próxima <br>
            <span class="text-indigo-600">gran habilidad.</span>
          </h1>
          
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p class="text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
              Explora nuestra selección de programas diseñados por expertos para convertirte en el profesional que el mercado demanda.
            </p>

            <!-- Modern Search -->
            <div class="w-full max-w-md relative group">
              <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition-opacity"></div>
              <div class="relative bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center px-4 py-1">
                <mat-icon class="text-slate-400">search</mat-icon>
                <input 
                  type="text" [(ngModel)]="localSearchQuery" (input)="updateSearch()" 
                  placeholder="Ej. Diseño, Programación..." 
                  class="w-full px-4 py-3 bg-transparent border-none outline-none text-slate-900 font-bold placeholder-slate-400">
              </div>
            </div>
          </div>
        </div>

        <!-- Filtered Content -->
        @if (filteredCourses().length === 0) {
          <div class="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
            <div class="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <mat-icon class="text-4xl">inventory_2</mat-icon>
            </div>
            <h3 class="text-2xl font-black text-slate-900 mb-2">No encontramos resultados</h3>
            <p class="text-slate-500 mb-8 max-w-xs mx-auto">Intenta con otros términos para encontrar lo que buscas.</p>
            <button (click)="localSearchQuery = ''; updateSearch()" class="text-indigo-600 font-bold hover:underline">Mostrar todos los cursos</button>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (course of filteredCourses(); track course.id) {
              <div 
                [routerLink]="['/courses', course.id]" 
                class="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full hover:-translate-y-2">
                
                <div class="relative aspect-[16/10] overflow-hidden">
                  <img [src]="course.imageUrl" [alt]="course.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerpolicy="no-referrer">
                  
                  <!-- Quality Badge -->
                  <div class="absolute top-6 left-6 flex flex-col gap-2">
                    <span class="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-black text-indigo-600 uppercase tracking-widest rounded-lg shadow-sm w-fit">
                      {{ course.level }}
                    </span>
                  </div>

                  <!-- Overlay on hover -->
                  <div class="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div class="p-8 flex flex-col flex-grow">
                  <div class="mb-4">
                    <h3 class="text-2xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">{{ course.title }}</h3>
                  </div>
                  
                  <p class="text-slate-500 font-medium line-clamp-2 mb-8 flex-grow leading-relaxed italic">
                    "{{ course.shortDescription }}"
                  </p>

                  <div class="flex flex-col gap-4 mt-auto pt-6 border-t border-slate-50">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-4 text-slate-400">
                        <div class="flex items-center gap-1.5">
                          <mat-icon class="scale-75">schedule</mat-icon>
                          <span class="text-xs font-black uppercase tracking-tighter">{{ course.duration }}</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                          <mat-icon class="scale-75">layers</mat-icon>
                          <span class="text-xs font-black uppercase tracking-tighter">{{ course.modules.length }} Módulos</span>
                        </div>
                      </div>
                      
                      <div class="w-10 h-10 bg-slate-900 group-hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center transition-all duration-300">
                        <mat-icon class="scale-75">chevron_right</mat-icon>
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
                </div>
              </div>
            }
          </div>
        }

        <!-- Bottom CTA -->
        <div class="mt-32 p-12 lg:p-16 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden group">
          <div class="relative z-10 max-w-2xl">
            <h2 class="text-4xl md:text-5xl font-black mb-6 tracking-tighter">¿No encuentras lo que buscas?</h2>
            <p class="text-xl text-slate-400 mb-8 leading-relaxed">
              Estamos constantemente expandiendo nuestros cursos. Suscríbete para recibir notificaciones sobre nuevos lanzamientos.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
               <button [routerLink]="['/contact']" class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20">
                 Solicitar un tema
               </button>
            </div>
          </div>
          
          <!-- Abstract Background Shape -->
          <div class="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div class="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
            <div class="absolute -top-1/4 -right-1/4 w-full h-full border-[60px] border-white/5 rounded-full rotate-45 scale-150 transition-transform duration-1000 group-hover:rotate-90"></div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class CoursesComponent implements OnInit {
  courseService = inject(CourseService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  
  allCourses = this.courseService.courses;
  localSearchQuery = '';
  searchQuerySignal = signal('');

  filteredCourses = computed(() => {
    const q = this.searchQuerySignal().toLowerCase();
    if (!q) return this.allCourses();

    return this.allCourses().filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.shortDescription.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.localSearchQuery = params['q'];
        this.searchQuerySignal.set(params['q']);
      }
    });
  }

  updateSearch() {
    this.searchQuerySignal.set(this.localSearchQuery);
  }

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
