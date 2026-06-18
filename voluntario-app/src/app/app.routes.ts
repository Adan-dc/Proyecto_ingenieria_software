import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
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
    path: 'detalle-taller',
    loadComponent: () => import('./detalle-taller/detalle-taller.page').then(m => m.DetalleTallerPage)
  },
  {
    path: 'inscripcion',
    loadComponent: () => import('./inscripcion/inscripcion.page').then(m => m.InscripcionPage)
  },
  {
    path: 'inscripcion-exitosa',
    loadComponent: () => import('./inscripcion-exitosa/inscripcion-exitosa.page').then(m => m.InscripcionExitosaPage)
  },
  {
    path: 'mis-talleres',
    loadComponent: () => import('./mis-talleres/mis-talleres.page').then(m => m.MisTalleresPage)
  },
  {
    path: 'taller-finalizado',
    loadComponent: () => import('./taller-finalizado/taller-finalizado.page').then(m => m.TallerFinalizadoPage)
  },
  {
    path: 'comentario-taller',
    loadComponent: () => import('./comentario-taller/comentario-taller.page').then(m => m.ComentarioTallerPage)
  },
  {
    path: 'mi-cuenta',
    loadComponent: () => import('./mi-cuenta/mi-cuenta.page').then(m => m.MiCuentaPage)
  }
];