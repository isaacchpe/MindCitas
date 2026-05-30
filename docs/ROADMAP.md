# Roadmap y deuda tecnica

## Funcionalidades pospuestas

### HU-08 — Chat anonimo (Socket.io)

Comunicacion en tiempo real entre estudiantes con anonimato. Requiere WebSocket (Socket.io), moderacion de contenido y manejo de sesiones persistentes. Queda fuera del Sprint 3 por complejidad y tiempo.

Dependencias: infraestructura de WebSocket en el backend, modelo de conversaciones y mensajes, moderacion automatica basica.

### HU-12 — Panel admin avanzado de moderacion

Gestion de tipos de sesion, horarios de profesionales y moderacion de contenido del chat. Depende de la implementacion de HU-08 (chat anonimo) para la parte de moderacion.

Estado actual: el Sprint 3 entrega un admin basico (listar usuarios, activar/desactivar, metricas). La gestion de profesionales y tipos de sesion se hace via seeds manuales.

## Mejoras tecnicas pendientes

- Envio real de email en forgot-password (actualmente imprime token en consola en dev)
- Blacklist de refresh tokens en logout
- Paginacion cursor-based para listas grandes
- Rate limiting por usuario ademas de por IP
- Logs estructurados con Winston o Pino
- Monitoreo de errores (Sentry o similar)
