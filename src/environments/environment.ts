// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// How to get roleName using Kusto query = performanceCounters | distinct cloud_RoleName | order by cloud_RoleName asc

export const environment = {
    applications: [
        {
            apiKey: 'pfnglu5k3zpujbutgj7dhxldcfludk731samgqys',
            applicationId: '8730f15e-5653-4809-97c5-d4047e9f4b9a',
            dependencies: [{ displayName: 'EDH', name: 'edh.pulte.com' }],
            fullName: 'Automated Market Based Pricing & Positioning',
            name: 'AMPP',
            roleName: 'amppapiprod'
        },
        {
            apiKey: 'pwt3ssx57nqnu4uex66he0ktlzkvp1fqwzpiya82',
            applicationId: '9cd4c50b-c5f5-4067-aad0-4d0b1c07f7cc',
            dependencies: [{ displayName: 'EDH', name: 'edh.pulte.com' }],
            fullName: 'Construction Portal',
            name: 'CP',
            roleName: 'pcpwebwestprod'
        },
        {
            apiKey: 'sfdjrr1znph107b5mjpffzwmq2feuxwcuiypspol',
            applicationId: 'adeea85e-d354-4370-929d-63a735c4de0f',
            fullName: 'Enterprise Data Hub',
            name: 'EDH',
            roleName: 'edhapiwestprod'
        },
        {
            apiKey: 'u33s8klcr4q6nvdv3sprxams6xxxv4k6lqqtw4s8',
            applicationId: '7f212225-827e-4fbb-904b-23ea27e7c5c7',
            dependencies: [
                { displayName: 'Aspose', name: 'aspose' },
                { displayName: 'Docusign', name: 'docusign' },
                { displayName: 'EBillExpress', name: 'e-billexpress' },
                { displayName: 'EDH', name: 'edh.pulte.com' },
                { displayName: 'MicrosoftOnline', name: 'microsoftonline' },
                { displayName: 'PicturePark', name: 'picturepark' }
            ],
            fullName: 'Home Designer',
            name: 'PHD',
            roleName: 'phdapiwestprod'
        },
        {
            apiKey: 'dxdu77fex5yzyj04ktoqa5eb4eikqeknjuj8x4d3',
            applicationId: '902cbed5-4db7-4656-9134-6ffd10246492',
            dependencies: [{ displayName: 'EDH', name: 'edh.pulte.com' }],
            fullName: 'Land Cost Management',
            name: 'LCM',
            roleName: 'lcmwebwestprod'
        },
        {
            apiKey: 'htpj644vedl4tk2h15ak6fqizfwmmkht8bhqu8t3',
            applicationId: 'd8eb4478-f931-4f6a-8fa3-2704347870d8',
            fullName: 'Public Websites - Content Delivery',
            name: 'DMV-CD',
            roleName: 'pulte-ecomcdprod'
        },
        {
            apiKey: 'vthzdsrllxxw6cmrk253vphuwnx5sjczroe7v07z',
            applicationId: '9a52333b-0dc5-40ad-90e0-988719fc88cf',
            fullName: 'Rebate Tracking System',
            name: 'RTS',
            roleName: 'rtsprod'
        }
    ],
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
