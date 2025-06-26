export const isInAppBrowser = (): boolean => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  
    return (
      /instagram/i.test(ua) || 
      /fbav|facebook/i.test(ua) || 
      /LinkedInApp/i.test(ua) || 
      /linkedin/i.test(ua) || 
      /Snapchat/i.test(ua) || 
      /twitter/i.test(ua)
    );
  };