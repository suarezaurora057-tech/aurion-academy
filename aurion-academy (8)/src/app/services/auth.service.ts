import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/types';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.client;
  private platformId = inject(PLATFORM_ID);
 
  currentUser = signal<User | null>(null);
  allUsers = signal<User[]>([]);
 
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAuth();
    }
  }
 
  private async initAuth() {
    if (this.supabaseService.isMock()) {
      console.info('Aurion Academy: Operando en modo demostración (sin backend).');
      this.loadMockUsers();
      // Auto-login default admin in mock mode if needed
      const admin = this.allUsers().find(u => u.email === 'admin@gmail.com');
      if (admin) this.currentUser.set(admin);
      return;
    }
 
    try {
      // Check current session
      const { data: { session } } = await this.supabase.auth.getSession();
      if (session?.user) {
        this.loadUserProfile(session.user.id);
      }
 
      // Listen for auth changes
      this.supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          this.loadUserProfile(session.user.id);
        } else {
          this.currentUser.set(null);
        }
      });
 
      this.refreshUsers();
      this.subscribeToUsers();
    } catch (e) {
      console.error('Failed to initialize Supabase Auth:', e);
    }
  }

  private loadMockUsers() {
    const mocks: User[] = [
      { 
        id: 'mock-admin-001', 
        name: 'Administrador Aurion', 
        email: 'admin@gmail.com', 
        role: 'admin', 
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 
        enrolledCourses: [] 
      },
      { id: 'u1', name: 'Juan Pérez', email: 'juan@example.com', role: 'student', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=juan', enrolledCourses: [] },
      { id: 'u2', name: 'María García', email: 'maria@example.com', role: 'editor', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria', enrolledCourses: [] }
    ];
    this.allUsers.set(mocks);
  }

  private async loadUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*, inscripciones(*)')
      .eq('id', userId)
      .single();

    if (data && !error) {
      const user: User = {
        id: data.id,
        name: data.name || data.nombre, // Handle potential naming differences
        email: data.email,
        role: data.role || 'student',
        avatarUrl: data.avatar_url || `https://picsum.photos/seed/${data.email}/200/200`,
        enrolledCourses: (data.inscripciones || []).map((ins: Record<string, unknown>) => ({
          courseId: (ins['course_id'] || ins['id_curso']) as string,
          progress: (ins['progress'] || 0) as number,
          grade: (ins['grade'] || 0) as number,
          enrollmentDate: (ins['enrollment_date'] || ins['fecha_inscripcion']) as string,
          completedLessons: (ins['completed_lessons'] || []) as string[]
        }))
      };
      this.currentUser.set(user);
    }
  }

  async login(email: string, pass: string): Promise<{ success: boolean, error?: string }> {
    if (this.supabaseService.isMock()) {
      if (email === 'admin@gmail.com' && pass === 'admin123') {
        const admin = this.allUsers().find(u => u.email === email);
        if (admin) this.currentUser.set(admin);
        return { success: true };
      }
      const user = this.allUsers().find(u => u.email === email);
      if (user) {
        this.currentUser.set(user);
        return { success: true };
      }
      return { success: false, error: 'Credenciales inválidas en modo demo.' };
    }

    try {
      const { error } = await this.supabase.auth.signInWithPassword({
        email,
        password: pass
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: unknown) {
      const error = e as Error;
      return { success: false, error: error.message || 'Error inesperado al iniciar sesión' };
    }
  }

  async register(name: string, email: string, pass: string, courseId?: string): Promise<{ success: boolean, error?: string }> {
    if (this.supabaseService.isMock()) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: 'student',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        enrolledCourses: []
      };
      this.allUsers.update(users => [...users, newUser]);
      this.currentUser.set(newUser);
      if (courseId) await this.enroll(courseId, newUser.id);
      return { success: true };
    }

    try {
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: name }
        }
      });

      if (authError) return { success: false, error: authError.message };
      if (!authData.user) return { success: false, error: 'No se pudo crear el usuario.' };

      // Create record in usuarios table
      const { error: dbError } = await this.supabase
        .from('usuarios')
        .insert([{
          id: authData.user.id,
          name: name,
          email: email,
          role: 'student',
          created_at: new Date().toISOString()
        }]);

      if (dbError) return { success: false, error: 'Error al crear perfil de usuario: ' + dbError.message };

      if (courseId) {
        await this.enroll(courseId, authData.user.id);
      }

      return { success: true };
    } catch (e: unknown) {
      const error = e as Error;
      return { success: false, error: error.message || 'Error inesperado en el registro' };
    }
  }

  async recoverPassword(email: string): Promise<boolean> {
    if (this.supabaseService.isMock()) return true;
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return !error;
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.currentUser.set(null);
  }

  async enroll(courseId: string, userIdArg?: string) {
    const userId = userIdArg || this.currentUser()?.id;
    if (!userId) return;

    const { error } = await this.supabase
      .from('inscripciones')
      .insert([{
        usuario_id: userId,
        curso_id: courseId,
        progress: 0,
        grade: 0,
        fecha_inscripcion: new Date().toISOString()
      }]);

    if (!error) {
      this.loadUserProfile(userId);
    }
  }

  async updateProgress(courseId: string, progress: number, grade: number) {
    const user = this.currentUser();
    if (!user) return;

    const { error } = await this.supabase
      .from('inscripciones')
      .update({ progress, grade })
      .eq('usuario_id', user.id)
      .eq('curso_id', courseId);

    if (!error) {
      this.loadUserProfile(user.id);
      
      // Auto-certificate check
      if (progress >= 100) {
        this.generateCertificate(courseId, user.id);
      }
    }
  }

  private async generateCertificate(courseId: string, userId: string) {
    const { error } = await this.supabase
      .from('certificados')
      .insert([{
        usuario_id: userId,
        curso_id: courseId,
        fecha_emision: new Date().toISOString(),
        url: `certificados/${userId}_${courseId}.pdf`
      }]);
    
    if (error) console.error('Error creating certificate:', error);
  }

  async toggleLessonCompletion(courseId: string, lessonId: string) {
    const user = this.currentUser();
    if (!user) return;

    const enroll = user.enrolledCourses.find(c => c.courseId === courseId);
    if (!enroll) return;

    const completed = new Set(enroll.completedLessons || []);
    if (completed.has(lessonId)) {
      completed.delete(lessonId);
    } else {
      completed.add(lessonId);
    }

    const { error } = await this.supabase
      .from('inscripciones')
      .update({ completed_lessons: Array.from(completed) })
      .eq('usuario_id', user.id)
      .eq('curso_id', courseId);

    if (!error) {
      this.loadUserProfile(user.id);
    }
  }

  async refreshUsers() {
    if (this.supabaseService.isMock()) return;
    try {
      const { data } = await this.supabase
        .from('usuarios')
        .select('*');
      
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const users: User[] = (data as unknown[]).map((d: any) => ({
          id: d['id'] as string,
          name: (d['name'] || d['nombre']) as string,
          email: d['email'] as string,
          role: (d['role'] || 'student') as 'student' | 'admin' | 'superadmin' | 'editor',
          avatarUrl: (d['avatar_url'] || `https://picsum.photos/seed/${d['email']}/200/200`) as string,
          enrolledCourses: [] // Load these separately if needed
        }));
        this.allUsers.set(users);
      }
    } catch (e) {
      console.error('Failed to refresh users:', e);
    }
  }

  async adminUpdateUser(userId: string, updates: Partial<User>) {
    if (this.supabaseService.isMock()) {
      this.allUsers.update(users => users.map(u => u.id === userId ? { ...u, ...updates } : u));
      if (this.currentUser()?.id === userId) {
        this.currentUser.update(u => u ? { ...u, ...updates } : null);
      }
      return;
    }

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name) dbUpdates['name'] = updates.name;
    if (updates.email) dbUpdates['email'] = updates.email;
    if (updates.role) dbUpdates['role'] = updates.role;

    const { error } = await this.supabase
      .from('usuarios')
      .update(dbUpdates)
      .eq('id', userId);

    if (!error) {
      if (this.currentUser()?.id === userId) {
        this.loadUserProfile(userId);
      }
      this.refreshUsers();
    }
  }

  async deleteUser(userId: string) {
    if (this.supabaseService.isMock()) {
      this.allUsers.update(users => users.filter(u => u.id !== userId));
      return;
    }

    const { error } = await this.supabase
      .from('usuarios')
      .delete()
      .eq('id', userId);
    
    if (!error) this.refreshUsers();
  }

  async updateAvatar(newAvatarUrl: string) {
    const user = this.currentUser();
    if (!user) return;
    
    const { error } = await this.supabase
      .from('usuarios')
      .update({ avatar_url: newAvatarUrl })
      .eq('id', user.id);
    
    if (!error) this.loadUserProfile(user.id);
  }

  async updateUserInfo(updates: Partial<User>) {
    const user = this.currentUser();
    if (!user) return;

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name) dbUpdates['name'] = updates.name;
    if (updates.phone) dbUpdates['phone'] = updates.phone;
    if (updates.address) dbUpdates['address'] = updates.address;
    if (updates.bio) dbUpdates['bio'] = updates.bio;

    const { error } = await this.supabase
      .from('usuarios')
      .update(dbUpdates)
      .eq('id', user.id);

    if (!error) this.loadUserProfile(user.id);
  }

  async saveQuizGrade(courseId: string, lessonId: string, grade: number) {
    const user = this.currentUser();
    if (!user) return;

    const enroll = user.enrolledCourses.find(c => c.courseId === courseId);
    if (!enroll) return;

    const quizGrades = { ...(enroll.quizGrades || {}) };
    quizGrades[lessonId] = grade;

    const completed = new Set(enroll.completedLessons || []);
    completed.add(lessonId);

    const { error } = await this.supabase
      .from('inscripciones')
      .update({ 
        quiz_grades: quizGrades,
        completed_lessons: Array.from(completed)
      })
      .eq('usuario_id', user.id)
      .eq('curso_id', courseId);

    if (!error) this.loadUserProfile(user.id);
  }

  async setAllUsers(users: User[]) {
    // This is for admin batch updates. We can update locally or refresh.
    if (this.supabaseService.isMock()) {
      this.allUsers.set(users);
      return;
    }
    this.refreshUsers();
  }

  private subscribeToUsers() {
    if (this.supabaseService.isMock()) return;
    try {
      this.supabase
        .channel('public:usuarios')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'usuarios' }, () => {
          this.refreshUsers();
        })
        .subscribe();
    } catch (e) {
      console.error('Failed to subscribe to users:', e);
    }
  }
}
