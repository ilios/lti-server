# Ilios LTI Launch Server [![Build Status](https://travis-ci.org/ilios/lti-server.svg?branch=master)](https://travis-ci.org/ilios/lti-server)

> LTI Provider for launching an Ilios dashboard

## Install

```
$ pnpm install
$ pnpm install -g serverless
```

## Running tests

```
$ pnpm test
```

## Deploy

```
$ serverless deploy --stage=dev
```

## CLI
```
$ generate-url --help

  Handles data requests in the LTI format and returns Ilios data.

  Usage
    $ generate-url <ltiAppUrl> <apiServer> <apiNameSpace> <iliosSecret> <userId>

  Examples
    $ generate-url 'https://localhost' 'https://demo-api.com' 'api/v3' 'secret' 24
    https://lti-site.com/login/TOKEN
```
