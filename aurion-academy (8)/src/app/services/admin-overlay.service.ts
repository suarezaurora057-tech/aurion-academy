import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminOverlayService {
  isOpen = signal(false);
  
  toggle() {
    this.isOpen.set(!this.isOpen());
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }
}
