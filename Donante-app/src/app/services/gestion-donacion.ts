import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

export interface VecinoRegistro {
  rut: string;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  direccion: string;
}

export interface Vecino {
  rut: string;
  nombre?: string;
  apellido?: string;
  nombreCompleto?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
}

export interface TallerDonacion {
  id?: number;
  codigo?: number;

  nombre?: string;
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  profesor?: string;

  fecha?: string;
  hora?: string;
  horaInicio?: string;
  horaFin?: string;
  horario?: string;

  direccion?: string;
  lugar?: string;
  ubicacion?: string;

  cupos?: number;
  cuposDisponibles?: number;
  maxVoluntarios?: number;

  imagenUrl?: string;
  imagen?: string;

  estado?: string;
}

export interface ArticuloRequerido {
  id: number;

  nombre?: string;
  articulo?: string;
  nombreArticulo?: string;
  titulo?: string;

  descripcion?: string;
  detalle?: string;
  observacion?: string;

  cantidad?: number;
  cantidadRequerida?: number;
  cantidadNecesaria?: number;
  stockNecesario?: number;

  unidad?: string;
  estado?: string;
}

export interface DonacionApk {
  rutDonante: string;
  nombreDonante: string;
  telefonoDonante: string;
  correoDonante: string;
  direccionDonante: string;

  articulo: string;
  cantidad: number;
  descripcion: string;

  codigoTaller: number | null;
  nombreTaller: string;
}

@Injectable({
  providedIn: 'root'
})
export class GestionDonacionService {

  // APK / navegador: usa la IP actual de tu computador, no localhost en celular.
  private apiGestionUrl = 'http://192.168.1.229:8083/api/v1/gestion';

  // Backend admin talleres.
  private apiTalleresUrl = 'http://192.168.1.229:8081/api/talleres';
  private apiArticulosUrl = 'http://192.168.1.229:8081/api/articulos-requeridos';

  constructor(private http: HttpClient) {}

  registrarVecino(vecino: VecinoRegistro): Observable<Vecino> {
    const body: VecinoRegistro = {
      rut: this.normalizarRut(vecino.rut),
      nombreCompleto: vecino.nombreCompleto.trim(),
      correo: vecino.correo.trim(),
      telefono: vecino.telefono.trim(),
      direccion: vecino.direccion.trim()
    };

    return this.http.post<Vecino>(`${this.apiGestionUrl}/vecinos/registro`, body);
  }

  buscarVecinoPorRut(rut: string): Observable<Vecino> {
    const rutNormalizado = this.normalizarRut(rut);
    return this.http.get<Vecino>(`${this.apiGestionUrl}/vecinos/${encodeURIComponent(rutNormalizado)}`);
  }

  listarTalleres(): Observable<TallerDonacion[]> {
    return this.http.get<TallerDonacion[]>(this.apiTalleresUrl);
  }

  listarArticulosPorTaller(idTaller: number): Observable<ArticuloRequerido[]> {
    return this.http.get<ArticuloRequerido[]>(`${this.apiArticulosUrl}/taller/${idTaller}`);
  }

  enviarDonacion(donacion: DonacionApk): Observable<any> {
    const body: DonacionApk = {
      ...donacion,
      rutDonante: this.normalizarRut(donacion.rutDonante)
    };

    return this.http.post(`${this.apiGestionUrl}/apk/donacion`, body);
  }

  enviarDonaciones(donaciones: DonacionApk[]): Observable<any[]> {
    return forkJoin(
      donaciones.map(donacion => this.enviarDonacion(donacion))
    );
  }

  listarMisSolicitudes(rut: string): Observable<any[]> {
    const rutNormalizado = this.normalizarRut(rut);
    return this.http.get<any[]>(`${this.apiGestionUrl}/apk/mis-solicitudes/${encodeURIComponent(rutNormalizado)}`);
  }

  normalizarRut(rut: string): string {
    if (!rut) {
      return '';
    }

    let limpio = rut
      .trim()
      .replace(/\./g, '')
      .replace(/\s/g, '')
      .toUpperCase();

    if (!limpio) {
      return '';
    }

    if (limpio.includes('-')) {
      const partes = limpio.split('-');
      const cuerpo = partes[0];
      const dv = partes[1];

      if (cuerpo && dv) {
        return `${cuerpo}-${dv}`;
      }
    }

    if (limpio.length > 1) {
      const cuerpo = limpio.substring(0, limpio.length - 1);
      const dv = limpio.substring(limpio.length - 1);
      return `${cuerpo}-${dv}`;
    }

    return limpio;
  }
}