const postgres = require('postgres');
const bcrypt = require('bcryptjs');

const connectionString = 'postgresql://postgres:database@@@localhost:5432/CS4B';

const sql = postgres(connectionString, {
  ssl: false,
});

async function hashPassword() {
  console.log('🔐 Hasheando contraseña...');
  
  try {
    const plainPassword = 'password';
    const hash = await bcrypt.hash(plainPassword, 10);
    
    console.log('\n📝 Hash generado:', hash);
    
    // Actualizar la contraseña en la base de datos
    const result = await sql`
      UPDATE usuarios 
      SET password = ${hash} 
      WHERE email = 'correo@gmail.com' 
      RETURNING id, email, nombre, rol
    `;
    
    console.log('\n✅ Contraseña actualizada!');
    console.log('Usuario:', result[0]);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

hashPassword();
