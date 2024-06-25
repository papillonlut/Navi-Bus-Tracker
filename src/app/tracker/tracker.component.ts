import { Component, OnInit } from '@angular/core';
import * as data from '../../../history.json';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {

  private map: any;

  constructor() { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.loadLeaflet();
    }
  }

  private async loadLeaflet() {
    const L = await import('leaflet');
    console.log('Leaflet library loaded successfully:', L);

    setTimeout(() => {
      this.initMap(L);
    }, 0);
  }

  private initMap(L: any): void {
    this.map = L.map('map').setView([47.3220, 5.0446], 13);
    console.log('Map initialized:', this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.addMarkers(L);
  }

  private addMarkers(L: any): void {
    const markers = (data as any).default;

    markers.forEach((marker: any) => {
      const lat = marker.trip.latitude;
      const long = marker.trip.longitude;
      const tripId = marker.trip.trip_id;
      const speed = marker.trip.speed;

      if (lat !== undefined && long !== undefined) {
        const leafletMarker = L.marker([lat, long]).addTo(this.map);
        leafletMarker.bindPopup(`Trip ID: ${tripId}<br>Speed: ${speed}`);
      } else {
        console.warn('Marker has undefined coordinates:', marker);
      }
    });
  }
}