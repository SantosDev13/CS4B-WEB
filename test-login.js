const bcrypt = require('bcryptjs');

async function testLogin() {
  const plainPassword = 'password';
  const storedHash = '$2a$10$T7U7V8mUbXQMOn7XHava9eUrh40fRpkHHMpuTeNXLOKlohzsiTgWS';
  
  const isValid = await bcrypt.compare(plainPassword, storedHash);
  
  console.log('🧪 Probando login...');
  console.log('Password ingresada:', plainPassword);
  console.log('Hash en base de datos:', storedHash);
  console.log('¿Coincide?:', isValid ? '✅ SÍ' : '❌ NO');
}

testLogin();
