import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-punto-acopio',
  templateUrl: './punto-acopio.page.html',
  styleUrls: ['./punto-acopio.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent
  ]
})
export class PuntoAcopioPage {

  nombreLugar = 'Sede Junta de Vecinos';
  direccion = 'Pamela 1205, Maipú';
  horario = '10:00 a 19:00 horas';

  constructor(private router: Router) {}

  abrirGoogleMaps() {
    const direccionMaps = encodeURIComponent(this.direccion);
    const url = `https://www.google.com/maps/search/?api=1&query=${direccionMaps}`;

    window.open(url, '_system');
  }

  copiarDireccion() {
    navigator.clipboard.writeText(this.direccion)
      .then(() => {
        alert('Dirección copiada correctamente.');
      })
      .catch(() => {
        alert('No se pudo copiar la dirección.');
      });
  }

  irSolicitudes() {
    this.limpiarDatosDonacion();
    this.router.navigate(['/mis-solicitudes']);
  }

  volverInicio() {
    this.limpiarDatosDonacion();
    this.router.navigate(['/home']);
  }

  limpiarDatosDonacion() {
    localStorage.removeItem('tallerSeleccionado');
    localStorage.removeItem('articulosSeleccionados');
    localStorage.removeItem('comentarioDonacion');
  }
}