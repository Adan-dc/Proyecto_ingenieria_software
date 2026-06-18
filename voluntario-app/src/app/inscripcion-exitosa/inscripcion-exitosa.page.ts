import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  IonContent,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-inscripcion-exitosa',
  templateUrl: './inscripcion-exitosa.page.html',
  styleUrls: ['./inscripcion-exitosa.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton
  ]
})
export class InscripcionExitosaPage {

  titulo = '¡Inscripción confirmada!';
  mensaje = 'Te hemos enviado un mensaje de confirmación a tu número de teléfono con todos los detalles del taller.';

  taller: any = null;

  nombreTaller = '';
  fechaTaller = '';
  horarioTaller = '';
  lugarTaller = '';

  constructor(private router: Router) {}

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {
    const tituloGuardado = localStorage.getItem('tituloExito');
    const mensajeGuardado = localStorage.getItem('mensajeExito');

    if (tituloGuardado) {
      this.titulo = tituloGuardado;
    }

    if (mensajeGuardado) {
      this.mensaje = mensajeGuardado;
    }

    const tallerGuardado =
      localStorage.getItem('tallerActualizado') ||
      localStorage.getItem('tallerSeleccionado');

    if (tallerGuardado) {
      try {
        this.taller = JSON.parse(tallerGuardado);

        this.nombreTaller = this.taller.nombre || 'Taller';
        this.fechaTaller = this.formatearFecha(this.taller.fecha);

        const inicio = this.formatearHora(this.taller.horaInicio);
        const fin = this.formatearHora(this.taller.horaFin);

        if (inicio && fin) {
          this.horarioTaller = `${inicio} - ${fin}`;
        } else {
          this.horarioTaller = this.taller.horario || 'Horario por confirmar';
        }

        this.lugarTaller =
          this.taller.lugar ||
          this.taller.ubicacion ||
          this.taller.direccion ||
          'Lugar por confirmar';

      } catch (error) {
        console.error('Error al leer taller:', error);
        this.taller = null;
      }
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) {
      return 'Fecha por confirmar';
    }

    const partes = fecha.split('-');

    if (partes.length !== 3) {
      return fecha;
    }

    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }

  formatearHora(hora: string): string {
    if (!hora) {
      return '';
    }

    return hora.substring(0, 5);
  }

  verMisTalleres() {
    this.router.navigate(['/mis-talleres']);
  }

  volverDetalle() {
    this.router.navigate(['/detalle-taller']);
  }

  volverInicio() {
    localStorage.removeItem('tituloExito');
    localStorage.removeItem('mensajeExito');
    localStorage.removeItem('tallerActualizado');

    this.router.navigate(['/home']);
  }
}