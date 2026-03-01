import { Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  map: any = L.Map;
  userMarker: any = L.Layer;
  rutaCoords: any = [];
  ngAfterViewInit() {
    this.iniciarGPSLive() ;
    this.map = L.map('map').setView([-31.4201, -64.1888], 13); // Córdoba
    // TOUCH MOBILE PERFECTO
    L.control.scale().addTo(this.map);  // Barra escala
    this.map.touchZoom.enable();        // Zoom dedos
    this.map.doubleClickZoom.disable(); // Evita zoom doble accidental
    // Espera DOM listo
    setTimeout(() => {

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(this.map);

      // Marker Jessica bici
      // L.marker([-31.4201, -64.1888])
      //   .addTo(this.map)
      //   .bindPopup('🚴‍♀️ Jessica aquí')
      //   .openPopup();
    }, 100);

    // DENTRO de ngAfterViewInit(), DESPUÉS del marker estático
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const speed = position.coords.speed ?? 0;

          console.log(lat);
          console.log(lng);
          console.log(speed);

          // Mueve mapa a TU ubicación REAL
          this.map.setView([lat, lng], 16);

          // Borra marker anterior
          if (this.userMarker) {
            this.map.removeLayer(this.userMarker);
          }

          // NUEVO marker "TÚ AQUÍ" (rojo pulsante)
          this.userMarker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: 'gps-marker',
              html: '🚴‍♀️',
              iconSize: [30, 30]
            })
          })
            .addTo(this.map)
            // .bindPopup(`Jessica LIVE<br>Vel: ${(speed * 3.6)?.toFixed(1) || 0} km/h`)
            .openPopup();


          // Guarda coords anteriores
          this.rutaCoords.push([lat, lng]);
          if (this.rutaCoords.length > 1) {
            L.polyline(this.rutaCoords, { color: 'red' }).addTo(this.map);
          }


          console.log(`GPS LIVE: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        },
        (error) => {
          // Fallback Córdoba si falla
          this.map.setView([-31.4201, -64.1888], 13);
        },
        {
          enableHighAccuracy: true,  // Preciso para bici
          timeout: 1500,           // 1.5s máx espera
          maximumAge: 1000         // NUEVO cada 1s (rápido para bici)
        }
      );
    }
  }



  iniciarGPSLive() {
  if (!navigator.geolocation) {
    console.error('GPS no soportado');
    return;
  }

  // ANDROID: Pide permiso explícito PRIMERO
  navigator.permissions.query({name: 'geolocation'}).then(permission => {
    if (permission.state === 'granted') {
      this.startWatching();
    } else if (permission.state === 'prompt') {
      // Pide permiso YA
      navigator.geolocation.getCurrentPosition(
        () => this.startWatching(),
        () => console.log('Permiso denegado Android'),
        {timeout: 10000}
      );
    }
  });
}

startWatching() {
  navigator.geolocation.watchPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      if (this.map) {
        this.map.setView([lat, lng], 16);
        // Marker sigue ANDROID
        if (this.userMarker) this.map.removeLayer(this.userMarker);
        this.userMarker = L.marker([lat, lng])
          .addTo(this.map)
          .bindPopup(`🚴‍♀️ LIVE ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
          .openPopup();
      }
    },
    (error) => {
      console.log('Android GPS delay:', error.message); // NO fallback
    },
    {
        enableHighAccuracy: false,
        timeout: 10000,  // Aumenta a 10s
        maximumAge: 30000  // Usa caché reciente
    }
  );
}
}
