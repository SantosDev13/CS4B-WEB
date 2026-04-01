const postgres = require('postgres');

const connectionString = 'postgresql://postgres:postgres@localhost:5432/CS4B';

const sql = postgres(connectionString, {
  ssl: false,
});

async function test() {
  console.log('🔌 Conectando a la base...');
  
  try {
    const servicios = await sql`SELECT * FROM servicios LIMIT 5`;
    console.log('\n📦 Servicios:', servicios.length);
    console.table(servicios.map(s => ({ id: s.id, titulo: s.titulo, slug: s.slug, visible: s.visible })));
    
    const posts = await sql`SELECT * FROM posts LIMIT 5`;
    console.log('\n📝 Posts:', posts.length);
    console.table(posts.map(p => ({ id: p.id, titulo: p.titulo, slug: p.slug, publicado: p.publicado })));
    
    const usuarios = await sql`SELECT id, email, nombre, rol FROM usuarios LIMIT 5`;
    console.log('\n👤 Usuarios:', usuarios.length);
    console.table(usuarios);
    
    const categorias = await sql`SELECT * FROM categorias`;
    console.log('\n🏷️ Categorías:', categorias.length);
    console.table(categorias);
    
    const contactos = await sql`SELECT id, nombre, email, leido FROM contactos LIMIT 5`;
    console.log('\n📨 Contactos:', contactos.length);
    console.table(contactos);
    
    console.log('\n✅ ¡Conexión exitosa!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

test();
