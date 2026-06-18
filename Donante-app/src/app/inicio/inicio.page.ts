import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { IonContent } from '@ionic/angular/standalone';

import { GestionDonacionService } from '../services/gestion-donacion';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent]
})
export class InicioPage {

  rut = '';
  cargando = false;

  constructor(
    private router: Router,
    private gestionService: GestionDonacionService
  ) {}

  iniciarSesion() {
    if (!this.rut.trim()) {
      alert('Debes ingresar tu RUT.');
      return;
    }

    this.cargando = true;

    this.gestionService.buscarVecinoPorRut(this.rut.trim()).subscribe({
      next: (vecino) => {
        localStorage.setItem('vecinoActual', JSON.stringify(vecino));
        this.cargando = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        this.cargando = false;

        if (error.status === 404) {
          alert('No encontramos un vecino con ese RUT. Puedes registrarte.');
        } else if (error.status === 0) {
          alert('No se pudo conectar con el backend de donaciones.');
        } else {
          alert('No se pudo iniciar sesión. Revisa el backend.');
        }
      }
    });
  }

  irRegistro() {
    this.router.navigate(['/registro']);
  }
}