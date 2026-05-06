import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Course } from '../models/types';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.client;
  private platformId = inject(PLATFORM_ID);
  
  courses = signal<Course[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCourses();
      this.subscribeToCourses();
    }
  }
  
  private async loadCourses() {
    if (this.supabaseService.isMock()) {
      const mockCourses: Course[] = [
        {
          id: 'c1',
          title: 'Master en Excel Avanzado',
          shortDescription: 'Domina las herramientas analíticas más potentes para el mundo empresarial.',
          fullDescription: 'Un curso completo desde cero hasta nivel experto.',
          imageUrl: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=1740&auto=format&fit=crop',
          duration: '40 horas',
          level: 'Avanzado',
          learningObjectives: ['Tablas Dinámicas', 'Macros VBA', 'Power Query'],
          modules: []
        },
        {
          id: 'c2',
          title: 'Marketing Digital 360',
          shortDescription: 'Estrategias efectivas para posicionar tu marca en el ecosistema digital actual.',
          fullDescription: 'Aprende SEO, SEM, y gestión de redes sociales.',
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
          duration: '30 horas',
          level: 'Intermedio',
          learningObjectives: ['Google Ads', 'Content Strategy', 'Analytics'],
          modules: []
        }
      ];
      this.courses.set(mockCourses);
      return;
    }
    try {
      const { data, error } = await this.supabase
        .from('cursos')
        .select('*, lecciones(*)');
      
      if (data && !error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const loadedCourses: Course[] = (data as unknown[]).map((c: any) => ({
          id: c['id'] as string,
          title: (c['title'] || c['nombre']) as string,
          shortDescription: (c['short_description'] || c['descripcion_corta']) as string,
          fullDescription: (c['full_description'] || c['descripcion_completa']) as string,
          imageUrl: (c['image_url'] || c['imagen_url']) as string,
          duration: (c['duration'] || c['duracion']) as string,
          level: (c['level'] || c['nivel']) as string,
          learningObjectives: (c['learning_objectives'] || c['objetivos'] || []) as string[],
          modules: [{
            id: 'm1',
            title: 'Contenido del Curso',
            lessons: ((c['lecciones'] as Record<string, unknown>[]) || []).map((l: Record<string, unknown>) => ({
              id: l['id'] as string,
              title: (l['title'] || l['nombre']) as string,
              type: (l['type'] || 'video') as 'video' | 'reading' | 'quiz',
              duration: (l['duration'] || '10 min') as string,
              url: l['url'] as string
            }))
          }]
        }));
        this.courses.set(loadedCourses);
      }
    } catch (e) {
      console.error('Failed to load courses from Supabase:', e);
    }
  }

  private subscribeToCourses() {
    if (this.supabaseService.isMock()) return;
    
    try {
      this.supabase
        .channel('public:cursos')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cursos' }, () => {
          this.loadCourses();
        })
        .subscribe();

      this.supabase
        .channel('public:lecciones')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'lecciones' }, () => {
          this.loadCourses();
        })
        .subscribe();
    } catch (e) {
      console.error('Failed to subscribe to courses:', e);
    }
  }

  getCourseById(id: string): Course | undefined {
    return this.courses().find(c => c.id === id);
  }

  async addCourse(course: Omit<Course, 'id'>) {
    if (this.supabaseService.isMock()) {
      const newCourse = { ...course, id: Math.random().toString(36).substr(2, 9) };
      this.courses.update(courses => [...courses, newCourse]);
      return;
    }

    const { error } = await this.supabase
      .from('cursos')
      .insert([{
        title: course.title,
        short_description: course.shortDescription,
        full_description: course.fullDescription,
        image_url: course.imageUrl,
        duration: course.duration,
        level: course.level,
        learning_objectives: course.learningObjectives
      }]);
    
    if (!error) this.loadCourses();
  }

  async updateCourse(id: string, partialCourse: Partial<Course>) {
    if (this.supabaseService.isMock()) {
      this.courses.update(courses => courses.map(c => c.id === id ? { ...c, ...partialCourse } : c));
      return;
    }

    const updates: Record<string, unknown> = {};
    if (partialCourse.title) updates['title'] = partialCourse.title;
    if (partialCourse.shortDescription) updates['short_description'] = partialCourse.shortDescription;
    if (partialCourse.fullDescription) updates['full_description'] = partialCourse.fullDescription;
    if (partialCourse.imageUrl) updates['image_url'] = partialCourse.imageUrl;
    
    const { error } = await this.supabase
      .from('cursos')
      .update(updates)
      .eq('id', id);
    
    if (!error) this.loadCourses();
  }

  async deleteCourse(id: string) {
    if (this.supabaseService.isMock()) {
      this.courses.update(courses => courses.filter(c => c.id !== id));
      return;
    }

    const { error } = await this.supabase
      .from('cursos')
      .delete()
      .eq('id', id);
    
    if (!error) this.loadCourses();
  }
}
