'use strict';

const readSchoolConfig = async(key, aws) => {
  const s3 = new aws.S3();
  const params = {
    Bucket: process.env.CONFIG_BUCKET,
    Key: 'config.json',
  };
  console.log('Looking for configuration for school in: ');
  console.log(params);
  const data = await s3.getObject(params).promise();
  const obj = JSON.parse(data.Body);
  if (!(key in obj)) {
    throw new Error(`The Consumer Key "${key}" is not known to Ilios. Please contact support@iliosproject.org to set it up.`);
  }

  const config = obj[key];
  if (!('supportEmailAddress' in config)) {
    config.supportEmailAddress = 'support@iliosproject.org';
  }

  return config;
};

module.exports = readSchoolConfig;
