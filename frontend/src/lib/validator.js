import Ajv from 'ajv';
import intention from 'Common/schema/intention.json';

const ajv = new Ajv({
  // allows Ajv to set "default" values from scheme to object
  useDefaults: true,

  // allows to have data types coerced to the types specified in schema type
  coerceTypes: true
});

/**
 * Validate Intention
 */
const validateIntention = ajv.compile(intention);

export default {
  validateIntention,
  schema: {
    intention
  }
};
