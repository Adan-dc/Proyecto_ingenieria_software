import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IonContent } from '@ionic/angular/standalone';

import {
  ArticuloRequerido,
  GestionDonacionService
} from '../services/gestion-donacion';

interface ArticuloVista {
  id: number;
  icono: string;
  nombre: string;
  detalle: string;
  cantidad: number;
}

@Component({
  selector: 'app-donar',
  templateUrl: './donar.page.html',
  styleUrls: ['./donar.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent
  ]
})
export class DonarPage {

  taller: any = null;
  articulos: ArticuloVista[] = [];
  cargando = true;

  constructor(
    private router: Router,
    private gestionService: GestionDonacionService
  ) {}

  ionViewWillEnter() {
    this.cargarTaller();
  }

  cargarTaller() {
    const tallerGuardado = localStorage.getItem('tallerSeleccionado');

    if (!tallerGuardado) {
      this.router.navigate(['/home']);
      return;
    }

    this.taller = JSON.parse(tallerGuardado);

    const idTaller = this.taller.id || this.taller.codigo;

    console.log('Taller seleccionado:', this.taller);
    console.log('ID del taller:', idTaller);

    if (!idTaller) {
      alert('El taller seleccionado no tiene ID.');
      this.router.navigate(['/home']);
      return;
    }

    this.cargarArticulosDelTaller(idTaller);
  }

  cargarArticulosDelTaller(idTaller: number) {
    this.cargando = true;

    this.gestionService.listarArticulosPorTaller(idTaller).subscribe({
      next: (data) => {
        console.log('Artículos recibidos desde backend:', data);

        this.articulos = data.map((articulo: any) => ({
          id: articulo.id,
          icono: this.obtenerIconoArticulo(articulo),
          nombre: this.obtenerNombreArticulo(articulo),
          detalle: this.obtenerDetalleArticulo(articulo),
          cantidad: 0
        }));

        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar artículos requeridos:', error);
        this.articulos = [];
        this.cargando = false;
        alert('No se pudieron cargar los artículos requeridos del taller.');
      }
    });
  }

  obtenerNombreArticulo(articulo: any): string {
    return articulo.nombre ||
           articulo.nombreArticulo ||
           articulo.articulo ||
           articulo.titulo ||
           articulo.descripcionArticulo ||
           'Artículo requerido';
  }

  obtenerDetalleArticulo(articulo: any): string {
    if (articulo.descripcion) {
      return articulo.descripcion;
    }

    if (articulo.detalle) {
      return articulo.detalle;
    }

    if (articulo.observacion) {
      return articulo.observacion;
    }

    const cantidad = articulo.cantidadRequerida ||
                     articulo.cantidadNecesaria ||
                     articulo.cantidad ||
                     articulo.stockNecesario;

    if (cantidad) {
      return `Cantidad requerida: ${cantidad}`;
    }

    return 'Artículo solicitado por el administrador.';
  }

  obtenerIconoArticulo(articulo: any): string {
    const nombre = this.obtenerNombreArticulo(articulo).toLowerCase();

    if (nombre.includes('ropa') || nombre.includes('abrigo') || nombre.includes('zapato')) {
      return 'checkroom';
    }

    if (
      nombre.includes('alimento') ||
      nombre.includes('comida') ||
      nombre.includes('arroz') ||
      nombre.includes('fideo') ||
      nombre.includes('lata')
    ) {
      return 'soup_kitchen';
    }

    if (nombre.includes('juguete')) {
      return 'toys';
    }

    if (
      nombre.includes('libro') ||
      nombre.includes('cuaderno') ||
      nombre.includes('útil') ||
      nombre.includes('util') ||
      nombre.includes('lápiz') ||
      nombre.includes('lapiz')
    ) {
      return 'backpack';
    }

    if (nombre.includes('pelota') || nombre.includes('deporte')) {
      return 'sports_soccer';
    }

    if (nombre.includes('pintura') || nombre.includes('pincel') || nombre.includes('manualidad')) {
      return 'palette';
    }

    return 'inventory_2';
  }

  sumar(articulo: ArticuloVista) {
    articulo.cantidad++;
  }

  restar(articulo: ArticuloVista) {
    if (articulo.cantidad > 0) {
      articulo.cantidad--;
    }
  }

  totalArticulos(): number {
    return this.articulos.reduce((total, item) => total + item.cantidad, 0);
  }

  continuar() {
    if (this.totalArticulos() === 0) {
      alert('Debes seleccionar al menos un artículo.');
      return;
    }

    const seleccionados = this.articulos.filter(item => item.cantidad > 0);

    localStorage.setItem('articulosSeleccionados', JSON.stringify(seleccionados));

    this.router.navigate(['/comentario']);
  }

  volver() {
    this.router.navigate(['/home']);
  }
}