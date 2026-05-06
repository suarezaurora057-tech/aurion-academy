import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="relative">
        <div class="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
        <h1 class="text-5xl font-black text-slate-900 tracking-tight leading-tight">Métricas del <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Ecosistema</span></h1>
        <p class="text-slate-500 mt-2 font-medium text-lg max-w-xl">Inteligencia y rendimiento operativo de tu academia digital en tiempo real.</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex -space-x-2">
           @for (i of [1,2,3,4]; track i) {
             <div class="w-10 h-10 rounded-full border-2 border-slate-50 bg-slate-200 overflow-hidden shadow-sm">
               <img src="https://i.pravatar.cc/100?u={{i}}" alt="Admin" class="w-full h-full object-cover">
             </div>
           }
        </div>
        <button (click)="generateReport()" class="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
          <mat-icon class="text-sm">download</mat-icon>
          Reporte Mensual
        </button>
      </div>
    </div>

    <!-- Bento Core -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
      <!-- Feature Card: Performance -->
      <div class="md:col-span-8 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col justify-between group">
        <div class="absolute top-0 right-0 w-80 h-80 bg-indigo-50/30 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-indigo-100/40 transition-colors duration-700"></div>
        
        <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200">
              <mat-icon>insights</mat-icon>
            </div>
            <div>
              <h3 class="text-2xl font-black text-slate-900">Actividad de Usuarios</h3>
              <p class="text-slate-400 font-bold text-xs uppercase tracking-widest mt-0.5">Distribución semanal</p>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-black text-slate-900">{{ totalEnrollments }}</span>
            <span class="text-sm font-bold text-emerald-500 uppercase">Inscripciones</span>
          </div>
        </div>

        <div class="relative z-10 h-64 flex items-end justify-between gap-3 px-2">
           @let activity = [
             { label: 'Lun', val: '40', color: 'bg-indigo-100' },
             { label: 'Mar', val: '65', color: 'bg-indigo-200' },
             { label: 'Mié', val: '45', color: 'bg-indigo-100' },
             { label: 'Jue', val: '95', color: 'bg-indigo-600 shadow-[0_0_25px_rgba(79,70,229,0.4)]' },
             { label: 'Vie', val: '75', color: 'bg-indigo-300' },
             { label: 'Sáb', val: '35', color: 'bg-indigo-100' },
             { label: 'Dom', val: '20', color: 'bg-indigo-50' }
           ];
           @for (item of activity; track item.label) {
             <div class="flex-1 flex flex-col items-center group/bar cursor-help">
               <div class="w-full max-w-[54px] {{item.color}} rounded-2xl relative transition-all duration-500 group-hover/bar:scale-x-110" [style.height.%]="item.val">
                 <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover/bar:opacity-100 transition-opacity">
                   {{item.val}}%
                 </div>
               </div>
               <span class="mt-4 text-[11px] font-black tracking-widest text-slate-400 group-hover/bar:text-indigo-600 transition-colors uppercase">{{item.label}}</span>
             </div>
           }
        </div>
      </div>

      <!-- System Health Card -->
      <div class="md:col-span-4 grid grid-rows-2 gap-6">
        <div class="bg-white border border-slate-100 shadow-sm rounded-[2.5rem] p-8 flex flex-col justify-between group hover:border-emerald-200 transition-colors">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base de Datos</p>
              <p class="text-xs font-bold text-emerald-600">Totalmente Operativa</p>
            </div>
          </div>
          <div class="mt-6 flex items-end justify-between">
            <div>
              <h4 class="text-4xl font-black text-slate-900 tracking-tighter">{{ totalCourses }}</h4>
              <p class="text-sm font-bold text-slate-400">Cursos disponibles</p>
            </div>
            <div class="h-10 w-24 bg-emerald-50 rounded-lg flex items-center justify-center gap-1">
               <div class="w-1.5 h-4 bg-emerald-300 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
               <div class="w-1.5 h-6 bg-emerald-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
               <div class="w-1.5 h-3 bg-emerald-200 rounded-full animate-bounce" style="animation-delay: 0s"></div>
            </div>
          </div>
        </div>

        <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
           <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(79,70,229,0.4),transparent)]"></div>
           <div class="relative z-10 flex items-center justify-between mb-8">
              <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <mat-icon class="text-indigo-400">cloud</mat-icon>
              </div>
              <span class="text-[10px] font-black tracking-widest text-white/40 uppercase">Infraestructura</span>
           </div>
           <div class="relative z-10">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Latencia del Servidor</p>
              <h4 class="text-4xl font-black mt-1">24<span class="text-sm text-indigo-400 ml-1 font-bold">ms</span></h4>
              
              <div class="mt-6 flex items-center gap-4">
                 <div class="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                   <div class="bg-indigo-400 h-full w-[15%]"></div>
                 </div>
                 <span class="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Normal</span>
              </div>
           </div>
        </div>
      </div>

      <!-- Total Students & Admins Row -->
      <div class="md:col-span-4 bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-xl transition-shadow group flex flex-col justify-between">
        <div class="flex items-center gap-4 mb-10">
          <div class="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-slate-900 group-hover:text-white duration-500">
            <mat-icon class="text-3xl">people_alt</mat-icon>
          </div>
          <div>
            <h4 class="text-xl font-black text-slate-900">Usuarios</h4>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Estudiantes activos</p>
          </div>
        </div>
        <div>
          <div class="flex items-baseline gap-1">
            <span class="text-6xl font-black tracking-tighter text-slate-900">{{ totalUsers }}</span>
            <span class="text-slate-300 font-black text-2xl">/</span>
            <span class="text-slate-400 font-bold text-lg">1.5k</span>
          </div>
          <p class="text-xs font-bold text-slate-500 mt-2 bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100">84% de la meta mensual</p>
        </div>
      </div>

      <div class="md:col-span-4 bg-indigo-600 rounded-[2.5rem] p-10 text-white relative flex flex-col justify-between shadow-[0_20px_50px_rgba(79,70,229,0.3)]">
        <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div class="relative z-10 flex justify-between items-start">
           <div class="w-16 h-16 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[1.5rem] flex items-center justify-center">
             <mat-icon class="text-4xl">verified_user</mat-icon>
           </div>
           <mat-icon class="text-white/20">security</mat-icon>
        </div>
        <div class="relative z-10 mt-8">
          <h4 class="text-lg font-bold text-white/70">Staff Directivo</h4>
          <p class="text-7xl font-black tracking-tighter">{{ totalAdmins }}</p>
          <p class="text-xs font-bold text-indigo-100 uppercase tracking-widest mt-2">Administradores con acceso total</p>
        </div>
      </div>

      <div class="md:col-span-4 bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col justify-between group overflow-hidden relative">
        <div class="absolute bottom-0 right-0 w-32 h-32 bg-emerald-50 rounded-full translate-x-12 translate-y-12 blur-2xl group-hover:bg-emerald-100 transition-colors"></div>
        <div class="relative z-10">
          <h4 class="text-xl font-black text-slate-900 leading-tight">Certificados<br>Digitales</h4>
          <p class="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Éxitos de formación</p>
        </div>
        <div class="relative z-10 mt-10 flex items-center justify-between">
           <span class="text-5xl font-black text-slate-900 tracking-tighter">{{ totalCertificates }}</span>
           <div class="w-16 h-16 rounded-full border-4 border-emerald-50 flex items-center justify-center bg-white shadow-sm">
             <mat-icon class="text-emerald-500 scale-125">workspace_premium</mat-icon>
           </div>
        </div>
      </div>
    </div>
  `
})
export class AdminOverviewComponent {
  auth = inject(AuthService);
  courseService = inject(CourseService);

  get totalUsers() {
    return this.auth.allUsers().filter(u => u.role === 'student').length;
  }

  get totalCourses() {
    return this.courseService.courses().length;
  }

  get totalEnrollments() {
     return this.auth.allUsers().reduce((acc, u) => acc + u.enrolledCourses.length, 0);
  }

  get totalCertificates() {
     return this.auth.allUsers().reduce((acc, u) => acc + u.enrolledCourses.filter(c => c.progress === 100).length, 0);
  }

  get totalAdmins() {
     return this.auth.allUsers().filter(u => u.role === 'admin' || u.role === 'superadmin').length;
  }

  generateReport() {
    const reportData = [
      ['Metric', 'Value'],
      ['Total Students', this.totalUsers.toString()],
      ['Total Courses', this.totalCourses.toString()],
      ['Total Enrollments', this.totalEnrollments.toString()],
      ['Total Certificates', this.totalCertificates.toString()],
      ['Total Admins', this.totalAdmins.toString()],
      ['Generated At', new Date().toLocaleString()]
    ];

    const csvContent = reportData.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_mensual_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
