/// <reference types="@capacitor/push-notifications" />

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
  },

  plugins: {
    PushNotifications: {
      presentationOptions: [
        'badge',
        'sound',
        'alert'
      ]
    }
  }
};

export default config;