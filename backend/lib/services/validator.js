const path = require('path');

// JSON schema valdidator
const Ajv = require('ajv');
const ajv = new Ajv({
  // allows Ajv to set "default" values from scheme to object
  useDefaults: true,

  // allows to have data types coerced to the types specified in schema type
  coerceTypes: true
});

const SCHEMA_DIR = path.resolve(__dirname, '../../../common/schema');

const VALID_ID = /^[0-9a-f]{24}$/;

/**
 * Validate Id
 * @param {*} id
 * @returns {boolean} Verdict
 */
function validateId(id) {
  return typeof id === 'string' && VALID_ID.test(id);
}

/**
 * Validate Intention
 */
const validateIntention = ajv.compile(
  require(path.join(SCHEMA_DIR, 'intention.json'))
);

/**
 * Validate Query
 */
const validateQuery = ajv.compile(
  require(path.join(SCHEMA_DIR, 'query.json'))
);

// Exports
module.exports = {
  validateId,
  validateIntention,
  validateQuery
};
