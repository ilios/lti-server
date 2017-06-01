# Ilios LTI Launch Server [![Build Status](https://travis-ci.org/ilios/lti-server.svg?branch=master)](https://travis-ci.org/ilios/lti-server)

> LTI Provider for launching an Ilios dashboard

## Install

```
$ yarn install
```

## CLI
```
$ generate-url --help

  Handles data requests in the LTI format and returns Ilios data.

  Usage
    $ generate-url <school-consumer-key> <userId>

  Examples
    $ generate-url test-school 24
    https://lti-site.com/login/TOKEN
```
