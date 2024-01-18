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
  };

  if (typeof window !== 'undefined') {
    retData.url = window.location.href;
    retData.browserInfo = getBrowserInfo();
    retData.screenResolution = `${window.screen.width}x${window.screen.height}`;
  }

  if (typeof document !== 'undefined') {
    retData.pageTitle = document.title;
  }

  return retData;
};
