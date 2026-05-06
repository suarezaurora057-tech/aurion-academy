export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz';
  duration: string;
  url?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  duration: string;
  level: string;
  learningObjectives: string[];
  modules: CourseModule[];
  certificateUrl?: string; // Configurable certificate path
  certificateTemplate?: string; // 'default' | 'modern' | 'classic'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'admin' | 'superadmin' | 'editor';
  status?: 'active' | 'blocked';
  createdAt?: string;
  avatarUrl: string;
  enrolledCourses: EnrolledCourse[];
  certificates?: string[];
  phone?: string;
  address?: string;
  dob?: string;
  bio?: string;
  learningPreferences?: string;
  ipAddress?: string;
  activityLog?: { date: string; action: string; details?: string }[];
}

export interface EnrolledCourse {
  courseId: string;
  progress: number; // 0 to 100
  grade: number;
  enrollmentDate: string;
  completedLessons: string[];
  quizGrades?: Record<string, number>;
  certificateTemplateId?: 'red' | 'blue' | 'green';
}
