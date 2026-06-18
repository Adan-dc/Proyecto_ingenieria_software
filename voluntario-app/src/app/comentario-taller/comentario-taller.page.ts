import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { ComentarioTallerService } from '../services/comentario-taller';

@Component({
  selector: 'app-comentario-taller',
  templateUrl: './comentario-taller.page.html',
  styleUrls: ['./comentario-taller.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent
  ]
})
export class ComentarioTallerPage {

  taller: any = null;
  usuario: any = null;
  comentario = '';

  comentarioExistente = false;
  cargandoComentario = false;
  guardando = false;

  constructor(
    private router: Router,
    private comentarioService: ComentarioTallerService
  ) {}

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {
    const tallerGuardado = localStorage.getItem('tallerComentario');

    const usuarioGuardado =
      localStorage.getItem('usuarioActual') ||
      localStorage.getItem('voluntarioActual');

    if (!tallerGuardado || !usuarioGuardado) {
      alert('No se pudo cargar la información del taller o usuario.');
      this.router.navigate(['/mis-talleres']);
      return;
    }

    try {
      this.taller = JSON.parse(tallerGuardado);
      this.usuario = JSON.parse(usuarioGuardado);

      console.log('Taller comentario:', this.taller);
      console.log('Usuario comentario:', this.usuario);

      this.cargarComentarioExistente();

    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos del comentario.');
      this.router.navigate(['/mis-talleres']);
    }
  }

  obtenerTallerId(): number | null {
    const id =
      this.taller?.id ||
      this.taller?.tallerId ||
      this.taller?.idTaller ||
      this.taller?.codigoTaller ||
      this.taller?.codigo ||
      this.taller?.taller_id ||
      this.taller?.taller?.id ||
      this.taller?.taller?.codigoTaller;

    return id ? Number(id) : null;
  }

  obtenerVoluntarioId(): number | null {
    const id =
      this.usuario?.id ||
      this.usuario?.voluntarioId ||
      this.usuario?.idVoluntario ||
      this.usuario?.codigo ||
      this.usuario?.voluntario?.id;

    return id ? Number(id) : null;
  }

  cargarComentarioExistente() {
    const tallerId = this.obtenerTallerId();
    const voluntarioId = this.obtenerVoluntarioId();

    if (!tallerId || !voluntarioId) {
      console.warn('No se pudo cargar comentario existente:', {
        tallerId,
        voluntarioId,
        taller: this.taller,
        usuario: this.usuario
      });
      return;
    }

    this.cargandoComentario = true;

    this.comentarioService.obtenerComentario(voluntarioId, tallerId).subscribe({
      next: (respuesta: any) => {
        this.cargandoComentario = false;

        if (respuesta && respuesta.comentario) {
          this.comentario = respuesta.comentario;
          this.comentarioExistente = true;
        } else {
          this.comentario = '';
          this.comentarioExistente = false;
        }
      },
      error: () => {
        this.cargandoComentario = false;
        this.comentario = '';
        this.comentarioExistente = false;
      }
    });
  }

  guardarComentario() {
    if (this.comentarioExistente) {
      alert('Ya comentaste este taller. Solo se permite un comentario por taller.');
      return;
    }

    const texto = this.comentario.trim();

    if (!texto) {
      alert('Debes escribir un comentario.');
      return;
    }

    const tallerId = this.obtenerTallerId();
    const voluntarioId = this.obtenerVoluntarioId();

    if (!tallerId || !voluntarioId) {
      alert('No se pudo identificar el taller o el voluntario.');
      console.error({
        tallerId,
        voluntarioId,
        taller: this.taller,
        usuario: this.usuario
      });
      return;
    }

    const body = {
      tallerId: tallerId,
      voluntarioId: voluntarioId,
      nombreVoluntario: this.obtenerNombreVoluntario(),
      emailVoluntario: this.obtenerEmailVoluntario(),
      comentario: texto
    };

    console.log('Enviando comentario:', body);

    this.guardando = true;

    this.comentarioService.guardarComentario(body).subscribe({
      next: () => {
        this.guardando = false;
        this.comentarioExistente = true;

        alert('Comentario enviado correctamente.');
        this.router.navigate(['/mis-talleres']);
      },
      error: (error) => {
        this.guardando = false;

        console.error('Error al guardar comentario:', error);

        if (error.status === 409) {
          this.comentarioExistente = true;
          alert('Ya comentaste este taller. Solo se permite un comentario.');
        } else {
          alert('No se pudo enviar el comentario.');
        }
      }
    });
  }

  obtenerNombreTaller(): string {
    return (
      this.taller?.nombre ||
      this.taller?.nombreTaller ||
      this.taller?.titulo ||
      this.taller?.tallerNombre ||
      this.taller?.taller?.nombre ||
      'Taller sin nombre'
    );
  }

  obtenerNombreVoluntario(): string {
    return (
      this.usuario?.nombre ||
      this.usuario?.nombreCompleto ||
      this.usuario?.nombreVoluntario ||
      this.usuario?.email ||
      this.usuario?.correo ||
      'Voluntario'
    );
  }

  obtenerEmailVoluntario(): string {
    return (
      this.usuario?.email ||
      this.usuario?.correo ||
      this.usuario?.emailVoluntario ||
      ''
    );
  }

  formatearFecha(fecha: string): string {
    if (!fecha) {
      return 'Fecha por confirmar';
    }

    try {
      const partes = fecha.split('-');

      if (partes.length === 3) {
        return `${partes[2]}-${partes[1]}-${partes[0]}`;
      }

      return fecha;
    } catch {
      return fecha;
    }
  }

  volver() {
    this.router.navigate(['/mis-talleres']);
  }
}