# Configuracion de GitHub

## Reglas de proteccion de ramas

### main

Configurar en Settings > Branches > Add branch protection rule:

- Branch name pattern: `main`
- Require a pull request before merging: activado
  - Required approving reviews: 1
  - Dismiss stale pull request approvals: activado
- Require status checks to pass before merging: activado
  - Status checks:
    - lint-backend
    - lint-frontend
    - test-backend-unit
    - test-backend-integration
    - test-frontend-unit
    - build-frontend
- Do not allow bypassing the above settings: activado

### develop

- Branch name pattern: `develop`
- Require status checks to pass before merging: activado
  - Mismos status checks que main

## Secrets

Ver .github/workflows/README.md para la lista de secrets.

## Flujo de trabajo

1. Crear rama desde develop: `feature/nombre-descriptivo`
2. Desarrollar y hacer commits con conventional commits en espanol
3. Abrir PR hacia develop
4. CI corre automaticamente (6 jobs)
5. Al menos 1 aprobacion de otro miembro del equipo
6. Merge a develop
7. Al cierre del sprint: PR de develop a main
8. CD despliega automaticamente a Render y Vercel
