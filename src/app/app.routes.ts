import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/cv-analyzer/cv-analyzer.component').then(m => m.CvAnalyzerComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];