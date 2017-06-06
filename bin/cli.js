#!/usr/bin/env node
'use strict';

const ltiAppUrl = 'https://d4jps70wc8ppm.cloudfront.net';
const aws = require('aws-sdk');
const readSchoolConfig = require('../lib/readSchoolConfig');
const createJWT = require('../lib/createJWT');

const meow = require('meow');

const cli = meow(`
	Usage
	  $ generate-url <school-consumer-key> <userId>

	Examples
	  $ generate-url test-school 24
	  https://lti-site.com/login/TOKEN
`);
const generateUrl = ([consumerKey, userId]) => {
  if (undefined == consumerKey || undefined == userId) {
    process.stderr.write('Missing parameters <consumerKey> and <userId> are required.\n');
    cli.showHelp([1]);
  }
  readSchoolConfig(consumerKey, aws).then(config => {
    const token = createJWT(userId, config.apiServer, config.apiNameSpace, config.iliosSecret);
    const targetUrl = `${ltiAppUrl}/login/${token}`;

    process.stdout.write(targetUrl + '\n');
  });
};

generateUrl(cli.input);
