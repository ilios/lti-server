import { generateKeyPair, exportJWK } from 'jose';

export interface JWKPair {
  publicJWK: object;
  privateJWK: object;
}

export type GenerateJWKPair = () => Promise<JWKPair>;

export default async (): Promise<JWKPair> => {
  try {
    const { publicKey, privateKey } = await generateKeyPair('Ed25519', { extractable: true });

    const publicJWK = await exportJWK(publicKey);
    const privateJWK = await exportJWK(privateKey);

    return {
      publicJWK,
      privateJWK,
    };
  } catch (error) {
    console.error('Error generating JWK pair:', error);
    throw new Error('JWK generation failed');
  }
};
