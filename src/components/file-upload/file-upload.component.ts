import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="upload-container">
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
        [disabled]="!selectedFile || isAnalyzing"
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

    .upload-area {
      flex: 1;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }

    .upload-area:hover {
      border-color: #2563eb;
      background: #eff6ff;
      transform: translateY(-2px);
    }

    .upload-area.drag-over {
      border-color: #2563eb;
      background: #dbeafe;
      transform: scale(1.02);
    }

    .upload-area.has-file {
      border-color: #16a34a;
      background: #f0fdf4;
    }

    .upload-icon i {
      font-size: 3rem;
      color: #64748b;
      margin-bottom: 1rem;
    }

    .file-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .file-info i {
      font-size: 2.5rem;
    }

    .file-name {
      font-weight: 600;
      color: #1e293b;
    }

    .file-size {
      color: #64748b;
    }

    .upload-text {
      color: #64748b;
      margin: 0;
    }

    .analyze-btn {
      transition: all 0.3s ease;
    }

    .analyze-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
  `]
})
export class FileUploadComponent {
  @Output() fileSelected = new EventEmitter<File>();
  @Output() analyzeRequest = new EventEmitter<void>();

  selectedFile: File | null = null;
  isDragOver = false;
  isAnalyzing = false;

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
    if (this.selectedFile) {
      this.isAnalyzing = true;
      this.analyzeRequest.emit();
    }
  }

  setAnalyzing(state: boolean) {
    this.isAnalyzing = state;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}