import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonButton
} from '@ionic/angular/standalone';

import { AuthService } from '../services/auth';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonButton
  ]
})
export class RegistroPage {

  nombre: string = '';
  rut: string = '';
  telefono: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrarVoluntario() {
    if (this.nombre.trim() === '') {
      alert('Debes ingresar tu nombre completo.');
      return;
    }

    if (this.rut.trim() === '') {
      alert('Debes ingresar tu RUT.');
      return;
    }

    if (this.telefono.trim() === '') {
      alert('Debes ingresar tu teléfono.');
      return;
    }

    if (this.email.trim() === '') {
      alert('Debes ingresar tu correo electrónico.');
      return;
    }

    if (this.password.trim() === '') {
      alert('Debes crear una contraseña.');
      return;
    }

    const nuevoVoluntario = {
      nombre: this.nombre,
      rut: this.rut,
      telefono: this.telefono,
      email: this.email,
      password: this.password
    };

    this.authService.registrar(nuevoVoluntario).subscribe({
      next: (voluntarioRegistrado) => {
        if (!voluntarioRegistrado) {
          alert('Ya existe un voluntario registrado con ese correo.');
          return;
        }

        alert('Registro creado correctamente. Ahora puedes iniciar sesión.');

        this.router.navigate(['/login']);
      },
      error: () => {
        alert('No se pudo conectar con el backend. Revisa que Spring Boot esté encendido.');
      }
    });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}