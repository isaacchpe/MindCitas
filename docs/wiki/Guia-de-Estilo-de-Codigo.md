# Guia de Estilo de Codigo

## Reglas generales

- No comentarios decorativos ni didacticos
- No emojis en codigo, logs ni commits (solo en UI cuando el diseno lo pida)
- No JSDoc en archivos internos (solo en routes para Swagger y en services para el editor)
- No console.log de depuracion (solo en server.js y errorHandler)
- Imports: librerias externas primero, luego internos por path relativo

## JavaScript

- Strings con comillas simples en JS, dobles en JSX para atributos
- Semicolons obligatorios
- 2 espacios de indentacion
- const por defecto, let cuando sea necesario, nunca var
- Igualdad estricta (===)

## ESLint

Backend: .eslintrc.cjs con eslint:recommended + prettier
Frontend: .eslintrc.json con react, react-hooks, jsx-a11y + prettier

## Prettier

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "endOfLine": "lf"
}
```

## Conventional Commits (espanol)

Formato: `tipo: descripcion corta`

Tipos:
- feat: nueva funcionalidad
- fix: correccion de bug
- chore: tareas de mantenimiento
- docs: documentacion
- refactor: reestructuracion sin cambio funcional
- test: pruebas

## Git Flow

- main: produccion (push directo prohibido)
- develop: integracion
- feature/*, fix/*, chore/*: ramas de trabajo
- PRs van hacia develop, merge a main al cerrar sprint
