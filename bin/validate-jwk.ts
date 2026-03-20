import { Command } from 'commander';
import { createPublicKey, verify } from 'node:crypto';
import { readFileSync } from 'node:fs';

const program = new Command();

program
  .name('validate-jwk')
  .description('Validate a signature using a JWK public key')
  .requiredOption('--key <path>', 'Path to public JWK JSON file (as output by jwk:generate)')
  .requiredOption('--message <text>', 'Original message that was signed')
  .requiredOption('--signature <base64>', 'Base64-encoded signature to validate')
  .action((options) => {
    try {
      const raw = readFileSync(options.key, 'utf-8');
      const parsed = JSON.parse(raw);
      const jwk = parsed.keys ? parsed.keys[0] : parsed;

      const publicKey = createPublicKey({ key: jwk, format: 'jwk' });
      const isValid = verify(
        'sha256',
        Buffer.from(options.message),
        publicKey,
        Buffer.from(options.signature, 'base64'),
      );

      if (isValid) {
        console.log('Valid');
        process.exit(0);
      } else {
        console.log('Invalid');
        process.exit(1);
      }
    } catch (error) {
      console.error('Failed to validate signature:', error);
      process.exit(1);
    }
  });

program.parse();
