const DEVEL = self.location.hostname.startsWith('local');

/**
 * Debug
 *
 * @param {string} msg Message
 */
function debug(msg) {
  if(DEVEL) {
    console.log(msg);
  }
}

export default debug;
