import { Component, OnInit } from '@angular/core';
import * as data from '../../../history.json';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {

  private map: any;
  private markerLayer: any;

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
    // Récupérer les paramètres de vue depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const lat = parseFloat(urlParams.get('lat') || '47.3220');
    const lng = parseFloat(urlParams.get('lng') || '5.0446');
    const zoom = parseInt(urlParams.get('zoom') || '13', 10);

    this.map = L.map('map').setView([lat, lng], zoom);
    console.log('Map initialized:', this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);
    this.addMarkers(L);

    // Écouteurs d'événements pour détecter les changements de vue de carte
    this.map.on('moveend', () => {
      this.updateUrlWithMapView();
    });

    // Initialiser les paramètres d'URL après 3 secondes
    setTimeout(() => {
      this.updateUrlWithMapView();
    }, 3000);
  }

  private addMarkers(L: any): void {
    const markers = (data as any).default;

    markers.forEach((marker: any) => {
      const lat = marker.latitude;
      const long = marker.longitude;
      const tripId = marker.id;
      const timestamp = marker.timestamp;
      const headsign = marker.headsign;

      if (lat !== undefined && long !== undefined) {
        const leafletMarker = L.marker([lat, long]);
        leafletMarker.bindPopup(`ID: ${tripId}<br>${headsign}<br>${timestamp}`);
        this.markerLayer.addLayer(leafletMarker);
      } else {
        console.warn('Marker has undefined coordinates:', marker);
      }
    });
  }

  private updateUrlWithMapView(): void {
    if (this.map) {
      const center = this.map.getCenter();
      const zoom = this.map.getZoom();

      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('lat', center.lat.toString());
      urlParams.set('lng', center.lng.toString());
      urlParams.set('zoom', zoom.toString());

      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, '', newUrl);

      console.log('URL updated with map view:', newUrl);
    }
  }
}
