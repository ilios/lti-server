import generateJWKPair from '../../lib/jwkGenerator';
import { expect, describe, it } from '@jest/globals';

jest.mock('jose', () => ({
  generateKeyPair: jest.fn(),
  exportJWK: jest.fn(),
}));

describe('Generates a JWK pair', function () {
  it.skip('generates valid EdDSA/Ed25519 key pairs', async function () {
    const keyPair = await generateJWKPair();
    expect(keyPair).toHaveProperty('publicJWK');
    expect(keyPair).toHaveProperty('privateJWK');
    expect(keyPair.publicJWK).toHaveProperty('kty', 'RSA');
    expect(keyPair.publicJWK).toHaveProperty('e', 'AQAB');
    expect(keyPair.publicJWK).toHaveProperty('alg', 'RSA256');
    expect(keyPair.publicJWK).toHaveProperty('kid');
    expect(keyPair.publicJWK).toHaveProperty('use', 'sig');
    expect(keyPair.publicJWK).not.toHaveProperty('n');

    expect(keyPair.privateJWK).toHaveProperty('kty', 'RSA');
    expect(keyPair.privateJWK).toHaveProperty('alg', 'RSA256');
  });
});
