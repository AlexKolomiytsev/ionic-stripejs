import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: '404f32d3',
  appName: 'test-ionic-with-stripe',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    hostname: 'floating-bayou-00569.herokuapp.com',
    androidScheme: 'https',
    iosScheme: 'ionic'
  }
};

export default config;
