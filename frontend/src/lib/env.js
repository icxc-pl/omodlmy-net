import { isSupported } from './platforms';

const env = {
  /**
   * Is dev mode?
   */
  dev: location.hostname === 'local.omodlmy.net',

  /**
   * App URL
   */
  // eslint-disable-next-line no-undef
  url: `//${location.host}`,

  /**
   * App version
   */
  // eslint-disable-next-line no-undef
  version: `${__version}`,

  /**
   * Is share feature supported?
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
   */
  isShareSupported: typeof navigator.share === 'function',

  /**
   * Is App installed?
   */
  isAppInstalled: location.search === '?pwa',

  /**
   * Is current platform supported?
   */
  isPlatformSupported: isSupported
};

export default env;
