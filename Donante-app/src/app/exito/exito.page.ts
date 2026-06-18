import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-exito',
  templateUrl: './exito.page.html',
  styleUrls: ['./exito.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent]
})
export class ExitoPage {

  constructor(private router: Router) {}

  volverInicio() {
    localStorage.removeItem('tallerSeleccionado');
    localStorage.removeItem('articulosSeleccionados');
    localStorage.removeItem('comentarioDonacion');

    this.router.navigate(['/home']);
  }

  irSolicitudes() {
    this.router.navigate(['/mis-solicitudes']);
  }
}