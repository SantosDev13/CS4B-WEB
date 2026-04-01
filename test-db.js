const postgres = require('postgres');

const connectionString = 'postgresql://postgres:database@@@localhost:5432/CS4B';

const sql = postgres(connectionString, {
  ssl: false,
});

async function test() {
  console.log('🔌 Conectando a la base...');
  
  try {
    const usuarios = await sql`SELECT id, email, nombre, rol, LEFT(password, 30) as pw_preview FROM usuarios`;
    console.log('\n👤 Usuarios:', usuarios.length);
    console.table(usuarios);
    
    console.log('\n✅ ¡Conexión exitosa!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

test();
