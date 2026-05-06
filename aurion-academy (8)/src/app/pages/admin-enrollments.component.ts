import { Component, inject, computed, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';
import { MatIconModule } from '@angular/material/icon';
import { UpperCasePipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface EnrollmentEntry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  courseCategory: string;
  progress: number;
  enrollmentDate: string;
}

@Component({
  selector: 'app-admin-enrollments',
  standalone: true,
  imports: [MatIconModule, UpperCasePipe, DatePipe, FormsModule],
  template: `
    <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="relative">
        <div class="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-purple-600 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)]"></div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">Inscripciones</h1>
        <p class="text-slate-500 mt-1 font-medium text-lg">Control de flujo académico y progreso de estudiantes</p>
      </div>
      
      <div class="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
        <div class="flex flex-col">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Activas</span>
          <span class="text-2xl font-black text-slate-900">{{ enrollmentsData().length }}</span>
        </div>
        <div class="w-[1px] h-10 bg-slate-100"></div>
        <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
          <mat-icon>how_to_reg</mat-icon>
        </div>
      </div>
    </div>

    <!-- Main Table Container -->
    <div class="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
      <div class="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
        <div class="relative w-full sm:w-80">
           <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</mat-icon>
           <input type="text" [(ngModel)]="localSearch" (input)="onSearchChange()" placeholder="Buscar inscripción..." class="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none">
        </div>
        <div class="flex gap-2">
           <button (click)="exportCSV()" class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">Exportar CSV</button>
           <button (click)="showFilters = !showFilters" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
             {{ showFilters ? 'Ocultar Filtros' : 'Ver Filtros' }}
           </button>
        </div>
      </div>

      @if (showFilters) {
        <div class="p-8 bg-slate-50 border-b border-slate-100 animate-in slide-in-from-top-2 duration-300">
           <div class="flex flex-wrap gap-4">
              <button (click)="filterByStatus('all')" [class]="currentFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600'" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all border border-slate-100">Todas</button>
              <button (click)="filterByStatus('active')" [class]="currentFilter === 'active' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600'" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all border border-slate-100">En Curso</button>
              <button (click)="filterByStatus('completed')" [class]="currentFilter === 'completed' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600'" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all border border-slate-100">Completadas</button>
           </div>
        </div>
      }
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr class="text-slate-400 text-[11px] font-black uppercase tracking-widest border-b border-slate-50">
              <th class="px-8 py-6">Estudiante</th>
              <th class="px-8 py-6">Curso & Nivel</th>
              <th class="px-8 py-6">Estado de Progreso</th>
              <th class="px-8 py-6">Fecha de Acceso</th>
              <th class="px-8 py-6 text-right">Acciones Directas</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            @for (item of enrollmentsData(); track item.id) {
              <tr class="hover:bg-slate-50/50 transition-all group/row">
                <td class="px-8 py-5">
                  <div class="flex items-center gap-4">
                    <div class="relative">
                      <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-100">
                        {{ item.userName.charAt(0) | uppercase }}
                      </div>
                      <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></div>
                    </div>
                    <div>
                      <span class="font-black text-slate-900 block tracking-tight">{{ item.userName }}</span>
                      <span class="text-slate-400 text-xs font-bold">{{ item.userEmail }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-5">
                   <div class="font-black text-slate-800 tracking-tight">{{ item.courseTitle }}</div>
                   <div class="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-tighter rounded-md">{{ item.courseCategory }}</div>
                </td>
                <td class="px-8 py-5">
                   <div class="flex flex-col gap-2">
                     <div class="flex justify-between items-center w-full max-w-[140px]">
                        <span class="text-[10px] font-black text-slate-400 uppercase">{{ item.progress === 100 ? 'Completado' : 'En Curso' }}</span>
                        <span class="text-xs font-black text-slate-900">{{ item.progress }}%</span>
                     </div>
                     <div class="w-full max-w-[140px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div class="h-full {{ item.progress === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]' }} transition-all duration-1000 ease-out" [style.width.%]="item.progress"></div>
                     </div>
                   </div>
                </td>
                <td class="px-8 py-5">
                   <span class="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/50">
                     {{ item.enrollmentDate | date:'mediumDate' }}
                   </span>
                </td>
                <td class="px-8 py-5 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/row:translate-x-0">
                    <button (click)="simulateCompletion(item)" class="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all shadow-sm" title="Finalizar Curso">
                      <mat-icon class="scale-90">verified_user</mat-icon>
                    </button>
                    <button (click)="cancelEnrollment(item)" class="p-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all shadow-sm" title="Dar de Baja">
                      <mat-icon class="scale-90">person_remove</mat-icon>
                    </button>
                  </div>
                </td>
              </tr>
            }
            @if (enrollmentsData().length === 0) {
              <tr>
                <td colspan="5" class="p-20 text-center">
                   <div class="flex flex-col items-center gap-4">
                      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                        <mat-icon class="text-5xl">inbox</mat-icon>
                      </div>
                      <p class="text-slate-400 font-bold uppercase tracking-widest text-sm">No se encontraron inscripciones</p>
                   </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminEnrollmentsComponent {
  auth = inject(AuthService);
  courseService = inject(CourseService);

  localSearch = '';
  searchQuery = signal('');
  showFilters = false;
  currentFilter: 'all' | 'active' | 'completed' = 'all';

  onSearchChange() {
    this.searchQuery.set(this.localSearch);
  }

  filterByStatus(status: 'all' | 'active' | 'completed') {
    this.currentFilter = status;
  }

  exportCSV() {
    const data = this.enrollmentsData();
    if (data.length === 0) return;

    const headers = ['Student Name', 'Student Email', 'Course', 'Category', 'Progress', 'Enrollment Date'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        `"${item.userName}"`,
        `"${item.userEmail}"`,
        `"${item.courseTitle}"`,
        `"${item.courseCategory}"`,
        `${item.progress}%`,
        `"${item.enrollmentDate}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `inscripciones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  enrollmentsData = computed(() => {
    const list: EnrollmentEntry[] = [];
    const users = this.auth.allUsers();
    const query = this.searchQuery().toLowerCase().trim();
    
    users.forEach(user => {
      user.enrolledCourses.forEach(enroll => {
        const course = this.courseService.getCourseById(enroll.courseId);
        if (course) {
           const matchesSearch = !query || 
                                user.name.toLowerCase().includes(query) || 
                                user.email.toLowerCase().includes(query) || 
                                course.title.toLowerCase().includes(query);
           
           const matchesFilter = this.currentFilter === 'all' || 
                                (this.currentFilter === 'active' && enroll.progress < 100) || 
                                (this.currentFilter === 'completed' && enroll.progress === 100);

           if (matchesSearch && matchesFilter) {
              list.push({
                id: user.id + '_' + course.id,
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                courseId: course.id,
                courseTitle: course.title,
                courseCategory: course.level || 'General',
                progress: enroll.progress,
                enrollmentDate: enroll.enrollmentDate
              });
           }
        }
      });
    });

    // Sort by newest enrollment
    list.sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime());
    return list;
  });

  simulateCompletion(item: EnrollmentEntry) {
    const users = this.auth.allUsers();
    const idx = users.findIndex(u => u.id === item.userId);
    if (idx !== -1) {
      const enrollmentIdx = users[idx].enrolledCourses.findIndex(c => c.courseId === item.courseId);
      if (enrollmentIdx !== -1) {
        users[idx].enrolledCourses[enrollmentIdx].progress = 100;
        users[idx].enrolledCourses[enrollmentIdx].grade = 100;
        this.auth.setAllUsers([...users]);
        
        // If this is the current user, update their local context as well
        const currUser = this.auth.currentUser();
        if (currUser && currUser.id === item.userId) {
          const newCurrUser = JSON.parse(JSON.stringify(users[idx]));
          this.auth.currentUser.set(newCurrUser);
          if (typeof window !== 'undefined') localStorage.setItem('proeduca_user', JSON.stringify(newCurrUser));
        }
      }
    }
  }

  cancelEnrollment(item: EnrollmentEntry) {
    const users = this.auth.allUsers();
    const idx = users.findIndex(u => u.id === item.userId);
    if (idx !== -1) {
      users[idx].enrolledCourses = users[idx].enrolledCourses.filter(c => c.courseId !== item.courseId);
      this.auth.setAllUsers([...users]);
    }
  }
}
