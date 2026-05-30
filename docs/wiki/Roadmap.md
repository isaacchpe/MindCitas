# Roadmap

## Funcionalidades no implementadas

### HU-08 — Chat anonimo (Socket.io)

Comunicacion en tiempo real entre estudiantes con anonimato. Requiere WebSocket, moderacion de contenido y manejo de sesiones persistentes.

**Estado:** no iniciada. Queda como deuda tecnica para Sprint 4.

**Dependencias:** infraestructura WebSocket, modelo de conversaciones/mensajes, moderacion automatica.

### HU-12 — Panel admin avanzado de moderacion

Gestion de tipos de sesion, horarios de profesionales y moderacion de contenido del chat.

**Estado:** parcialmente implementada. El Sprint 3 entrega admin basico (listar usuarios, activar/desactivar, metricas). La gestion de profesionales se hace via seeds. Depende de HU-08 para la parte de moderacion.

## Mejoras tecnicas pendientes

- Envio real de email en forgot-password (actualmente imprime token en consola)
- Blacklist de refresh tokens en logout
- Paginacion cursor-based para listas grandes
- Rate limiting por usuario ademas de por IP
- Logs estructurados con Winston o Pino
- Monitoreo de errores (Sentry o similar)
- Notificaciones push para recordatorios de habitos
- Tests de carga con k6 o Artillery

## Propuesta para Sprint 4

1. Implementar HU-08 (chat anonimo) con Socket.io
2. Implementar envio real de emails (SendGrid o Resend)
3. Agregar dashboard admin con graficas (Chart.js en panel admin)
4. Implementar notificaciones in-app
5. Migrar a plan pago de Render si el trafico lo justifica
