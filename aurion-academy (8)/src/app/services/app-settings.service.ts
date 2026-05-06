import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AppSettings {
  siteName: string;
  siteLogo: string | null;
  bannerUrl: string;
  aboutUsText: string;
  aboutUsImageUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  footerDescription: string;
  theme: 'light' | 'dark';
}

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  private platformId = inject(PLATFORM_ID);

  private readonly defaultSettings: AppSettings = {
    siteName: 'AURION ACADEMY',
    siteLogo: null,
    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
    aboutUsText: 'Somos una institución educativa comprometida con la excelencia y el desarrollo profesional continuo.',
    aboutUsImageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1470&auto=format&fit=crop',
    contactEmail: 'info@pva.edu.do',
    contactPhone: '+1 (829) 451-2000',
    contactAddress: 'Av. 27 de Febrero #200, El Dorado, Santiago de los Caballeros, RD',
    footerDescription: 'Formando el futuro de la educación profesional.',
    theme: 'light'
  };

  settings = signal<AppSettings>(this.defaultSettings);

  constructor() {
    this.loadSettings();
  }

  // Accessors for convenience
  siteName = () => this.settings().siteName;
  siteLogo = () => this.settings().siteLogo;
  bannerUrl = () => this.settings().bannerUrl;
  aboutUsText = () => this.settings().aboutUsText;
  aboutUsImageUrl = () => this.settings().aboutUsImageUrl;
  contactEmail = () => this.settings().contactEmail;
  contactPhone = () => this.settings().contactPhone;
  contactAddress = () => this.settings().contactAddress;
  footerDescription = () => this.settings().footerDescription;

  theme = () => this.settings().theme;

  private loadSettings() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('aurion_settings');
      if (stored) {
        this.settings.set({ ...this.defaultSettings, ...JSON.parse(stored) });
      }
      this.applyTheme(this.settings().theme);
    }
  }

  updateSettings(newSettings: Partial<AppSettings>) {
    const updated = { ...this.settings(), ...newSettings };
    this.settings.set(updated);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('aurion_settings', JSON.stringify(updated));
      this.applyTheme(updated.theme);
    }
  }

  private applyTheme(theme: string) {
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    } else {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    }
  }
}

