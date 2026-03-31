import { NextRequest, NextResponse } from 'next/server';
import { db, Post } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET - Obtener posts (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published') !== 'false';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const categoria = searchParams.get('categoria');

    let posts: Post[] = [];
    let total = 0;

    if (categoria) {
      // Buscar por categoría
      const categorias = await db.categorias.findBySlug(categoria);
      if (categorias[0]) {
        posts = await db.posts.findByCategoria(categorias[0].id, limit, offset);
        total = await db.posts.count(published);
      } else {
        posts = [];
        total = 0;
      }
    } else {
      posts = await db.posts.findAll(published, limit, offset);
      total = await db.posts.count(published);
    }

    // Obtener info de categoría y autor para cada post
    const postsConRelaciones = await Promise.all(
      posts.map(async (post) => {
        let categoria = null;
        let autor = null;

        if (post.categoria_id) {
          const categorias = await db.categorias.findById(post.categoria_id);
          categoria = categorias[0] ? {
            id: categorias[0].id,
            nombre: categorias[0].nombre,
            slug: categorias[0].slug,
            color: categorias[0].color,
          } : null;
        }

        if (post.autor_id) {
          const autores = await db.usuarios.findById(post.autor_id);
          autor = autores[0] ? {
            id: autores[0].id,
            nombre: autores[0].nombre,
            avatar: autores[0].avatar,
          } : null;
        }

        return {
          ...post,
          categoria,
          autor,
        };
      })
    );

    return NextResponse.json({
      posts: postsConRelaciones,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error al obtener posts:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear post (solo admin/editor)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { titulo, slug, contenido, excerpt, imagen_destacada, categoria_id, etiquetas, publicado, fecha_publicacion, meta_title, meta_description } = body;

    if (!titulo || !slug || !contenido) {
      return NextResponse.json(
        { error: 'Título, slug y contenido son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el slug sea único
    const existing = await db.posts.findBySlug(slug);
    if (existing[0]) {
      return NextResponse.json(
        { error: 'El slug ya está en uso' },
        { status: 400 }
      );
    }

    const post = await db.posts.create({
      titulo,
      slug,
      contenido,
      excerpt: excerpt || null,
      imagen_destacada: imagen_destacada || null,
      categoria_id: categoria_id || null,
      autor_id: authUser.id,
      etiquetas: etiquetas || [],
      publicado: publicado || false,
      fecha_publicacion: publicado ? (fecha_publicacion || new Date()) : null,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
    });

    return NextResponse.json(post[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear post:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
