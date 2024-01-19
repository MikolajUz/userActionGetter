import { userData } from '../../../interfaces/userData.interface';

const getBrowserInfo = (): string => {
  const userAgent =
    typeof window !== 'undefined' ? window.navigator.userAgent : '';
  const browser = /Edge\/|Edg\/|OPR|Safari|Chrome|Firefox|MSIE|Trident/.exec(
    userAgent
  );

  if (browser && browser.index !== -1) {
    return browser[0];
  } else {
    return 'Unknown';
  }
};

export const getUserInfo = () => {
  let retData: userData = {
    url: '',
    pageTitle: '',
    browserInfo: '',
    screenResolution: '',
    userAgent: '',
    language: '',
    cookies: undefined,
    onlineStatus: undefined,
    geolocation: undefined,
    hardwareConcurrency: undefined,
    mediaDevices: undefined,
    doNotTrack: null,
    referrer: '',
    isMobile: false,
    timezone: '',
    screenOrientation: '',
    browserCodeName: '',
    browserName: '',
    browserVersion: '',
    platform: '',
  };

  if (typeof window !== 'undefined') {
    retData.url = window.location.href;
    retData.browserInfo = getBrowserInfo();
    retData.screenResolution = `${window.screen.width}x${window.screen.height}`;
    retData.userAgent = window.navigator.userAgent;
    retData.language = window.navigator.language;
    retData.cookies = window.navigator.cookieEnabled;
    retData.onlineStatus = window.navigator.onLine;
    retData.geolocation = window.navigator.geolocation;
    retData.hardwareConcurrency = window.navigator.hardwareConcurrency;
    retData.mediaDevices = window.navigator.mediaDevices;
    retData.doNotTrack = window.navigator.doNotTrack;
    retData.referrer = document.referrer;
    retData.isMobile = /Mobi/i.test(window.navigator.userAgent);
    retData.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    retData.screenOrientation = window.screen.orientation.type;
    retData.browserCodeName = window.navigator.appCodeName;
    retData.browserName = window.navigator.appName;
    retData.browserVersion = window.navigator.appVersion;
    retData.platform = window.navigator.platform;
  }

  if (typeof document !== 'undefined') {
    retData.pageTitle = document.title;
  }

  return retData;
};
