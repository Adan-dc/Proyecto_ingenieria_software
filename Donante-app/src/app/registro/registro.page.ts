import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { IonContent } from '@ionic/angular/standalone';

import { GestionDonacionService, VecinoRegistro } from '../services/gestion-donacion';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent]
})
export class RegistroPage {

  rut = '';
  nombreCompleto = '';
  correo = '';
  telefono = '';
  direccion = '';

  cargando = false;

  constructor(
    private router: Router,
    private gestionService: GestionDonacionService
  ) {}

  volver() {
    this.router.navigate(['/inicio']);
  }

  registrarVecino() {
    if (!this.rut.trim()) {
      alert('Debes ingresar tu RUT.');
      return;
    }

    if (!this.nombreCompleto.trim()) {
      alert('Debes ingresar tu nombre completo.');
      return;
    }

    if (!this.direccion.trim()) {
      alert('Debes ingresar tu dirección.');
      return;
    }

    const vecino: VecinoRegistro = {
      rut: this.rut.trim(),
      nombreCompleto: this.nombreCompleto.trim(),
      correo: this.correo.trim(),
      telefono: this.telefono.trim(),
      direccion: this.direccion.trim()
    };

    this.cargando = true;

    this.gestionService.registrarVecino(vecino).subscribe({
      next: (data) => {
        localStorage.setItem('vecinoActual', JSON.stringify(data));
        this.cargando = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error al registrar vecino:', error);
        this.cargando = false;

        const mensajeBackend =
          error?.error?.message ||
          error?.error?.error ||
          error?.error ||
          '';

        if (mensajeBackend) {
          alert('No se pudo registrar: ' + JSON.stringify(mensajeBackend));
        } else {
          alert('No se pudo registrar. Revisa que el backend esté encendido.');
        }
      }
    });
  }
}