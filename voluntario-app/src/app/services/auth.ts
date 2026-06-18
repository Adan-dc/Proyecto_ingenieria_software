import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Voluntario {
  id?: number;
  nombre: string;
  rut: string;
  telefono: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://192.168.1.170:8080/api/voluntarios';

  constructor(private http: HttpClient) {}

  registrar(voluntario: Voluntario): Observable<Voluntario> {
    return this.http.post<Voluntario>(`${this.apiUrl}/registro`, voluntario);
  }

  login(loginRequest: LoginRequest): Observable<Voluntario> {
    return this.http.post<Voluntario>(`${this.apiUrl}/login`, loginRequest);
  }
}
