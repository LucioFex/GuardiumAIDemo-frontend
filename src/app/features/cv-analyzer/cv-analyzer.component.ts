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
                <div class="xelere-logo">X</div>
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
                    <div class="xelere-logo">X</div>
                    <span class="company-name">Xelere</span>
                  </div>
                  <div class="company-item">
                    <img src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=24&h=24&fit=crop" 
                         alt="IBM" class="company-logo">
                    <span class="company-name">IBM</span>
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
                <p class="copyright">© 2025 Xelere. Todos los derechos reservados.</p>
                <p class="tech-stack">Desarrollado con Angular 20 + Bootstrap 5</p>
              </div>
            </div>
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
      background: linear-gradient(135deg, var(--xelere-black), var(--xelere-gray-dark));
      color: white;
      padding: 1.5rem 0;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo {
      display: flex;
      align-items: center;
    }

    .xelere-logo {
      width: 48px;
      height: 48px;
      background: var(--xelere-red-primary);
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 24px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .xelere-logo:hover {
      background: var(--xelere-red-light);
      transform: rotate(5deg) scale(1.05);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      transition: color 0.3s ease;
    }

    .brand-subtitle {
      margin: 0;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 400;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .form-check-label {
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .form-check-label:hover {
      color: white;
    }

    .form-check-input:checked {
      background-color: var(--xelere-red-primary);
      border-color: var(--xelere-red-primary);
    }

    .main-content {
      flex: 1;
      padding: 3rem 0;
      background: linear-gradient(135deg, #f8f9fa, #ffffff);
    }

    .panel-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(220, 68, 68, 0.1);
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      animation: fadeIn 0.6s ease;
    }

    .panel-card:hover {
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
      border-color: var(--xelere-red-primary);
    }

    .panel-header {
      padding: 1.5rem 1.5rem 0;
      border-bottom: 1px solid #e5e5e5;
      background: linear-gradient(135deg, #fff5f5, rgba(255, 229, 229, 0.5));
      margin-bottom: 1.5rem;
      border-radius: 12px 12px 0 0;
    }

    .panel-title {
      color: var(--xelere-black);
      font-weight: 600;
      margin-bottom: 0.5rem;
      transition: color 0.3s ease;
    }

    .panel-subtitle {
      color: var(--xelere-gray-dark);
      font-size: 0.875rem;
      margin: 0;
      opacity: 0.8;
    }

    .panel-content {
      flex: 1;
      padding: 0 1.5rem 1.5rem;
      display: flex;
      flex-direction: column;
    }

    .footer {
      background: var(--xelere-black);
      color: white;
      margin-top: auto;
      padding: 3rem 0 1rem;
    }

    .footer-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .footer-main {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer-title {
      color: var(--xelere-red-light);
      font-weight: 700;
      margin: 0;
      font-size: 1.5rem;
      transition: color 0.3s ease;
    }

    .footer-title:hover {
      color: var(--xelere-red-light);
    }

    .footer-description {
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .footer-credits {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .credits-title, .social-title {
      color: #ff6b6b;
      font-weight: 600;
      margin: 0;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .company-logos {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .company-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    .company-item:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(5px);
    }

    .company-logo {
      width: 24px;
      height: 24px;
      object-fit: contain;
      filter: brightness(0) invert(1);
      transition: filter 0.3s ease;
    }

    .company-item:hover .company-logo {
      filter: brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(340deg);
    }

    .company-item:hover .xelere-logo {
      background: #ff6b6b;
      transform: rotate(5deg);
    }

    .company-name {
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
      font-size: 0.9rem;
      transition: color 0.3s ease;
    }

    .company-item:hover .company-name {
      color: white;
    }

    .footer-social {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      text-decoration: none;
      font-size: 1.2rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .social-link:hover {
      background: var(--xelere-red-primary);
      color: white;
      transform: translateY(-3px) scale(1.1);
      box-shadow: 0 4px 12px rgba(220, 68, 68, 0.35);
    }

    .footer-bottom {
      margin-top: 1rem;
    }

    .footer-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      margin-bottom: 1.5rem;
    }

    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .copyright {
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      font-size: 0.9rem;
    }

    .tech-stack {
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
      font-size: 0.85rem;
      font-style: italic;
    }

    .alert {
      border: none;
      border-radius: 8px;
      animation: slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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

      .footer-main {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
      }

      .footer-bottom-content {
        flex-direction: column;
        text-align: center;
      }

      .social-links {
        justify-content: center;
      }
    }
  `]
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