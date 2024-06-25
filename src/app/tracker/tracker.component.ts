import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {

  private map: any; // Utilisation de `any` pour éviter les problèmes de type

  constructor() { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.loadLeaflet();
    }
  }

  private async loadLeaflet() {
    const L = await import('leaflet');
    setTimeout(() => { // Ajoutez un délai pour s'assurer que le DOM est prêt
      this.initMap(L);
    }, 0);
  }

  private initMap(L: any): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }
}