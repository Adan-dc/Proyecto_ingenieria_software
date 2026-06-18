import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { IonContent } from '@ionic/angular/standalone';

import { DonacionApk, GestionDonacionService } from '../services/gestion-donacion';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.page.html',
  styleUrls: ['./comentario.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent
  ]
})
export class ComentarioPage {

  vecino: any = null;
  taller: any = null;
  articulos: any[] = [];
  comentario = '';
  enviando = false;

  constructor(
    private router: Router,
    private gestionService: GestionDonacionService
  ) {}

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {
    const vecinoGuardado = localStorage.getItem('vecinoActual');
    const tallerGuardado = localStorage.getItem('tallerSeleccionado');
    const articulosGuardados = localStorage.getItem('articulosSeleccionados');

    if (!vecinoGuardado) {
      alert('Debes iniciar sesión nuevamente.');
      this.router.navigate(['/inicio']);
      return;
    }

    if (!tallerGuardado) {
      alert('No se encontró el taller seleccionado.');
      this.router.navigate(['/home']);
      return;
    }

    if (!articulosGuardados) {
      alert('No se encontraron artículos seleccionados.');
      this.router.navigate(['/donar']);
      return;
    }

    try {
      this.vecino = JSON.parse(vecinoGuardado);
      this.taller = JSON.parse(tallerGuardado);
      this.articulos = JSON.parse(articulosGuardados);

      console.log('Vecino actual:', this.vecino);
      console.log('Taller seleccionado:', this.taller);
      console.log('Artículos seleccionados:', this.articulos);

    } catch (error) {
      console.error('Error al cargar datos de donación:', error);
      alert('No se pudieron cargar los datos de la donación.');
      this.router.navigate(['/home']);
    }
  }

  volver() {
    this.router.navigate(['/donar']);
  }

  enviarSolicitud() {
    const comentarioLimpio = this.comentario.trim();

    if (!comentarioLimpio) {
      alert('Debes escribir un comentario sobre el estado de los artículos.');
      return;
    }

    if (!this.vecino) {
      alert('No se encontró el vecino. Cierra sesión e inicia nuevamente.');
      this.router.navigate(['/inicio']);
      return;
    }

    const rutDonante =
      this.vecino.rut ||
      this.vecino.rutDonante ||
      '';

    if (!rutDonante) {
      alert('No se encontró el RUT del donante. Cierra sesión e inicia nuevamente.');
      return;
    }

    const nombreDonante =
      this.vecino.nombreCompleto ||
      `${this.vecino.nombre || ''} ${this.vecino.apellido || ''}`.trim() ||
      'Vecino';

    const codigoTaller =
      this.taller.codigo ||
      this.taller.id ||
      null;

    const nombreTaller =
      this.taller.nombre ||
      this.taller.titulo ||
      'Taller';

    const solicitudes: DonacionApk[] = this.articulos.map(articulo => ({
      rutDonante: rutDonante,
      nombreDonante: nombreDonante,
      telefonoDonante: this.vecino.telefono || '',
      correoDonante: this.vecino.correo || this.vecino.email || '',
      direccionDonante: this.vecino.direccion || '',

      articulo: articulo.nombre || articulo.articulo || 'Artículo',
      cantidad: articulo.cantidad || 1,
      descripcion: comentarioLimpio,

      codigoTaller: codigoTaller,
      nombreTaller: nombreTaller
    }));

    console.log('Solicitudes que se enviarán:', solicitudes);

    this.enviando = true;

    this.gestionService.enviarDonaciones(solicitudes).subscribe({
      next: () => {
        this.enviando = false;

        localStorage.setItem('comentarioDonacion', comentarioLimpio);

        this.router.navigate(['/punto-acopio']);
      },
      error: (error) => {
        console.error('Error al enviar solicitud:', error);
        this.enviando = false;

        const mensajeBackend =
          error?.error?.message ||
          error?.error?.error ||
          error?.error?.mensaje ||
          error?.message ||
          '';

        if (mensajeBackend) {
          alert('No se pudo enviar la solicitud.\n\n' + JSON.stringify(mensajeBackend));
        } else {
          alert('No se pudo enviar la solicitud. Revisa el backend.');
        }
      }
    });
  }
}