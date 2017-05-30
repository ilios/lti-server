'use strict';

const readSchoolConfig = (key, obj) => {
  if (!(key in obj)) {
    throw new Error(`"${key}" is not known to Ilios. Please contact support@iliosproject.org to set it up.`);
  }

  return obj[key];
};

module.exports = readSchoolConfig;
