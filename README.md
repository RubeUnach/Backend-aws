# Backend AWS Zero Trust

Backend desarrollado en Node.js y Express para una aplicación web segura
implementada bajo un enfoque Zero Trust.

El proyecto forma parte de una arquitectura distribuida en AWS compuesta por
un Frontend y un Backend desplegados en VPC independientes comunicadas mediante
VPC Peering.

---

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- JSON Web Token (JWT)
- bcryptjs
- Helmet
- CORS
- express-rate-limit

---

## Arquitectura del Backend

El Backend utiliza una arquitectura por capas:

```text
Routes
   |
   v
Middlewares / DTO
   |
   v
Controllers
   |
   v
Services
   |
   v
Repositories
   |
   v
Sequelize ORM
   |
   v
PostgreSQLx
