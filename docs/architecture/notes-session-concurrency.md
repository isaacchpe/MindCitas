# Concurrencia en agendamiento de sesiones

## Problema

Dos usuarios podrian intentar reservar el mismo slot (profesional + hora) simultaneamente. Sin control, ambas reservas se crearian exitosamente, generando un conflicto.

## Solucion

Indice compuesto unico parcial en la coleccion `sessions`:

```javascript
sessionSchema.index(
  { professionalId: 1, scheduledAt: 1 },
  { unique: true, partialFilterExpression: { status: 'scheduled' } }
);
```

- Solo aplica a sesiones con `status: 'scheduled'`. Las canceladas liberan el slot.
- Si dos inserts concurrentes intentan el mismo `(professionalId, scheduledAt)`, MongoDB rechaza el segundo con error de clave duplicada (code 11000).
- El service captura este error y responde con HTTP 409 "El horario seleccionado ya esta reservado".

## Limitaciones

- No protege contra race conditions a nivel de lectura (un usuario podria ver un slot como disponible y fallar al reservarlo). Esto se maneja con el error 409 y un mensaje claro en el frontend.
- No implementa bloqueo pesimista (locks). Para el volumen esperado de la plataforma academica, el enfoque optimista con indice unico es suficiente.

## Prueba de integracion

La prueba de integracion 3 del Sprint 3 valida este comportamiento: dos reservas concurrentes al mismo slot, una debe tener exito y la otra recibir 409.
