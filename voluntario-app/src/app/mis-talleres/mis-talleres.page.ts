import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { TallerService } from '../services/taller';

@Component({
  selector: 'app-mis-talleres',
  templateUrl: './mis-talleres.page.html',
  styleUrls: ['./mis-talleres.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent
  ]
})
export class MisTalleresPage {

  cargando = false;
  talleres: any[] = [];

  constructor(
    private router: Router,
    private tallerService: TallerService
  ) {}

  ionViewWillEnter() {
    this.cargarMisTalleres();
  }

  cargarMisTalleres() {
    this.cargando = true;

    const inscritosGuardados = this.obtenerTalleresInscritosLocal();

    if (inscritosGuardados.length === 0) {
      this.talleres = [];
      this.cargando = false;
      return;
    }

    /*
      IMPORTANTE:
      Este método debe ser el mismo que usas en HOME para mostrar los talleres disponibles.
      Si en tu TallerService no se llama listarTalleres(), puede llamarse:
      - obtenerTalleres()
      - getTalleres()
      - listar()
      
      Usa exactamente el mismo método que usa home.page.ts.
    */
    this.tallerService.listarTalleres().subscribe({
      next: (talleresActuales: any[]) => {
        const idsInscritos = inscritosGuardados.map((item: any) =>
          Number(item.id || item.tallerId || item.idTaller)
        );

        this.talleres = talleresActuales
          .filter((taller: any) => {
            const idTaller = Number(taller.id || taller.tallerId || taller.idTaller);
            return idsInscritos.includes(idTaller);
          })
          .map((tallerActual: any) => {
            const inscritoLocal = inscritosGuardados.find((item: any) =>
              Number(item.id || item.tallerId || item.idTaller) ===
              Number(tallerActual.id || tallerActual.tallerId || tallerActual.idTaller)
            );

            return this.normalizarTaller({
              ...inscritoLocal,
              ...tallerActual
            });
          });

        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar talleres actualizados:', error);

        /*
          Si falla el backend, usamos el localStorage como respaldo.
          Pero lo ideal es que siempre cargue desde el backend.
        */
        this.talleres = inscritosGuardados.map((taller: any) =>
          this.normalizarTaller(taller)
        );

        this.cargando = false;
      }
    });
  }

  obtenerTalleresInscritosLocal(): any[] {
    try {
      const data = localStorage.getItem('misTalleres') || '[]';
      const talleresGuardados = JSON.parse(data);

      if (!Array.isArray(talleresGuardados)) {
        return [];
      }

      const usuarioGuardado =
        localStorage.getItem('usuarioActual') ||
        localStorage.getItem('voluntarioActual');

      let rutActual = '';

      if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        rutActual = usuario.rut || '';
      }

      return talleresGuardados.filter((taller: any) => {
        const rutTaller = taller.rutVoluntario || taller.rut || '';

        if (!rutActual) {
          return true;
        }

        if (!rutTaller) {
          return true;
        }

        return String(rutTaller).trim() === String(rutActual).trim();
      });

    } catch (error) {
      console.error('Error al leer misTalleres:', error);
      return [];
    }
  }

  normalizarTaller(taller: any) {
    const id =
      taller.id ||
      taller.tallerId ||
      taller.idTaller ||
      taller.codigoTaller ||
      taller.codigo ||
      taller.taller_id ||
      taller.taller?.id ||
      taller.taller?.codigoTaller;

    return {
      ...taller,

      id: id,
      tallerId: id,
      idTaller: id,

      nombre:
        taller.nombre ||
        taller.nombreTaller ||
        taller.titulo ||
        taller.tallerNombre ||
        taller.taller?.nombre ||
        'Taller sin nombre',

      descripcion:
        taller.descripcion ||
        taller.taller?.descripcion ||
        'Sin descripción disponible.',

      fecha:
        taller.fecha ||
        taller.taller?.fecha ||
        '',

      horaInicio:
        taller.horaInicio ||
        taller.hora ||
        taller.horarioInicio ||
        taller.taller?.horaInicio ||
        taller.taller?.hora ||
        '',

      horaFin:
        taller.horaFin ||
        taller.horarioFin ||
        taller.taller?.horaFin ||
        taller.taller?.horarioFin ||
        '',

      horario:
        taller.horario ||
        '',

      lugar:
        taller.lugar ||
        taller.ubicacion ||
        taller.direccion ||
        taller.taller?.lugar ||
        taller.taller?.ubicacion ||
        taller.taller?.direccion ||
        'Lugar por confirmar'
    };
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

  obtenerHorario(taller: any): string {
    const horaInicio =
      taller.horaInicio ||
      taller.hora ||
      taller.horarioInicio ||
      '';

    const horaFin =
      taller.horaFin ||
      taller.horarioFin ||
      '';

    if (horaInicio && horaFin) {
      return `${this.formatearHora(horaInicio)} - ${this.formatearHora(horaFin)}`;
    }

    if (horaInicio) {
      return this.formatearHora(horaInicio);
    }

    if (taller.horario) {
      return taller.horario;
    }

    return 'Horario por confirmar';
  }

  formatearHora(hora: string): string {
    if (!hora) {
      return '';
    }

    return String(hora).substring(0, 5);
  }

  tallerFinalizado(taller: any): boolean {
    if (!taller.fecha) {
      return false;
    }

    const horaFin =
      taller.horaFin ||
      taller.horarioFin ||
      taller.hora ||
      taller.horaInicio ||
      '23:59';

    const fechaHoraFin = new Date(`${taller.fecha}T${horaFin}`);

    if (isNaN(fechaHoraFin.getTime())) {
      return false;
    }

    return new Date().getTime() > fechaHoraFin.getTime();
  }

  irAComentario(taller: any) {
    const idTaller =
      taller.id ||
      taller.tallerId ||
      taller.idTaller ||
      taller.codigoTaller ||
      taller.codigo ||
      taller.taller_id;

    if (!idTaller) {
      console.error('El taller no tiene ID para comentar:', taller);
      alert('No se puede comentar este taller porque no tiene ID.');
      return;
    }

    const tallerParaComentario = {
      ...taller,
      id: Number(idTaller),
      tallerId: Number(idTaller),
      idTaller: Number(idTaller)
    };

    localStorage.setItem('tallerComentario', JSON.stringify(tallerParaComentario));

    console.log('Taller actualizado enviado a comentario:', tallerParaComentario);

    this.router.navigate(['/comentario-taller']);
  }

  volverHome() {
    this.router.navigate(['/home']);
  }
}