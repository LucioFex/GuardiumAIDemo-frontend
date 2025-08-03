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
      color: #ff9999;
      margin-bottom: 1rem;
      transition: color 0.3s ease;
    }

    .results-content {
      flex: 1;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e5e5;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: fadeIn 0.6s ease;
    }

    .results-content:hover {
      border-color: var(--xelere-red-primary);
      box-shadow: 0 2px 8px rgba(220, 68, 68, 0.15);
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
      animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      transition: all 0.3s ease;
    }

    .status-badge:hover {
      transform: scale(1.05);
    }

    .status-approved {
      background: rgba(56, 161, 105, 0.15);
      color: var(--success-color);
      border: 2px solid var(--success-color);
    }

    .status-rejected {
      background: rgba(229, 62, 62, 0.1);
      color: var(--xelere-red-primary);
      border: 2px solid var(--xelere-red-primary);
    }

    .status-unknown {
      background: rgba(214, 158, 46, 0.15);
      color: var(--warning-color);
      border: 2px solid var(--warning-color);
    }

    .status-text {
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .section-title {
      color: var(--xelere-gray-dark);
      margin-bottom: 1rem;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .feedback-content {
      background: linear-gradient(135deg, #fff5f5, rgba(255, 229, 229, 0.6));
      border-radius: 8px;
      padding: 1.5rem;
      border-left: 4px solid var(--xelere-red-primary);
      line-height: 1.6;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: fadeIn 0.8s ease;
    }

    .feedback-content:hover {
      box-shadow: 0 2px 8px rgba(220, 68, 68, 0.25);
      transform: translateX(2px);
    }

    .feedback-content p {
      margin: 0;
      color: var(--xelere-black);
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
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