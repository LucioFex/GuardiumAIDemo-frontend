import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../services/ats-api.service';

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
  styles: [`
    .results-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
      color: #64748b;
    }

    .empty-icon i {
      font-size: 4rem;
      color: #cbd5e1;
      margin-bottom: 1rem;
    }

    .results-content {
      flex: 1;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .status-badge-container {
      display: flex;
      justify-content: center;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1.1rem;
      animation: slideIn 0.5s ease;
    }

    .status-approved {
      background: #dcfce7;
      color: #16a34a;
      border: 2px solid #bbf7d0;
    }

    .status-rejected {
      background: #fef2f2;
      color: #dc2626;
      border: 2px solid #fecaca;
    }

    .status-unknown {
      background: #fef3c7;
      color: #d97706;
      border: 2px solid #fed7aa;
    }

    .status-text {
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .section-title {
      color: #374151;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .feedback-content {
      background: #f8fafc;
      border-radius: 8px;
      padding: 1.5rem;
      border-left: 4px solid #2563eb;
      line-height: 1.6;
    }

    .feedback-content p {
      margin: 0;
      color: #374151;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
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