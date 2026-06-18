import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  IonContent,
  IonButton
} from '@ionic/angular/standalone';

import { Taller, TallerService } from '../services/taller';

@Component({
  selector: 'app-detalle-taller',
  templateUrl: './detalle-taller.page.html',
  styleUrls: ['./detalle-taller.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton
  ]
})
export class DetalleTallerPage {

  taller: Taller | null = null;
  cargando = false;

  constructor(
    private router: Router,
    private tallerService: TallerService
  ) {}

  ionViewWillEnter() {
    this.cargarDetalleTaller();
  }

  cargarDetalleTaller() {
    const tallerGuardado = localStorage.getItem('tallerSeleccionado');

    if (!tallerGuardado) {
      this.router.navigate(['/home']);
      return;
    }

    const tallerLocal = JSON.parse(tallerGuardado);

    if (!tallerLocal.id) {
      this.router.navigate(['/home']);
      return;
    }

    this.cargando = true;

    this.tallerService.buscarTallerPorId(tallerLocal.id).subscribe({
      next: (tallerBackend) => {
        this.taller = tallerBackend;
        localStorage.setItem('tallerSeleccionado', JSON.stringify(tallerBackend));
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar detalle:', error);
        this.taller = tallerLocal;
        this.cargando = false;
      }
    });
  }

  inscribirseAlTaller() {
    if (!this.taller) {
      return;
    }

    if (this.cuposOcupados() >= this.cuposTotales()) {
      alert('No quedan cupos disponibles para este taller.');
      return;
    }

    localStorage.setItem('tallerSeleccionado', JSON.stringify(this.taller));
    this.router.navigate(['/inscripcion']);
  }

  volverInicio() {
    this.router.navigate(['/home']);
  }

  cuposOcupados(): number {
    return this.taller?.cuposOcupados || 0;
  }

  cuposTotales(): number {
    return this.taller?.cuposTotales || 0;
  }

  porcentajeOcupado(): number {
    const totales = this.cuposTotales();

    if (totales <= 0) {
      return 0;
    }

    return Math.min((this.cuposOcupados() / totales) * 100, 100);
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) {
      return 'Fecha por confirmar';
    }

    const partes = fecha.split('-');

    if (partes.length !== 3) {
      return fecha;
    }

    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }

  formatearHora(hora?: string): string {
    if (!hora) {
      return '';
    }

    return hora.substring(0, 5);
  }

  obtenerHorario(): string {
    if (!this.taller) {
      return 'Horario por confirmar';
    }

    if (this.taller.horario) {
      return this.taller.horario;
    }

    const inicio = this.formatearHora(this.taller.horaInicio);
    const fin = this.formatearHora(this.taller.horaFin);

    if (inicio && fin) {
      return `${inicio} - ${fin}`;
    }

    return 'Horario por confirmar';
  }

  obtenerLugar(): string {
    return this.taller?.lugar ||
           this.taller?.ubicacion ||
           this.taller?.direccion ||
           'Lugar por confirmar';
  }

  obtenerImagenClase(): string {
    return this.taller?.imagenClase || 'kinesiologia';
  }
}