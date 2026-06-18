import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadComponent: () => import('./inicio/inicio.page').then(m => m.InicioPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'donar',
    loadComponent: () => import('./donar/donar.page').then(m => m.DonarPage)
  },
  {
    path: 'comentario',
    loadComponent: () => import('./comentario/comentario.page').then(m => m.ComentarioPage)
  },
  {
    path: 'exito',
    loadComponent: () => import('./exito/exito.page').then(m => m.ExitoPage)
  },
  {
    path: 'mis-solicitudes',
    loadComponent: () => import('./mis-solicitudes/mis-solicitudes.page').then(m => m.MisSolicitudesPage)
  },
  {
    path: 'punto-acopio',
    loadComponent: () => import('./punto-acopio/punto-acopio.page').then( m => m.PuntoAcopioPage)
  }
];