import { Command } from 'commander';
import { createPrivateKey, sign } from 'node:crypto';
import { readFileSync } from 'node:fs';

const program = new Command();

program
  .name('sign-jwk')
  .description('Sign a message using a JWK private key')
  .requiredOption('--key <path>', 'Path to private JWK JSON file (as output by jwk:generate)')
  .requiredOption('--message <text>', 'Message to sign')
  .action((options) => {
    try {
      const raw = readFileSync(options.key, 'utf-8');
      const parsed = JSON.parse(raw);
      const jwk = parsed.keys ? parsed.keys[0] : parsed;

      const privateKey = createPrivateKey({ key: jwk, format: 'jwk' });
      const signature = sign('sha256', Buffer.from(options.message), privateKey);

      console.log(signature.toString('base64'));
    } catch (error) {
      console.error('Failed to sign message:', error);
      process.exit(1);
    }
  });

program.parse();
