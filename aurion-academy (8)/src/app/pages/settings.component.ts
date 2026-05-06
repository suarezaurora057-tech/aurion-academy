import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppSettingsService, AppSettings } from '../services/app-settings.service';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';
import { User, Course } from '../models/types';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div class="bg-slate-50 min-h-screen p-4 md:p-8">
      <div class="max-w-7xl mx-auto flex flex-col gap-8">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div class="flex items-center gap-5">
            <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
              <mat-icon class="scale-125">settings</mat-icon>
            </div>
            <div>
              <h1 class="text-3xl font-black text-slate-900 tracking-tight">Panel de Control</h1>
              <p class="text-slate-500 font-medium italic text-sm">Gestiona la identidad, usuarios y oferta académica de Aurion Academy</p>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button (click)="saveAllChanges()" class="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              <mat-icon class="scale-75">save</mat-icon> Guardar Cambios
            </button>
            <button (click)="resetChanges()" class="flex items-center gap-2 px-8 py-4 bg-white text-slate-400 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
              Cancelar
            </button>
          </div>
        </div>

        <!-- Dashboard Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <!-- Navigation Sidebar -->
          <div class="lg:col-span-1 space-y-2">
            <button (click)="activeTab.set('general')" 
                    [class]="activeTab() === 'general' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white text-slate-500 hover:bg-slate-50'"
                    class="w-full flex items-center gap-4 px-6 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-sm border border-slate-100">
              <mat-icon>info</mat-icon> Información General
            </button>
            <button (click)="activeTab.set('visual')" 
                    [class]="activeTab() === 'visual' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white text-slate-500 hover:bg-slate-50'"
                    class="w-full flex items-center gap-4 px-6 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-sm border border-slate-100">
              <mat-icon>palette</mat-icon> Logo e Imagen
            </button>
            <button (click)="activeTab.set('users')" 
                    [class]="activeTab() === 'users' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white text-slate-500 hover:bg-slate-50'"
                    class="w-full flex items-center gap-4 px-6 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-sm border border-slate-100">
              <mat-icon>people</mat-icon> Gestión de Usuarios
            </button>
            <button (click)="activeTab.set('courses')" 
                    [class]="activeTab() === 'courses' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white text-slate-500 hover:bg-slate-50'"
                    class="w-full flex items-center gap-4 px-6 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-sm border border-slate-100">
              <mat-icon>layers</mat-icon> Gestión de Cursos
            </button>
          </div>

          <!-- Main Content Area -->
          <div class="lg:col-span-3 bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] overflow-hidden min-h-[600px]">
            
            <!-- General Tab -->
            @if (activeTab() === 'general') {
              <div class="p-10 md:p-14 space-y-12 animate-in fade-in slide-in-from-right-4 duration-300">
                <div class="space-y-8">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-2">
                      <label for="siteNameInp" class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Nombre de la academia</label>
                      <input id="siteNameInp" type="text" [formControl]="generalForm.controls.siteName" 
                        class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
                    </div>
                    <div class="space-y-2">
                      <label for="contactEmailInp" class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Correo Institucional</label>
                      <input id="contactEmailInp" type="email" [formControl]="generalForm.controls.contactEmail" 
                        class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label for="footerDescInp" class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Descripción</label>
                    <textarea id="footerDescInp" [formControl]="generalForm.controls.footerDescription" rows="3"
                      class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"></textarea>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-2">
                      <label for="contactAddressInp" class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Dirección</label>
                      <input id="contactAddressInp" type="text" [formControl]="generalForm.controls.contactAddress" 
                        class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
                    </div>
                    <div class="space-y-2">
                      <label for="contactPhoneInp" class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Teléfono</label>
                      <input id="contactPhoneInp" type="text" [formControl]="generalForm.controls.contactPhone" 
                        class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all">
                    </div>
                  </div>
                </div>

                <!-- Live Preview Card Integration -->
                <div class="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <h3 class="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-6">Vista Previa (Footer & Contacto)</h3>
                  <div class="space-y-4">
                    <p class="text-2xl font-black tracking-tight">{{ generalForm.controls.siteName.value || 'Aurion Academy' }}</p>
                    <p class="text-slate-400 italic text-sm leading-relaxed">{{ generalForm.controls.footerDescription.value || 'Descripción institucional...' }}</p>
                    <div class="flex flex-wrap gap-6 pt-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <div class="flex items-center gap-2"><mat-icon class="scale-75">email</mat-icon> {{ generalForm.controls.contactEmail.value }}</div>
                      <div class="flex items-center gap-2"><mat-icon class="scale-75">phone</mat-icon> {{ generalForm.controls.contactPhone.value }}</div>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- Visual Tab -->
            @if (activeTab() === 'visual') {
              <div class="p-10 md:p-14 space-y-12 animate-in fade-in slide-in-from-right-4 duration-300">
                
                <div class="space-y-10">
                  <div class="space-y-4">
                    <label for="logoInp" class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-2">Logotipo de la Academia</label>
                    <div class="flex flex-col md:flex-row items-center gap-10 bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner">
                      <div class="w-40 h-40 rounded-3xl bg-white shadow-sm flex items-center justify-center p-6 relative group overflow-hidden border border-slate-100 shrink-0">
                        @if (logoPreview()) {
                          <img [src]="logoPreview()" alt="Logo" class="max-w-full max-h-full object-contain">
                        } @else {
                          <mat-icon class="text-slate-100 text-6xl">image</mat-icon>
                        }
                        <input type="file" id="logoInp" class="hidden" accept="image/*" #logoInp (change)="handleFile($event, 'logo')">
                        <div role="button" tabindex="0" (click)="logoInp.click()" (keydown.enter)="logoInp.click()" class="absolute inset-0 bg-indigo-600/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                           <mat-icon class="text-white scale-125">upload</mat-icon>
                        </div>
                      </div>
                      <div class="flex-1 text-center md:text-left space-y-4">
                        <h4 class="text-lg font-black text-slate-800">Cargar Logo</h4>
                        <p class="text-sm text-slate-500 font-medium leading-relaxed italic">Sube el logo oficial de tu institución. Se recomienda formato PNG transparente o SVG para mejor calidad.</p>
                        <button (click)="logoInp.click()" class="bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm">
                          Seleccionar Archivo
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Banner Section -->
                  <div class="space-y-4">
                    <label for="bannerUrlInp" class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-2">Imagen Principal / Banner</label>
                    <div class="space-y-6">
                      <div class="relative w-full h-48 rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200 group shadow-sm">
                        <img [src]="bannerPreview()" alt="Banner" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                        <input type="file" id="bannerInp" class="hidden" accept="image/*" #bannerInp (change)="handleFile($event, 'banner')">
                        <div role="button" tabindex="0" (click)="bannerInp.click()" (keydown.enter)="bannerInp.click()" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                           <div class="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-3">
                              <mat-icon class="text-white">photo_camera</mat-icon>
                              <span class="text-white font-black text-[10px] uppercase tracking-widest">Cambiar Banner</span>
                           </div>
                        </div>
                      </div>
                      <div class="space-y-2 px-2">
                        <label for="bannerUrlInp" class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">O inserta una URL personalizada</label>
                        <input type="text" id="bannerUrlInp" [formControl]="generalForm.controls.bannerUrl" 
                          class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                          placeholder="https://images.unsplash.com/...">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- Users Tab -->
            @if (activeTab() === 'users') {
              <div class="p-10 md:p-14 space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <div class="flex items-center justify-between border-b border-slate-50 pb-8">
                  <div>
                    <h3 class="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Comunidad Académica</h3>
                    <p class="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3 italic">Listado total de usuarios registrados</p>
                  </div>
                  <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                     <mat-icon>badge</mat-icon>
                  </div>
                </div>

                <div class="overflow-x-auto -mx-10 md:-mx-14 border border-slate-50">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr class="bg-slate-50/50">
                        <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuario</th>
                        <th class="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Correo</th>
                        <th class="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol</th>
                        <th class="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                      @for (user of auth.allUsers(); track user.id) {
                        <tr class="hover:bg-slate-50/30 transition-colors group">
                          <td class="px-10 py-6">
                            <div class="flex items-center gap-4">
                              <div class="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0">
                                <img [src]="user.avatarUrl" [alt]="user.name" class="w-full h-full object-cover">
                              </div>
                              <input #nameInp type="text" [value]="user.name" 
                                (blur)="updateUser(user.id, { name: nameInp.value })"
                                class="bg-transparent border-none font-black text-slate-800 text-sm focus:ring-0 w-full hover:bg-white rounded px-2 transition-colors">
                            </div>
                          </td>
                          <td class="px-6 py-6">
                            <input #emailInp type="email" [value]="user.email" 
                                (blur)="updateUser(user.id, { email: emailInp.value })"
                                class="bg-transparent border-none font-medium text-slate-500 text-sm focus:ring-0 w-full hover:bg-white rounded px-2 transition-colors">
                          </td>
                          <td class="px-6 py-6 font-black">
                            <select #roleInp [value]="user.role" 
                              (change)="updateUser(user.id, { role: roleInp.value })"
                              class="bg-transparent border-none text-[10px] uppercase font-black tracking-widest text-indigo-600 focus:ring-0 cursor-pointer hover:bg-white rounded px-2 py-1 transition-colors">
                              <option value="student">Estudiante</option>
                              <option value="editor">Editor</option>
                              <option value="admin">Administrador</option>
                              <option value="superadmin">Superadmin</option>
                            </select>
                          </td>
                          <td class="px-10 py-6 text-right">
                             <button (click)="deleteUser(user.id)" class="w-10 h-10 bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all inline-flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <mat-icon class="scale-75">delete</mat-icon>
                             </button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            <!-- Courses Tab -->
            @if (activeTab() === 'courses') {
              <div class="p-10 md:p-14 space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <div class="flex items-center justify-between border-b border-slate-50 pb-8">
                  <div>
                    <h3 class="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none text-indigo-600">Catálogo de Cursos</h3>
                    <p class="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3 italic">Control directo de la oferta educativa</p>
                  </div>
                  <button (click)="addEmptyCourse()" class="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                     <mat-icon>add</mat-icon> Nuevo Curso
                  </button>
                </div>

                <div class="space-y-6">
                  @for (course of courseService.courses(); track course.id) {
                    <div class="group relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 hover:border-indigo-100 transition-all">
                      <div class="flex flex-col md:flex-row gap-8 items-start">
                        <div class="w-full md:w-48 aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0 relative">
                           <img [src]="course.imageUrl" [alt]="course.title" class="w-full h-full object-cover">
                           <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <button class="bg-white/10 text-white p-2 rounded-xl border border-white/20 hover:bg-white/20 transition-all" (click)="editImg(course)">
                               <mat-icon class="scale-75">edit</mat-icon>
                             </button>
                           </div>
                        </div>
                        <div class="flex-1 space-y-4">
                          <input #cTitle type="text" [value]="course.title" 
                            (blur)="updateCourse(course.id, { title: cTitle.value })"
                            class="w-full bg-transparent border-none p-0 font-black text-xl text-slate-900 tracking-tight focus:ring-0">
                          <textarea #cDesc [value]="course.shortDescription" 
                            (blur)="updateCourse(course.id, { shortDescription: cDesc.value })"
                            class="w-full bg-transparent border-none p-0 text-sm text-slate-400 font-medium italic leading-relaxed focus:ring-0 resize-none h-auto"></textarea>
                          
                          <div class="flex items-center gap-6 pt-4 border-t border-slate-50">
                            <div class="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                               <mat-icon class="scale-75">schedule</mat-icon> {{ course.duration }}
                            </div>
                            <div class="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                               <mat-icon class="scale-75">trending_up</mat-icon> {{ course.level }}
                            </div>
                          </div>
                        </div>
                        <button (click)="deleteCourse(course.id)" class="p-4 bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all opacity-0 group-hover:opacity-100">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

          </div>
        </div>
      </div>
    </div>

    <!-- Feedback Toasts -->
    @if (showToast()) {
      <div class="fixed bottom-12 right-12 z-[1000] animate-in fade-in slide-in-from-right-10 duration-500">
        <div class="flex items-center gap-4 bg-slate-900 text-white px-8 py-5 rounded-[2.2rem] shadow-2xl border border-white/10 backdrop-blur-xl">
           <div class="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
             <mat-icon>check_circle</mat-icon>
           </div>
           <div>
             <p class="font-black text-xs uppercase tracking-widest">Sistema Sincronizado</p>
             <p class="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-0.5">{{ toastMsg() }}</p>
           </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .animate-in { animation: animateIn 0.3s ease-out; }
    @keyframes animateIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    input:focus, textarea:focus, select:focus {
      outline: none;
    }
  `]
})
export class SettingsComponent implements OnInit {
  settingsService = inject(AppSettingsService);
  auth = inject(AuthService);
  courseService = inject(CourseService);
  fb = inject(FormBuilder);

  activeTab = signal<'general' | 'visual' | 'users' | 'courses'>('general');
  logoPreview = signal<string | null>(null);
  bannerPreview = signal<string>('');
  showToast = signal(false);
  toastMsg = signal('');

  generalForm = this.fb.group({
    siteName: ['', Validators.required],
    footerDescription: [''],
    contactEmail: ['', Validators.email],
    contactPhone: [''],
    contactAddress: [''],
    bannerUrl: [''],
    theme: this.fb.control<'light' | 'dark'>('light')
  });

  ngOnInit() {
    this.loadCurrentSettings();
    this.auth.refreshUsers(); // Ensure users are loaded
  }

  loadCurrentSettings() {
    const s = this.settingsService.settings();
    this.generalForm.patchValue({
      siteName: s.siteName,
      footerDescription: s.footerDescription,
      contactEmail: s.contactEmail,
      contactPhone: s.contactPhone,
      contactAddress: s.contactAddress,
      bannerUrl: s.bannerUrl,
      theme: s.theme
    });
    this.logoPreview.set(s.siteLogo);
    this.bannerPreview.set(s.bannerUrl);
  }

  handleFile(event: Event, type: 'logo' | 'banner') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (type === 'logo') {
          this.logoPreview.set(result);
        } else {
          this.bannerPreview.set(result);
          this.generalForm.patchValue({ bannerUrl: result });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveAllChanges() {
    if (this.generalForm.valid) {
      const vals = this.generalForm.value;
      const updates: Partial<AppSettings> = {
        siteName: vals.siteName || '',
        footerDescription: vals.footerDescription || '',
        contactEmail: vals.contactEmail || '',
        contactPhone: vals.contactPhone || '',
        contactAddress: vals.contactAddress || '',
        bannerUrl: vals.bannerUrl || '',
        siteLogo: this.logoPreview(),
        theme: vals.theme || 'light'
      };
      this.settingsService.updateSettings(updates);
      this.notify('Información general actualizada');
    }
  }

  resetChanges() {
    this.loadCurrentSettings();
    this.notify('Cambios descartados');
  }

  // Admin User Actions
  updateUser(userId: string, updates: Partial<{name: string, email: string, role: string}>) {
    this.auth.adminUpdateUser(userId, updates as Partial<User>);
    this.notify('Usuario actualizado');
  }

  deleteUser(userId: string) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.auth.deleteUser(userId);
      this.notify('Usuario eliminado');
    }
  }

  // Course Actions
  updateCourse(courseId: string, updates: Partial<Course>) {
    this.courseService.updateCourse(courseId, updates);
    this.notify('Curso actualizado');
  }

  deleteCourse(courseId: string) {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      this.courseService.deleteCourse(courseId);
      this.notify('Curso eliminado');
    }
  }

  addEmptyCourse() {
    const newCourse: Omit<Course, 'id'> = {
      title: 'Nuevo Curso de Excelencia',
      shortDescription: 'Describe brevemente de qué trata este nuevo programa educativo.',
      fullDescription: '',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop',
      duration: '20 horas',
      level: 'Básico',
      learningObjectives: [],
      modules: []
    };
    this.courseService.addCourse(newCourse);
    this.notify('Curso creado');
  }

  editImg(course: Course) {
    const newUrl = prompt('Ingresa la URL de la nueva imagen para el curso:', course.imageUrl);
    if (newUrl && newUrl !== course.imageUrl) {
      this.updateCourse(course.id, { imageUrl: newUrl });
    }
  }

  private notify(msg: string) {
    this.toastMsg.set(msg);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }
}
