# Decisiones Arquitectonicas

## ADR-001: Arquitectura en capas (Routes → Controller → Service → Repository → Model)

Separacion estricta de responsabilidades. El controlador no toca Mongoose, el service no toca req/res, el repository es el unico que interactua con la base de datos. Facilita testing unitario con mocks del repository.

## ADR-002: MongoDB como base de datos

Elegido por flexibilidad de esquema, buen soporte para datos semi-estructurados (entradas emocionales con campos opcionales), y disponibilidad de MongoDB Atlas con plan gratuito.

## ADR-003: JWT para autenticacion

Par de tokens (access 15 min + refresh 7 dias) para sesiones stateless. El access token viaja en el header Authorization. El refresh token se envia al endpoint /auth/refresh para obtener un nuevo access token sin re-autenticar.

## ADR-004: Zustand para estado global en frontend

Elegido sobre Redux por su simplicidad, tamanio reducido y API basada en hooks. Estado de sesion persistido en localStorage via middleware persist.

## ADR-005: Tailwind CSS con sistema de diseno propio

Tokens de diseno (colores, tipografia, espaciado) configurados en tailwind.config.js. Paleta semantica (brand-primary, surface-bg, feedback-error) en vez de colores genericos. Mobile-first con breakpoint lg para desktop.

## ADR-006: Patron Bucket semanal para habit logs

Los logs de habitos se agrupan en documentos semanales (weekStart como lunes 00:00 UTC) con un array de entries por dia de la semana. Reduce el numero de documentos y facilita la consulta de rachas.

## ADR-007: Plataformas de despliegue

Render para backend, Vercel para frontend. Sin Docker (decision documentada con justificacion de la docente). Ver docs/architecture/adr-007-deployment-platforms.md para detalle completo.
