import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IonContent } from '@ionic/angular/standalone';

import {
  GestionDonacionService,
  TallerDonacion
} from '../services/gestion-donacion';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent
  ]
})
export class HomePage {

  vecino: any = null;
  talleres: TallerDonacion[] = [];
  cargando = true;

  constructor(
    private router: Router,
    private gestionService: GestionDonacionService
  ) {}

  ionViewWillEnter() {
    this.verificarVecino();
    this.cargarTalleres();
  }

  verificarVecino() {
    const vecinoGuardado = localStorage.getItem('vecinoActual');

    if (!vecinoGuardado) {
      this.router.navigate(['/inicio']);
      return;
    }

    this.vecino = JSON.parse(vecinoGuardado);
  }

  cargarTalleres() {
    this.cargando = true;

    this.gestionService.listarTalleres().subscribe({
      next: (data) => {
        this.talleres = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar talleres:', error);
        this.talleres = [];
        this.cargando = false;
        alert('No se pudieron cargar los talleres desde el backend.');
      }
    });
  }

  seleccionarTaller(taller: TallerDonacion) {
    localStorage.setItem('tallerSeleccionado', JSON.stringify(taller));
    this.router.navigate(['/donar']);
  }

  irSolicitudes() {
    this.router.navigate(['/mis-solicitudes']);
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/inicio']);
  }

  obtenerNombre(taller: TallerDonacion): string {
    return taller.nombre || taller.titulo || 'Taller sin nombre';
  }

  obtenerDescripcion(taller: TallerDonacion): string {
    return taller.descripcion || 'Sin descripción disponible.';
  }

  obtenerCategoria(taller: TallerDonacion): string {
    return taller.categoria || 'Donación';
  }

  obtenerDireccion(taller: TallerDonacion): string {
    return taller.direccion || taller.lugar || taller.ubicacion || 'Lugar por confirmar';
  }

  obtenerHorario(taller: TallerDonacion): string {
    if (taller.fecha && taller.horaInicio && taller.horaFin) {
      return `${this.formatearFecha(taller.fecha)} | ${this.formatearHora(taller.horaInicio)} - ${this.formatearHora(taller.horaFin)}`;
    }

    if (taller.fecha && taller.hora) {
      return `${this.formatearFecha(taller.fecha)} | ${this.formatearHora(taller.hora)}`;
    }

    if (taller.horario) {
      return taller.horario;
    }

    return 'Horario por confirmar';
  }

  obtenerImagen(taller: TallerDonacion): string {
    return taller.imagenUrl ||
           taller.imagen ||
           'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) {
      return '';
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
}