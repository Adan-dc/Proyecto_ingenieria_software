import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComentarioTallerService {

  private apiUrl = 'http://192.168.1.170:8081/api/comentarios';

  constructor(private http: HttpClient) {}

  obtenerComentario(voluntarioId: number, tallerId: number) {
    return this.http.get(`${this.apiUrl}/voluntario/${voluntarioId}/taller/${tallerId}`);
  }

  guardarComentario(body: any) {
    return this.http.post(`${this.apiUrl}`, body);
  }
}