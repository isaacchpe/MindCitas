# GitHub Actions Workflows

## CI (ci.yml)

Se ejecuta en pull requests hacia develop y main, y en pushes a develop.

6 jobs en paralelo:
- lint-backend
- lint-frontend
- test-backend-unit
- test-backend-integration
- test-frontend-unit
- build-frontend

## CD (cd.yml)

Se ejecuta en pushes a main (despues de merge del PR).

2 jobs:
- deploy-backend: dispara webhook de Render
- deploy-frontend: build y deploy con Vercel CLI

## Secrets necesarios

Configurar en GitHub Settings > Secrets and variables > Actions:

| Secret | Descripcion | Donde obtenerlo |
|--------|-------------|-----------------|
| RENDER_DEPLOY_HOOK_URL | URL del deploy hook de Render | Render Dashboard > Service > Settings > Deploy Hook |
| VERCEL_TOKEN | Token personal de Vercel | Vercel Dashboard > Settings > Tokens |
| VERCEL_ORG_ID | ID de la organizacion en Vercel | Ejecutar `vercel link` en local, leer .vercel/project.json |
| VERCEL_PROJECT_ID | ID del proyecto en Vercel | Mismo archivo .vercel/project.json |
