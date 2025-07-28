import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="upload-container">
      <!-- Industry and Profession Selection -->
      <div class="selection-section mb-4">
        <div class="d-flex flex-column gap-3">
          <div>
            <label for="industry" class="form-label">
              <i class="bi bi-building me-2"></i>Industria *
            </label>
            <select 
              id="industry"
              class="form-select"
              [(ngModel)]="selectedIndustry"
              (change)="onIndustryChange()"
              required>
              <option value="">Selecciona una industria</option>
              <option *ngFor="let industry of industries" [value]="industry.key">
                {{ industry.name }}
              </option>
            </select>
          </div>
          <div>
            <label for="profession" class="form-label">
              <i class="bi bi-person-badge me-2"></i>Profesión *
            </label>
            <select 
              id="profession"
              class="form-select"
              [(ngModel)]="selectedProfession"
              [disabled]="!selectedIndustry"
              required>
              <option value="">Selecciona una profesión</option>
              <option *ngFor="let profession of availableProfessions" [value]="profession">
                {{ profession }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div 
        class="upload-area"
        [class.drag-over]="isDragOver"
        [class.has-file]="selectedFile"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()">
        
        <input 
          #fileInput
          type="file" 
          accept=".pdf"
          (change)="onFileSelected($event)"
          style="display: none;">
        
        <div class="upload-content">
          <div class="upload-icon" *ngIf="!selectedFile">
            <i class="bi bi-cloud-upload"></i>
          </div>
          <div class="file-info" *ngIf="selectedFile">
            <i class="bi bi-file-earmark-pdf text-danger"></i>
            <span class="file-name">{{ selectedFile.name }}</span>
            <small class="file-size">{{ formatFileSize(selectedFile.size) }}</small>
          </div>
          <p class="upload-text" *ngIf="!selectedFile">
            <strong>Arrastra tu CV aquí</strong><br>
            <small>o haz clic para seleccionar un archivo PDF</small>
          </p>
          <button 
            *ngIf="selectedFile" 
            class="btn btn-outline-danger btn-sm mt-2"
            (click)="clearFile($event)">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>
      </div>
      
      <button 
        class="btn btn-primary btn-lg w-100 mt-3 analyze-btn"
        [disabled]="!canAnalyze() || isAnalyzing"
        (click)="onAnalyze()">
        <span *ngIf="!isAnalyzing">
          <i class="bi bi-search"></i> Analizar CV
        </span>
        <span *ngIf="isAnalyzing">
          <span class="spinner-border spinner-border-sm me-2"></span>
          Analizando...
        </span>
      </button>
    </div>
  `,
  styles: [`
    .upload-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .selection-section {
      background: linear-gradient(135deg, var(--lime-light), rgba(236, 243, 158, 0.5));
      border-radius: 8px;
      padding: 1.5rem;
      border: 1px solid var(--sage-light);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: fadeIn 0.6s ease;
    }

    .selection-section:hover {
      box-shadow: 0 2px 8px rgba(144, 169, 85, 0.2);
      transform: translateY(-1px);
      border-color: var(--forest-medium);
    }

    .form-label {
      font-weight: 600;
      color: var(--forest-darkest);
      margin-bottom: 0.5rem;
      transition: color 0.3s ease;
    }

    .form-select {
      background: white;
      color: var(--forest-darkest);
      border-radius: 6px;
      border: 1px solid var(--sage-light);
      padding: 0.75rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: slideDown 0.3s ease;
    }

    .form-select:focus {
      border-color: var(--forest-dark);
      box-shadow: 0 0 0 3px rgba(79, 119, 45, 0.2);
      transform: translateY(-1px);
    }

    .form-select:disabled {
      background-color: rgba(236, 243, 158, 0.3);
      color: var(--forest-medium);
      opacity: 0.7;
      transition: all 0.3s ease;
    }

    .upload-area {
      flex: 1;
      border: 2px dashed var(--sage-light);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      background: rgba(236, 243, 158, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }

    .upload-area:hover {
      border-color: var(--forest-dark);
      background: rgba(236, 243, 158, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(144, 169, 85, 0.2);
    }

    .upload-area.drag-over {
      border-color: var(--forest-dark);
      background: rgba(144, 169, 85, 0.4);
      transform: scale(1.02);
      animation: pulse 0.6s ease-in-out;
    }

    .upload-area.has-file {
      border-color: var(--forest-medium);
      background: rgba(144, 169, 85, 0.3);
      animation: scaleIn 0.3s ease;
    }

    .upload-icon i {
      font-size: 3rem;
      color: var(--sage-light);
      margin-bottom: 1rem;
      transition: color 0.3s ease;
    }

    .file-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      animation: fadeIn 0.5s ease;
    }

    .file-info i {
      font-size: 2.5rem;
    }

    .file-name {
      font-weight: 600;
      color: var(--forest-darkest);
    }

    .file-size {
      color: var(--forest-medium);
    }

    .upload-text {
      color: var(--sage-light);
      margin: 0;
      transition: color 0.3s ease;
    }

    .analyze-btn {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: #31572C !important;
      color: white !important;
      border: none !important;
      font-weight: 600;
    }

    .analyze-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      background: var(--forest-darkest) !important;
      box-shadow: 0 4px 12px rgba(19, 42, 19, 0.4);
    }

    .analyze-btn:disabled {
      transition: all 0.3s ease;
      opacity: 0.6;
    }
  `]
})
export class FileUploadComponent {
  @Output() fileSelected = new EventEmitter<File>();
  @Output() analyzeRequest = new EventEmitter<{file: File, profession: string}>();

  selectedFile: File | null = null;
  selectedIndustry: string = '';
  selectedProfession: string = '';
  isDragOver = false;
  isAnalyzing = false;

  industries = [
    { key: 'technology', name: 'Tecnología' },
    { key: 'health', name: 'Salud' },
    { key: 'business', name: 'Negocios y Finanzas' },
    { key: 'arts', name: 'Arte y Comunicación' }
  ];

  professionsByIndustry: { [key: string]: string[] } = {
    technology: [
      'Desarrollador Backend',
      'Especialista en Ciberseguridad',
      'Frontend Developer',
      'Data Engineer',
      'DevOps Engineer',
      'Arquitecto de Soluciones'
    ],
    health: [
      'Médico Clínico',
      'Enfermero/a',
      'Psicólogo/a',
      'Kinesiólogo/a',
      'Técnico en Radiología',
      'Bioquímico/a'
    ],
    business: [
      'Analista Financiero',
      'Contador Público',
      'Auditor Externo',
      'Asesor de Inversiones',
      'Gerente de Producto',
      'Analista de Riesgo Crediticio'
    ],
    arts: [
      'Diseñador Gráfico',
      'Periodista',
      'Productor Audiovisual',
      'Community Manager',
      'Fotógrafo',
      'Guionista'
    ]
  };

  get availableProfessions(): string[] {
    return this.selectedIndustry ? this.professionsByIndustry[this.selectedIndustry] || [] : [];
  }

  onIndustryChange() {
    this.selectedProfession = '';
  }

  canAnalyze(): boolean {
    return !!(this.selectedFile && this.selectedIndustry && this.selectedProfession);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    if (file.type === 'application/pdf') {
      this.selectedFile = file;
      this.fileSelected.emit(file);
    } else {
      alert('Por favor selecciona un archivo PDF válido.');
    }
  }

  clearFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.fileSelected.emit(null as any);
  }

  onAnalyze() {
    if (this.canAnalyze()) {
      this.isAnalyzing = true;
      this.analyzeRequest.emit({
        file: this.selectedFile!,
        profession: this.selectedProfession
      });
    }
  }

  setAnalyzing(state: boolean) {
    this.isAnalyzing = state;
  }

  reset() {
    this.selectedFile = null;
    this.selectedIndustry = '';
    this.selectedProfession = '';
    this.isAnalyzing = false;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}