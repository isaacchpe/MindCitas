# MindCitas

MindCitas es una plataforma web responsiva de bienestar emocional dirigida a estudiantes universitarios colombianos. Permite registrar el estado emocional diario, visualizar tendencias semanales y acceder a un diario de reflexion personal. Proyecto desarrollado en la materia Proyecto de Software de la Corporacion Universitaria Iberoamericana, Sprint 2.

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

## Sistema de diseno

### Colores

| Token | Hex | Uso |
|-------|-----|-----|
| brand-primary | #4A7C59 | Acciones principales, bienestar |
| brand-emotional | #7C6DAF | Modulo de diario emocional |
| brand-habits | #E6934A | Habitos y rachas |
| text-primary | #2C3E50 | Texto principal |
| text-secondary | #6B7B8C | Texto secundario, hints |
| surface-bg | #F5F5F5 | Fondo de pagina |
| surface-card | #FFFFFF | Fondo de tarjetas |
| surface-border | #E1E5EA | Bordes y separadores |
| feedback-error | #D9534F | Errores |
| feedback-success | #4A7C59 | Confirmaciones |
| mood-1 a mood-5 | #D9534F, #E6934A, #F0C808, #7CB342, #4A7C59 | Niveles de animo |

### Tipografia

Familia: Inter (400, 500, 600, 700)

| Nombre | Tamano | Peso | Line-height |
|--------|--------|------|-------------|
| display | 28px | 700 | 1.2 |
| h1 | 24px | 700 | 1.25 |
| h2 | 20px | 700 | 1.3 |
| h3 | 16px | 600 | 1.4 |
| body | 14px | 400 | 1.5 |
| caption | 12px | 400 | 1.4 |

## Variables de entorno

### Backend (`backend/.env.example`)

| Variable | Descripcion |
|----------|-------------|
| PORT | Puerto del servidor (default 3000) |
| NODE_ENV | Entorno: development, production, test |
| MONGODB_URI | URI de conexion a MongoDB |
| JWT_ACCESS_SECRET | Secreto para access tokens |
| JWT_REFRESH_SECRET | Secreto para refresh tokens |
| JWT_ACCESS_EXPIRES | Duracion del access token (ej: 15m) |
| JWT_REFRESH_EXPIRES | Duracion del refresh token (ej: 7d) |
| CLIENT_URL | URL del frontend para CORS |

### Frontend (`frontend/.env.example`)

| Variable | Descripcion |
|----------|-------------|
| VITE_API_URL | URL base de la API incluyendo /api |

## Scripts

### Raiz

- `npm run prepare` — instala hooks de Husky

### Backend

- `npm run dev` — servidor con nodemon
- `npm start` — servidor en produccion
- `npm test` — pruebas unitarias con Jest
- `npm run seed` — crea usuario demo con datos de prueba
- `npm run lint` / `lint:fix` — analisis y correccion con ESLint
- `npm run format` — formateo con Prettier

### Frontend

- `npm run dev` — servidor de desarrollo Vite
- `npm run build` — build de produccion
- `npm run preview` — previsualizar build
- `npm run lint` / `lint:fix` — analisis y correccion con ESLint
- `npm run format` — formateo con Prettier

## Como correr en local

1. Clonar el repositorio:

```bash
git clone https://github.com/isaacchpe/MindCitas.git
cd MindCitas
```

2. Instalar dependencias de la raiz (Husky + lint-staged):

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

Crea el usuario `demo@mindcitas.local` con contrasena `Demo1234!` y 7 entradas emocionales.

5. Configurar y levantar el frontend:

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

El frontend arranca en `http://localhost:5173`.

## Swagger UI

Con el backend corriendo, abrir `http://localhost:3000/api/docs` en el navegador para explorar la documentacion interactiva de la API.

## Verificacion rapida

1. Iniciar el backend con `npm run dev` en `/backend`. Confirmar que `http://localhost:3000/api/docs` muestra la documentacion Swagger.
2. Iniciar el frontend con `npm run dev` en `/frontend`. Ir a `http://localhost:5173/register` y registrar un usuario nuevo. Al completar el registro, el sistema redirige al dashboard.
3. En el dashboard, seleccionar un nivel de animo. Confirmar que aparece el toast "Registro guardado" y que la grafica semanal se actualiza.
4. Navegar a `/app/diario`. Editar el registro del dia: cambiar el mood y agregar una reflexion. Guardar.
5. Cerrar sesion desde el menu del avatar. Volver a iniciar sesion con las credenciales registradas.
6. Probar `/forgot-password` con el email registrado. En la consola del backend (en modo development) debe imprimirse el token de recuperacion.

## Equipo Sprint 2

| Nombre | Rol |
|--------|-----|
| Yasser Ariza | Product Owner |
| David Forero | Scrum Master |
| Isaac Chavez | Desarrollador |

Los tres miembros participan en desarrollo.
