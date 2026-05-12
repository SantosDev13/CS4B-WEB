import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST - Incrementar vistas de un post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Buscar el post
    const post = await prisma.post.findUnique({ where: { slug } });
    
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }
    
    // Verificar cookie desde el Route Handler (SÍ permite set-cookie)
    const cookieStore = request.cookies;
    const viewedPosts = cookieStore.get("viewed_posts")?.value || "";
    const viewedList: string[] = viewedPosts ? JSON.parse(viewedPosts) : [];
    
    // Solo incrementar si no ha sido visto recently
    if (!viewedList.includes(post.id)) {
      await prisma.post.update({
        where: { id: post.id },
        data: { vistas: { increment: 1 } },
      });
      
      // Actualizar cookie (DESDE ROUTE HANDLER SÍ SE PUEDE)
      const newViewedList = [...viewedList, post.id].slice(-20);
      
      const response = NextResponse.json({ success: true, vistas: post.vistas + 1 });
      response.cookies.set("viewed_posts", JSON.stringify(newViewedList), {
        httpOnly: true,
        maxAge: 3600, // 1 hora
        path: "/",
      });
      
      return response;
    }
    
    return NextResponse.json({ success: true, vistas: post.vistas, yaVisto: true });
  } catch (error) {
    console.error("Error incrementando vistas:", error);
    return NextResponse.json({ error: 'Error al incrementar vistas' }, { status: 500 });
  }
}