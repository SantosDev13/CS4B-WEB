import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET - Obtener post por slug (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const posts = await db.posts.findBySlug(slug);
    const post = posts[0];

    if (!post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Incrementar vistas
    await db.posts.incrementViews(post.id);

    // Obtener categoría y autor
    let categoria = null;
    let autor = null;

    if (post.categoria_id) {
      const categorias = await db.categorias.findById(post.categoria_id);
      categoria = categorias[0];
    }

    if (post.autor_id) {
      const autores = await db.usuarios.findById(post.autor_id);
      autor = autores[0] ? {
        id: autores[0].id,
        nombre: autores[0].nombre,
        avatar: autores[0].avatar,
      } : null;
    }

    return NextResponse.json({
      ...post,
      categoria,
      autor,
    });
  } catch (error) {
    console.error('Error al obtener post:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar post (solo admin/editor)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const posts = await db.posts.findBySlug(slug);
    const post = posts[0];

    if (!post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { titulo, contenido, excerpt, imagen_destacada, categoria_id, etiquetas, publicado, fecha_publicacion, meta_title, meta_description } = body;

    const updated = await db.posts.update(post.id, {
      titulo: titulo || post.titulo,
      contenido: contenido || post.contenido,
      excerpt: excerpt !== undefined ? excerpt : post.excerpt,
      imagen_destacada: imagen_destacada !== undefined ? imagen_destacada : post.imagen_destacada,
      categoria_id: categoria_id !== undefined ? categoria_id : post.categoria_id,
      etiquetas: etiquetas !== undefined ? etiquetas : post.etiquetas,
      publicado: publicado !== undefined ? publicado : post.publicado,
      fecha_publicacion: publicado ? (fecha_publicacion || new Date()) : (publicado === false ? null : post.fecha_publicacion),
      meta_title: meta_title !== undefined ? meta_title : post.meta_title,
      meta_description: meta_description !== undefined ? meta_description : post.meta_description,
    });

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error al actualizar post:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar post (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (authUser.rol !== 'admin') {
      return NextResponse.json(
        { error: 'Solo administradores pueden eliminar posts' },
        { status: 403 }
      );
    }

    const { slug } = await params;
    const posts = await db.posts.findBySlug(slug);
    const post = posts[0];

    if (!post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    await db.posts.delete(post.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
