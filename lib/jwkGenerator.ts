import { generateKeyPair, exportJWK } from 'jose';
import { randomUUID } from 'node:crypto';

export interface JWKPair {
  publicJWK: JsonWebKey;
  privateJWK: JsonWebKey;
}

export type GenerateJWKPair = () => Promise<JWKPair>;

export default async (): Promise<JWKPair> => {
  try {
    const { publicKey, privateKey } = await generateKeyPair('RS256', { extractable: true });

    const publicJWK = await exportJWK(publicKey);
    const privateJWK = await exportJWK(privateKey);

    const kid = randomUUID();

    publicJWK.alg = 'RS256';
    publicJWK.use = 'sig';
    publicJWK.kid = kid;
    privateJWK.alg = 'EdDSA';

    privateJWK.alg = 'RS256';
    privateJWK.use = 'sig';
    privateJWK.kid = kid;

    return {
      publicJWK,
      privateJWK,
    };
  } catch (error) {
    console.error('Error generating JWK pair:', error);
    throw new Error('JWK generation failed');
  }
};
