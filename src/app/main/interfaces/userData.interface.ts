export interface userData {
  url: string;
  pageTitle: string;
  browserInfo: string;
  screenResolution: string;
  userAgent: string;
  language: string;
  cookies: boolean | undefined;
  onlineStatus: boolean | undefined;
  geolocation: Geolocation | undefined;
  hardwareConcurrency: number | undefined;
  mediaDevices: MediaDevices | undefined;
  doNotTrack: string | null;
  referrer: string;
  screenOrientation: string;
  isMobile: boolean | undefined;
  timezone: string;
  browserCodeName: string;
  browserName: string;
  browserVersion: string;
  platform: string;
}
