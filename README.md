<!-- # GuardiumAIDemo-frontend
Frontend para la demo de IBM Guardium AI de Xelere

<img src="https://github.com/user-attachments/assets/4b6f2393-614a-482b-9478-e14f2866555d" width=750px height=auto>
-->

# GuardiumAIDemo-frontend

UI en **Angular 20** para la demo de *ATS + Guardium for AI*: subís un **CV (PDF)**, elegís **Industria** y **Profesión**, y la app muestra el **análisis** del candidato. Sirve para contrastar un CV “limpio” vs. uno con **prompt injection** y visualizar el bloqueo/auditoría que realiza el backend.

> Stack: Angular 20 + Bootstrap 5 + Bootstrap Icons + RxJS

## Vista rápida

- **Panel izquierdo**: Subir CV (drag & drop), “Industria”, “Profesión”, botón Analizar CV y estado *Analizando…*  
- **Panel derecho**: Resultados del Análisis con estado (p. ej. *APROBADO*) y feedback detallado.
- 🛡 **Botón Guardium AI**: Este botón activa el proxy que intercepta el input/output mediante la solución IBM Guardium IA Security.

<img width="450" height="auto" alt="ats_guardium" src="https://github.com/user-attachments/assets/83e8e3a5-28f8-4c7e-b3c3-e481daf4286f" />
<img width="550" height="auto" alt="ats_guardium_demo" src="https://github.com/user-attachments/assets/2645e4dc-4273-4d6b-a86a-99609d15aed0" />


## Requisitos

- **Node.js 18+** (LTS recomendado)  
- **npm** (o **pnpm**/**yarn**)  
- Backend corriendo (ver `README` del backend) con CORS habilitado

## Instalación

```bash
git clone https://github.com/LucioFex/GuardiumAIDemo-frontend.git
cd GuardiumAIDemo-frontend
npm install
```
