import { Component, Input, computed, inject } from '@angular/core';
import { DatePipe, NgStyle } from '@angular/common';
import { AppSettingsService } from '../services/app-settings.service';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [DatePipe, NgStyle],
  template: `
    <div id="certificate-inner-container" 
         class="relative w-full aspect-[1.414/1] flex flex-col items-center justify-center p-8 md:p-12 text-center overflow-hidden"
         [ngStyle]="themeStyles()"
         style="color: #1e293b; border: 1px solid #e2e8f0; background-color: #ffffff; box-shadow: none; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
       
       <!-- Border Overlay -->
       <div class="absolute inset-4 border-2 pointer-events-none" [ngStyle]="borderStyles()" style="border-style: solid; position: absolute; top: 1rem; bottom: 1rem; left: 1rem; right: 1rem; pointer-events: none; border-width: 2px;"></div>
       <div class="absolute inset-5 border pointer-events-none" [ngStyle]="borderStyles()" style="border-style: solid; position: absolute; top: 1.25rem; bottom: 1.25rem; left: 1.25rem; right: 1.25rem; pointer-events: none; border-width: 1px;"></div>
 
       <!-- Watermark/Logo -->
       <div class="absolute top-12 flex flex-col items-center opacity-80" [ngStyle]="textStyles()" style="position: absolute; top: 3rem; display: flex; flex-direction: column; align-items: center; opacity: 0.8;">
          @if (settings.siteLogo()) {
            <img [src]="settings.siteLogo()" alt="Logo" class="max-h-16 mb-2 object-contain" style="max-height: 4rem; margin-bottom: 0.5rem; object-fit: contain; opacity: 0.8; filter: grayscale(100%);" />
          }
          <span class="font-bold tracking-widest text-xs uppercase" style="font-family: sans-serif; font-weight: bold; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;">{{ settings.siteName() }}</span>
       </div>
 
       <div class="z-10 mt-16 flex flex-col items-center justify-center w-full" style="z-index: 10; margin-top: 4rem; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
          <h1 class="text-4xl md:text-5xl mb-4 uppercase tracking-wider" [ngStyle]="headerStyles()" style="font-family: serif; font-size: 2.5rem; margin-bottom: 1rem; text-transform: uppercase;">Certificado de Finalización</h1>
          <p class="text-sm md:text-base mb-6 italic" style="color: #64748b; font-family: serif; font-size: 1rem; margin-bottom: 1.5rem; font-style: italic;">El presente documento certifica que</p>
          
          <h2 class="text-3xl md:text-4xl font-bold mb-6" style="color: #0f172a; font-family: sans-serif; font-size: 2.25rem; font-weight: bold; margin-bottom: 1.5rem;">{{ studentName }}</h2>
          
          <p class="text-sm md:text-base mb-6 max-w-2xl text-balance" style="color: #64748b; font-family: serif; font-size: 1rem; margin-bottom: 1.5rem; max-width: 42rem;">
            ha completado satisfactoriamente los requisitos académicos, demostrando excelencia y dominio en el curso:
          </p>
          
          <h3 class="text-2xl md:text-3xl font-bold mb-12" style="color: #1e293b; font-family: sans-serif; font-size: 1.875rem; font-weight: bold; margin-bottom: 3rem;">{{ courseName }}</h3>
          
          <div class="flex w-full px-12 md:px-24 justify-between items-end mt-auto pt-8 relative" style="display: flex; width: 100%; justify-content: space-between; align-items: flex-end; margin-top: auto; padding-top: 2rem; position: relative;">
             <div class="flex flex-col items-center text-center" style="display: flex; flex-direction: column; align-items: center; text-align: center;">
                <div class="w-40 border-b mb-2" style="border-bottom: 1px solid #94a3b8; width: 10rem; margin-bottom: 0.5rem;"></div>
                <p class="text-xs uppercase tracking-wider font-bold" style="color: #64748b; font-family: sans-serif; font-size: 0.75rem; font-weight: bold; text-transform: uppercase;">Fecha de Emisión</p>
                <p class="text-sm font-bold" style="color: #1e293b; font-family: sans-serif; font-size: 0.875rem; font-weight: bold;">{{ currentDate | date:'longDate':'':'es' }}</p>
             </div>
             
             <!-- Optional signature or stamp -->
             <div class="absolute inset-x-0 bottom-0 flex justify-center -mb-8 opacity-20 pointer-events-none" style="position: absolute; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; margin-bottom: -2rem; opacity: 0.2; pointer-events: none;">
               <div class="w-32 h-32 rounded-full border-4 flex items-center justify-center rotate-[-15deg]" [ngStyle]="borderStyles()" style="border-style: solid; width: 8rem; height: 8rem; border-radius: 9999px; border-width: 4px; display: flex; align-items: center; justify-content: center; transform: rotate(-15deg);">
                 <span class="font-bold text-lg uppercase text-center leading-tight" [ngStyle]="textStyles()" style="font-family: sans-serif; font-weight: bold; font-size: 1.125rem; text-transform: uppercase; line-height: 1.25; text-align: center;">Sello<br>Oficial</span>
               </div>
             </div>
 
             <div class="flex flex-col items-center text-center z-10 px-2 rounded" style="z-index: 10; padding-left: 0.5rem; padding-right: 0.5rem; border-radius: 0.5rem; background-color: rgba(255, 255, 255, 0.7); backdrop-filter: blur(4px); display: flex; flex-direction: column; align-items: center; text-align: center;">
                <div class="w-40 border-b mb-2 flex justify-center pb-2" style="border-bottom: 1px solid #94a3b8; width: 10rem; margin-bottom: 0.5rem; display: flex; justify-content: center; padding-bottom: 0.5rem;">
                  <span class="italic text-2xl" [ngStyle]="textStyles()" style="font-family: serif; font-size: 1.5rem; font-style: italic;">Dirección</span>
                </div>
                <p class="text-xs uppercase tracking-wider font-bold" style="color: #64748b; font-family: sans-serif; font-size: 0.75rem; font-weight: bold; text-transform: uppercase;">Director Académico</p>
                <p class="text-sm font-bold" style="color: #1e293b; font-family: sans-serif; font-size: 0.875rem; font-weight: bold;">{{ settings.siteName() }}</p>
             </div>
          </div>
         
         <div class="absolute bottom-4 left-6 text-[10px]" style="position: absolute; bottom: 1rem; left: 1.5rem; color: #94a3b8; font-family: monospace; font-size: 10px;">
            ID: {{ certificateId }}
         </div>
       </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class CertificateComponent {
  settings = inject(AppSettingsService);
  
  @Input() templateId = 'blue';
  @Input() studentName = '';
  @Input() courseName = '';
  
  currentDate = new Date();
  certificateId = Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + new Date().getFullYear();

  themeStyles = computed(() => {
    switch (this.templateId) {
      case 'red': return { 'background-color': '#fff1f2', 'border-color': '#fecdd3' };
      case 'blue': return { 'background-color': '#f8fafc', 'border-color': '#bfdbfe' };
      case 'green': return { 'background-color': '#fafaf9', 'border-color': '#a7f3d0' };
      default: return { 'background-color': '#ffffff', 'border-color': '#e4e4e7' };
    }
  });

  borderStyles = computed(() => {
    switch (this.templateId) {
      case 'red': return { 'border-color': 'rgba(159, 18, 57, 0.3)' };
      case 'blue': return { 'border-color': 'rgba(30, 58, 138, 0.3)' };
      case 'green': return { 'border-color': 'rgba(6, 78, 59, 0.3)' };
      default: return { 'border-color': 'rgba(39, 39, 42, 0.3)' };
    }
  });

  headerStyles = computed(() => {
    switch (this.templateId) {
      case 'red': return { 'color': '#881337' };
      case 'blue': return { 'color': '#1e3a8a' };
      case 'green': return { 'color': '#064e3b' };
      default: return { 'color': '#18181b' };
    }
  });

  textStyles = computed(() => {
    switch (this.templateId) {
      case 'red': return { 'color': '#be123c' };
      case 'blue': return { 'color': '#1d4ed8' };
      case 'green': return { 'color': '#047857' };
      default: return { 'color': '#3f3f46' };
    }
  });
}
