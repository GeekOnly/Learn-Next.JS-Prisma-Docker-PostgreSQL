import { type NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const search       = searchParams.get('search') || ''
    const category     = searchParams.get('category')
    const sort         = searchParams.get('sort') || 'desc'

    const posts = await prisma.post.findMany({
        where: {
            title: {
                contains: search,
                mode: 'insensitive',
            }
        }
    })
    return Response.json(posts)
}

export async function POST(request: Request) {
    try {
        const { title, content , category } = await request.json()
        const newPost = await prisma.post.create({
            data:{
                title,
                content,
                category,
            },
        })
        return Response.json(newPost)
    } catch (error) {
        return new Response(error as BodyInit, { status: 500, })
    }
}