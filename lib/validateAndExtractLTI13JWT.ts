import { Lti13Event } from './eventToRequest';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { Lti13SchoolConfig } from './readSchoolConfig';

export interface Lti13Data {
  iliosSearchId: string;
  email: string;
}

export type ValidateAndExtractLTI13JWT = (request: Lti13Event, schoolConfig: Lti13SchoolConfig) => Promise<Lti13Data>;

const IMS = 'https://purl.imsglobal.org/spec/lti/claim';

export default async (request: Lti13Event, schoolConfig: Lti13SchoolConfig): Promise<Lti13Data> => {
  try {
    console.log('Validating and extracting LTI Payload', schoolConfig, request);
    // Create a Remote JSON Web Key Set (JWK Set) using the Moodle certs URL
    const jwks = createRemoteJWKSet(new URL(schoolConfig.keysetUrl));

    // Verify ID Token using jose library
    const { payload, protectedHeader } = await jwtVerify(request.token, jwks, {
      issuer: schoolConfig.issuer,
      audience: schoolConfig.clientId,
    });

    console.log('Validated and Extracted Data:');
    console.log(protectedHeader);
    console.log(payload);

    const { exp } = payload;
    if (!exp || Date.now() / 1000 > exp) {
      throw new Error('Token expired.');
    }

    let iliosSearchId;

    switch (schoolConfig.ltiPostField) {
      case 'ext_user_username': {
        const ext = payload[`${IMS}/ext`] as Record<string, string>;
        if (Object.keys(ext).includes('user_username')) {
          iliosSearchId = ext.user_username;
        } else {
          console.info(ext);
          throw new Error('user_username missing from payload');
        }
        break;
      }
      case 'lis_person_sourcedid': {
        const lis = payload[`${IMS}/lis`] as Record<string, string>;
        if (Object.keys(lis).includes('person_sourcedid')) {
          iliosSearchId = lis.person_sourcedid;
        } else {
          console.info(lis);
          throw new Error('person_sourcedid missing from payload');
        }
        break;
      }
      default:
        console.info(schoolConfig, payload);
        throw new Error(`Undefined ${schoolConfig.ltiPostField} requested.`);
    }

    return {
      iliosSearchId,
      email: payload.email as string,
    };
  } catch (error) {
    console.error('Error during token verification:', error);
    throw new Error('Token verification failed');
  }
};
