import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Taller {
  id: number;
  nombre: string;
  etiqueta?: string;
  descripcion?: string;
  profesor?: string;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  horario?: string;
  lugar?: string;
  direccion?: string;
  ubicacion?: string;
  cuposTotales?: number;
  cuposOcupados?: number;
  imagenUrl?: string;
  imagenClase?: string;
  estado?: string;
}

export interface InscripcionResponse {
  mensaje: string;
  tallerActualizado: Taller;
}

@Injectable({
  providedIn: 'root'
})
export class TallerService {

  // Backend administrador de talleres
  private apiTalleresUrl = 'http://192.168.1.170:8081/api/talleres';

  // Backend app voluntario
  private apiVoluntarioUrl = 'http://192.168.1.170:8080/api/voluntarios';

  // Para celular físico:
  // private apiTalleresUrl = 'http://IP-DE-TU-COMPUTADOR:8081/api/talleres';
  // private apiVoluntarioUrl = 'http://IP-DE-TU-COMPUTADOR:8080/api/voluntarios';

  constructor(private http: HttpClient) {}

  listarTalleres(): Observable<Taller[]> {
    return this.http.get<Taller[]>(this.apiTalleresUrl);
  }

  buscarTallerPorId(id: number): Observable<Taller> {
    return this.http.get<Taller>(`${this.apiTalleresUrl}/${id}`);
  }

  inscribirse(tallerId: number, rutVoluntario: string, nombreTaller: string): Observable<InscripcionResponse> {
    return this.http.post<InscripcionResponse>(
      `${this.apiVoluntarioUrl}/inscripciones/taller/${tallerId}`,
      {
        rutVoluntario,
        nombreTaller
      }
    );
  }
}

