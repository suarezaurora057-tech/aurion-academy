import { Component, inject, signal, computed } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';
import { User, EnrolledCourse } from '../models/types';
import { MatIconModule } from '@angular/material/icon';
import { UpperCasePipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [MatIconModule, UpperCasePipe, DatePipe, FormsModule],
  template: `
    <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="relative">
        <div class="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">Gestión de Usuarios</h1>
        <p class="text-slate-500 mt-1 font-medium text-lg">Administración centralizada de la comunidad estudiantil</p>
      </div>
      
      <div class="flex items-center gap-3 bg-white p-2 border border-slate-100 rounded-2xl shadow-sm">
        <div class="flex items-center gap-3 px-4 py-2 border-r border-slate-100">
           <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Activos</span>
           <span class="text-lg font-black text-emerald-600">{{ filteredUsers().length }}</span>
        </div>
        <button (click)="openAddUserModal()" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2">
          <mat-icon class="text-sm">person_add</mat-icon>
          Nuevo Usuario
        </button>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="space-y-8">
      <!-- Search & Filters -->
      <div class="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-1 relative">
            <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</mat-icon>
            <input type="text" [(ngModel)]="localSearch" (input)="onSearchChange()" placeholder="Buscar por nombre, email o ID..." 
                   class="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none">
          </div>
          <div class="flex gap-3">
             <button (click)="showFilters = !showFilters" class="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
               <mat-icon class="text-sm">{{ showFilters ? 'expand_less' : 'filter_list' }}</mat-icon>
               Filtros
             </button>
             <button (click)="refreshList()" class="px-6 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Sincronizar</button>
          </div>
        </div>

        @if (showFilters) {
          <div class="mt-8 pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-500">
             <div>
               <label for="statusFilter" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Estado de Acceso</label>
               <div id="statusFilter" class="flex gap-2">
                  <button (click)="currentStatusFilter = 'all'" [class]="currentStatusFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600'" class="flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-100 transition-all">Todos</button>
                  <button (click)="currentStatusFilter = 'active'" [class]="currentStatusFilter === 'active' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600'" class="flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-100 transition-all">Activos</button>
                  <button (click)="currentStatusFilter = 'blocked'" [class]="currentStatusFilter === 'blocked' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600'" class="flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-100 transition-all">Bloqueados</button>
               </div>
             </div>
             <div>
                <label for="levelFilter" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Nivel Académico</label>
                <select id="levelFilter" class="w-full px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none">
                  <option>Todos los Niveles</option>
                  <option>Estudiante Regular</option>
                  <option>Estudiante Élite</option>
                </select>
             </div>
             <div class="flex items-end">
                <button (click)="resetFilters()" class="w-full py-3 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Limpiar Filtros</button>
             </div>
          </div>
        }
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr class="text-slate-400 text-[11px] font-black uppercase tracking-widest border-b border-slate-50">
                <th class="px-10 py-8 text-center w-24">Perfil</th>
                <th class="px-8 py-8">Identidad Estudiantil</th>
                <th class="px-8 py-8">Estado de Cuenta</th>
                <th class="px-8 py-8">Ingreso</th>
                <th class="px-10 py-8 text-right">Gestión</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              @for (user of filteredUsers(); track user.id) {
                <tr class="hover:bg-slate-50/50 transition-all group/row">
                  <td class="px-10 py-6 text-center">
                    <div class="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl group-hover/row:bg-indigo-600 group-hover/row:text-white transition-all duration-500 shadow-sm">
                      {{ user.name.charAt(0) | uppercase }}
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <div>
                      <span class="font-black text-slate-900 block tracking-tight text-lg">{{ user.name }}</span>
                      <span class="text-slate-400 text-xs font-bold">{{ user.email }}</span>
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    @if (user.status === 'blocked') {
                      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                         <mat-icon class="text-sm">block</mat-icon>
                         <span class="text-[10px] font-black uppercase tracking-widest">Restringido</span>
                      </div>
                    } @else {
                      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                         <mat-icon class="text-sm">verified</mat-icon>
                         <span class="text-[10px] font-black uppercase tracking-widest">Activo</span>
                      </div>
                    }
                  </td>
                  <td class="px-8 py-6">
                    <div class="flex flex-col">
                      <span class="text-xs font-black text-slate-900">{{ (user.createdAt | date:'mediumDate') || 'N/A' }}</span>
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Miembro Regular</span>
                    </div>
                  </td>
                  <td class="px-10 py-6 text-right">
                    <div class="flex items-center justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-all duration-300 transform translate-x-4 group-hover/row:translate-x-0">
                       <button (click)="openDetailModal(user)" class="w-10 h-10 flex items-center justify-center text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm" title="Rendimiento Académico">
                         <mat-icon class="scale-90">analytics</mat-icon>
                       </button>
                       <button (click)="toggleBlock(user)" class="w-10 h-10 flex items-center justify-center text-amber-600 bg-amber-50 hover:bg-amber-600 hover:text-white rounded-xl transition-all shadow-sm" [title]="user.status === 'blocked' ? 'Desbloquear Acceso' : 'Bloquear Acceso'">
                         <mat-icon class="scale-90">{{ user.status === 'blocked' ? 'lock_open' : 'lock' }}</mat-icon>
                       </button>
                       <button (click)="openEditModal(user)" class="w-10 h-10 flex items-center justify-center text-slate-600 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl transition-all shadow-sm" title="Modificar Perfil">
                         <mat-icon class="scale-90">settings_suggest</mat-icon>
                       </button>
                       <button (click)="deleteUser(user)" class="w-10 h-10 flex items-center justify-center text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm" title="Eliminar de Raíz">
                         <mat-icon class="scale-90">delete_forever</mat-icon>
                       </button>
                    </div>
                  </td>
                </tr>
              }
              @if (filteredUsers().length === 0) {
                <tr>
                  <td colspan="5" class="p-20 text-center">
                    <div class="flex flex-col items-center gap-6">
                       <div class="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                         <mat-icon class="text-6xl">face_retouching_off</mat-icon>
                       </div>
                       <div>
                         <p class="text-slate-400 font-black uppercase tracking-widest text-sm">Sin hallazgos en la comunidad</p>
                         <p class="text-xs text-slate-400 mt-1">Pruebe con otros términos de búsqueda</p>
                       </div>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modals Redesigned -->
    @if (selectedUser()) {
      <div class="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
        <div class="bg-white rounded-[3rem] p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-white/20 animate-in zoom-in-95 duration-300 relative">
          <div class="flex justify-between items-start mb-10">
            <div class="flex items-center gap-6">
              <div class="w-24 h-24 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center font-black text-4xl shadow-2xl shadow-indigo-200">
                {{ selectedUser()?.name?.charAt(0) | uppercase }}
              </div>
              <div>
                <h3 class="text-3xl font-black text-slate-900 tracking-tight">{{ selectedUser()?.name }}</h3>
                <p class="text-slate-500 font-medium text-lg">{{ selectedUser()?.email }}</p>
                <div class="mt-2 flex gap-2">
                   <span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full">Estudiante Verificado</span>
                   <span class="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-full">ID: {{ selectedUser()?.id }}</span>
                </div>
              </div>
            </div>
            <button (click)="selectedUser.set(null)" class="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center transition-colors text-slate-400"><mat-icon>close</mat-icon></button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div class="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center group hover:bg-indigo-600 transition-all duration-500">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-200">Cursos Iniciados</p>
              <p class="text-4xl font-black text-indigo-600 mt-2 group-hover:text-white">{{ selectedUser()?.enrolledCourses?.length || 0 }}</p>
            </div>
            <div class="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center group hover:bg-emerald-600 transition-all duration-500">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-100">Meta Alcanzada</p>
              <p class="text-4xl font-black text-emerald-600 mt-2 group-hover:text-white">{{ countCompleted(selectedUser()!) }}</p>
            </div>
            <div class="bg-indigo-600 p-6 rounded-[2rem] text-center shadow-xl shadow-indigo-100">
              <p class="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Nivel de Alumno</p>
              <p class="text-2xl font-black text-white mt-2">Élite Digital</p>
            </div>
          </div>

          <div class="flex items-center gap-4 mb-6">
            <h4 class="text-xl font-black text-slate-900 tracking-tight">Registro de Rendimiento</h4>
            <div class="h-[1px] flex-1 bg-slate-100"></div>
          </div>

          @if (selectedUser()?.enrolledCourses?.length) {
            <div class="space-y-6">
              @for (enrollment of selectedUser()?.enrolledCourses; track enrollment.courseId) {
                <div class="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm group hover:border-indigo-200 transition-all duration-300">
                   <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                     <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                          <mat-icon>school</mat-icon>
                        </div>
                        <div>
                           <h5 class="font-black text-slate-900 text-lg leading-tight">{{ getCourseName(enrollment.courseId) }}</h5>
                           <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nota Actual: <span class="text-slate-900 font-black">{{ enrollment.grade }}/100</span></p>
                        </div>
                     </div>
                     <span class="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                       {{ enrollment.progress === 100 ? 'Finalizado' : 'Progreso Activo' }}
                     </span>
                   </div>
                   
                   <div class="mb-8">
                     <div class="flex justify-between items-end text-[10px] mb-2">
                       <span class="font-black text-slate-400 uppercase tracking-widest">Estado Académico</span>
                       <span class="font-black text-slate-900 text-base">{{ enrollment.progress }}%</span>
                     </div>
                     <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                       <div class="h-full {{ enrollment.progress === 100 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)]' }} transition-all duration-1000 ease-out" [style.width.%]="enrollment.progress"></div>
                     </div>
                   </div>

                   <!-- Professional Actions -->
                   <div class="flex flex-wrap gap-3">
                      <button (click)="forceComplete(selectedUser()!, enrollment)" class="flex-1 min-w-[140px] px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">Re-ajustar Progreso</button>
                      <button (click)="forceGrade(selectedUser()!, enrollment)" class="flex-1 min-w-[140px] px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">Calificar Módulos</button>
                   </div>
                </div>
              }
            </div>
          } @else {
            <div class="p-12 text-center bg-slate-50 rounded-[2rem] border border-slate-100">
               <mat-icon class="text-4xl text-slate-300 mb-2">history_edu</mat-icon>
               <p class="text-slate-400 font-bold uppercase tracking-widest text-xs italic">El estudiante aún no ha iniciado su viaje académico</p>
            </div>
          }
        </div>
      </div>
    }

    <!-- Edit User Modal -->
    @if (editingUser()) {
       <div class="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
         <div class="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-white/20 animate-in zoom-in-95 duration-300">
           <div class="flex justify-between items-center mb-10">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                  <mat-icon>manage_accounts</mat-icon>
                </div>
                <h3 class="text-2xl font-black text-slate-900 tracking-tight uppercase">Editar Perfil</h3>
             </div>
             <button (click)="editingUser.set(null)" class="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-400"><mat-icon>close</mat-icon></button>
           </div>
           
           <div class="space-y-6 mb-10">
             <div>
               <label for="studentName" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre Completo</label>
               <input id="studentName" type="text" [(ngModel)]="editData.name" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
             </div>
             <div>
               <label for="studentEmail" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
               <input id="studentEmail" type="email" [(ngModel)]="editData.email" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
             </div>
           </div>

           <div class="flex gap-4">
             <button (click)="editingUser.set(null)" class="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">Abortar</button>
             <button (click)="saveUser()" class="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all">Confirmar</button>
           </div>
         </div>
       </div>
    }

    <!-- Add User Modal -->
    @if (showAddModal()) {
       <div class="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
         <div class="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-white/20 animate-in zoom-in-95 duration-300">
           <div class="flex justify-between items-center mb-10">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                  <mat-icon>person_add</mat-icon>
                </div>
                <h3 class="text-2xl font-black text-slate-900 tracking-tight uppercase">Alta de Estudiante</h3>
             </div>
             <button (click)="showAddModal.set(false)" class="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-400"><mat-icon>close</mat-icon></button>
           </div>
           
           <div class="space-y-6 mb-10">
             <div>
               <label for="newUserName" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre y Apellido</label>
               <input id="newUserName" type="text" [(ngModel)]="editData.name" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
             </div>
             <div>
               <label for="newUserEmail" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Correo Institucional</label>
               <input id="newUserEmail" type="email" [(ngModel)]="editData.email" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
             </div>
             <div>
               <label for="newUserPass" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contraseña Provisional</label>
               <input id="newUserPass" type="text" [(ngModel)]="editData.password" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
             </div>
           </div>

           <div class="flex gap-4">
             <button (click)="showAddModal.set(false)" class="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">Cancelar</button>
             <button (click)="addUser()" class="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all">Dar de Alta</button>
           </div>
         </div>
       </div>
    }
  `
})
export class AdminStudentsComponent {
  auth = inject(AuthService);
  courseService = inject(CourseService);
  
  users = this.auth.allUsers;
  localSearch = '';
  searchQuery = signal('');
  showFilters = false;
  currentStatusFilter: 'all' | 'active' | 'blocked' = 'all';
  
  selectedUser = signal<User | null>(null);
  editingUser = signal<User | null>(null);
  showAddModal = signal(false);
  
  editData = { name: '', email: '', password: '' };

  onSearchChange() {
    this.searchQuery.set(this.localSearch);
  }

  refreshList() {
    this.auth.refreshUsers();
  }

  resetFilters() {
    this.currentStatusFilter = 'all';
    this.localSearch = '';
    this.searchQuery.set('');
  }

  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const statusFilter = this.currentStatusFilter;
    
    return this.users().filter(u => {
      if (u.role === 'superadmin' || u.role === 'admin') return false;
      
      const matchesSearch = !query || 
                           u.name.toLowerCase().includes(query) || 
                           u.email.toLowerCase().includes(query) || 
                           u.id.toLowerCase().includes(query);
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && u.status !== 'blocked') || 
                           (statusFilter === 'blocked' && u.status === 'blocked');
      
      return matchesSearch && matchesStatus;
    });
  });

  countCompleted(user: User): number {
    return user.enrolledCourses.filter(c => c.progress === 100).length;
  }

  getCourseName(courseId: string): string {
    const course = this.courseService.getCourseById(courseId);
    return course ? course.title : 'Curso Desconocido';
  }

  openDetailModal(user: User) {
    this.selectedUser.set(user);
  }

  openAddUserModal() {
    this.editData = { name: '', email: '', password: 'Password123!' };
    this.showAddModal.set(true);
  }

  addUser() {
    if (!this.editData.name || !this.editData.email) return;
    
    const newUser: User = {
      id: 'u_' + Date.now(),
      name: this.editData.name,
      email: this.editData.email,
      password: this.editData.password,
      role: 'student',
      status: 'active',
      createdAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.editData.email}`,
      enrolledCourses: [],
      certificates: []
    };

    const users = [...this.auth.allUsers(), newUser];
    this.auth.setAllUsers(users);
    this.showAddModal.set(false);
  }

  openEditModal(user: User) {
    this.editData = { name: user.name, email: user.email, password: '' };
    this.editingUser.set(user);
  }

  saveUser() {
    const userToEdit = this.editingUser();
    if (userToEdit) {
       this.updateUserInStore(userToEdit.id, { name: this.editData.name, email: this.editData.email });
       this.editingUser.set(null);
    }
  }

  deleteUser(user: User) {
     if (confirm('¿Eliminar al usuario de forma permanente?')) {
        const users = this.auth.allUsers().filter(u => u.id !== user.id);
        this.auth.setAllUsers(users);
     }
  }

  toggleBlock(user: User) {
     const status = user.status === 'blocked' ? 'active' : 'blocked';
     this.updateUserInStore(user.id, { status });
  }

  forceComplete(user: User, enrollment: EnrolledCourse) {
     const val = prompt('Nuevo progreso (0-100):', enrollment.progress.toString());
     if (val !== null) {
       const progress = parseInt(val, 10);
       if (!isNaN(progress) && progress >= 0 && progress <= 100) {
          const users = this.auth.allUsers();
          const userIdx = users.findIndex(u => u.id === user.id);
          if (userIdx !== -1) {
             const u = users[userIdx];
             const cIdx = u.enrolledCourses.findIndex(c => c.courseId === enrollment.courseId);
             if (cIdx !== -1) {
                u.enrolledCourses[cIdx].progress = progress;
                // re-set
                this.auth.setAllUsers([...users]);
                if (this.selectedUser()?.id === user.id) this.selectedUser.set({...u});
             }
          }
       }
     }
  }

  forceGrade(user: User, enrollment: EnrolledCourse) {
     const gradeStr = prompt('Ingresa la nueva nota (0-100):', enrollment.grade?.toString() || '0');
     if (gradeStr !== null) {
        const num = parseInt(gradeStr, 10);
        if (!isNaN(num) && num >= 0 && num <= 100) {
           const users = this.auth.allUsers();
           const userIdx = users.findIndex(u => u.id === user.id);
           if (userIdx !== -1) {
              const u = users[userIdx];
              const cIdx = u.enrolledCourses.findIndex(c => c.courseId === enrollment.courseId);
              if (cIdx !== -1) {
                 u.enrolledCourses[cIdx].grade = num;
                 // re-set
                 this.auth.setAllUsers([...users]);
                 if (this.selectedUser()?.id === user.id) this.selectedUser.set({...u});
              }
           }
        }
     }
  }

  private updateUserInStore(id: string, modifications: Partial<User>) {
     const users = this.auth.allUsers();
     const idx = users.findIndex(u => u.id === id);
     if (idx !== -1) {
        users[idx] = { ...users[idx], ...modifications };
        this.auth.setAllUsers([...users]);
     }
  }
}
