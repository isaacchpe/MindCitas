# MindCitas

## Plataforma Web de Bienestar Emocional para Jóvenes Universitarios

MindCitas es una plataforma web desarrollada como proyecto del curso de Proyecto de Software de la Corporación Universitaria Iberoamericana, enmarcada en la **Línea 3: Mente Activa — Bienestar Mental y Hábitos Digitales**.

El sistema busca mejorar el acceso de los estudiantes universitarios a servicios de bienestar emocional, integrando en una sola plataforma el agendamiento de sesiones de apoyo psicológico, un diario emocional con visualización de patrones de ánimo, un sistema de micro-hábitos con gamificación y un espacio de chat anónimo entre pares.

---

## Problema que resuelve

Los estudiantes universitarios colombianos enfrentan barreras significativas para acceder a servicios de salud mental institucional: listas de espera prolongadas, horarios limitados, ausencia de herramientas de seguimiento entre sesiones y falta de espacios digitales seguros para recibir apoyo. MindCitas propone una solución tecnológica que digitaliza y simplifica este proceso, permitiendo gestionar el bienestar emocional desde cualquier dispositivo con conexión a internet.

---

## Funcionalidades principales

- Agendamiento de sesiones de bienestar emocional (psicología, mindfulness, orientación académica, grupos de apoyo) con calendario visual y código de confirmación.
- Diario emocional con registro diario del estado de ánimo en escala de 5 niveles, campo de reflexión opcional y gráficas de tendencia semanal y mensual.
- Sistema de micro-hábitos con catálogo predefinido y personalizable, rachas por días consecutivos, insignias por logros alcanzados y tablero de progreso.
- Chat anónimo entre pares en tiempo real con salas temáticas y alias anónimos generados automáticamente.
- Autenticación con JWT y control de acceso basado en roles (estudiante, profesional de bienestar, administrador).

---

## Stack tecnológico

| Capa | Tecnologías |
|------|-------------|
| Backend | Node.js v20 LTS, Express.js, Mongoose |
| Frontend | React 18, Vite, React Router, Zustand, Axios |
| Base de datos | MongoDB Atlas |
| Autenticación | JWT (jsonwebtoken), bcrypt |
| Tiempo real | Socket.io |
| Visualizaciones | Chart.js |
| Calidad de código | ESLint, Prettier |
| DevOps | Docker, docker-compose, GitHub Actions |
| Despliegue | Render (backend), Vercel (frontend) |
| Diseño | Figma |

---

## Estructura del proyecto

```
mindcitas/
+-- backend/
|   +-- src/
|   |   +-- config/          # Configuración de BD, variables de entorno
|   |   +-- controllers/     # Controladores de cada módulo
|   |   +-- middlewares/      # Auth JWT, validación, manejo de errores
|   |   +-- models/           # Modelos Mongoose (User, Session, etc.)
|   |   +-- routes/           # Definición de rutas de la API
|   |   +-- services/         # Lógica de negocio
|   |   +-- utils/            # Funciones auxiliares
|   +-- tests/                # Pruebas unitarias e integración
|   +-- .env.example
|   +-- package.json
|   +-- server.js
+-- frontend/
|   +-- src/
|   |   +-- components/       # Componentes reutilizables de React
|   |   +-- pages/            # Páginas principales
|   |   +-- services/         # Consumo de API con Axios
|   |   +-- context/          # Estado global (Zustand)
|   |   +-- assets/           # Imágenes y recursos estáticos
|   |   +-- styles/           # Estilos globales
|   +-- index.html
|   +-- package.json
|   +-- vite.config.js
+-- docs/
|   +-- ADR-001-stack-tecnologico.md
|   +-- ADR-002-base-de-datos.md
|   +-- arquitectura-c4.md
+-- .gitignore
+-- .eslintrc.json
+-- .prettierrc
+-- README.md
```

---

## Instalación y ejecución local

### Prerrequisitos

- Node.js v20 o superior
- npm v9 o superior
- MongoDB (local o cuenta en MongoDB Atlas)
- Git

### Clonar el repositorio

```bash
git clone https://github.com/[usuario]/mindcitas.git
cd mindcitas
```

### Configurar el backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con las credenciales de MongoDB y el secreto JWT
npm start
```

El servidor se levanta por defecto en `http://localhost:3000`.

### Configurar el frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación se levanta por defecto en `http://localhost:5173`.

---

## Variables de entorno

Crear un archivo `.env` en la carpeta `backend/` tomando como referencia `.env.example`:

```
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/mindcitas
JWT_SECRET=clave_secreta_aqui
JWT_EXPIRES_IN=30d
NODE_ENV=development
```

---

## Flujo de trabajo con Git

El proyecto utiliza Git Flow con las siguientes ramas:

- `main`: rama de producción. Solo recibe merges desde develop mediante Pull Request aprobado.
- `develop`: rama de integración. Aquí se consolidan las funcionalidades completadas.
- `feature/*`: ramas individuales para cada funcionalidad (ejemplo: `feature/agendamiento`, `feature/diario-emocional`).

Ninguna modificación se sube directamente a `main`. Todo pasa por Pull Request con revisión de al menos un integrante del equipo.

---

## Metodología

El proyecto se desarrolla bajo el marco de trabajo Scrum adaptado al contexto académico, con tres sprints correspondientes a los tres cortes del semestre:

- Sprint 1 (Corte 1, 26 de marzo): formulación, prototipado, arquitectura y setup del proyecto.
- Sprint 2 (Corte 2, 7 de mayo): desarrollo del núcleo funcional (API, base de datos, frontend, pruebas).
- Sprint 3 (Corte 3, 4 de junio): despliegue a producción, CI/CD, documentación y presentación final.

La gestión del proyecto se realiza en Jira con tablero Kanban.

---

## Equipo de desarrollo

| Integrante | Rol Sprint 1 |
|------------|-------------|
| Isaac David Chávez Pérez | Product Owner |
| Yasser Daniel Ariza Barrios | Scrum Master |
| Alberto Pérez | Desarrollador |

Los tres integrantes conforman el equipo de desarrollo. Los roles de PO y SM rotan en cada sprint.

---

## Documentación adicional

- Documento de formulación del proyecto (Actividad 1): disponible en la plataforma institucional.
- Prototipo en Figma: [enlace pendiente]
- Tablero Jira: [enlace pendiente]
- Diagramas de arquitectura: ver carpeta `docs/`.

---

## Licencia

Proyecto académico desarrollado para la asignatura Proyecto de Software, Corporación Universitaria Iberoamericana, 2026-1. Uso exclusivamente educativo.
