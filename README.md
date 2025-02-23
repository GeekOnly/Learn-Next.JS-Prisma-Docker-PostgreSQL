# Next.js,Prisma,PostgreSQL,Docker



https://github.com/user-attachments/assets/288099a4-1415-42b4-8a58-807e3d1551db


## **1. Introduction**

แนะนำโปรเจคโดยสั้น ๆ เช่น

- โปรเจคนี้ใช้ **Next.js** เป็น frontend/backend framework
- ใช้ **Prisma** เป็น ORM สำหรับจัดการฐานข้อมูล
- ใช้ **Docker** เพื่อ containerize ระบบ
- ใช้ **PostgreSQL** เป็น database

**📦 Technologies Used**

- **Next.js** (React framework for SSR & API routes)
- **Prisma** (ORM for PostgreSQL)
- **Docker** (Containerization)
- **PostgreSQL** (Relational database)

---

## **2. Project Setup**

อธิบายวิธีติดตั้งและเริ่มใช้งานโปรเจค

### **2.1 Clone Repository**

```bash
git clone https://github.com/GeekOnly/Learn-Next.JS-Prisma-Docker-PostgreSQL.git
cd Learn-Next.JS-Prisma-Docker-PostgreSQL
```

### **2.2 Install Dependencies**

```bash
npm install
```

### **2.3 Setup Environment Variables (`.env`)**

ตัวอย่างไฟล์ `.env`

```
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydb?schema=public"
```

### **2.4 Running with Docker**

สร้างไฟล์ `docker-compose.yml`

```yaml
version: '3.8' # กำหนดเวอร์ชันของ Docker Compose
services:
  postgres: # เซอร์วิสสำหรับฐานข้อมูล PostgreSQL
    image: postgres:latest # ใช้ภาพ Docker ล่าสุดของ PostgreSQL
    environment: # กำหนดตัวแปรสภาพแวดล้อมสำหรับ PostgreSQL
      POSTGRES_USER: myuser # ชื่อผู้ใช้สำหรับฐานข้อมูล
      POSTGRES_PASSWORD: mypassword # รหัสผ่านสำหรับฐานข้อมูล
      POSTGRES_DB: mydb # ชื่อฐานข้อมูลที่สร้างขึ้น
    ports:
      - "5432:5432" # เปิดพอร์ต 5432 สำหรับเชื่อมต่อกับฐานข้อมูล
    volumes:
      - postgres-data:/var/lib/postgresql/data # เก็บข้อมูล PostgreSQL ใน volume เพื่อไม่ให้หายเมื่อหยุดเซอร์วิส
  pgadmin: # เซอร์วิสสำหรับ PgAdmin
    image: dpage/pgadmin4 # ใช้ภาพ Docker ล่าสุดของ PgAdmin
    environment: # กำหนดตัวแปรสภาพแวดล้อมสำหรับ PgAdmin
      PGADMIN_DEFAULT_EMAIL: admin@admin.com # อีเมลเริ่มต้นสำหรับเข้าสู่ระบบ PgAdmin
      PGADMIN_DEFAULT_PASSWORD: root # รหัสผ่านเริ่มต้นสำหรับเข้าสู่ระบบ PgAdmin
    ports:
      - "5050:80" # เปิดพอร์ต 5050 สำหรับเข้าถึง PgAdmin ผ่านเบราว์เซอร์
    depends_on:
      - postgres # ระบุว่า PgAdmin ขึ้นอยู่กับเซอร์วิส PostgreSQL
volumes:
  postgres-data: # กำหนด volume สำหรับเก็บข้อมูล PostgreSQL

```

**Start the container:**

```bash
docker-compose up -d
```

---

## **3. PostgreSQL Setup**


![Screenshot 2025-02-23 185350](https://github.com/user-attachments/assets/4ae74e38-d012-43fc-939b-b8f65769a2cf)


- **สร้างเซิร์ฟเวอร์ใหม่**:
    - เมื่อเข้าสู่ pgAdmin แล้ว คลิกขวาที่ **"Servers"** ในแถบด้านซ้าย
    - เลือก **"Create"** > **"Server..."**
- **ตั้งชื่อเซิร์ฟเวอร์**:
    - ในแท็บ **"General"** ให้ตั้งชื่อเซิร์ฟเวอร์ตามต้องการ เช่น `My PostgreSQL Server`
- **กำหนดการเชื่อมต่อ**:
    - ไปที่แท็บ **"Connection"**
    - กรอกข้อมูลตามนี้:
        - **Host name/address**: `postgres` (เนื่องจากใน `docker-compose.yml` ชื่อบริการคือ `postgres`)
        - **Port**: `5432`
        - **Username**: `myuser` (หรือชื่อผู้ใช้ที่คุณกำหนดใน `docker-compose.yml`)
        - **Password**: `mypassword` (หรือรหัสผ่านที่คุณกำหนดใน `docker-compose.yml`)

---

## **3. Prisma Setup**

### **3.1 Initialize Prisma**

```sql
npx prisma init
```

![XP112i8m44NtESMGhVG2Kcf54OgRWdg0q0urq4uqcIwAU7V74fEbMKt-8u-VgGCRp_CqAYIsl80-6CR1-KM32T352xmKoDc0xM4B3J6KPNkkgfYIcL3o2tjBWw0RsUUCWjygULiNU7K-PFZZanTZ5iQmSyGYI_4kvh-EJLQTighpABpViy2ZJ5SxuRTM-bbHkBMIS7qtGQiQgPU5V000](https://github.com/user-attachments/assets/d4496433-8420-46fd-9ec8-fef8609913a4)

ไฟล์ `prisma/schema.prisma`

```sql
generator client {
  provider = "prisma-client-js" // กำหนดผู้ให้บริการ Prisma Client
}

datasource db {
  provider = "postgresql" // กำหนดประเภทฐานข้อมูล
  url      = env("DATABASE_URL") // ใช้ URL ของฐานข้อมูลจากตัวแปรสภาพแวดล้อม
}

model Post {
  id          Int      @id @default(autoincrement()) // รหัสโพสต์ (primary key, auto-increment)
  title       String   // ชื่อโพสต์
  content     String?  // เนื้อหาโพสต์ (optional)
  categoryId  Int      // รหัสหมวดหมู่ (foreign key)
  category    Category @relation(fields: [categoryId], references: [id]) // ความสัมพันธ์กับโมเดล Category
  createdAt   DateTime @default(now()) // วันที่สร้างโพสต์ (ค่าเริ่มต้นเป็นเวลาปัจจุบัน)
} 

model Category {
  id    Int    @id @default(autoincrement()) // รหัสหมวดหมู่ (primary key, auto-increment)
  name  String @unique // ชื่อหมวดหมู่ (ต้องไม่ซ้ำกัน)
  posts Post[] // ความสัมพันธ์ที่มีหลายโพสต์ (หนึ่งหมวดหมู่มีหลายโพสต์)
}
```

### **3.2 Run Migrations**

```bash
npx prisma migrate dev --name "ชื่อที่บ่งบอกว่า Version นี้ทำอะไร"
```

### **3.3 Generate Prisma Client**

```bash
npx prisma generate
```

---

## **4. API Routes**

**Next.js API routes** ช่วยให้สร้าง endpoint API ที่สามารถจัดการคำขอ HTTP ได้ Routes เหล่านี้จะถูกสร้างเป็นไฟล์ภายใต้ไดเรกทอรี `app/api` และสามารถตอบสนองต่อคำขอ GET, POST, PUT และ DELETE ได้

### 4.1 API Route สำหรับ Posts

ไฟล์ `app/api/posts/route.ts`

- **GET request**:
    - ดึงข้อมูลรายการโพสต์ตามพารามิเตอร์การค้นหา เช่น `search`, `category`, และ `sort`
    - ใช้ Prisma ในการสอบถามฐานข้อมูลเพื่อหาข้อมูลโพสต์ที่ตรงตามเกณฑ์ที่กำหนด
    - สร้างอ็อบเจ็กต์ `whereCondition` ที่กรองโพสต์ตามชื่อเรื่องและชื่อหมวดหมู่ (ถ้ามีการระบุ)
    - ส่งคืนโพสต์ที่ดึงมาเป็น JSON
- **POST request**:
    - รับข้อมูล JSON เพื่อสร้างโพสต์ใหม่ที่มีชื่อ, เนื้อหา และ ID ของหมวดหมู่
    - ใช้ Prisma ในการสร้างโพสต์ใหม่ในฐานข้อมูลและส่งคืนโพสต์ที่สร้างขึ้นใหม่เป็น JSON
    - จัดการข้อผิดพลาดโดยการส่งคืนสถานะ 500 หากมีสิ่งผิดปกติเกิดขึ้น

```tsx
import { type NextRequest } from "next/server"; // Importing the NextRequest type for type safety
import { PrismaClient } from "@prisma/client"; // Importing PrismaClient for database operations

const prisma = new PrismaClient(); // Creating an instance of PrismaClient to interact with the database

// Function to handle GET requests for fetching posts
export async function GET(request: NextRequest) {
    // Extracting search parameters from the request URL
    const searchParams = request.nextUrl.searchParams;
    const search       = searchParams.get('search') || ''; // Get search term, default to empty string
    const category     = searchParams.get('category'); // Get category from search parameters
    const sort         = searchParams.get('sort') || 'desc'; // Get sort order, default to 'desc'

    // Constructing the 'where' condition for querying posts based on the presence of category and search term
    let whereCondition = category 
        ? {
            category: {
                is: {
                    name: category // Filter by category name if provided
                }
            },
            title: {
                contains: search, // Filter by title containing the search term
                mode: 'insensitive', // Case-insensitive search
            },
        } : {
            title: {
                contains: search, // Only filter by title if category is not provided
                mode: 'insensitive',
            },
        };

    // Querying the database to find posts that match the conditions
    const posts = await prisma.post.findMany({
        where: whereCondition as any, // Applying the where condition
        orderBy: {
            createdAt: sort, // Sorting the results based on creation date
        } as any,
        include: { 
            category: true, // Including related category information in the results
        }
    });

    // Returning the fetched posts as a JSON response
    return Response.json(posts);
}

// Function to handle POST requests for creating a new post
export async function POST(request: Request) {
    try {
        // Parsing the JSON body of the request to get the new post data
        const { title, content, categoryId } = await request.json();
        
        // Creating a new post in the database using Prisma
        const newPost = await prisma.post.create({
            data: {
                title, // Title of the new post
                content, // Content of the new post
                categoryId: Number(categoryId), // ID of the category, converted to a number
            },
        });

        // Returning the newly created post as a JSON response
        return Response.json(newPost);
    } catch (error) {
        // Handling any errors that occur during the creation process
        return new Response(error as BodyInit, { status: 500, }); // Returning a 500 status code for server errors
    }
}
```

### 4.2 API Route สำหรับโพสต์เฉพาะ id

ไฟล์ `app/api/posts/[id]/route.ts`

- **GET request**:
    - ดึงโพสต์เฉพาะโดยใช้ ID และรวมข้อมูลหมวดหมู่ที่เกี่ยวข้อง
    - ใช้ `findUnique` ของ Prisma ในการสอบถามฐานข้อมูลและส่งคืนข้อมูลโพสต์เป็น JSON
- **PUT request**:
    - อัปเดตโพสต์ที่มีอยู่ตาม ID ที่ระบุใน URL และข้อมูล JSON ที่ส่งในเนื้อหาคำขอ (ชื่อเรื่อง, เนื้อหา, และ ID ของหมวดหมู่)
    - ใช้ `update` ของ Prisma ในการปรับปรุงโพสต์ในฐานข้อมูลและส่งคืนโพสต์ที่อัปเดตแล้วเป็น JSON
- **DELETE request**:
    - ลบโพสต์ที่มี ID ที่ระบุจากฐานข้อมูล
    - ใช้ `delete` ของ Prisma และส่งคืนโพสต์ที่ถูกลบเป็น JSON หรือสถานะ 500 หากมีข้อผิดพลาดเกิดขึ้น

```tsx
import { PrismaClient } from "@prisma/client"; // Importing PrismaClient for database operations

const prisma = new PrismaClient(); // Creating an instance of PrismaClient to interact with the database

// Function to handle GET requests for fetching a specific post by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } } // Destructuring the params to get the post ID
) {
    const postId = Number(params.id); // Converting the post ID from string to number

    // Querying the database to find a unique post by its ID, including its category
    const post = await prisma.post.findUnique({
        where: {
            id: postId // Condition to find the post by ID
        },
        include: {
            category: true // Including related category information in the result
        }
    });

    // Returning the fetched post as a JSON response
    return Response.json(post);
}

// Function to handle PUT requests for updating a specific post by ID
export async function PUT(
    request: Request,
    { params }: { params: { id: string } } // Destructuring the params to get the post ID
) {
    try {
        // Parsing the JSON body of the request to get the updated post data
        const { title, content, categoryId } = await request.json();
        const postId = Number(params.id); // Converting the post ID from string to number

        // Updating the post in the database using Prisma
        const updatePost = await prisma.post.update({
            where: { id: postId }, // Condition to find the post by ID
            data: { title, content, categoryId: Number(categoryId) } // New data for the post
        });

        // Returning the updated post as a JSON response
        return Response.json(updatePost);
    } catch (error) {
        // Handling any errors that occur during the update process
        return new Response(error as BodyInit, { status: 500 }); // Returning a 500 status code for server errors
    }
}

// Function to handle DELETE requests for deleting a specific post by ID
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } } // Destructuring the params to get the post ID
) {
    try {
        const postId = Number(params.id); // Converting the post ID from string to number

        // Deleting the post from the database using Prisma
        const deletedPost = await prisma.post.delete({
            where: { id: postId } // Condition to find the post by ID
        });

        // Returning the deleted post as a JSON response
        return Response.json(deletedPost);
    } catch (error) {
        // Handling any errors that occur during the deletion process
        return new Response(error as BodyInit, { status: 500 }); // Returning a 500 status code for server errors
    }
}
```

### 4.3 API Route สำหรับ Category

ไฟล์ `app/api/categories/[id]/route.ts`

- **GET request**:
    - ดึงข้อมูลหมวดหมู่ทั้งหมดจากฐานข้อมูลโดยใช้ `findMany` ของ Prisma
    - ส่งคืนหมวดหมู่เป็น JSON
- **POST request**:
    - สร้างหมวดหมู่ใหม่ตามชื่อที่ให้ไว้ในเนื้อหาคำขอ
    - ใช้ `create` ของ Prisma เพื่อเพิ่มหมวดหมู่ใหม่และส่งคืนเป็น JSON

```tsx
import { type NextRequest } from "next/server"; // Importing NextRequest type for type safety in requests
import { PrismaClient } from "@prisma/client"; // Importing PrismaClient to interact with the database

const prisma = new PrismaClient(); // Creating an instance of PrismaClient to perform database operations

// Function to handle GET requests for fetching all categories
export async function GET() {
    try {
        // Querying the database to retrieve all categories
        const categories = await prisma.category.findMany();

        // Returning the retrieved categories as a JSON response
        return Response.json(categories);
    } catch (error) {
        // Handling any errors that occur during the retrieval process
        return new Response(error as BodyInit, { status: 500 }); // Returning a 500 status code for server errors
    }
}

// Function to handle POST requests for creating a new category
export async function POST(req: Request) {
    try {
        // Parsing the JSON body of the request to get the new category name
        const { name } = await req.json();

        // Creating a new category in the database using Prisma
        const newCategory = await prisma.category.create({
            data: {
                name // Using the parsed name for the new category
            },
        });

        // Returning the created category as a JSON response
        return Response.json(newCategory);
    } catch (error) {
        // Handling any errors that occur during the creation process
        return new Response(error as BodyInit, { status: 500 }); // Returning a 500 status code for server errors
    }
}

```

### 4.4 API Route สำหรับ Id Category

ไฟล์ `app/api/categories/[id]/route.ts`

```tsx
import { PrismaClient } from "@prisma/client"; // Importing PrismaClient to interact with the database

const prisma = new PrismaClient(); // Creating an instance of PrismaClient to perform database operations

// Function to handle PUT requests for updating a category
export async function PUT(
    request: Request,
    { params }: { params: { id: string } } // Destructuring params to get the category ID
) {
    try {
        // Parsing the JSON body of the request to get the new category name
        const { name } = await request.json();

        // Updating the category in the database using Prisma
        const category = await prisma.category.update({
            where: { id: Number(params.id) }, // Finding the category by ID
            data: { name }, // Setting the new name for the category
        });

        // Returning the updated category as a JSON response
        return Response.json(category);
    } catch (error) {
        // Handling any errors that occur during the update process
        return new Response(error as BodyInit, { status: 500 }); // Returning a 500 status code for server errors
    }
}

// Function to handle DELETE requests for deleting a category
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } } // Destructuring params to get the category ID
) {
    try {
        // Deleting the category from the database using Prisma
        return Response.json(
            await prisma.category.delete({
                where: { id: Number(params.id) }, // Finding the category by ID to delete
            })
        );
    } catch (error) {
        // Handling any errors that occur during the deletion process
        return new Response(error as BodyInit, { 
            status: 500 // Returning a 500 status code for server errors
        });
    }
}
```

---

## **5. FONT END**

### 5.1 Homepage (`app/page.tsx`)

หน้าแรกของเว็บแอปจะแสดงรายการโพสต์บล็อก และมีฟีเจอร์กรองข้อมูลตามหมวดหมู่ ค้นหาด้วยชื่อ และเรียงลำดับข้อมูล

- React Hook **(useState, useEffect)** สำหรับจัดการสถานะของข้อมูล
- ใช้ **Axios** เพื่อดึงข้อมูลจาก API (`/api/posts` และ `/api/categories`)
- Features
    - `fetchPosts()` → ดึงข้อมูลโพสต์จาก API และอัปเดต state
    - `fetchCategories()` → ดึงข้อมูลหมวดหมู่จาก API และอัปเดต state
    - `deletePost(id: Number)` → ส่งคำขอไปลบโพสต์จาก API
    - `handleFilterChange()` → อัปเดตโพสต์ตามค่าที่ผู้ใช้กรอกหรือเลือก
- ใช้ **Next.js's Link** เพื่อไปยังหน้าสร้าง (`/create`) และแก้ไข (`/edit/[id]`)
- UI ใช้ **Tailwind CSS** สำหรับการจัดสไตล์

```tsx
'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link' 

export default function Home() {
  // State for storing blog posts
  const [posts, setPosts] = useState([])

  // State for search input
  const [search, setSearch] = useState('')

  // State for selected category filter
  const [category, setCategory] = useState('')

  // State for storing available categories
  const [categories, setCategories] = useState([])

  // State for sorting order (desc = latest first, asc = oldest first)
  const [sort, setSort] = useState('desc')

  // Fetch posts and categories on component mount
  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [])

  // Fetch blog posts based on filters
  const fetchPosts = async () => {
    try {
      // Construct query parameters for filtering
      const query = new URLSearchParams({ category, search, sort }).toString()
      const res = await axios.get(`/api/posts?${query}`)
      setPosts(res.data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  // Fetch available categories from API
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`/api/categories`)
      setCategories(res.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Function to delete a post by ID
  const deletePost = async (id: number) => {
    try {
      // Show a confirmation dialog before deleting
      const confirmDelete = window.confirm('Are you sure you want to delete this post?')
      if (!confirmDelete) return
      
      await axios.delete(`/api/posts/${id}`)
      alert('Delete Successful!')
      fetchPosts() // Refresh posts after deletion
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  // Function to apply filters and refetch posts/categories
  const handleFilterChange = () => {
    fetchPosts()
    fetchCategories()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Blog Posts</h1>
      
      {/* Filter Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          {/* Search Input */}
          <input
             type="text"
             placeholder='Search by title...'
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className='px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />

          {/* Category Dropdown */}
          <select
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat: any) => (
              <option key={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Sorting Dropdown */}
          <select
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={sort}
            onChange={(e) => setSort(e.target.value)}       
          >
            <option value="desc">Latest</option>
            <option value="asc">Oldest</option>
          </select>

          {/* Apply Filters Button */}
          <button
            onClick={handleFilterChange}
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post: any) => (
              <tr key={post.id}>
                {/* Post Title */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {post.title}
                  </div>
                </td>

                {/* Post Category */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {post.category.name}
                  </div>
                </td>

                {/* Actions (Edit / Delete) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    href={`/edit/${post.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create New Post Button */}
      <Link
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        href="/create"
      >
        Create a New Post
      </Link>
    </div>
  )
}
```

### 5.2 Create (`app/create/page.tsx`)

หน้าสำหรับสร้างโพสต์ใหม่ ผู้ใช้สามารถกรอก **Title**, **Content**, และเลือกหมวดหมู่ จากนั้นกด Submit เพื่อบันทึกข้อมูล

- ใช้ **React Hook (useState, useEffect)**
- ใช้ **Axios** เพื่อดึงหมวดหมู่ (`fetchCategories()`) และส่งข้อมูลไปยัง API (`/api/posts`)
- ใช้ **useRouter** จาก Next.js เพื่อเปลี่ยนหน้าเมื่อสร้างโพสต์สำเร็จ
- เมื่อกด Submit จะเรียก `handleSubmit()` ซึ่ง
    1. ป้องกัน default form submission (`event.preventDefault()`)
    2. ส่งข้อมูลไปยัง API (`axios.post('/api/posts')`)
    3. หากสำเร็จจะเปลี่ยนหน้าไป `/`

```tsx
'use client' // Enables client-side rendering in Next.js

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const Create = () => {
    // State variables to manage form inputs and category list
    const [title, setTitle] = useState('') // Stores the post title
    const [content, setContent] = useState('') // Stores the post content
    const [categoryId, setCategoryId] = useState('') // Stores the selected category ID
    const [categories, setCategories] = useState([]) // Stores the list of categories
    const router = useRouter() // Next.js router for navigation

    // Handles form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevents default form submission behavior
        try {
            // Sends a POST request to the backend to create a new post
            await axios.post('/api/posts', {
                title,
                content,
                categoryId
            })
            router.push('/') // Redirects to the homepage after successful submission
        } catch (error) {
            console.log('error', error) // Logs any errors to the console
            alert('Something went wrong') // Displays an alert if submission fails
        }
    }

    // Fetches categories from the backend
    const fetchCategories = async () => {
        try {
            const res = await axios.get(`/api/categories`) // API request to get categories
            setCategories(res.data) // Updates state with retrieved categories
        } catch (error) {
            console.error(error) // Logs errors if the request fails
        }
    }

    // Fetch categories when the component mounts
    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Create a New Post</h1>
            {/* Form to create a new post */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title input field */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value) }}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                {/* Content input field */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Content
                    </label>
                    <textarea
                        name="content"
                        id="content"
                        required
                        rows={4}
                        value={content}
                        onChange={(e) => { setContent(e.target.value) }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    ></textarea>
                </div>
                {/* Category selection dropdown */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                {/* Submit button */}
                <div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Create

```

### 5.3 Edit (`app/edit/[id]/page.tsx`)

หน้าสำหรับแก้ไขโพสต์ที่มีอยู่ โดยดึงข้อมูลจาก API และให้ผู้ใช้แก้ไขเนื้อหา

### **โครงสร้างโค้ด**

- ใช้ **useState** เก็บค่าของ `title`, `content`, `categoryId`
- ใช้ **useEffect** โหลดข้อมูลจาก API โดยใช้ `id` ของโพสต์ที่ถูกเลือก
- เมื่อกด Submit จะเรียก `handleSubmit()` ซึ่ง:
    1. ส่งข้อมูลที่แก้ไขไปยัง API (`axios.put('/api/posts/${id}')`)
    2. หากสำเร็จจะเปลี่ยนหน้าไป `/`

```tsx
'use client'

import React, { use, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

// Edit component for updating a post
const Edit = ({ params }: { params: Promise<{ id: string }> }) => {
    // State variables to hold post data and categories
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [categories, setCategories] = useState([])
    const router = useRouter()
    
    // Extract post ID from params
    const { id } = use(params);

    // Function to fetch post details by ID
    const fetchPost = async (id: Number) => {
        try {
            const response = await axios.get(`/api/posts/${id}`)
            // Set the post data in state
            setTitle(response.data.title)
            setContent(response.data.content)
            setCategoryId(response.data.categoryId)
        } catch (error) {
            console.log('error:', error)
        }
    }

    // Function to fetch categories for the dropdown
    const fetchCategories = async () => {
        try {
            const res = await axios.get(`/api/categories`)
            // Set the categories in state
            setCategories(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    // useEffect to fetch post data and categories when the component mounts or when ID changes
    useEffect(() => {
        if (id) {
            fetchPost(parseInt(id)) // Fetch the post details
            fetchCategories() // Fetch categories
        }
    }, [id])

    // Function to handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission
        try {
            // Update the post data in the API
            await axios.put(`/api/posts/${id}`, {
                title,
                content,
                categoryId
            })
            router.push('/') // Redirect to the homepage after successful update
        } catch (error) {
            console.log('error', error)
            alert('something went wrong') // Alert in case of an error
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Edit Post {id}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={title}
                        onChange={(e) => { setTitle(e.target.value) }} // Update title state on change
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                {/* Content Textarea */}
                <div>
                    <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Content
                    </label>
                    <textarea
                        name="content"
                        id="content"
                        required
                        rows={4}
                        value={content}
                        onChange={(e) => { setContent(e.target.value) }} // Update content state on change
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    ></textarea>
                </div>
                {/* Category Select Dropdown */}
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Select a category</option>
                    {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Edit

```

## **6. Running the Project**

### **6.1 Start PostgreSQL (if using Docker)**

```bash
docker-compose up -d
```

### **6.2 Run Next.js**

```bash
npm run dev
```

---

## **7. Testing API**

ใช้ **Postman** หรือ **cURL** ทดสอบ API

### POSTS

GET Requests

- **ดึงโพสต์ทั้งหมดพร้อมฟิลเตอร์ที่เลือกได้:**
    - **URL:** `http://localhost:3000/api/posts?search=example&category=tech&sort=asc`
    - **Method:** GET
    - **Response:** ควรคืนค่ารายการโพสต์ที่ถูกกรองตามคำค้นหาและหมวดหมู่
- **ดึงโพสต์เฉพาะตาม ID:**
    - **URL:** `http://localhost:3000/api/posts/{id}` (แทนที่ `{id}` ด้วย ID ของโพสต์ที่แท้จริง)
    - **Method:** GET
    - **Response:** ควรคืนค่าโพสต์ที่มี ID ที่ระบุ

**POST Request**

- **สร้างโพสต์ใหม่:**
    - **URL:** `http://localhost:3000/api/posts`
    - **Method:** POST
    - **Body:** เลือก "raw" และเลือก JSON format จากนั้นป้อน:
        
        ```json
        {
            "title": "ชื่อโพสต์ใหม่",
            "content": "นี่คือเนื้อหาของโพสต์ใหม่.",
            "categoryId": 1
        }
        ```
        
    - **Response:** ควรคืนค่าโพสต์ที่เพิ่งสร้างใหม่

**PUT Request**

- **อัปเดตโพสต์เฉพาะ:**
    - **URL:** `http://localhost:3000/api/posts/{id}` (แทนที่ `{id}` ด้วย ID ของโพสต์ที่แท้จริง)
    - **Method:** PUT
    - **Body:** เลือก "raw" และเลือก JSON format จากนั้นป้อน:
        
        ```json
        {
            "title": "ชื่อโพสต์ที่อัปเดต",
            "content": "นี่คือเนื้อหาที่อัปเดตแล้ว.",
            "categoryId": 1
        }
        ```
        
    - **Response:** ควรคืนค่าโพสต์ที่ถูกอัปเดต

**DELETE Request**

- **ลบโพสต์เฉพาะ:**
    - **URL:** `http://localhost:3000/api/posts/{id}` (แทนที่ `{id}` ด้วย ID ของโพสต์ที่แท้จริง)
    - **Method:** DELETE
    - **Response:** ควรคืนค่าโพสต์ที่ถูกลบ

### Category

### GET Requests

- **ดึงหมวดหมู่ทั้งหมด:**
    - **URL:** `http://localhost:3000/api/categories`
    - **Method:** GET
    - **Response:** ควรคืนค่ารายการหมวดหมู่ทั้งหมดในรูปแบบ JSON

### POST Request

- **สร้างหมวดหมู่ใหม่:**
    - **URL:** `http://localhost:3000/api/categories`
    - **Method:** POST
    - **Body:** เลือก "raw" และเลือก JSON format จากนั้นป้อน:
        
        ```json
        {
            "name": "New Category Name"
        }
        ```
        
    - **Response:** ควรคืนค่าหมวดหมู่ที่เพิ่งสร้างใหม่ในรูปแบบ JSON

### PUT Request

- **อัปเดตหมวดหมู่เฉพาะ:**
    - **URL:** `http://localhost:3000/api/categories/{id}` (แทนที่ `{id}` ด้วย ID ของหมวดหมู่ที่แท้จริง)
    - **Method:** PUT
    - **Body:** เลือก "raw" และเลือก JSON format จากนั้นป้อน:
        
        ```json
        {
            "name": "Update Category Name"
        }
        ```
        
    - **Response:** ควรคืนค่าหมวดหมู่ที่ถูกอัปเดตในรูปแบบ JSON

### DELETE Request

- **ลบหมวดหมู่เฉพาะ:**
    - **URL:** `http://localhost:3000/api/categories/{id}` (แทนที่ `{id}` ด้วย ID ของหมวดหมู่ที่แท้จริง)
    - **Method:** DELETE
    - **Response:** ควรคืนค่าหมวดหมู่ที่ถูกลบในรูปแบบ JSON

---

## **8. Reference**

[รู้จักกับ Prisma ORM](https://mikelopster.dev/posts/next-prisma)

[ลองเล่น Prisma กับ Next.js กัน](https://www.youtube.com/watch?v=_D-lAKZqNTA)
