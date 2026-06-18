import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  IonContent,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.page.html',
  styleUrls: ['./mi-cuenta.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton
  ]
})
export class MiCuentaPage implements OnInit {

  usuario: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const usuarioGuardado = localStorage.getItem('usuarioActual');

    if (!usuarioGuardado) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = JSON.parse(usuarioGuardado);
  }

  volverInicio() {
    this.router.navigate(['/home']);
  }

  cerrarSesion() {
    const confirmar = confirm('¿Seguro que deseas cerrar sesión?');
  
    if (!confirmar) {
      return;
    }
  
    localStorage.removeItem('usuarioActual');
    localStorage.removeItem('voluntarioActual');
    localStorage.removeItem('tallerSeleccionado');
    localStorage.removeItem('tallerActualizado');
    localStorage.removeItem('datosInscripcion');
    localStorage.removeItem('tituloExito');
    localStorage.removeItem('mensajeExito');
  
    this.router.navigate(['/login']);
  }
}