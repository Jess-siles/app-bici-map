import { Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
   @ViewChild('map') mapRef!: ElementRef;
  private map!: L.Map;
  private drawnItems!: L.FeatureGroup;

  ngAfterViewInit() {
    setTimeout(() => {
      // MAPA
      this.map = L.map(this.mapRef.nativeElement, {
        zoomControl: true
      }).setView([-31.432, -64.192], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

      // CAPA DIBUJOS
      this.drawnItems = new L.FeatureGroup();
      this.map.addLayer(this.drawnItems);

      // DRAW CONTROLS ← AHORA SÍ APARECEN
      const drawControl = new (<any>L.Control.Draw)({
        position: 'topleft',
        draw: {
          polyline: {
            shapeOptions: {
              color: '#FF6B35',
              weight: 8,
              opacity: 0.9
            }
          },
          polygon: false,
          circle: false,
          rectangle: false,
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: this.drawnItems
        }
      });
      
      this.map.addControl(drawControl);
      
      // FUERZA REDIMENSIONAMIENTO ← ELIMINA CUADROS
      this.map.invalidateSize();
      
      // EVENTOS DRAW
      this.map.on('draw:created', (e: any) => {
        const layer = e.layer;
        this.drawnItems.addLayer(layer);
        console.log('✅ RUTA BICI:', JSON.stringify(layer.toGeoJSON()));
      });
    }, 500); // Más tiempo
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
