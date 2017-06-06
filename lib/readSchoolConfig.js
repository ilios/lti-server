'use strict';

const readSchoolConfig = (key, aws) => {
  return new Promise((resolve, reject) => {
    const s3 = new aws.S3();
    const params = {
      Bucket: process.env.CONFIG_BUCKET,
      Key: 'config.json',
    };
    console.log('Looking for configuration for school in: ');
    console.log(params);
    s3.getObject(params).promise().then(data => {
      const obj = JSON.parse(data.Body);

      if (!(key in obj)) {
        reject(`The Consumer Key "${key}" is not known to Ilios. Please contact support@iliosproject.org to set it up.`);
      } else {
        resolve(obj[key]);
      }
    });
  });

};

module.exports = readSchoolConfig;
