export const scriptLoader = (url: string) => {
  return new Promise(function(resolve, reject) {
    const newScript: HTMLScriptElement = document.createElement('script');
    newScript.onload = () => {
      resolve();
    };
    newScript.onerror = () => {
      reject();
    };
    newScript.async = true;
    newScript.type = 'text/javascript';
    newScript.src = url;

    document.getElementsByTagName('head')[0].appendChild(newScript);
  });
};
