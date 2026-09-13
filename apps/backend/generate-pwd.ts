import * as bcrypt from 'bcrypt';

async function main() {
  const password = 'admin1234';

  const hash = await bcrypt.hash(password, 10);

  console.log('Mot de passe :', password);
  console.log('Hash BCrypt :', hash);
}

main();