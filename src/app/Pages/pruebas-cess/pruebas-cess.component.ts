import { Component } from '@angular/core';

@Component({
  selector: 'app-pruebas-cess',
  standalone: true,
  imports: [],
  templateUrl: './pruebas-cess.component.html',
  styleUrl: './pruebas-cess.component.scss'
})
export class PruebasCessComponent {

  mover(){
 document.querySelector('.texto')?.classList.toggle('animar');  }
}
