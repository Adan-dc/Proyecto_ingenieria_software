import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonButton
} from '@ionic/angular/standalone';

import { Taller, TallerService } from '../services/taller';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.page.html',
  styleUrls: ['./inscripcion.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton
  ]
})
export class InscripcionPage {

  taller: Taller | null = null;

  nombreCompleto = '';
  rut = '';
  telefono = '';

  enviando = false;

  constructor(
    private router: Router,
    private tallerService: TallerService
  ) {}

  ionViewWillEnter() {
    this.cargarTaller();
    this.cargarUsuarioActual();
  }

  cargarTaller() {
    const tallerGuardado = localStorage.getItem('tallerSeleccionado');

    if (!tallerGuardado) {
      this.router.navigate(['/home']);
      return;
    }

    try {
      this.taller = JSON.parse(tallerGuardado);
      console.log('Taller seleccionado:', this.taller);
    } catch (error) {
      console.error('Error al leer tallerSeleccionado:', error);
      this.router.navigate(['/home']);
    }
  }

  cargarUsuarioActual() {
    const usuarioGuardado =
      localStorage.getItem('usuarioActual') ||
      localStorage.getItem('voluntarioActual');

    if (!usuarioGuardado) {
      return;
    }

    try {
      const usuario = JSON.parse(usuarioGuardado);

      this.nombreCompleto = usuario.nombre || usuario.nombreCompleto || '';
      this.rut = usuario.rut || '';
      this.telefono = usuario.telefono || '';

      console.log('Usuario actual:', usuario);

    } catch (error) {
      console.error('Error al leer usuarioActual:', error);
    }
  }

  confirmarInscripcion() {
    if (!this.taller) {
      return;
    }

    if (!this.taller.id) {
      alert('No se encontró el ID del taller.');
      return;
    }

    if (this.nombreCompleto.trim() === '') {
      alert('Por favor ingresa tu nombre completo.');
      return;
    }

    if (this.rut.trim() === '') {
      alert('Por favor ingresa tu RUT.');
      return;
    }

    if (this.telefono.trim() === '') {
      alert('Por favor ingresa tu número de teléfono.');
      return;
    }

    this.enviando = true;

    this.tallerService.inscribirse(
      this.taller.id,
      this.rut.trim(),
      this.taller.nombre
    ).subscribe({
      next: (respuesta: any) => {
        this.enviando = false;

        console.log('Respuesta inscripción:', respuesta);

        const tallerOriginal: any = this.taller || {};
        const tallerRespuesta: any = respuesta?.tallerActualizado || {};

        const tallerActualizado: any = {
          ...tallerOriginal,
          ...tallerRespuesta
        };

        if (!tallerActualizado.id && tallerOriginal.id) {
          tallerActualizado.id = tallerOriginal.id;
        }

        if (!tallerActualizado.tallerId && tallerActualizado.id) {
          tallerActualizado.tallerId = tallerActualizado.id;
        }

        if (!tallerActualizado.idTaller && tallerActualizado.id) {
          tallerActualizado.idTaller = tallerActualizado.id;
        }

        localStorage.setItem('tallerActualizado', JSON.stringify(tallerActualizado));
        localStorage.setItem('tallerSeleccionado', JSON.stringify(tallerActualizado));

        this.guardarTallerInscrito(tallerActualizado);

        const datosInscripcion = {
          id: tallerActualizado.id,
          tallerId: tallerActualizado.id,
          idTaller: tallerActualizado.id,

          nombre: tallerActualizado.nombre,
          descripcion: tallerActualizado.descripcion,
          etiqueta: tallerActualizado.etiqueta,
          imagenClase: tallerActualizado.imagenClase,
          imagenUrl: tallerActualizado.imagenUrl,

          nombreCompleto: this.nombreCompleto,
          rut: this.rut,
          telefono: this.telefono,
          fechaInscripcion: new Date().toLocaleDateString('es-CL'),

          profesor: tallerActualizado.profesor,
          fecha: tallerActualizado.fecha,
          horaInicio: tallerActualizado.horaInicio,
          horaFin: tallerActualizado.horaFin,
          lugar:
            tallerActualizado.lugar ||
            tallerActualizado.ubicacion ||
            tallerActualizado.direccion ||
            'Lugar por confirmar'
        };

        localStorage.setItem('datosInscripcion', JSON.stringify(datosInscripcion));

        localStorage.setItem('tituloExito', '¡Inscripción confirmada!');
        localStorage.setItem(
          'mensajeExito',
          'Te hemos enviado un mensaje de confirmación a tu número de teléfono con todos los detalles del taller.'
        );

        this.router.navigate(['/inscripcion-exitosa']);
      },
      error: (error) => {
        this.enviando = false;

        console.error('Error al confirmar inscripción:', error);

        if (error.status === 400) {
          alert('Ya estás inscrito en este taller o no quedan cupos disponibles.');
        } else if (error.status === 404) {
          alert('No se encontró el voluntario o el taller.');
        } else {
          alert('No se pudo confirmar la inscripción. Revisa los backend.');
        }
      }
    });
  }

  guardarTallerInscrito(taller: any) {
    if (!taller) {
      return;
    }

    const data = localStorage.getItem('misTalleres');
    const misTalleres = data ? JSON.parse(data) : [];

    const tallerOriginal: any = this.taller || {};

    const idTaller =
      taller.id ||
      taller.tallerId ||
      taller.idTaller ||
      taller.codigoTaller ||
      taller.codigo ||
      taller.taller_id ||
      tallerOriginal.id ||
      tallerOriginal.tallerId ||
      tallerOriginal.idTaller ||
      tallerOriginal.codigoTaller ||
      tallerOriginal.codigo ||
      tallerOriginal.taller_id;

    if (!idTaller) {
      console.error('No se pudo guardar el taller inscrito porque no tiene ID:', {
        tallerRecibido: taller,
        tallerOriginal: tallerOriginal
      });

      alert('No se pudo guardar este taller porque no tiene ID.');
      return;
    }

    const tallerNormalizado = {
      id: Number(idTaller),
      tallerId: Number(idTaller),
      idTaller: Number(idTaller),

      nombre:
        taller.nombre ||
        taller.nombreTaller ||
        taller.titulo ||
        taller.tallerNombre ||
        tallerOriginal.nombre ||
        tallerOriginal.nombreTaller ||
        tallerOriginal.titulo ||
        tallerOriginal.tallerNombre ||
        'Taller sin nombre',

      descripcion:
        taller.descripcion ||
        tallerOriginal.descripcion ||
        '',

      fecha:
        taller.fecha ||
        tallerOriginal.fecha ||
        '',

      horaInicio:
        taller.horaInicio ||
        taller.hora ||
        tallerOriginal.horaInicio ||
        tallerOriginal.hora ||
        '',

      horaFin:
        taller.horaFin ||
        tallerOriginal.horaFin ||
        '',

      horario:
        taller.horario ||
        tallerOriginal.horario ||
        '',

      lugar:
        taller.lugar ||
        taller.ubicacion ||
        taller.direccion ||
        tallerOriginal.lugar ||
        tallerOriginal.ubicacion ||
        tallerOriginal.direccion ||
        'Lugar por confirmar',

      ubicacion:
        taller.ubicacion ||
        tallerOriginal.ubicacion ||
        '',

      direccion:
        taller.direccion ||
        tallerOriginal.direccion ||
        '',

      etiqueta:
        taller.etiqueta ||
        tallerOriginal.etiqueta ||
        '',

      imagenUrl:
        taller.imagenUrl ||
        tallerOriginal.imagenUrl ||
        '',

      imagenClase:
        taller.imagenClase ||
        tallerOriginal.imagenClase ||
        '',

      profesor:
        taller.profesor ||
        tallerOriginal.profesor ||
        '',

      rutVoluntario: this.rut.trim(),
      nombreVoluntario: this.nombreCompleto.trim(),
      telefonoVoluntario: this.telefono.trim()
    };

    const yaExiste = misTalleres.some((item: any) =>
      Number(item.id || item.tallerId || item.idTaller) === Number(idTaller) &&
      String(item.rutVoluntario || item.rut || '').trim() === this.rut.trim()
    );

    if (!yaExiste) {
      misTalleres.push(tallerNormalizado);
      localStorage.setItem('misTalleres', JSON.stringify(misTalleres));
    } else {
      const actualizados = misTalleres.map((item: any) => {
        const mismoTaller =
          Number(item.id || item.tallerId || item.idTaller) === Number(idTaller) &&
          String(item.rutVoluntario || item.rut || '').trim() === this.rut.trim();

        return mismoTaller ? tallerNormalizado : item;
      });

      localStorage.setItem('misTalleres', JSON.stringify(actualizados));
    }

    console.log('Taller inscrito guardado correctamente:', tallerNormalizado);
  }

  volverDetalle() {
    this.router.navigate(['/detalle-taller']);
  }

  obtenerImagenClase(): string {
    const tallerActual: any = this.taller || {};
  
    return (
      tallerActual.imagenClase ||
      tallerActual.categoria ||
      tallerActual.etiqueta ||
      'taller-general'
    );
  }
}