import { Command } from 'commander';
import generateJWKPair from '../lib/jwkGenerator';

const program = new Command();

program
  .name('generate-jwk')
  .description('Generate a secure JSON Web Key pair')
  .action(async () => {
    try {
      const { publicJWK, privateJWK } = await generateJWKPair();

      console.log('Public:');
      console.log(JSON.stringify({ keys: [publicJWK] }, null, 2));

      console.log('Private (keep secret):');
      console.log(JSON.stringify({ keys: [privateJWK] }, null, 2));
    } catch (error) {
      console.error('Failed to generate JWK pair:', error);
      process.exit(1);
    }
  });

program.parse();
