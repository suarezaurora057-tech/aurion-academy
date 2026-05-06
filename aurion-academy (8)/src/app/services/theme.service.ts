import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  
  // Signal to track the current theme
  darkMode = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Load saved theme from localStorage
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      this.darkMode.set(savedTheme === 'dark' || (!savedTheme && prefersDark));

      // Effect to apply changes whenever the signal changes
      effect(() => {
        const isDark = this.darkMode();
        if (isDark) {
          document.body.classList.add('theme-dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.body.classList.remove('theme-dark');
          localStorage.setItem('theme', 'light');
        }
      });
    }
  }

  toggleTheme() {
    this.darkMode.update(val => !val);
  }
}
