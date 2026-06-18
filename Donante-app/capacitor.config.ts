import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.proyecto.donante',
  appName: 'Donante App',
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