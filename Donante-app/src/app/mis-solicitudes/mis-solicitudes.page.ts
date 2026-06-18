import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IonContent } from '@ionic/angular/standalone';

import { GestionDonacionService } from '../services/gestion-donacion';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.page.html',
  styleUrls: ['./mis-solicitudes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent
  ]
})
export class MisSolicitudesPage {

  vecino: any = null;
  solicitudes: any[] = [];
  cargando = true;
  filtro = 'TODAS';

  constructor(
    private router: Router,
    private gestionService: GestionDonacionService
  ) {}

  ionViewWillEnter() {
    this.cargarVecino();
  }

  cargarVecino() {
    const vecinoGuardado = localStorage.getItem('vecinoActual');

    if (!vecinoGuardado) {
      alert('Debes iniciar sesión nuevamente.');
      this.router.navigate(['/inicio']);
      return;
    }

    this.vecino = JSON.parse(vecinoGuardado);

    const rut =
      this.vecino.rut ||
      this.vecino.rutDonante ||
      '';

    if (!rut) {
      alert('No se encontró el RUT del vecino.');
      this.cargando = false;
      return;
    }

    this.cargarSolicitudes(rut);
  }

  cargarSolicitudes(rut: string) {
    this.cargando = true;

    this.gestionService.listarMisSolicitudes(rut).subscribe({
      next: (data) => {
        this.solicitudes = data || [];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar mis solicitudes:', error);
        this.solicitudes = [];
        this.cargando = false;
        alert('No se pudieron cargar tus solicitudes.');
      }
    });
  }

  volver() {
    this.router.navigate(['/home']);
  }

  cambiarFiltro(filtro: string) {
    this.filtro = filtro;
  }

  solicitudesFiltradas() {
    if (this.filtro === 'ACEPTADAS') {
      return this.solicitudes.filter(s =>
        s.estadoRevision === 'ACEPTADA' ||
        s.estadoRevision === 'ACEPTADO'
      );
    }

    if (this.filtro === 'RECHAZADAS') {
      return this.solicitudes.filter(s =>
        s.estadoRevision === 'RECHAZADA' ||
        s.estadoRevision === 'RECHAZADO'
      );
    }

    return this.solicitudes;
  }

  obtenerArticulo(solicitud: any): string {
    return solicitud.objetoADonar ||
           solicitud.articulo ||
           solicitud.nombreArticulo ||
           'Donación';
  }

  obtenerCantidad(solicitud: any): number {
    return solicitud.cantidad || 1;
  }

  obtenerEstado(solicitud: any): string {
    if (!solicitud.estadoRevision) {
      return 'ENVIADA';
    }

    if (solicitud.estadoRevision === 'PENDIENTE_REVISION') {
      return 'ENVIADA';
    }

    if (solicitud.estadoRevision === 'ACEPTADA') {
      return 'ACEPTADA';
    }

    if (solicitud.estadoRevision === 'RECHAZADA') {
      return 'RECHAZADA';
    }

    return solicitud.estadoRevision;
  }

  obtenerTaller(solicitud: any): string {
    return solicitud.nombreTaller || 'Sin taller asociado';
  }

  obtenerDescripcion(solicitud: any): string {
    return solicitud.descripcion || 'Sin descripción';
  }
}