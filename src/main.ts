import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { importProvidersFrom } from '@angular/core';

import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ResultsPanelComponent } from './components/results-panel/results-panel.component';
import { AtsApiService, ApiResponse, ChatRequest } from './services/ats-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FileUploadComponent, ResultsPanelComponent],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="d-flex justify-content-between align-items-center py-3">
            <div class="logo">
              <h2 class="mb-0">
                <i class="bi bi-person-check me-2"></i>
                ATS Analyzer
              </h2>
              <small class="text-muted">Evaluación Inteligente de CVs</small>
            </div>
            <div class="header-actions">
              <button 
                class="btn btn-outline-primary btn-sm"
                (click)="resetSession()"
                [disabled]="isLoading">
                <i class="bi bi-arrow-clockwise"></i>
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Navigation -->
      <nav class="navbar">
        <div class="container">
          <div class="nav-content">
            <div class="nav-item active">
              <i class="bi bi-upload me-2"></i>
              Análisis de CVs
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <div class="container">
          <div class="row g-4">
            <!-- Left Panel - File Upload -->
            <div class="col-lg-6">
              <div class="panel-card">
                <div class="panel-header">
                  <h5 class="panel-title">
                    <i class="bi bi-cloud-upload me-2"></i>
                    Subir CV
                  </h5>
                  <p class="panel-subtitle">Arrastra o selecciona un archivo PDF para analizar</p>
                </div>
                <div class="panel-content">
                  <app-file-upload 
                    #fileUpload
                    (fileSelected)="onFileSelected($event)"
                    (analyzeRequest)="onAnalyzeRequest()">
                  </app-file-upload>
                </div>
              </div>
            </div>

            <!-- Right Panel - Results -->
            <div class="col-lg-6">
              <div class="panel-card">
                <div class="panel-header">
                  <h5 class="panel-title">
                    <i class="bi bi-graph-up me-2"></i>
                    Resultados del Análisis
                  </h5>
                  <p class="panel-subtitle">Feedback detallado y evaluación del candidato</p>
                </div>
                <div class="panel-content">
                  <app-results-panel 
                    #resultsPanel
                    [results]="analysisResults">
                  </app-results-panel>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Messages -->
          <div class="row mt-4" *ngIf="statusMessage">
            <div class="col-12">
              <div class="alert" [ngClass]="{
                'alert-info': statusMessage.type === 'info',
                'alert-success': statusMessage.type === 'success',
                'alert-danger': statusMessage.type === 'error'
              }" role="alert">
                <i class="bi" [ngClass]="{
                  'bi-info-circle': statusMessage.type === 'info',
                  'bi-check-circle': statusMessage.type === 'success',
                  'bi-exclamation-triangle': statusMessage.type === 'error'
                }"></i>
                {{ statusMessage.text }}
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="text-center py-4">
            <p class="mb-2">
              <strong>ATS Analyzer</strong> - Sistema de Evaluación de CVs con IA
            </p>
            <small class="text-muted">
              Powered by OpenAI GPT-4 • Angular 19 • Bootstrap 5
            </small>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      background: white;
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .logo h2 {
      color: var(--primary-color);
      font-weight: 700;
    }

    .navbar {
      background: var(--primary-color);
      padding: 0.75rem 0;
    }

    .nav-content {
      display: flex;
      align-items: center;
    }

    .nav-item {
      color: white;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
    }

    .nav-item.active {
      background: rgba(255, 255, 255, 0.2);
    }

    .main-content {
      flex: 1;
      padding: 2rem 0;
    }

    .panel-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
    }

    .panel-card:hover {
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .panel-header {
      padding: 1.5rem 1.5rem 0;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 1.5rem;
    }

    .panel-title {
      color: var(--text-color);
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .panel-subtitle {
      color: var(--muted-color);
      font-size: 0.875rem;
      margin: 0;
    }

    .panel-content {
      flex: 1;
      padding: 0 1.5rem 1.5rem;
      display: flex;
      flex-direction: column;
    }

    .footer {
      background: var(--text-color);
      color: white;
      margin-top: auto;
    }

    .alert {
      border: none;
      border-radius: 8px;
      animation: fadeIn 0.5s ease;
    }

    .alert i {
      margin-right: 0.5rem;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 1rem 0;
      }
      
      .panel-card {
        margin-bottom: 1rem;
      }
    }
  `]
})
export class App {
  selectedFile: File | null = null;
  analysisResults: ApiResponse | null = null;
  isLoading = false;
  statusMessage: { type: 'info' | 'success' | 'error', text: string } | null = null;

  constructor(private atsService: AtsApiService) {}

  onFileSelected(file: File | null) {
    this.selectedFile = file;
    if (!file) {
      this.analysisResults = null;
      this.clearStatusMessage();
    }
  }

  async onAnalyzeRequest() {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.showStatusMessage('info', 'Procesando CV... Esto puede tomar unos segundos.');

    try {
      // Convert file to base64
      const base64 = await this.fileToBase64(this.selectedFile);
      
      const request: ChatRequest = {
        mensaje: "Analiza este CV y proporciona un feedback detallado sobre las fortalezas y debilidades del candidato.",
        archivo_pdf_b64: base64,
        GuardiumAI: true
      };

      this.atsService.analyzeCV(request).subscribe({
        next: (response) => {
          this.analysisResults = response;
          this.showStatusMessage('success', 'Análisis completado exitosamente.');
          this.isLoading = false;
          // Clear file upload state
          const fileUpload = document.querySelector('app-file-upload') as any;
          if (fileUpload?.setAnalyzing) {
            fileUpload.setAnalyzing(false);
          }
        },
        error: (error) => {
          console.error('Error analyzing CV:', error);
          this.showStatusMessage('error', 'Error al conectar con el servidor. Asegúrate de que la API esté ejecutándose en http://localhost:5001');
          this.isLoading = false;
          const fileUpload = document.querySelector('app-file-upload') as any;
          if (fileUpload?.setAnalyzing) {
            fileUpload.setAnalyzing(false);
          }
        }
      });
    } catch (error) {
      console.error('Error processing file:', error);
      this.showStatusMessage('error', 'Error al procesar el archivo. Asegúrate de que sea un PDF válido.');
      this.isLoading = false;
    }
  }

  resetSession() {
    this.atsService.resetChat().subscribe({
      next: () => {
        this.selectedFile = null;
        this.analysisResults = null;
        this.showStatusMessage('info', 'Sesión reiniciada. Puedes subir un nuevo CV.');
      },
      error: (error) => {
        console.error('Error resetting session:', error);
        this.showStatusMessage('error', 'Error al reiniciar la sesión. Asegúrate de que la API esté ejecutándose en http://localhost:5001');
      }
    });
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:application/pdf;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  private showStatusMessage(type: 'info' | 'success' | 'error', text: string) {
    this.statusMessage = { type, text };
    // Auto-clear after 5 seconds for success/info messages
    if (type !== 'error') {
      setTimeout(() => this.clearStatusMessage(), 5000);
    }
  }

  private clearStatusMessage() {
    this.statusMessage = null;
  }
}

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(HttpClientModule),
    AtsApiService
  ]
});