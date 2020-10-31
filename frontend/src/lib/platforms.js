import BrowserInfo from '@smartbear/browser-info';
BrowserInfo.detect();

const platforms = {
  'Android_Chrome': 'vqmDl6ZaeSs',
  'Android_SamsungInternet': 'N7GQQhv1Iek',
  'Android_Firefox': 'aGbNJhJXdEE',
  'Android_Edge': 'YbWg8_dqX0A',
  'iOS_Safari': 'W9yLEI6aYeA',
  'iPadOS_Safari': 'W9yLEI6aYeA'
};

const currentPlatform = `${BrowserInfo.os}_${BrowserInfo.name}`;
const isSupported = typeof platforms[currentPlatform] !== 'undefined';

function getTutorial () {
  if (isSupported) {
    return platforms[currentPlatform];
  }
  return null;
}

export {
  BrowserInfo,

  platforms,
  currentPlatform,
  isSupported,

  getTutorial
};
