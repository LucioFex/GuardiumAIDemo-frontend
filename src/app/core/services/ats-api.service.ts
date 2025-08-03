import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse {
  respuesta: string;
  aprobado: 'YES' | 'NO' | 'Unknown' | 'Prompt-Injection-Detected';
}

export interface ChatRequest {
  mensaje: string;
  archivo_pdf_b64?: string;
  GuardiumAI?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AtsApiService {
  private baseUrl = 'http://localhost:5001';

  constructor(private http: HttpClient) {}

  analyzeCV(request: ChatRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/chat`, request);
  }

  resetChat(): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset`, {});
  }
}