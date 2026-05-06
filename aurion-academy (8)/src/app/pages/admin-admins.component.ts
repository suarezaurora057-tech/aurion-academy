import { Component, inject, computed, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/types';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-admins',
  standalone: true,
  imports: [MatIconModule, DatePipe, UpperCasePipe, FormsModule],
  template: `
    <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="relative">
        <div class="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">Administradores</h1>
        <p class="text-slate-500 mt-1 font-medium text-lg">Jerarquía y control de privilegios del sistema</p>
      </div>
    </div>

    <!-- Top Bento Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
      <div class="lg:col-span-1 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Staff Activo</span>
          <p class="text-6xl font-black tracking-tighter">{{ admins().length }}</p>
          <div class="mt-8 flex items-center gap-2 text-amber-400">
             <mat-icon class="text-sm">security</mat-icon>
             <span class="text-[10px] font-black uppercase tracking-widest">Cuentas Seguras</span>
          </div>
        </div>
      </div>

      <div tabindex="0" role="button" (keydown.enter)="openCreateModal()" class="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-between relative group hover:border-amber-200 transition-all cursor-pointer overflow-hidden" (click)="openCreateModal()">
        <div class="absolute right-10 top-10 w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 rotate-12 group-hover:rotate-0 shadow-sm">
           <mat-icon class="text-3xl">add_moderator</mat-icon>
        </div>
        <div>
           <h3 class="text-2xl font-black text-slate-900 tracking-tight leading-none">Expandir Autoridad</h3>
           <p class="text-slate-400 mt-2 font-bold text-sm">Añadir un nuevo miembro certificado al equipo técnico.</p>
        </div>
        <div class="mt-8">
           <span class="px-6 py-3 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:px-8 transition-all">Iniciar Registro +</span>
        </div>
      </div>

      <div class="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col justify-between">
        <div class="flex flex-col gap-1">
          <span class="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Nivel de Seguridad</span>
          <span class="text-2xl font-black">Grado Militar</span>
        </div>
        <div class="flex justify-between items-end">
           <div class="flex -space-x-4">
             @for (a of admins().slice(0, 3); track a.id) {
               <div class="w-10 h-10 rounded-full border-2 border-indigo-600 bg-white/20 backdrop-blur-sm flex items-center justify-center font-black text-xs">
                 {{ a.name.charAt(0) }}
               </div>
             }
           </div>
           <mat-icon class="text-white/20">fingerprint</mat-icon>
        </div>
      </div>
    </div>

    <!-- Admin List -->
    <div class="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
      <div class="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Registro de Facultades</h3>
        <div class="w-10 h-1 bg-slate-200 rounded-full"></div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr class="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <th class="px-10 py-8">Gestor del Sistema</th>
              <th class="px-10 py-8">Designación de Rango</th>
              <th class="px-10 py-8">Estado</th>
              <th class="px-10 py-8">Último Acceso</th>
              <th class="px-10 py-8 text-right">Mantenimiento</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            @for (admin of admins(); track admin.id) {
              <tr class="hover:bg-slate-50/50 transition-all group/row">
                <td class="px-10 py-6">
                  <div class="flex items-center gap-5">
                    <div class="relative">
                      <div class="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-all" 
                           [class]="admin.role === 'superadmin' ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'">
                        {{ admin.name.charAt(0) | uppercase }}
                      </div>
                      @if (admin.role === 'superadmin') {
                        <div class="absolute -top-1 -right-1 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 shadow-sm border-2 border-white">
                          <mat-icon class="text-sm">verified</mat-icon>
                        </div>
                      }
                    </div>
                    <div>
                      <span class="font-black text-slate-900 block tracking-tight text-lg leading-tight">{{ admin.name }}</span>
                      <span class="text-slate-400 text-xs font-bold">{{ admin.email }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-10 py-6">
                   @if (admin.role === 'superadmin') {
                     <span class="px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-[0.1em] border border-amber-100 shadow-sm">
                       Superior Core
                     </span>
                   } @else {
                     <span class="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.1em] border border-slate-200 shadow-sm">
                       Security Officer
                     </span>
                   }
                </td>
                <td class="px-10 py-6">
                   @if (admin.status === 'active' || !admin.status) {
                     <div class="flex items-center gap-2 text-emerald-600">
                       <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                       <span class="text-[10px] font-black uppercase tracking-widest">Activo</span>
                     </div>
                   } @else {
                     <div class="flex items-center gap-2 text-rose-600">
                       <div class="w-2 h-2 bg-rose-500 rounded-full"></div>
                       <span class="text-[10px] font-black uppercase tracking-widest">Bloqueado</span>
                     </div>
                   }
                </td>
                <td class="px-10 py-6 text-slate-500 font-bold text-xs">
                   <div class="flex flex-col">
                     <span>{{ (admin.createdAt | date:'mediumDate') || 'N/A' }}</span>
                     <span class="text-[10px] font-black text-slate-300 tracking-widest uppercase">System Hook</span>
                   </div>
                </td>
                <td class="px-10 py-6 text-right">
                  <div class="flex items-center justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-all duration-300">
                    @if (admin.role !== 'superadmin' && currentUser()?.role === 'superadmin') {
                       <button (click)="revokeAdmin(admin)" class="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Revocar Autoridad">
                          <mat-icon class="scale-75">shield_moon</mat-icon>
                       </button>
                    } @else if (admin.role === 'superadmin') {
                       <span class="px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50/50">Protección Root</span>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Modal Redesigned -->
    @if (isCreateModalOpen()) {
       <div class="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-xl animate-in fade-in duration-500">
         <div class="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/20 animate-in zoom-in-95 duration-300">
           <div class="flex justify-between items-center mb-12">
             <div class="flex items-center gap-5">
                <div class="w-14 h-14 bg-amber-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-amber-100">
                  <mat-icon class="text-3xl">add_moderator</mat-icon>
                </div>
                <div>
                   <h3 class="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Alta de Staff</h3>
                   <p class="text-slate-400 font-bold text-xs mt-1">Nivel de acreditación requerido: Superior</p>
                </div>
             </div>
             <button (click)="isCreateModalOpen.set(false)" class="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400"><mat-icon>close</mat-icon></button>
           </div>
           
           @if (errorMessage()) {
             <div class="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in fade-in slide-in-from-top-1">
               <mat-icon class="text-sm">error</mat-icon>
               <span class="text-xs font-bold uppercase tracking-widest">{{ errorMessage() }}</span>
             </div>
           }
           
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
             <div class="md:col-span-2">
               <label for="adminName" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre Completo</label>
               <input id="adminName" type="text" [(ngModel)]="newData.name" placeholder="Ej. Alex Vance" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all">
             </div>
             <div>
               <label for="adminEmail" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Vía de Comunicación</label>
               <input id="adminEmail" type="email" [(ngModel)]="newData.email" placeholder="email@proeduca.com" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all">
             </div>
             <div>
               <label for="adminPassword" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Código de Acceso</label>
               <input id="adminPassword" type="password" [(ngModel)]="newData.password" placeholder="********" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all">
             </div>
             <div class="md:col-span-1">
               <label for="adminRole" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Acreditación de Rango</label>
               <select id="adminRole" [(ngModel)]="newData.role" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all appearance-none cursor-pointer">
                  <option value="admin">Administrador General</option>
                  <option value="superadmin">Super Administrador (Root)</option>
               </select>
             </div>
             <div class="md:col-span-1">
                <label for="adminStatus" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Estado</label>
                <select id="adminStatus" [(ngModel)]="newData.status" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all appearance-none cursor-pointer">
                   <option value="active">Activo</option>
                   <option value="blocked">Bloqueado</option>
                </select>
             </div>
           </div>

           <div class="flex gap-4">
             <button (click)="isCreateModalOpen.set(false)" class="flex-1 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">Cancelar Misión</button>
             <button (click)="createAdmin()" class="flex-1 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 shadow-2xl shadow-slate-200 transition-all">Sellar Registro</button>
           </div>
         </div>
       </div>
    }
  `
})
export class AdminAdminsComponent {
  auth = inject(AuthService);
  
  currentUser = this.auth.currentUser;
  
  admins = computed(() => {
    return this.auth.allUsers().filter(u => u.role === 'admin' || u.role === 'superadmin');
  });

  isCreateModalOpen = signal(false);
  errorMessage = signal('');
  
  newData = { name: '', email: '', password: '', role: 'admin' as 'admin' | 'superadmin', status: 'active' as 'active' | 'blocked' };

  openCreateModal() {
     this.newData = { name: '', email: '', password: '', role: 'admin', status: 'active' };
     this.errorMessage.set('');
     this.isCreateModalOpen.set(true);
  }

  createAdmin() {
     if (!this.newData.name || !this.newData.email || !this.newData.password) {
        this.errorMessage.set("Completa todos los campos");
        return;
     }
     
     const users = this.auth.allUsers();
     if (users.some(u => u.email === this.newData.email)) {
        this.errorMessage.set("El email ya está registrado");
        return;
     }

     const newAdmin: User = {
        id: crypto.randomUUID(),
        name: this.newData.name,
        email: this.newData.email,
        enrolledCourses: [],
        role: this.newData.role,
        status: this.newData.status,
        createdAt: new Date().toISOString(),
        avatarUrl: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.newData.name) + '&background=random'
     };
     
     // Store new user in mock backend
     const updatedUsers = [...users, newAdmin];
     this.auth.setAllUsers(updatedUsers);
     
     // Simulate writing password. In a real backend, would register auth
     const authMock = JSON.parse(localStorage.getItem('proeduca_auth_mock') || '{}');
     authMock[this.newData.email] = this.newData.password;
     if (typeof window !== 'undefined') localStorage.setItem('proeduca_auth_mock', JSON.stringify(authMock));

     this.isCreateModalOpen.set(false);
  }

  revokeAdmin(admin: User) {
    if (this.currentUser()?.role !== 'superadmin') {
      return;
    }
    const users = this.auth.allUsers();
    const idx = users.findIndex(u => u.id === admin.id);
    if (idx !== -1) {
      users[idx].role = 'student';
      this.auth.setAllUsers([...users]);
    }
  }
}
