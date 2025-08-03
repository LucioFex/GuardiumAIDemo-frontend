import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../../core/services/ats-api.service';

@Component({
  selector: 'app-results-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-container">
      <div *ngIf="!results" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-file-text"></i>
        </div>
        <h5>Panel de Resultados</h5>
        <p class="text-muted">Los resultados del análisis aparecerán aquí una vez que subas y analices un CV.</p>
      </div>

      <div *ngIf="results" class="results-content">
        <div class="status-badge-container mb-4">
          <div class="status-badge" [ngClass]="{
            'status-approved': results.aprobado === 'YES',
            'status-rejected': results.aprobado === 'NO',
            'status-unknown': results.aprobado === 'Unknown'
          }">
            <i class="bi" [ngClass]="{
              'bi-check-circle-fill': results.aprobado === 'YES',
              'bi-x-circle-fill': results.aprobado === 'NO',
              'bi-question-circle-fill': results.aprobado === 'Unknown'
            }"></i>
            <span class="status-text">
              {{ getStatusText(results.aprobado) }}
            </span>
          </div>
        </div>

        <div class="feedback-section">
          <h6 class="section-title">
            <i class="bi bi-chat-dots me-2"></i>
            Análisis Detallado
          </h6>
          <div class="feedback-content">
            <p [innerHTML]="formatFeedback(results.respuesta)"></p>
          </div>
        </div>

        <button 
          class="btn btn-outline-secondary btn-sm mt-3"
          (click)="onReset()">
          <i class="bi bi-arrow-clockwise"></i> Nuevo Análisis
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./results-panel.component.css']
})
export class ResultsPanelComponent {
  @Input() results: ApiResponse | null = null;

  getStatusText(status: string): string {
    switch (status) {
      case 'YES': return 'Aprobado';
      case 'NO': return 'Rechazado';
      case 'Unknown': return 'Pendiente';
      default: return 'Desconocido';
    }
  }

  formatFeedback(feedback: string): string {
    return feedback.replace(/\n/g, '<br>');
  }

  onReset() {
    this.results = null;
  }
}