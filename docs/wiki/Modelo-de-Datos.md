# Modelo de Datos

## Colecciones MongoDB

### users
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| name | String | Nombre completo, 2-80 chars |
| email | String | Unico, lowercase |
| password | String | Hash bcrypt, select: false |
| academicProgram | String | Opcional, hasta 120 chars |
| role | String | enum: student, professional, admin |
| isActive | Boolean | Default true |
| timestamps | Date | createdAt, updatedAt |

Indice unico: { email: 1 }

### emotional_entries
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| userId | ObjectId | ref User |
| date | Date | Normalizada a medianoche UTC |
| mood | Number | 1-5 |
| note | String | Opcional, hasta 500 chars |
| timestamps | Date | createdAt, updatedAt |

Indice compuesto unico: { userId: 1, date: 1 }

### habits
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| userId | ObjectId | ref User |
| habitType | String | enum: meditation, exercise, reading, hydration, sleep, custom |
| name | String | 2-60 chars |
| description | String | Opcional, hasta 200 chars |
| frequency | String | enum: daily |
| isActive | Boolean | Default true |
| createdAt | Date | |

### habit_logs (patron Bucket semanal)
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| habitId | ObjectId | ref Habit |
| userId | ObjectId | ref User |
| weekStart | Date | Lunes 00:00 UTC |
| entries | Array | [{ dayOfWeek: 0-6, completedAt: Date }] |
| currentStreak | Number | Racha actual |
| bestStreak | Number | Mejor racha historica |

Indice compuesto unico: { habitId: 1, weekStart: 1 }

### badges (catalogo)
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| code | String | Unico: streak-7, streak-14, streak-30 |
| name | String | Nombre visible |
| description | String | |
| threshold | Number | Dias requeridos |

### user_badges
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| userId | ObjectId | ref User |
| badgeId | ObjectId | ref Badge |
| habitId | ObjectId | ref Habit (que gatillo la insignia) |
| awardedAt | Date | |

Indice compuesto unico: { userId: 1, badgeId: 1, habitId: 1 }

### professionals
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| fullName | String | |
| specialty | String | enum: psychology, mindfulness, academic, group |
| email | String | Opcional |
| workingHours | Array | [{ dayOfWeek, startHour, endHour }] |
| isActive | Boolean | |

### sessions
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| userId | ObjectId | ref User |
| userSnapshot | Object | { fullName, program } embebido al crear |
| professionalId | ObjectId | ref Professional |
| sessionType | String | enum: psychology, mindfulness, academic, group |
| scheduledAt | Date | Slot de 1 hora en UTC |
| status | String | enum: scheduled, completed, canceled, no_show |
| confirmationCode | String | Unico, formato MC-XXXXXX |
| timestamps | Date | createdAt, updatedAt |

Indice parcial unico: { professionalId: 1, scheduledAt: 1 } donde status = 'scheduled'
