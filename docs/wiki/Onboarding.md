# Onboarding para nuevos integrantes

## Requisitos previos

- Node.js >= 20 (recomendado usar nvm)
- npm >= 9
- Git
- MongoDB Atlas cuenta gratuita o instancia local de MongoDB
- Editor: VS Code recomendado con extensiones ESLint y Prettier

## Primer dia

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/isaacchpe/MindCitas.git
   cd MindCitas
   ```

2. Instalar dependencias raiz (Husky + lint-staged):
   ```bash
   npm install
   ```

3. Configurar y levantar el backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Editar .env con tu URI de MongoDB
   npm run seed          # usuario demo
   npm run seed:badges   # insignias base
   npm run seed:professionals  # profesionales
   npm run dev
   ```

4. Configurar y levantar el frontend:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

5. Verificar que todo funciona:
   - Backend: http://localhost:3000/api/health
   - Swagger: http://localhost:3000/api/docs
   - Frontend: http://localhost:5173

## Recursos del stack

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [Jest](https://jestjs.io/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

## Recursos del dominio

- Bienestar emocional universitario
- Escala de mood 1-5 (Muy mal a Muy bien)
- Sistema de rachas para habitos de autocuidado
- Agendamiento de sesiones con profesionales de apoyo

## Flujo de trabajo

1. Tomar una tarea del tablero (Jira/GitHub Projects)
2. Crear rama desde develop: `feature/nombre-descriptivo`
3. Desarrollar con conventional commits en espanol
4. Abrir PR hacia develop
5. Esperar CI verde y 1 aprobacion
6. Merge
