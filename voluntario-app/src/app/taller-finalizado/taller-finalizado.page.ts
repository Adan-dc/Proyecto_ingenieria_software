import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  IonContent,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-taller-finalizado',
  templateUrl: './taller-finalizado.page.html',
  styleUrls: ['./taller-finalizado.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton
  ]
})
export class TallerFinalizadoPage implements OnInit {

  nombreTaller: string = 'Taller finalizado';

  constructor(private router: Router) {}

  ngOnInit() {
    const tallerFinalizado = localStorage.getItem('tallerFinalizadoActual');

    if (tallerFinalizado) {
      const taller = JSON.parse(tallerFinalizado);
      this.nombreTaller = taller.taller || taller.nombre || 'Taller finalizado';
    }
  }

  escribirComentario() {
    this.router.navigate(['/comentario-taller']);
  }

  cerrarMensaje() {
    const tallerFinalizado = localStorage.getItem('tallerFinalizadoActual');

    if (tallerFinalizado) {
      const taller = JSON.parse(tallerFinalizado);
      localStorage.setItem('mensajeFinalizadoVisto_' + taller.id, 'true');
    }

    this.router.navigate(['/home']);
  }
}
