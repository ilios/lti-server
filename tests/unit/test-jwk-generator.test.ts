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
    expect(keyPair.publicJWK).toHaveProperty('kty', 'OKP');
    expect(keyPair.publicJWK).toHaveProperty('crv', 'Ed25519');
    expect(keyPair.publicJWK).toHaveProperty('x');
    expect(keyPair.publicJWK).not.toHaveProperty('d');

    expect(keyPair.privateJWK).toHaveProperty('kty', 'OKP');
    expect(keyPair.privateJWK).toHaveProperty('crv', 'Ed25519');
    expect(keyPair.privateJWK).toHaveProperty('x');
    expect(keyPair.privateJWK).toHaveProperty('d');
  });
});
