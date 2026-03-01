import { Routes } from '@angular/router';
import { PruebasCessComponent } from './Pages/pruebas-cess/pruebas-cess.component';
import { MapComponent } from './Pages/map/map.component';

export const routes: Routes = [

    {path: 'pruebasCess', component: PruebasCessComponent},
    {path: 'mapa', component: MapComponent},

];
