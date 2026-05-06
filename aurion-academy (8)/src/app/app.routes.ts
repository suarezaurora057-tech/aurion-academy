import {Routes} from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.currentUser()) {
    return true;
  }
  return router.parseUrl('/login');
};

const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.currentUser()?.role === 'admin') {
    return true;
  }
  return router.parseUrl('/');
};

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent) },
  { path: 'about', loadComponent: () => import('./pages/about.component').then(m => m.AboutComponent) },
  { path: 'courses', loadComponent: () => import('./pages/courses.component').then(m => m.CoursesComponent) },
  { path: 'courses/:id', loadComponent: () => import('./pages/course-detail.component').then(m => m.CourseDetailComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact.component').then(m => m.ContactComponent) },
  { path: 'help', loadComponent: () => import('./pages/help-center.component').then(m => m.HelpCenterComponent) },
  { path: 'certifications', loadComponent: () => import('./pages/certifications-info.component').then(m => m.CertificationsInfoComponent) },
  { path: 'job-board', loadComponent: () => import('./pages/job-board.component').then(m => m.JobBoardComponent) },
  { path: 'terms', loadComponent: () => import('./pages/legal.component').then(m => m.TermsComponent) },
  { path: 'privacy', loadComponent: () => import('./pages/legal.component').then(m => m.PrivacyComponent) },
  { path: 'cookies', loadComponent: () => import('./pages/legal.component').then(m => m.CookiesComponent) },
  { path: 'login', loadComponent: () => import('./pages/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register.component').then(m => m.RegisterComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'settings', loadComponent: () => import('./pages/settings.component').then(m => m.SettingsComponent), canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
