import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { ResultsPanelComponent } from '../../shared/components/results-panel/results-panel.component';
import { AtsApiService, ApiResponse, ChatRequest } from '../../core/services/ats-api.service';

@Component({
  selector: 'app-cv-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent, ResultsPanelComponent],
  styleUrls: ['./cv-analyzer.component.css'],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="header-content">
            <div class="brand">
              <div class="logo">
                <img class="xelere-logo" src="assets/xelere_dark.png">
              </div>
              <div class="brand-text">
                <h1 class="brand-title">Demo ATS Guardium AI Security</h1>
                <p class="brand-subtitle">Análisis inteligente de CVs con IA</p>
              </div>
            </div>
            <div class="header-actions">
              <div class="form-check form-switch">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="guardiumSwitch"
                  [checked]="guardiumEnabled"
                  (change)="onGuardiumToggle($event)">
                <label class="form-check-label" for="guardiumSwitch">
                  <i class="bi bi-shield-check me-1"></i>
                  Guardium AI
                </label>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Status Messages -->
      <div class="container" *ngIf="statusMessage">
        <div class="alert" [ngClass]="{
          'alert-info': statusMessage.type === 'info',
          'alert-success': statusMessage.type === 'success',
          'alert-danger': statusMessage.type === 'error'
        }">
          <i class="bi" [ngClass]="{
            'bi-info-circle': statusMessage.type === 'info',
            'bi-check-circle': statusMessage.type === 'success',
            'bi-exclamation-triangle': statusMessage.type === 'error'
          }"></i>
          {{ statusMessage.text }}
        </div>
      </div>

      <!-- Main Content -->
      <main class="main-content">
        <div class="container">
          <div class="row g-4">
            <!-- Upload Panel -->
            <div class="col-lg-6">
              <div class="panel-card">
                <div class="panel-header">
                  <h3 class="panel-title">
                    <i class="bi bi-cloud-upload me-2"></i>
                    Subir CV
                  </h3>
                  <p class="panel-subtitle">Arrastra o selecciona un archivo PDF para analizar</p>
                </div>
                <div class="panel-content">
                  <app-file-upload 
                    #fileUpload
                    (fileSelected)="onFileSelected($event)"
                    (analyzeRequest)="onAnalyzeRequest($event)">
                  </app-file-upload>
                </div>
              </div>
            </div>

            <!-- Results Panel -->
            <div class="col-lg-6">
              <div class="panel-card">
                <div class="panel-header">
                  <h3 class="panel-title">
                    <i class="bi bi-bar-chart me-2"></i>
                    Resultados del Análisis
                  </h3>
                  <p class="panel-subtitle">Feedback detallado y evaluación del candidato</p>
                </div>
                <div class="panel-content">
                  <app-results-panel [results]="analysisResults"></app-results-panel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-main">
              <div class="footer-brand">
                <h4 class="footer-title">Demo ATS Guardium AI</h4>
                <p class="footer-description">
                  Plataforma de análisis inteligente de CVs utilizando tecnología de IA avanzada 
                  para optimizar procesos de selección de talento.
                </p>
              </div>
              
              <div class="footer-credits">
                <h5 class="credits-title">Desarrollado por</h5>
                <div class="company-logos">
                  <div class="company-item">
                    <span class="company-name">
                      <img class="xelere-logo-footer" src="assets/xelere_dark.png">
                    </span>
                  </div>
                  <div class="company-item">
                    <span class="company-name">
                      <img class="ibm-logo-footer" src="assets/ibm_dark.png">
                    </span>
                  </div>
                  <div class="company-item">
                    <img class="guardium-logo-footer" src="assets/guardium.png">
                    <span class="company-name">IBM Guardium AI Security</span>
                  </div>
                </div>
              </div>

              <div class="footer-social">
                <h5 class="social-title">Síguenos</h5>
                <div class="social-links">
                  <a href="#" class="social-link">
                    <i class="bi bi-linkedin"></i>
                  </a>
                  <a href="#" class="social-link">
                    <i class="bi bi-github"></i>
                  </a>
                  <a href="#" class="social-link">
                    <i class="bi bi-twitter"></i>
                  </a>
                </div>
              </div>
            </div>

            <div class="footer-bottom">
              <div class="footer-divider"></div>
              <div class="footer-bottom-content">
                <p class="copyright">© 2025 Xelere. Licencia MIT.</p>
                <p class="tech-stack">Desarrollado con Angular 20 + Bootstrap 5</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class CvAnalyzerComponent {
  @ViewChild('fileUpload') fileUploadComponent!: FileUploadComponent;
  
  selectedFile: File | null = null;
  analysisResults: ApiResponse | null = null;
  isLoading = false;
  guardiumEnabled = false;
  statusMessage: { type: 'info' | 'success' | 'error', text: string } | null = null;

  constructor(private atsService: AtsApiService) {}

  onFileSelected(file: File | null) {
    this.selectedFile = file;
    if (!file) {
      this.analysisResults = null;
      this.clearStatusMessage();
    }
  }

  async onAnalyzeRequest(data: {file: File, profession: string}) {
    if (!data.file || !data.profession) return;

    this.isLoading = true;
    this.showStatusMessage('info', 'Procesando CV... Esto puede tomar unos segundos.');

    try {
      // Convert file to base64
      const base64 = await this.fileToBase64(data.file);
      
      const request: ChatRequest = {
        mensaje: `Dime si este candidato es un buen fit para la posición: ${data.profession}`,
        archivo_pdf_b64: base64,
        GuardiumAI: this.guardiumEnabled
      };

      this.atsService.analyzeCV(request).subscribe({
        next: (response) => {
          this.analysisResults = response;
          this.showStatusMessage('success', 'Análisis completado exitosamente.');
          this.isLoading = false;
          this.fileUploadComponent.setAnalyzing(false);
        },
        error: (error) => {
          console.error('Error analyzing CV:', error);
          this.showStatusMessage('error', 'Error al conectar con el servidor. Asegúrate de que la API esté ejecutándose en http://localhost:5001');
          this.isLoading = false;
          this.fileUploadComponent.setAnalyzing(false);
        }
      });
    } catch (error) {
      console.error('Error processing file:', error);
      this.showStatusMessage('error', 'Error al procesar el archivo. Asegúrate de que sea un PDF válido.');
      this.isLoading = false;
      this.fileUploadComponent.setAnalyzing(false);
    }
  }

  resetSession() {
    this.atsService.resetChat().subscribe({
      next: () => {
        this.selectedFile = null;
        this.analysisResults = null;
        // Reset file upload component
        const fileUpload = document.querySelector('app-file-upload') as any;
        if (fileUpload?.reset) {
          fileUpload.reset();
        }
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

  onGuardiumToggle(event: any) {
    this.guardiumEnabled = event.target.checked;
  }

  toggleGuardium() {
    this.guardiumEnabled = !this.guardiumEnabled;
  }
}