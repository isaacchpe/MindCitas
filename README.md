# MindCitas

[![CI](https://github.com/isaacchpe/MindCitas/actions/workflows/ci.yml/badge.svg)](https://github.com/isaacchpe/MindCitas/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/node-%3E%3D20-green)
![License](https://img.shields.io/badge/license-Academic-blue)

Plataforma web de bienestar emocional para estudiantes universitarios.

## Descripcion del proyecto

MindCitas es una plataforma web responsiva de bienestar emocional dirigida a estudiantes universitarios colombianos. Nace de la necesidad identificada en el contexto academico de la Corporacion Universitaria Iberoamericana: los estudiantes enfrentan estres academico, ansiedad y dificultades emocionales que afectan su rendimiento y calidad de vida, pero carecen de herramientas accesibles para monitorear su bienestar y acceder a apoyo profesional.

La plataforma permite a los estudiantes registrar su estado emocional diario en una escala de 5 niveles, mantener un diario de reflexion personal, visualizar tendencias semanales y mensuales de su bienestar, construir micro-habitos saludables con un sistema de rachas e insignias, y agendar sesiones de apoyo con profesionales de psicologia, mindfulness y orientacion academica.

El proyecto se desarrolla en la materia Proyecto de Software, siguiendo metodologia Scrum con sprints de 3 semanas. La arquitectura sigue un patron en capas (Routes, Controller, Service, Repository, Model) con separacion estricta de responsabilidades.

## Estado del proyecto

| Recurso | URL |
|---------|-----|
| Backend (produccion) | https://mindcitas-api.onrender.com |
| Frontend (produccion) | https://mindcitas.vercel.app |
| Swagger UI | https://mindcitas-api.onrender.com/api/docs |
| Wiki | https://github.com/isaacchpe/MindCitas/wiki |

## Tecnologias

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Runtime | Node.js | 20 LTS |
| Backend framework | Express | 4.18 |
| ODM | Mongoose | 8.2 |
| Base de datos | MongoDB Atlas | 7.0 |
| Autenticacion | jsonwebtoken + bcrypt | 9.0 / 5.1 |
| Documentacion API | swagger-jsdoc + swagger-ui-express | 6.2 / 5.0 |
| Frontend framework | React | 18.2 |
| Bundler | Vite | 5.2 |
| Routing | React Router | 6.22 |
| Estado global | Zustand | 4.5 |
| Graficas | Chart.js + react-chartjs-2 | 4.4 / 5.2 |
| CSS | Tailwind CSS | 3.4 |
| Iconos | lucide-react | 0.469 |
| Testing backend | Jest + Supertest | 29.7 / 6.3 |
| Testing frontend | Vitest + Testing Library | 4.1 / 16.1 |
| E2E | Playwright | 1.60 |
| CI/CD | GitHub Actions | - |
| Deploy backend | Render | Free |
| Deploy frontend | Vercel | Free |

## Estructura del repositorio

```
mindCitas/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              (6 jobs en paralelo)
│   │   └── cd.yml              (deploy a Render + Vercel)
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
├── backend/
│   ├── scripts/                (seed, seed-badges, seed-professionals, swagger-export)
│   ├── tests/
│   │   ├── setup/db.js         (MongoMemoryServer)
│   │   └── integration/        (11 pruebas)
│   └── src/
│       ├── config/             (env, db, logger)
│       ├── middlewares/        (errorHandler, auth, requireRole, validate)
│       ├── utils/              (AppError, asyncHandler)
│       ├── docs/               (swagger)
│       └── modules/
│           ├── auth/           (6 endpoints)
│           ├── users/          (3 endpoints)
│           ├── emotional-entries/ (7 endpoints)
│           ├── habits/         (7 endpoints + badges)
│           ├── sessions/       (7 endpoints)
│           ├── admin/          (3 endpoints)
│           └── health/         (1 endpoint)
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── layout/         (AppShell, AuthLayout, SideNav, BottomNav)
│       │   ├── ui/             (Button, TextField, FormCard, MoodButton, Toast, LogoutModal)
│       │   ├── habits/         (HabitCard, HabitFormDrawer, BadgeShowcase)
│       │   ├── sessions/       (CalendarPicker, SessionCard)
│       │   └── dashboard/      (EmotionalAlert, TrendChart, ExportButton)
│       ├── pages/
│       │   ├── auth/           (Login, Register, ForgotPassword, ResetPassword)
│       │   └── app/            (Dashboard, Diary, Habits, Badges, Sessions, Booking)
│       ├── services/           (api, auth, emotional, habits, sessions)
│       ├── stores/             (auth, emotional, habits, sessions, toast)
│       └── lib/                (cn, date, mood)
├── tests/e2e/                  (6 pruebas Playwright)
├── docs/
│   ├── architecture/           (ADRs, notas de concurrencia)
│   ├── wiki/                   (respaldo de las paginas de la Wiki)
│   └── ROADMAP.md
└── vercel.json
```

## Guia de instalacion local

### Requisitos

- Node.js >= 20
- npm >= 9
- MongoDB Atlas (cuenta gratuita) o instancia local de MongoDB

### Pasos

1. Clonar el repositorio:

```bash
git clone https://github.com/isaacchpe/MindCitas.git
cd MindCitas
npm install
```

2. Backend:

```bash
cd backend
npm install
cp .env.example .env
```

Editar `backend/.env` con la URI de MongoDB y secretos JWT.

```bash
npm run seed                # usuario demo + admin
npm run seed:badges         # insignias base
npm run seed:professionals  # profesionales de sesiones
npm run dev
```

3. Frontend:

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

4. Verificar:
   - Backend: http://localhost:3000/api/health
   - Swagger: http://localhost:3000/api/docs
   - Frontend: http://localhost:5173

### Credenciales de prueba

| Usuario | Email | Contrasena | Rol |
|---------|-------|------------|-----|
| Demo | demo@mindcitas.local | Demo1234! | student |
| Admin | admin@mindcitas.local | Admin1234! | admin |

## Endpoints principales

34 endpoints distribuidos en 8 tags. Documentacion completa en Swagger UI.

| Modulo | Endpoints | Descripcion |
|--------|-----------|-------------|
| Auth | 6 | Registro, login, refresh, logout, forgot/reset password |
| Users | 3 | Perfil (GET/PUT /me), insignias del usuario |
| Emotional Entries | 7 | Registro diario, tendencias, exportar CSV, alerta |
| Habits | 7 | CRUD habitos, check diario, rachas |
| Badges | 1 | Catalogo de insignias |
| Sessions | 7 | Tipos, slots, agendar, listar, reprogramar, cancelar |
| Admin | 3 | Listar usuarios, activar/desactivar, estadisticas |
| Health | 1 | Estado del servicio |

## Despliegue

### Backend — Render

- Servicio: Web Service (Free)
- Region: Oregon (US-West)
- Build: `cd backend && npm install`
- Start: `cd backend && npm start`
- Health Check: `/api/health`
- Auto-Deploy: rama main

### Frontend — Vercel

- Framework: Vite
- Build: `cd frontend && npm install && npm run build`
- Output: `frontend/dist`
- Rewrites: SPA (todo a index.html)

### CD automatico

Push a main dispara `cd.yml`: webhook a Render + deploy con Vercel CLI.

Ver [docs/architecture/adr-007-deployment-platforms.md](docs/architecture/adr-007-deployment-platforms.md) para la justificacion de las plataformas elegidas.

## Contribuir

1. Crear rama desde develop: `feature/nombre-descriptivo`
2. Conventional commits en espanol: `feat: agregar filtro de sesiones`
3. Abrir PR hacia develop con la plantilla
4. CI debe pasar (6 jobs) + 1 aprobacion
5. Al cierre del sprint: PR de develop a main

Ver [docs/wiki/Guia-de-Estilo-de-Codigo.md](docs/wiki/Guia-de-Estilo-de-Codigo.md) para convenciones.

## Limitaciones conocidas

- Plan gratuito de Render: las instancias del backend se duermen despues de 15 minutos de inactividad. La primera peticion tras inactividad puede tardar 30-50 segundos.
- HU-08 (chat anonimo con Socket.io) no esta implementada. Ver [docs/ROADMAP.md](docs/ROADMAP.md).
- HU-12 (panel admin avanzado de moderacion) no esta implementada. Ver [docs/ROADMAP.md](docs/ROADMAP.md).
- El envio de emails en forgot-password es simulado (imprime token en consola en desarrollo).

## Equipo

| Nombre | Sprint 2 | Sprint 3 |
|--------|----------|----------|
| Yasser Daniel Ariza Barrios | Product Owner | Desarrollador |
| David Santiago Forero Lopez | Scrum Master | Product Owner |
| Isaac David Chavez Perez | Desarrollador | Scrum Master |

Los tres miembros participan en desarrollo. Los roles de PO y SM rotan cada sprint.

## Licencia

Proyecto academico desarrollado para la asignatura Proyecto de Software, Corporacion Universitaria Iberoamericana, semestre 2026-1. Uso exclusivamente educativo.
