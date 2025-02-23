# Learn Next.js + Prisma + Docker + PostgreSQL

## 🚀 Introduction
This project demonstrates how to use **Next.js** with **Prisma** as an ORM, **Docker** for containerization, and **PostgreSQL** as the database.

## 📦 Technologies Used
- **Next.js** (React framework for SSR & API routes)
- **Prisma** (ORM for PostgreSQL)
- **Docker** (Containerization)
- **PostgreSQL** (Relational database)

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/GeekOnly/Learn-Next.JS-Prisma-Docker-PostgreSQL.git
cd Learn-Next.JS-Prisma-Docker-PostgreSQL
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file and add the following:
```ini
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
NEXTAUTH_SECRET="your-secret-key"
```

### 4️⃣ Setup Docker & PostgreSQL
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:latest
    restart: always
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: mydatabase
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
```
Start the database:
```bash
docker-compose up -d
```

### 5️⃣ Initialize Prisma
```bash
npx prisma init
```
Edit `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
```
Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 6️⃣ Start the Development Server
```bash
npm run dev
```

---

## 📡 API Routes
Example API for user management:

**`pages/api/users.ts`**:
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  }
  if (req.method === 'POST') {
    const { name, email } = req.body;
    const newUser = await prisma.user.create({ data: { name, email } });
    return res.status(201).json(newUser);
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}
```

Test with cURL:
```bash
curl -X GET http://localhost:3000/api/users
```

---

## 🚀 Deployment
Deploy the project using **Vercel** or **Docker**:
```bash
vercel deploy
```

---

## 📜 License
This project is licensed under the MIT License.

---

## 🙌 Contributing
Feel free to open issues or submit PRs to improve this project!

---

Happy coding! 🎉

