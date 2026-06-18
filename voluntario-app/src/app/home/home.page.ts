import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  IonContent,
  IonButton
} from '@ionic/angular/standalone';

import { Taller, TallerService } from '../services/taller';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton
  ],
})
export class HomePage {

  talleres: Taller[] = [];
  cargando = false;

  constructor(
    private router: Router,
    private tallerService: TallerService
  ) {}

  ionViewWillEnter() {
    this.cargarTalleres();
  }

  cargarTalleres() {
    this.cargando = true;

    this.tallerService.listarTalleres().subscribe({
      next: (data) => {
        console.log('Talleres cargados desde backend:', data);
        this.talleres = data || [];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar talleres:', error);
        this.talleres = [];
        this.cargando = false;
        alert('No se pudieron cargar los talleres.');
      }
    });
  }

  seleccionarTaller(taller: Taller) {
    localStorage.setItem('tallerSeleccionado', JSON.stringify(taller));
    this.router.navigate(['/detalle-taller']);
  }

  cuposOcupados(taller: Taller): number {
    return taller.cuposOcupados || 0;
  }

  cuposTotales(taller: Taller): number {
    return taller.cuposTotales || 0;
  }

  porcentajeCupos(taller: Taller): number {
    const ocupados = this.cuposOcupados(taller);
    const totales = this.cuposTotales(taller);

    if (totales <= 0) {
      return 0;
    }

    return Math.min((ocupados / totales) * 100, 100);
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

  obtenerHorario(taller: Taller): string {
    if (taller.horario) {
      return taller.horario;
    }

    const inicio = this.formatearHora(taller.horaInicio);
    const fin = this.formatearHora(taller.horaFin);

    if (inicio && fin) {
      return `${inicio} - ${fin}`;
    }

    return 'Horario por confirmar';
  }

  obtenerImagenClase(taller: Taller): string {
    return taller.imagenClase || 'kinesiologia';
  }
  irMiCuenta() {
    this.router.navigate(['/mi-cuenta']);
  }

  irMisTalleres() {
    this.router.navigate(['/mis-talleres']);
  }

  tallerFinalizado(taller: any): boolean {
    if (!taller.fecha) {
      return false;
    }
  
    const horaFin =
      taller.horaFin ||
      taller.horarioFin ||
      taller.hora ||
      taller.horaInicio ||
      '23:59';
  
    const fechaHoraFin = new Date(`${taller.fecha}T${horaFin}`);
  
    if (isNaN(fechaHoraFin.getTime())) {
      return false;
    }
  
    return new Date().getTime() > fechaHoraFin.getTime();
  }
  
}