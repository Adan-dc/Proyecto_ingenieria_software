import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonButton
} from '@ionic/angular/standalone';

import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonButton
  ]
})
export class LoginPage {

  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  iniciarSesion() {
    if (this.email.trim() === '') {
      alert('Debes ingresar tu correo electrónico.');
      return;
    }

    if (this.password.trim() === '') {
      alert('Debes ingresar tu contraseña.');
      return;
    }

    const loginRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.login(loginRequest).subscribe({
      next: (usuario) => {
        if (!usuario) {
          alert('Correo o contraseña incorrectos.');
          return;
        }

        localStorage.setItem('usuarioActual', JSON.stringify(usuario));

        alert('Inicio de sesión correcto.');

        this.router.navigate(['/home']);
      },
      error: () => {
        alert('No se pudo conectar con el backend. Revisa que Spring Boot esté encendido.');
      }
    });
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}