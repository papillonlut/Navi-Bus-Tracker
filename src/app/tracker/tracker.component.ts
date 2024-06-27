import { Component, OnInit, HostListener } from '@angular/core';
import * as data from '../../../../history.json';

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
    const lat = parseFloat(urlParams.get('lat') || '47.30321423088468');
    const lng = parseFloat(urlParams.get('lng') || '5.052337646484376');
    const zoom = parseInt(urlParams.get('zoom') || '12', 10);

    this.map = L.map('map').setView([lat, lng], zoom);
    console.log('Map initialized:', this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);
    this.addMarkers(L);

    // Écouteurs d'événements pour détecter les changements de vue de carte
    this.map.on('moveend', () => {
      this.updateUrlWithMapView();
    });

    // Écouteur pour détecter les changements de niveau de zoom
    this.map.on('zoomend', () => {
      this.updateMarkers(L);
    });

    // Initialiser les paramètres d'URL après 3 secondes
    setTimeout(() => {
      this.updateUrlWithMapView();
    }, 3000);
  }

  private addMarkers(L: any): void {
    try {
      const markers = (data as any).default;
  
      if (!Array.isArray(markers)) {
        console.error('Markers data is not an array:', markers);
        return;
      }
  
      markers.forEach((marker: any) => {
        const lat = marker.latitude;
        const long = marker.longitude;
        const tripId = marker.id;
        const timestamp = marker.timestamp;
        const headsign = marker.headsign;
        const line = marker.line;
        const color = marker.color;
        const img = marker.img;
  
        if (lat !== undefined && long !== undefined) {
          const leafletMarker = L.circleMarker([lat, long], {radius: this.getRadius()});
          leafletMarker.setStyle({fillOpacity: 0.5, color: color});
          leafletMarker.bindPopup(`${img} ${line} | ${headsign}<br>ID: ${tripId}<br>${timestamp}`);
          this.markerLayer.addLayer(leafletMarker);
          this.addSvgMarker(L, [lat, long], img);
        } else {
          console.warn('Marker has undefined coordinates:', marker);
        }
      });
    } catch (error) {
      console.error('Error adding markers:', error);
    }
  }

  private addSvgMarker(L: any, position: [number, number], svgContent: string): void {
    const svgIcon = L.divIcon({
      html: svgContent,
      className: '',
      iconSize: [this.getRadius(), this.getRadius()],
      iconAnchor: [20, 20]
    });
    L.marker(position, { icon: svgIcon }).addTo(this.markerLayer);
  }

  private updateMarkers(L: any): void {
    this.markerLayer.clearLayers();
    this.addMarkers(L);
  }

  private getRadius(): number {
    const zoom = this.map.getZoom();

    switch (zoom) {
      case 12:
        return 5;
      case 13:
        return 6;
      case 14:
        return 7;
      case 15:
        return 8;
      case 16:
        return 9;
      case 17:
        return 10;
      case 18:
        return 11;
      default:
        return 4;
    }
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