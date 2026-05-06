import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CourseService } from '../services/course.service';
import { AuthService } from '../services/auth.service';
import { Course, Lesson } from '../models/types';
import { MatIconModule } from '@angular/material/icon';
import { CertificateComponent } from './certificate.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [RouterLink, MatIconModule, CertificateComponent],
  template: `
    @if (course()) {
      <div class="bg-white min-h-screen">
        <!-- Header -->
        <div class="bg-black text-white py-16 md:py-24 relative overflow-hidden">
          <div class="absolute inset-0 opacity-20">
            <img [src]="course()?.imageUrl" alt="Background" class="w-full h-full object-cover blur-sm" referrerpolicy="no-referrer">
          </div>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="flex flex-col md:flex-row gap-8 items-center">
              <div class="w-full md:w-2/3">
                <!-- Botón para volver atrás dinámicamente -->
                <button (click)="goBack()" class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full mb-6 transition-all text-sm font-medium backdrop-blur-sm border border-white/10 cursor-pointer shadow-lg hover:shadow-xl">
                  <mat-icon class="text-[18px] w-[18px] h-[18px]">arrow_back</mat-icon> Volver atrás
                </button>
                
                <div class="flex gap-3 mb-4">
                  <span class="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                    {{ course()?.level }}
                  </span>
                  <span class="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <mat-icon class="text-[14px] w-[14px] h-[14px]">schedule</mat-icon> {{ course()?.duration }}
                  </span>
                </div>
                <h1 class="text-4xl md:text-5xl font-extrabold mb-4">{{ course()?.title }}</h1>
                <p class="text-xl text-gray-300 leading-relaxed">{{ course()?.shortDescription }}</p>
              </div>
              
              <div class="w-full md:w-1/3">
                <div class="bg-white rounded-2xl p-6 shadow-2xl text-zinc-900">
                  <img [src]="course()?.imageUrl" [alt]="course()?.title" class="w-full h-48 object-cover rounded-xl mb-6" referrerpolicy="no-referrer">
                  
                  @if (!isEnrolled()) {
                    <button (click)="enroll()" class="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg mb-3 flex items-center justify-center gap-2">
                      <mat-icon>school</mat-icon> Inscribirme Ahora
                    </button>
                    <p class="text-xs text-center text-zinc-500">Inscripción gratuita para estudiantes de Aurion Academy.</p>
                  } @else {
                    <button disabled class="w-full bg-zinc-200 text-zinc-500 px-4 py-4 rounded-xl font-bold text-lg cursor-not-allowed mb-3 flex items-center justify-center gap-2">
                      <mat-icon>check_circle</mat-icon> Ya estás inscrito
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div class="md:col-span-2">
              @if (!isEnrolled()) {
                <!-- Tabs Header -->
                <div class="flex gap-8 border-b border-zinc-200 mb-8">
                  <button 
                    (click)="activeTab.set('overview')"
                    [class.border-purple-600]="activeTab() === 'overview'"
                    [class.text-purple-600]="activeTab() === 'overview'"
                    [class.border-transparent]="activeTab() !== 'overview'"
                    [class.text-zinc-500]="activeTab() !== 'overview'"
                    class="pb-4 font-bold text-lg border-b-2 hover:text-purple-600 transition-colors">
                    Descripción general
                  </button>
                  <button 
                    (click)="activeTab.set('curriculum')"
                    [class.border-purple-600]="activeTab() === 'curriculum'"
                    [class.text-purple-600]="activeTab() === 'curriculum'"
                    [class.border-transparent]="activeTab() !== 'curriculum'"
                    [class.text-zinc-500]="activeTab() !== 'curriculum'"
                    class="pb-4 font-bold text-lg border-b-2 hover:text-purple-600 transition-colors">
                    Plan de estudios
                  </button>
                </div>
              }

              <!-- Tab Content: Overview -->
              @if (activeTab() === 'overview' || isEnrolled()) {
                <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
                  <section class="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
                    <h2 class="text-2xl font-bold text-zinc-900 mb-4">Acerca de este curso (Descripción)</h2>
                    <p class="text-zinc-600 leading-relaxed text-lg">{{ course()?.fullDescription }}</p>
                  </section>

                  @if (course()?.learningObjectives?.length) {
                    <section class="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
                      <h2 class="text-2xl font-bold text-zinc-900 mb-6">Esto es lo que aprenderá</h2>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        @for (objective of course()?.learningObjectives; track $index) {
                          <div class="flex items-start gap-3">
                            <mat-icon class="text-green-500 shrink-0 bg-green-50 rounded-full p-1 w-8 h-8 flex items-center justify-center text-[18px]">check</mat-icon>
                            <span class="text-zinc-700 leading-relaxed">{{ objective }}</span>
                          </div>
                        }
                      </div>
                    </section>
                  }
                </div>
              }

              <!-- Tab Content: Curriculum -->
              @if (activeTab() === 'curriculum' || isEnrolled()) {
                <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
                  
                  <h2 class="text-2xl font-bold text-zinc-900 mb-6">Plan de Estudios</h2>
                  


                  <div class="space-y-4">
                    @for (module of course()?.modules; track module.id; let i = $index) {
                      <div class="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm transition-all">
                        <!-- Module Header -->
                        <button 
                          (click)="toggleModule(module.id, i)"
                          class="w-full flex items-center justify-between p-5 transition-colors text-left"
                          [class.opacity-50]="isModuleLocked(i)"
                          [class.cursor-not-allowed]="isModuleLocked(i)"
                          [class.hover:bg-zinc-50]="!isModuleLocked(i)">
                          <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0"
                                 [class.bg-purple-100]="!isModuleLocked(i)" [class.text-purple-700]="!isModuleLocked(i)"
                                 [class.bg-zinc-200]="isModuleLocked(i)" [class.text-zinc-500]="isModuleLocked(i)">
                              {{ i + 1 }}
                            </div>
                            <div>
                              <h3 class="font-bold text-zinc-900 text-lg flex items-center gap-2">
                                {{ module.title }}
                                @if (isModuleLocked(i)) {
                                  <mat-icon class="text-zinc-400 text-[18px] w-[18px] h-[18px]">lock</mat-icon>
                                }
                              </h3>
                              <p class="text-zinc-500 text-sm">{{ module.lessons.length }} lecciones</p>
                            </div>
                          </div>
                          @if (!isModuleLocked(i)) {
                            <mat-icon class="text-zinc-400 transition-transform duration-300" 
                                      [class.rotate-180]="expandedModules().has(module.id)">
                              expand_more
                            </mat-icon>
                          }
                        </button>

                        <!-- Module Lessons -->
                        @if (expandedModules().has(module.id) && !isModuleLocked(i)) {
                          <div class="border-t border-zinc-100 bg-zinc-50/50">
                            @for (lesson of module.lessons; track lesson.id) {
                              <div 
                                (click)="playLesson(lesson, i)"
                                (keydown.enter)="playLesson(lesson, i)"
                                tabindex="0"
                                class="flex items-center justify-between p-4 pl-16 border-b border-zinc-100 last:border-0 hover:bg-zinc-100 transition-colors cursor-pointer group">
                                <div class="flex items-center gap-4">
                                  <!-- Completion Status Icon -->
                                  <div 
                                    class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                                    [class.border-green-500]="isLessonCompleted(lesson.id)"
                                    [class.bg-green-500]="isLessonCompleted(lesson.id)"
                                    [class.border-zinc-300]="!isLessonCompleted(lesson.id)">
                                    @if (isLessonCompleted(lesson.id)) {
                                      <mat-icon class="text-white text-[16px] w-[16px] h-[16px]">check</mat-icon>
                                    }
                                  </div>
                                  
                                  <!-- Lesson Info -->
                                  <div>
                                    <p class="font-medium text-zinc-900 group-hover:text-purple-700 transition-colors">
                                      {{ lesson.title }}
                                    </p>
                                    <div class="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                                      @if (lesson.type === 'video') {
                                        <mat-icon class="text-[14px] w-[14px] h-[14px]">play_circle</mat-icon> Videotutorial
                                      } @else if (lesson.type === 'reading') {
                                        <mat-icon class="text-[14px] w-[14px] h-[14px]">article</mat-icon> Lectura
                                      } @else {
                                        <mat-icon class="text-[14px] w-[14px] h-[14px]">quiz</mat-icon> Cuestionario
                                      }
                                      <span>•</span>
                                      <span>{{ lesson.duration }}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                @if (lesson.type === 'video' && isEnrolled()) {
                                  <mat-icon class="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">play_arrow</mat-icon>
                                } @else if (!isEnrolled()) {
                                  <mat-icon class="text-zinc-300">lock</mat-icon>
                                }
                              </div>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <div class="md:col-span-1">
              <div class="sticky top-24 space-y-8">
                @if (isEnrolled()) {
                  <div class="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
                    <h3 class="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                      <mat-icon class="text-purple-600">analytics</mat-icon> Evaluación Académica
                    </h3>
                    
                    @if (getEvaluationState(); as eval) {
                      <div class="space-y-6">
                      <!-- Promedio Final -->
                      <div class="text-center p-4 rounded-xl" 
                           [class.bg-green-50]="eval.isApproved" 
                           [class.bg-red-50]="!eval.isApproved && eval.examsTaken === eval.totalQuizzes"
                           [class.bg-zinc-50]="eval.examsTaken < eval.totalQuizzes">
                        <p class="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Promedio Final</p>
                        <div class="text-4xl font-black mb-1"
                             [class.text-green-600]="eval.isApproved"
                             [class.text-red-600]="!eval.isApproved && eval.examsTaken === eval.totalQuizzes"
                             [class.text-zinc-900]="eval.examsTaken < eval.totalQuizzes">
                          {{ eval.finalAverage }}/100
                        </div>
                        <p class="font-bold text-sm"
                           [class.text-green-600]="eval.isApproved"
                           [class.text-red-600]="!eval.isApproved && eval.examsTaken === eval.totalQuizzes"
                           [class.text-zinc-500]="eval.examsTaken < eval.totalQuizzes">
                          @if (eval.examsTaken < eval.totalQuizzes) {
                            En curso
                          } @else if (eval.isApproved) {
                            ¡Aprobado!
                          } @else {
                            Reprobado
                          }
                        </p>
                      </div>

                      <!-- Progress Bar -->
                      <div class="space-y-2 py-2">
                        <div class="flex justify-between text-sm">
                          <span class="text-zinc-600 font-medium">Progreso del curso</span>
                          <span class="font-bold text-purple-600">{{ eval.completionScore }}%</span>
                        </div>
                        <div class="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                          <div class="bg-purple-600 h-2.5 rounded-full transition-all duration-500" [style.width.%]="eval.completionScore"></div>
                        </div>
                        <p class="text-xs text-zinc-500 pt-1">
                          Completa el 100% y aprueba las evaluaciones para tu certificado.
                        </p>
                      </div>

                      <!-- Desglose -->
                      <div class="space-y-3 pt-3 border-t border-zinc-100">
                        <div class="flex justify-between text-sm">
                          <span class="text-zinc-600">Progreso de lecciones (30%)</span>
                          <span class="font-bold text-zinc-900">{{ eval.completionScore }}%</span>
                        </div>
                        <div class="flex justify-between text-sm">
                          <span class="text-zinc-600">Promedio exámenes (70%)</span>
                          <span class="font-bold text-zinc-900">{{ eval.examScore }}/100</span>
                        </div>
                      </div>

                      <!-- Lista de Exámenes -->
                      @if (eval.totalQuizzes > 0) {
                        <div class="border-t border-zinc-100 pt-4">
                          <h4 class="text-sm font-bold text-zinc-900 mb-3">Calificaciones de Exámenes</h4>
                          <ul class="space-y-2">
                            @for (exam of eval.examDetails; track exam.title) {
                              <li class="flex justify-between items-center text-sm">
                                <span class="text-zinc-600 truncate pr-2" [title]="exam.title">{{ exam.title }}</span>
                                @if (exam.grade !== null) {
                                  <span class="font-bold px-2 py-0.5 rounded text-xs"
                                        [class.bg-green-100]="exam.grade >= 70" [class.text-green-700]="exam.grade >= 70"
                                        [class.bg-red-100]="exam.grade < 70" [class.text-red-700]="exam.grade < 70">
                                    {{ exam.grade }}
                                  </span>
                                } @else {
                                  <span class="text-zinc-400 text-xs font-medium bg-zinc-100 px-2 py-0.5 rounded">Pdte.</span>
                                }
                              </li>
                            }
                          </ul>
                          @if (!eval.allExamsPassed && eval.examsTaken === eval.totalQuizzes) {
                            <p class="text-xs text-red-600 mt-3 bg-red-50 p-2 rounded border border-red-100">
                              * Debes obtener al menos 70 en todos los exámenes para aprobar.
                            </p>
                          }
                        </div>
                      }
                      
                      @if (eval.isApproved && eval.completionScore === 100) {
                        <div class="border-t border-zinc-100 pt-4">
                           <div class="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                             <div class="flex items-center gap-3 mb-3">
                               <div class="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-inner">
                                 <mat-icon>workspace_premium</mat-icon>
                               </div>
                               <div>
                                 <h4 class="text-amber-900 font-bold leading-tight">¡Curso Completado!</h4>
                                 <p class="text-amber-700 text-xs">Felicidades por tu logro</p>
                               </div>
                             </div>
                             <button (click)="showCertificate.set(true)" class="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-sm text-sm mb-2">
                               <mat-icon class="text-[18px] w-[18px] h-[18px]">visibility</mat-icon> Ver Mi Certificado
                             </button>
                           </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              }

                <div class="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
                  <h3 class="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <mat-icon class="text-purple-600">info</mat-icon> Detalles Técnicos
                  </h3>
                  
                  <ul class="space-y-4">
                    <li class="flex items-center gap-3 text-zinc-700">
                      <div class="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-purple-600">
                        <mat-icon>schedule</mat-icon>
                      </div>
                      <div>
                        <p class="text-xs text-zinc-500 font-semibold uppercase">Duración</p>
                        <p class="font-medium">{{ course()?.duration }}</p>
                      </div>
                    </li>
                    <li class="flex items-center gap-3 text-zinc-700">
                      <div class="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-purple-600">
                        <mat-icon>trending_up</mat-icon>
                      </div>
                      <div>
                        <p class="text-xs text-zinc-500 font-semibold uppercase">Nivel</p>
                        <p class="font-medium">{{ course()?.level }}</p>
                      </div>
                    </li>
                    <li class="flex items-center gap-3 text-zinc-700">
                      <div class="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-purple-600">
                        <mat-icon>workspace_premium</mat-icon>
                      </div>
                      <div>
                        <p class="text-xs text-zinc-500 font-semibold uppercase">Certificación</p>
                        <p class="font-medium">Incluida al finalizar</p>
                      </div>
                    </li>
                    <li class="flex items-center gap-3 text-zinc-700">
                      <div class="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-purple-600">
                        <mat-icon>devices</mat-icon>
                      </div>
                      <div>
                        <p class="text-xs text-zinc-500 font-semibold uppercase">Modalidad</p>
                        <p class="font-medium">100% Virtual</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Content Overlay / Modal -->
      @if (selectedLesson()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <!-- Backdrop -->
          <div 
            class="absolute inset-0 bg-zinc-900/90 backdrop-blur-sm transition-opacity"
            tabindex="0"
            (keyup.enter)="closeModalIfAllowed()"
            (click)="closeModalIfAllowed()">
          </div>
          
          <!-- Modal Container -->
          <div class="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50 shrink-0">
              <h3 class="font-bold text-lg text-zinc-900 flex items-center gap-2">
                @if (selectedLesson()?.type === 'video') {
                  <mat-icon class="text-blue-600">play_circle</mat-icon>
                } @else if (selectedLesson()?.type === 'reading') {
                  <mat-icon class="text-orange-600">article</mat-icon>
                } @else {
                  <mat-icon class="text-purple-600">quiz</mat-icon>
                }
                {{ selectedLesson()?.title }}
              </h3>
              @if (selectedLesson()?.type !== 'quiz') {
                <button (click)="closeLessonModal()" class="text-zinc-400 hover:text-zinc-900 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-200">
                  <mat-icon>close</mat-icon>
                </button>
              }
            </div>
            
            <!-- Body -->
            <div class="flex-1 overflow-y-auto">
              @if (selectedLesson()?.type === 'video') {
                <div class="w-full aspect-video bg-black">
                  <video controls autoplay class="w-full h-full object-contain" [src]="selectedLesson()?.url" (ended)="onVideoEnded()">
                  </video>
                </div>
              } @else if (selectedLesson()?.type === 'reading') {
                <div class="p-8 md:p-12 prose prose-zinc max-w-none text-center py-20 flex flex-col items-center justify-center h-full">
                  <div class="w-24 h-24 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-6 border border-orange-100 shadow-sm">
                    <mat-icon class="text-5xl w-12 h-12">menu_book</mat-icon>
                  </div>
                  <h2 class="text-2xl font-bold mb-3 text-zinc-900">Material de Lectura</h2>
                  <p class="text-zinc-500 mb-8 max-w-md">Has abierto este documento. Tu progreso se ha registrado automáticamente en el sistema.</p>
                  @if (hasNextLesson()) {
                    <button (click)="goToNextLesson()" class="bg-zinc-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-lg flex items-center gap-2">
                      Siguiente Lección <mat-icon>arrow_forward</mat-icon>
                    </button>
                  } @else {
                    <button (click)="closeLessonModal()" class="bg-zinc-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-lg flex items-center gap-2">
                      Volver al Curso <mat-icon>close</mat-icon>
                    </button>
                  }
                </div>
              } @else if (selectedLesson()?.type === 'quiz') {
                 <!-- Quiz interface -->
                 <div class="p-6 md:p-10">
                   @if (getQuizGrade(selectedLesson()!.id) !== undefined) {
                      <!-- Results -->
                      <div class="text-center py-12 flex flex-col items-center justify-center">
                        <div class="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                             [class.bg-green-50]="getQuizGrade(selectedLesson()!.id)! >= 70"
                             [class.bg-red-50]="getQuizGrade(selectedLesson()!.id)! < 70">
                          <mat-icon class="text-4xl w-10 h-10"
                                    [class.text-green-600]="getQuizGrade(selectedLesson()!.id)! >= 70" 
                                    [class.text-red-600]="getQuizGrade(selectedLesson()!.id)! < 70">
                            {{ getQuizGrade(selectedLesson()!.id)! >= 70 ? 'check_circle' : 'cancel' }}
                          </mat-icon>
                        </div>
                        <div class="text-7xl font-black mb-4 tracking-tighter" [class.text-green-600]="getQuizGrade(selectedLesson()!.id)! >= 70" [class.text-red-600]="getQuizGrade(selectedLesson()!.id)! < 70">
                          {{ getQuizGrade(selectedLesson()!.id) }}<span class="text-4xl text-zinc-300">/100</span>
                        </div>
                        <p class="text-2xl font-bold mb-10" [class.text-green-600]="getQuizGrade(selectedLesson()!.id)! >= 70" [class.text-red-600]="getQuizGrade(selectedLesson()!.id)! < 70">
                          {{ getQuizGrade(selectedLesson()!.id)! >= 70 ? '¡Módulo Aprobado!' : 'No Aprobado' }}
                        </p>
                        
                        @if (hasNextLesson() && getQuizGrade(selectedLesson()!.id)! >= 70) {
                          <button (click)="goToNextLesson()" class="bg-zinc-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-lg flex items-center gap-2">
                            Siguiente Módulo <mat-icon>arrow_forward</mat-icon>
                          </button>
                        } @else {
                          <button (click)="closeLessonModal()" class="bg-zinc-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-lg flex items-center gap-2">
                            Volver al curso
                          </button>
                        }
                      </div>
                   } @else {
                     <!-- Real simple quiz -->
                     <div class="max-w-2xl mx-auto py-6">
                       <div class="mb-8">
                         <h4 class="text-2xl font-extrabold text-zinc-900 mb-2">Evaluación del Módulo</h4>
                         <p class="text-zinc-500">Responde las siguientes preguntas de repaso para poder avanzar.</p>
                       </div>
                       
                       <div class="space-y-6 mb-10">
                         <div class="bg-zinc-50 p-6 md:p-8 rounded-3xl border border-zinc-100">
                           <p class="font-bold text-zinc-900 mb-5 text-lg">1. ¿Has comprendido los conceptos principales explicados en las lecciones anteriores?</p>
                           <div class="space-y-3">
                             <button (click)="setQuizAnswer('q1', 'yes')"
                                     class="w-full flex items-center gap-4 p-4 bg-white border-2 rounded-2xl transition-all text-left group"
                                     [class.border-purple-600]="quizAnswers().q1 === 'yes'"
                                     [class.border-zinc-200]="quizAnswers().q1 !== 'yes'">
                               <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                                    [class.border-purple-600]="quizAnswers().q1 === 'yes'"
                                    [class.border-zinc-300]="quizAnswers().q1 !== 'yes'">
                                 @if (quizAnswers().q1 === 'yes') { <div class="w-3 h-3 bg-purple-600 rounded-full"></div> }
                               </div>
                               <span class="font-medium text-zinc-700 group-hover:text-zinc-900">Sí, completamente.</span>
                             </button>
                             <button (click)="setQuizAnswer('q1', 'no')"
                                     class="w-full flex items-center gap-4 p-4 bg-white border-2 rounded-2xl transition-all text-left group"
                                     [class.border-purple-600]="quizAnswers().q1 === 'no'"
                                     [class.border-zinc-200]="quizAnswers().q1 !== 'no'">
                               <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                                    [class.border-purple-600]="quizAnswers().q1 === 'no'"
                                    [class.border-zinc-300]="quizAnswers().q1 !== 'no'">
                                 @if (quizAnswers().q1 === 'no') { <div class="w-3 h-3 bg-purple-600 rounded-full"></div> }
                               </div>
                               <span class="font-medium text-zinc-700 group-hover:text-zinc-900">Aún tengo algunas dudas.</span>
                             </button>
                           </div>
                         </div>
                         
                         <div class="bg-zinc-50 p-6 md:p-8 rounded-3xl border border-zinc-100">
                           <p class="font-bold text-zinc-900 mb-5 text-lg">2. ¿Sientes que estás listo para avanzar al siguiente tema del curso?</p>
                           <div class="space-y-3">
                             <button (click)="setQuizAnswer('q2', 'yes')"
                                     class="w-full flex items-center gap-4 p-4 bg-white border-2 rounded-2xl transition-all text-left group"
                                     [class.border-purple-600]="quizAnswers().q2 === 'yes'"
                                     [class.border-zinc-200]="quizAnswers().q2 !== 'yes'">
                               <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                                    [class.border-purple-600]="quizAnswers().q2 === 'yes'"
                                    [class.border-zinc-300]="quizAnswers().q2 !== 'yes'">
                                 @if (quizAnswers().q2 === 'yes') { <div class="w-3 h-3 bg-purple-600 rounded-full"></div> }
                               </div>
                               <span class="font-medium text-zinc-700 group-hover:text-zinc-900">Sí, estoy listo para avanzar.</span>
                             </button>
                             <button (click)="setQuizAnswer('q2', 'no')"
                                     class="w-full flex items-center gap-4 p-4 bg-white border-2 rounded-2xl transition-all text-left group"
                                     [class.border-purple-600]="quizAnswers().q2 === 'no'"
                                     [class.border-zinc-200]="quizAnswers().q2 !== 'no'">
                               <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                                    [class.border-purple-600]="quizAnswers().q2 === 'no'"
                                    [class.border-zinc-300]="quizAnswers().q2 !== 'no'">
                                 @if (quizAnswers().q2 === 'no') { <div class="w-3 h-3 bg-purple-600 rounded-full"></div> }
                               </div>
                               <span class="font-medium text-zinc-700 group-hover:text-zinc-900">Necesito repasar el material.</span>
                             </button>
                           </div>
                         </div>
                       </div>
                       
                       <div class="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                         <button (click)="closeLessonModal()" class="px-6 py-3.5 font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors">
                           Cancelar
                         </button>
                         <button (click)="submitQuiz()" [disabled]="!quizAnswers().q1 || !quizAnswers().q2" class="px-8 py-3.5 font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg flex items-center gap-2">
                           Entregar Respuestas <mat-icon class="text-[20px] w-[20px] h-[20px]">send</mat-icon>
                         </button>
                       </div>
                     </div>
                   }
                 </div>
              }
            </div>
            
            <!-- Modal Navigation -->
            <div class="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-zinc-100 bg-zinc-50 shrink-0 gap-4">
              <button 
                [disabled]="!hasPreviousLesson()"
                (click)="goToPreviousLesson()"
                class="flex items-center gap-2 px-6 py-2.5 font-bold text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto justify-center">
                <mat-icon>chevron_left</mat-icon> Anterior
              </button>
              
              <div class="flex items-center gap-4">
                <div class="text-sm font-medium text-zinc-500">
                  Lección {{ currentLessonIndex() + 1 }} de {{ flatLessons().length }}
                </div>
                <!-- Manual toggle marker -->
                @if (selectedLesson() && selectedLesson()?.type !== 'quiz') {
                  <button (click)="toggleCurrentLessonCompletion()" class="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all border"
                          [class.bg-green-50]="isLessonCompleted(selectedLesson()!.id)"
                          [class.text-green-700]="isLessonCompleted(selectedLesson()!.id)"
                          [class.border-green-200]="isLessonCompleted(selectedLesson()!.id)"
                          [class.bg-zinc-100]="!isLessonCompleted(selectedLesson()!.id)"
                          [class.text-zinc-500]="!isLessonCompleted(selectedLesson()!.id)"
                          [class.border-zinc-200]="!isLessonCompleted(selectedLesson()!.id)">
                    <mat-icon class="text-[14px] w-[14px] h-[14px]">{{ isLessonCompleted(selectedLesson()!.id) ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon> 
                    {{ isLessonCompleted(selectedLesson()!.id) ? 'Completada' : 'Marcar como completada' }}
                  </button>
                }
              </div>

              <button 
                [disabled]="!hasNextLesson()"
                (click)="goToNextLesson()"
                class="flex items-center gap-2 px-6 py-2.5 font-bold text-zinc-700 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto justify-center">
                Siguiente <mat-icon>chevron_right</mat-icon>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modals for Certificates -->
      @if (showCertificate()) {
        <div class="fixed inset-0 z-[120] flex items-center justify-center p-4 print:p-0 print:bg-white bg-zinc-900/90 backdrop-blur-sm transition-opacity">
          <div class="absolute inset-0 print:hidden" tabindex="0" (keyup.enter)="showCertificate.set(false)" (click)="showCertificate.set(false)"></div>
          <div class="relative w-full max-w-5xl bg-white shadow-2xl flex flex-col p-8 print:p-0 print:shadow-none min-h-[50vh] rounded-3xl animate-in zoom-in-95 print:animate-none">
             
             <div class="flex justify-between items-center mb-6 print:hidden border-b border-zinc-100 pb-4">
                <h3 class="text-2xl font-bold text-zinc-900">Tu Certificado</h3>
                <div class="flex gap-2">
                  <button (click)="printCertificate()" class="text-zinc-600 hover:text-amber-600 bg-zinc-100 hover:bg-amber-50 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <mat-icon>print</mat-icon> Imprimir / Guardar PDF
                  </button>
                  <button (click)="showCertificate.set(false)" class="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 w-10 h-10 flex items-center justify-center rounded-full transition-colors"><mat-icon>close</mat-icon></button>
                </div>
             </div>
             
             <div class="overflow-x-auto print:overflow-visible flex justify-center pb-8 border-b-8 border-transparent">
               <div class="min-w-[800px] print:min-w-0 print:w-full">
                 <app-certificate [templateId]="course()?.certificateTemplate || 'default'" [studentName]="authService.currentUser()?.name || ''" [courseName]="course()?.title || ''"></app-certificate>
               </div>
             </div>
          </div>
        </div>
      }

    } @else {
      <div class="min-h-screen flex items-center justify-center bg-zinc-50">
        <div class="text-center">
          <mat-icon class="text-6xl text-zinc-300 mb-4">error_outline</mat-icon>
          <h2 class="text-2xl font-bold text-zinc-700">Curso no encontrado</h2>
          <a routerLink="/courses" class="text-purple-600 hover:underline mt-4 inline-block">Volver a los cursos</a>
        </div>
      </div>
    }
  `
})
export class CourseDetailComponent implements OnInit {
  // Inyección de dependencias (Servicios de Angular)
  route = inject(ActivatedRoute); // Para obtener parámetros de la URL
  router = inject(Router); // Para navegar entre páginas
  location = inject(Location); // Para navegar hacia atrás en el historial
  courseService = inject(CourseService); // Para obtener datos de los cursos
  authService = inject(AuthService); // Para manejar la sesión del usuario
  
  // Estado del componente usando Signals (Reactividad de Angular)
  course = signal<Course | undefined>(undefined);
  isEnrolled = signal<boolean>(false);
  activeTab = signal<'overview' | 'curriculum'>('overview');
  expandedModules = signal<Set<string>>(new Set());
  selectedLesson = signal<Lesson | null>(null);

  showCertificate = signal(false);

  // Método que se ejecuta al iniciar el componente
  ngOnInit() {
    // Obtener el ID del curso desde la URL (ej. /courses/c1 -> id = 'c1')
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Buscar el curso en el servicio
      const found = this.courseService.getCourseById(id);
      this.course.set(found);
      // Verificar si el usuario actual está inscrito en este curso
      this.checkEnrollment();
      
      // Expandir el primer módulo por defecto si existen
      if (found?.modules?.length) {
        this.expandedModules.set(new Set([found.modules[0].id]));
      }
    }
  }

  // Navegar a la página anterior
  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/courses']);
    }
  }

  // Verifica si el usuario logueado tiene este curso en su lista de inscritos
  checkEnrollment() {
    const user = this.authService.currentUser();
    const currentCourse = this.course();
    if (user && currentCourse) {
      const enrolled = user.enrolledCourses.some(c => c.courseId === currentCourse.id);
      this.isEnrolled.set(enrolled);
    } else {
      this.isEnrolled.set(false);
    }
  }

  // Lógica para inscribirse en el curso
  enroll() {
    // Si no hay usuario logueado, redirigir al registro/login
    if (!this.authService.currentUser()) {
      this.router.navigate(['/register'], { queryParams: { courseId: this.course()?.id } });
      return;
    }
    
    // Si el curso existe, inscribir al usuario usando el servicio de autenticación
    if (this.course()) {
      this.authService.enroll(this.course()!.id);
      this.checkEnrollment(); // Actualizar el estado para mostrar los videos
    }
  }

  // Alternar la expansión de un módulo en el acordeón
  toggleModule(moduleId: string, moduleIndex: number) {
    if (this.isModuleLocked(moduleIndex)) {
      return;
    }
    const current = new Set(this.expandedModules());
    if (current.has(moduleId)) {
      current.delete(moduleId);
    } else {
      current.add(moduleId);
    }
    this.expandedModules.set(current);
  }

  isModuleLocked(moduleIndex: number): boolean {
    if (!this.isEnrolled()) return false;
    if (moduleIndex === 0) return false;
    
    const previousModule = this.course()?.modules[moduleIndex - 1];
    if (!previousModule) return false;
    
    const previousQuiz = previousModule.lessons.find(l => l.type === 'quiz');
    if (!previousQuiz) return false;
    
    const grade = this.getQuizGrade(previousQuiz.id);
    return grade === undefined || grade < 70;
  }

  // Reproducir una lección (si es video y el usuario está inscrito)
  playLesson(lesson: Lesson, moduleIndex: number) {
    if (!this.isEnrolled() || this.isModuleLocked(moduleIndex)) {
      return;
    }
    this.selectedLesson.set(lesson);
    if (lesson.type === 'quiz') {
      this.quizAnswers.set({ q1: '', q2: '' });
    } else if (lesson.type === 'reading') {
      this.markLessonComplete(lesson.id);
    }
  }

  // Navegación entre lecciones
  flatLessons = computed(() => {
    const course = this.course();
    if (!course) return [];
    
    // Forzamos reactividad ante cambios en el usuario (como progreso o calificaciones terminadas)
    this.authService.currentUser();
    
    const lessons: { lesson: Lesson; moduleIndex: number; isLocked: boolean }[] = [];
    course.modules.forEach((module, mIndex) => {
      const locked = this.isModuleLocked(mIndex);
      module.lessons.forEach(lesson => {
        lessons.push({ lesson, moduleIndex: mIndex, isLocked: locked });
      });
    });
    return lessons;
  });

  currentLessonIndex = computed(() => {
    const lesson = this.selectedLesson();
    if (!lesson) return -1;
    return this.flatLessons().findIndex((fl: { lesson: Lesson; moduleIndex: number; isLocked: boolean }) => fl.lesson.id === lesson.id);
  });

  hasPreviousLesson = computed(() => {
    return this.currentLessonIndex() > 0;
  });

  hasNextLesson = computed(() => {
    const idx = this.currentLessonIndex();
    if (idx === -1) return false;
    const next = this.flatLessons()[idx + 1];
    return !!next && !next.isLocked;
  });

  goToPreviousLesson() {
    if (this.hasPreviousLesson()) {
      const prev = this.flatLessons()[this.currentLessonIndex() - 1];
      this.playLesson(prev.lesson, prev.moduleIndex);
    }
  }

  goToNextLesson() {
    const currentLesson = this.selectedLesson();
    if (currentLesson && currentLesson.type === 'video') {
      this.markLessonComplete(currentLesson.id);
    }
    
    if (this.hasNextLesson()) {
      const next = this.flatLessons()[this.currentLessonIndex() + 1];
      this.playLesson(next.lesson, next.moduleIndex);
    }
  }

  quizAnswers = signal({ q1: '', q2: '' });

  setQuizAnswer(q: 'q1'|'q2', val: string) {
    this.quizAnswers.update(a => ({ ...a, [q]: val }));
  }

  closeLessonModal() {
    this.selectedLesson.set(null);
  }

  closeModalIfAllowed() {
    if (this.selectedLesson()?.type !== 'quiz') {
      this.closeLessonModal();
    }
  }

  onVideoEnded() {
    const lesson = this.selectedLesson();
    if (lesson && lesson.type === 'video') {
      this.markLessonComplete(lesson.id);
    }
  }

  toggleCurrentLessonCompletion() {
    const lessonId = this.selectedLesson()?.id;
    if (lessonId) {
      this.authService.toggleLessonCompletion(this.course()!.id, lessonId);
      this.updateCourseProgress();
    }
  }

  markLessonComplete(lessonId: string) {
    if (!this.isLessonCompleted(lessonId)) {
      this.authService.toggleLessonCompletion(this.course()!.id, lessonId);
      this.updateCourseProgress();
    }
  }

  // Verificar si una lección está completada
  isLessonCompleted(lessonId: string): boolean {
    const user = this.authService.currentUser();
    if (!user || !this.course()) return false;
    
    const enrollment = user.enrolledCourses.find(c => c.courseId === this.course()!.id);
    if (!enrollment || !enrollment.completedLessons) return false;
    
    return enrollment.completedLessons.includes(lessonId);
  }

  getEnrollment() {
    const user = this.authService.currentUser();
    if (!user || !this.course()) return null;
    return user.enrolledCourses.find(c => c.courseId === this.course()!.id);
  }

  getQuizGrade(lessonId: string): number | undefined {
    const enrollment = this.getEnrollment();
    return enrollment?.quizGrades?.[lessonId];
  }

  submitQuiz() {
    const lessonId = this.selectedLesson()?.id;
    if (!lessonId) return;
    // Simple mock logic: user clicked "Entregar Examen" after selecting answers -> automagically award 100/100
    this.authService.saveQuizGrade(this.course()!.id, lessonId, 100);
    this.updateCourseProgress();
  }

  updateCourseProgress() {
    const course = this.course();
    const user = this.authService.currentUser();
    if (!course || !user) return;

    const enrollment = user.enrolledCourses.find(c => c.courseId === course.id);
    if (!enrollment) return;

    let totalLessons = 0;
    let totalQuizzes = 0;
    const quizIds: string[] = [];

    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        totalLessons++;
        if (l.type === 'quiz') {
          totalQuizzes++;
          quizIds.push(l.id);
        }
      });
    });

    const completedCount = enrollment.completedLessons?.length || 0;
    const completionScore = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

    const quizGrades = enrollment.quizGrades || {};
    let sumGrades = 0;
    let examsTaken = 0;

    quizIds.forEach(qId => {
      if (quizGrades[qId] !== undefined) {
        examsTaken++;
        sumGrades += quizGrades[qId];
      }
    });

    const examScore = examsTaken > 0 ? sumGrades / examsTaken : 0;
    
    let finalAverage = 0;
    if (totalQuizzes > 0) {
      finalAverage = (examScore * 0.7) + (completionScore * 0.3);
    } else {
      finalAverage = completionScore;
    }

    const progress = Math.round(completionScore);
    const grade = Math.round(finalAverage);
    const oldProgress = enrollment.progress;

    this.authService.updateProgress(course.id, progress, grade);
    
    // Automatically trigger certificate dialog when reaching 100%
    if (oldProgress < 100 && progress === 100) {
       this.showCertificate.set(true);
    }
  }

  printCertificate() {
    window.print();
  }

  getEvaluationState() {
    const course = this.course();
    const user = this.authService.currentUser();
    if (!course || !user) return null;

    const enrollment = user.enrolledCourses.find(c => c.courseId === course.id);
    if (!enrollment) return null;

    let totalLessons = 0;
    let totalQuizzes = 0;
    const quizIds: string[] = [];

    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        totalLessons++;
        if (l.type === 'quiz') {
          totalQuizzes++;
          quizIds.push(l.id);
        }
      });
    });

    const completedCount = enrollment.completedLessons?.length || 0;
    const completionScore = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

    const quizGrades = enrollment.quizGrades || {};
    let sumGrades = 0;
    let allExamsPassed = true;
    let examsTaken = 0;
    const examDetails: {title: string, grade: number | null}[] = [];

    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        if (l.type === 'quiz') {
          const grade = quizGrades[l.id];
          if (grade !== undefined) {
            examsTaken++;
            sumGrades += grade;
            if (grade < 70) allExamsPassed = false;
            examDetails.push({ title: l.title, grade });
          } else {
            allExamsPassed = false;
            examDetails.push({ title: l.title, grade: null });
          }
        }
      });
    });

    const examScore = examsTaken > 0 ? sumGrades / examsTaken : 0;
    
    let finalAverage = 0;
    if (totalQuizzes > 0) {
      finalAverage = (examScore * 0.7) + (completionScore * 0.3);
    } else {
      finalAverage = completionScore;
    }

    const isApproved = finalAverage >= 70 && allExamsPassed && examsTaken === totalQuizzes;

    return {
      completionScore: Math.round(completionScore),
      examScore: Math.round(examScore),
      finalAverage: Math.round(finalAverage),
      isApproved,
      allExamsPassed,
      examsTaken,
      totalQuizzes,
      examDetails,
      enrollment
    };
  }
}
