import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.voluntarioapp',
  appName: 'voluntario-app',
  webDir: 'www',

  server: {
    androidScheme: 'http',
    cleartext: true
  },
  
  android: {
    allowMixedContent: true
  }

};

export default config;
