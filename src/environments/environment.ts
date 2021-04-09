// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// How to get roleName using Kusto query = performanceCounters | distinct cloud_RoleName | order by cloud_RoleName asc

export const environment = {
    apiUrl: 'https://apidev-function-app.azurewebsites.net/api',
    appInsights: {
        instrumentationKey: '6cf7b8be-bdd5-4505-a9f8-fb68f1f594c0'
    },
    azureClientId:'bd065891-b008-4968-9b26-5f2bcb9c1b66',
    envName: 'dev',
    production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
