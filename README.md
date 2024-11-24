# NestJS Authentication Demo with Prisma

This is a simple demo application built with **NestJS**, **Prisma**, and **JWT** for authentication. It demonstrates basic authentication features including **login** and **registration** for public endpoints, as well as a sample **GET** API endpoint for authorized users (Admin).

## Features

- **Public Endpoints**:
  - Auth **auth/registration**: Allows new users to sign up.
  - Auth **auth/login**: Allows existing users to log in with credentials.

- **Authorized Endpoints**:
  - Users **GET** API for Admin: Protected route accessible only to authenticated and authorized users (Admin role).

## Technologies Used

- **NestJS**: Framework for building the server-side application.
- **Prisma**: ORM for database management.
- **JWT**: For securing authorized routes.
- **bcrypt**: For password hashing.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- A PostgreSQL, MySQL, or SQLite database (Prisma supports various databases)
  
  > You can use any of the databases supported by Prisma. In this demo, we assume PostgreSQL, but you can adapt it based on your setup.

## Installati

### 1. Clone the Repository

```bash
git clone https://github.com/nadee95/nestjs-auth-demo.git
cd nestjs-auth-demo
pnpm install
pnpm run
