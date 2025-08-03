import { bootstrapApplication } from '@angular/platform-browser';
import { CvAnalyzerComponent } from './app/features/cv-analyzer/cv-analyzer.component';
import { appConfig } from './app/app.config';

bootstrapApplication(CvAnalyzerComponent, appConfig)
  .catch((err) => console.error(err));