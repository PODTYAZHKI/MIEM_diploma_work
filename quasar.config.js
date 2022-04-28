/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

const { configure } = require('quasar/wrappers');

module.exports = configure(function (/* ctx */) {
  return {
    eslint: {
      // fix: true,
      // include = [],
      // exclude = [],
      // rawOptions = {},
      warnings: true,
      errors: true,
    },

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ['axios', 'auth'],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ['app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      vueRouterMode: 'hash',
      publicPath:
        process.env.PUBLIC_PATH !== undefined ? process.env.PUBLIC_PATH : '/',
      env: {
        API_BASE: process.env.AUTH_API ? process.env.API_BASE : '',
        PROXY_API: process.env.PROXY_API ? process.env.PROXY_API : false,
        AUTH_API: process.env.AUTH_API ? process.env.AUTH_API : '/auth/api/v1',
        // FORMS_API: process.env.FORMS_API ? process.env.FORMS_API : '/ftc/api/v1',
        // EPI_API: process.env.EPI_API ? process.env.EPI_API : '/epi/api/v1',
        // WORKBOOK_API: process.env.WORKBOOK_API ? process.env.WORKBOOK_API : '/workbook',
        // GC_API: process.env.GC_API ? process.env.GC_API : '/gc/api/v1',
        // NVT_STATS_API: process.env.NVT_STATS_API ? process.env.NVT_STATS_API : '/nvt-stats-api',
        // NVT_RPI_API: process.env.NVT_RPI_API ? process.env.NVT_RPI_API : '/nvt-rpi-api',
        // NETWORK_TECHNOLOGIES_API: process.env.NETWORK_TECHNOLOGIES_API ? process.env.NETWORK_TECHNOLOGIES_API : '/network-technologies-api',
      },

      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16',
      },

      vueRouterMode: 'hash', // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      // analyze: true,
      // env: {},
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      // extendViteConf (viteConf) {},
      // viteVuePluginOptions: {},

      // vitePlugins: [
      //   [ 'package-name', { ..options.. } ]
      // ]
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      // https: true
      vueDevtools: true,
      open: {
        app: { name: 'Brave Browser' ? 'Brave Browser' : 'google chrome' },
      }, // opens browser window automatically
      port: 8080,
      proxy: process.env.PROXY_API
        ? {
            // proxy all requests starting with /api to jsonplaceholder
            '/auth': {
              target: process.env.API_BASE ? process.env.API_BASE : '',
              changeOrigin: true,
            },
            // '/epi': {
            //   target: process.env.API_BASE ? process.env.API_BASE : '',
            //   changeOrigin: true,
            // },
            // '/nvt-stats-api': {
            //   target: process.env.API_BASE ? process.env.API_BASE : '',
            //   changeOrigin: true,
            // },
            // '/nvt-rpi-api': {
            //   target: process.env.API_BASE ? process.env.API_BASE : '',
            //   changeOrigin: true,
            // },
            // '/workbook': {
            //   target: process.env.API_BASE ? process.env.API_BASE : '',
            //   changeOrigin: true,
            // },
            // '/ftc': {
            //   target: process.env.API_BASE ? process.env.API_BASE : '',
            //   changeOrigin: true,
            // },
            // '/network-technologies-api': {
            //   target: process.env.API_BASE ? process.env.API_BASE : '',
            //   changeOrigin: true,
            // },
          }
        : undefined,
    },
    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {
        screen: {
          bodyClasses: true, // <<< add this
        },
      },

      iconSet: 'material-icons', // Quasar icon set
      lang: 'ru', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      components: ['QTable'],
      // directives: [],

      // Quasar plugins
      plugins: ['Cookies', 'Notify', 'Loading', 'LocalStorage'],
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   registerServiceWorker: 'src-pwa/register-service-worker',
    //   serviceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    // },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        'render', // keep this as last one
      ],
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'generateSW', // or 'injectManifest'
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      // extendGenerateSWOptions (cfg) {}
      // extendInjectManifestOptions (cfg) {},
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: `Booking Service`,
        short_name: `Booking Service`,
        description: `Service for booking remote access to laboratory stands in MIEM HSE`,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      inspectPort: 5858,

      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'lab-booking',
      },
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: ['my-content-script'],

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    },
  };
});
