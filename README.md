# MindCitas
MindCitas es una plataforma web responsiva de bienestar emocional dirigida a estudiantes universitarios colombianos. Permite registrar el estado emocional diario, visualizar tendencias semanales y acceder a un diario de reflexión personal. Proyecto desarrollado en la materia Proyecto de Software de la Corporación Universitaria Iberoamericana, Sprint 2.

## Stack
- Backend: Node.js 20, Express 4, Mongoose 8, MongoDB Atlas, JWT, bcrypt
- Frontend: React 18, Vite 5, React Router 6, Zustand, Tailwind CSS 3, Chart.js
- Calidad: ESLint 8, Prettier 3, Husky 9, lint-staged
- Testing: Jest 29, Supertest
- CI: GitHub Actions

## Estructura del proyecto
```
mindCitas/
├── .github/workflows/ci.yml
├── backend/
│   ├── scripts/seed.js
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/          (env, db, logger)
│       ├── middlewares/      (errorHandler, notFound, authMiddleware, validate)
│       ├── utils/            (AppError, asyncHandler)
│       ├── docs/             (swagger)
│       └── modules/
│           ├── auth/         (model, repository, service, controller, validators, routes)
│           └── emotional-entries/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── layout/       (AppShell, AuthLayout, SideNav, BottomNav)
│       │   └── ui/           (Button, TextField, FormCard, MoodButton, Toast, PatternBanner)
│       ├── pages/
│       │   ├── auth/         (Login, Register, ForgotPassword, ResetPassword)
│       │   └── app/          (Dashboard, EmotionalDiary)
│       ├── services/         (api, auth, emotional)
│       ├── stores/           (auth, emotional, toast)
│       ├── lib/              (cn, date, mood)
│       └── styles/
└── docs/
```

## Sistema de diseño
### Colores
| Token | Hex | Uso |
|-------|-----|-----|
| brand-primary | #4A7C59 | Acciones principales, bienestar |
| brand-emotional | #7C6DAF | Módulo de diario emocional |
| brand-habits | #E6934A | Hábitos y rachas |
| text-primary | #2C3E50 | Texto principal |
| text-secondary | #6B7B8C | Texto secundario, hints |
| surface-bg | #F5F5F5 | Fondo de página |
| surface-card | #FFFFFF | Fondo de tarjetas |
| surface-border | #E1E5EA | Bordes y separadores |
| feedback-error | #D9534F | Errores |
| feedback-success | #4A7C59 | Confirmaciones |
| mood-1 a mood-5 | #D9534F, #E6934A, #F0C808, #7CB342, #4A7C59 | Niveles de ánimo |

### Tipografía

Familia: Inter (400, 500, 600, 700)

| Nombre | Tamaño | Peso | Line-height |
|--------|--------|------|-------------|
| display | 28px | 700 | 1.2 |
| h1 | 24px | 700 | 1.25 |
| h2 | 20px | 700 | 1.3 |
| h3 | 16px | 600 | 1.4 |
| body | 14px | 400 | 1.5 |
| caption | 12px | 400 | 1.4 |

## Variables de entorno

### Backend (`backend/.env.example`)

| Variable | Descripción |
|----------|-------------|
| PORT | Puerto del servidor (default 3000) |
| NODE_ENV | Entorno: development, production, test |
| MONGODB_URI | URI de conexión a MongoDB |
| JWT_ACCESS_SECRET | Secreto para access tokens |
| JWT_REFRESH_SECRET | Secreto para refresh tokens |
| JWT_ACCESS_EXPIRES | Duración del access token (ej: 15m) |
| JWT_REFRESH_EXPIRES | Duración del refresh token (ej: 7d) |
| CLIENT_URL | URL del frontend para CORS |

### Frontend (`frontend/.env.example`)

| Variable | Descripción |
|----------|-------------|
| VITE_API_URL | URL base de la API incluyendo /api |

## Scripts

### Raíz

- `npm run prepare` — instala hooks de Husky

### Backend

- `npm run dev` — servidor con nodemon
- `npm start` — servidor en producción
- `npm test` — pruebas unitarias con Jest
- `npm run seed` — crea usuario demo con datos de prueba
- `npm run lint` / `lint:fix` — análisis y corrección con ESLint
- `npm run format` — formateo con Prettier

### Frontend

- `npm run dev` — servidor de desarrollo Vite
- `npm run build` — build de producción
- `npm run preview` — previsualizar build
- `npm run lint` / `lint:fix` — análisis y corrección con ESLint
- `npm run format` — formateo con Prettier

## Cómo correr en local

1. Clonar el repositorio:

```bash
git clone https://github.com/isaacchpe/MindCitas.git
cd MindCitas
```

2. Instalar dependencias de la raíz (Husky + lint-staged):

```bash
npm install
```

3. Configurar y levantar el backend:

```bash
cd backend
npm install
cp .env.example .env
```

Editar `backend/.env` con la URI de MongoDB Atlas o local y los secretos JWT.

```bash
npm run dev
```

El servidor arranca en `http://localhost:3000`.

4. (Opcional) Cargar datos de prueba:

```bash
npm run seed
```

Crea el usuario `demo@mindcitas.local` con contraseña `Demo1234!` y 7 entradas emocionales.

5. Configurar y levantar el frontend:

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

El frontend arranca en `http://localhost:5173`.

## Swagger UI

Con el backend corriendo, abrir `http://localhost:3000/api/docs` en el navegador para explorar la documentación interactiva de la API.

## Verificación rápida

1. Iniciar el backend con `npm run dev` en `/backend`. Confirmar que `http://localhost:3000/api/docs` muestra la documentación Swagger.
2. Iniciar el frontend con `npm run dev` en `/frontend`. Ir a `http://localhost:5173/register` y registrar un usuario nuevo. Al completar el registro, el sistema redirige al dashboard.
3. En el dashboard, seleccionar un nivel de ánimo. Confirmar que aparece el toast "Registro guardado" y que la gráfica semanal se actualiza.
4. Navegar a `/app/diario`. Editar el registro del día: cambiar el mood y agregar una reflexión. Guardar.
5. Cerrar sesión desde el menú del avatar. Volver a iniciar sesión con las credenciales registradas.
6. Probar `/forgot-password` con el email registrado. En la consola del backend (en modo development) debe imprimirse el token de recuperación.

## Equipo Sprint 2

| Nombre | Rol |
|--------|-----|
| Yasser Ariza | Product Owner |
| David Forero | Scrum Master |
| Isaac Chávez | Desarrollador |

## Equipo de desarrollo

| Integrante | Rol Sprint 1 |
|------------|-------------|
| Isaac David Chávez Pérez | Product Owner |
| Yasser Daniel Ariza Barrios | Scrum Master |
| David Santiago Forero López | Desarrollador |

Los tres integrantes conforman el equipo de desarrollo. Los roles de PO y SM rotan en cada sprint.

---

## Documentación adicional

- Documento de formulación del proyecto (Actividad 1): disponible en la plataforma institucional.
- [Prototipo en Figma](https://www.figma.com/design/Uolf4sS9a5TvSVppiAypZX/MindCitas---Prototipo?node-id=2-69)
- [Tablero Jira](https://mindcitas.atlassian.net/jira/software/projects/MIN/boards/2)
- [Diagramas de arquitectura](docs/).

---

## Licencia

Proyecto académico desarrollado para la asignatura Proyecto de Software, Corporación Universitaria Iberoamericana, 2026-1. Uso exclusivamente educativo.
