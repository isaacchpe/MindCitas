# ADR-007: Plataformas de despliegue

## Estado

Aceptada

## Fecha

2026-05-28

## Contexto

El proyecto necesita desplegarse en produccion para la entrega del Sprint 3. Se requiere una solucion gratuita, sin tarjeta de credito, que soporte un backend Node.js con MongoDB y un frontend React con Vite.

Opciones evaluadas:

**Backend:**
- Render: plan gratuito sin tarjeta, contenedorizacion transparente, integracion directa con GitHub, health checks, deploy hooks.
- Railway: plan gratuito con limite de horas mensuales, requiere tarjeta para verificacion.

**Frontend:**
- Vercel: build automatico de Vite, preview deployments por PR, HTTPS automatico, rewrites para SPA.
- Netlify: funcionalidades similares, configuracion ligeramente mas compleja para monorepos.

## Decision

Render para el backend y Vercel para el frontend.

### Sobre Docker

No se incluye Dockerfile ni docker-compose en el repositorio. Justificacion:

1. La docente indico textualmente en la sesion sincronica del 21 de mayo de 2026: "si esta desplegada, no creo que necesitemos [Docker]".
2. Render contenedoriza internamente los servicios web. Agregar un Dockerfile solo por cumplir un requisito de checklist seria cosmetica sin valor tecnico real.
3. Honestidad academica: preferimos documentar la decision y su razonamiento en vez de agregar artefactos vacios.

## Configuracion

### Backend (Render)

- Servicio: Web Service
- Region: Oregon (US-West)
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && npm start`
- Health Check Path: `/api/health`
- Plan: Free
- Auto-Deploy: rama main

### Frontend (Vercel)

- Framework: Vite
- Root Directory: configurado via vercel.json en la raiz
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`
- Rewrites: `/(.*) → /index.html` (SPA)

## Consecuencias

### Positivas

- Cero costo para el equipo academico.
- Despliegue automatico al hacer merge a main (CD pipeline).
- HTTPS automatico en ambas plataformas.
- Preview deployments en Vercel para cada PR.

### Negativas

- Plan gratuito de Render: las instancias se duermen despues de 15 minutos de inactividad. La primera peticion tras inactividad tarda 30-50 segundos (cold start).
- Migracion futura a AWS, GCP u otra plataforma cloud requerira escribir un Dockerfile.
- El plan gratuito de Render tiene limite de 750 horas mensuales de ejecucion.
