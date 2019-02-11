'use strict';
//Inspiration and code from: https://github.com/atomicjolt/lti-lambda

const launchResponse = ({event, lti, aws, eventToRequest, readSchoolConfig, findIliosUser, fetch, createJWT}) => {
  /**
   * Async/Await isn't viable here because the LTI library we're using doesn't
   * support promises, just a callback. Until it is updated this is the way to go.
   */
  return new Promise((resolve, reject) => {
    const request = eventToRequest(event);
    const consumerKey = request.body.oauth_consumer_key;
    readSchoolConfig(consumerKey, aws).then(config => {
      console.log(`Configuration for ${consumerKey} read succesfully`);
      const provider = new lti.Provider(consumerKey, config.consumerSecret);

      provider.valid_request(request, (error, isValid) => {
        if (isValid) {
          const searchString = request.body[config.ltiPostField];
          findIliosUser({fetch, createJWT, config, searchString, aws}).then(userId => {
            console.log(`Found user ${userId}.`);
            const token = createJWT(userId, config.apiServer, config.apiNameSpace, config.iliosSecret);

            const targetUrl = `${process.env.LTI_APP_URL}/login/${token}`;
            const response = {
              statusCode: 302,
              headers: {
                'Location': targetUrl
              },
              body: ''
            };
            resolve(response);
          }, error => {
            reject(error);
          });
        } else {
          reject(`Unable to validate request ${error}. Please ensure your consumer secret is correct.`);
        }
      });
    }, error => {
      reject(error);
    });
  });
};

module.exports = launchResponse;
