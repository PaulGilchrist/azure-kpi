// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// How to get roleName using Kusto query = performanceCounters | distinct cloud_RoleName | order by cloud_RoleName asc

export const environment = {
    appInsights: {
        instrumentationKey: '6cf7b8be-bdd5-4505-a9f8-fb68f1f594c0'
    },
    azureAuthProvider: {
        aadInstance: 'https://login.microsoftonline.com/{0}',
        clientId: 'bd065891-b008-4968-9b26-5f2bcb9c1b66',
        domainHint: 'pulte.com',
        tenant: 'pulte.onmicrosoft.com'
    },
    envName: 'dev',
    queries: [ // name refers to the object's propertyName
        {
            displayName: 'Active Endpoint Actions',
            name: 'activeEndpointActions',
            query: 'requests | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and name !contains("swagger") and (url contains("/api/") or url contains("/odata/")) | project name = trim_end(@"[(](.*)[)]\S*", name) | project name = tolower(trim_end(@"[0-9]*", name)) | summarize Endpoints=dcount(name)'
        },
        {
            displayName: 'Active Users',
            name: 'activeUsers',
            query: 'requests | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and user_Id != "testing" | distinct user_Id | summarize ActiveUsers=count(user_Id)'
        },
        {
            displayName: 'Avg IO Data (bytes/sec)',
            name: 'avgIODataBytesPerSec',
            query: 'performanceCounters | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and cloud_RoleName == "<RoleNameGoesHere>" and counter =="IO Data Bytes/sec" | summarize avgIODataBytesPerSec=round(avg(value),0) by category, counter | project avgIODataBytesPerSec'
        },
        {
            displayName: 'Avg Response Time (milliseconds)',
            name: 'avgResponseTimeMilliseconds',
            query: 'requests | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and (url contains("/api/") or url contains("/odata/")) and success=="True" | summarize AvgResponseTimeMilliseconds=round(avg(duration),0)'
        },
        {
            displayName: 'Avg Response Time Aspose (milliseconds)',
            name: 'avgResponseTimeAsposeMilliseconds',
            query: 'dependencies | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and target contains("aspose") and success=="True" | summarize AvgResponseTimeMilliseconds=round(avg(duration),0)'
        },
        {
            displayName: 'Avg Response Time Docusign (milliseconds)',
            name: 'avgResponseTimeDocusignMilliseconds',
            query: 'dependencies | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and target contains("docusign") and success=="True" | summarize AvgResponseTimeMilliseconds=round(avg(duration),0)'
        },
        {
            displayName: 'Avg Response Time EDH (milliseconds)',
            name: 'avgResponseTimeEDHMilliseconds',
            query: 'dependencies | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and target contains("edh.pulte.com") and success=="True" | summarize AvgResponseTimeMilliseconds=round(avg(duration),0)'
        },
        {
            displayName: 'Avg Response Time eBillExpress (milliseconds)',
            name: 'avgResponseTimeEBillExpressMilliseconds',
            query: 'dependencies | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and target contains("e-billexpress") and success=="True" | summarize AvgResponseTimeMilliseconds=round(avg(duration),0)'
        },
        {
            displayName: 'Avg Response Time Microsoft Online (milliseconds)',
            name: 'avgResponseTimeMicrosoftOnlineMilliseconds',
            query: 'dependencies | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and target contains("microsoftonline") and success=="True" | summarize AvgResponseTimeMilliseconds=round(avg(duration),0)'
        },
        {
            displayName: 'Avg Response Time PicturePark (milliseconds)',
            name: 'avgResponseTimePictureParkMilliseconds',
            query: 'dependencies | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and target contains("picturepark") and success=="True" | summarize AvgResponseTimeMilliseconds=round(avg(duration),0)'
        },
        {
            displayName: 'Avg Response Time SQL (milliseconds)',
            name: 'avgResponseTimeSqlMilliseconds',
            query: 'dependencies | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and type == "SQL" and success=="True" | summarize AvgResponseTimeMilliseconds=round(avg(duration),0)'
        },
        {
            displayName: 'Max Normalized % Processor Time',
            name: 'maxNormalizedPercentProcessorTime',
            query: 'performanceCounters | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and cloud_RoleName == "<RoleNameGoesHere>" and counter =="% Processor Time Normalized" | summarize maxNormalizedPercentProcessorTime=round(max(value),0) by category, counter | project maxNormalizedPercentProcessorTime'
        },
        {
            displayName: 'Min Available Memory (megabytes)',
            name: 'minAvailableMemoryMB',
            query: 'performanceCounters | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and cloud_RoleName == "<RoleNameGoesHere>" and counter =="Available Bytes" | summarize minAvailableMemoryMegabytes=round(min(value)/1024/1024,0) by category, counter | project minAvailableMemoryMegabytes'
        },
        {
            displayName: 'Read (%)',
            name: 'readPercent',
            query: 'requests | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) | summarize Reads=todecimal(countif(name startswith("GET"))), Writes=todecimal(countif(name !startswith("GET"))) | project ReadPercentage=round(Reads/(Reads+Writes)*100,1)'
        },
        {
            displayName: 'Request Error (%)',
            name: 'requestErrorPercent',
            query: 'requests | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and user_Id != "testing" | summarize Success=todecimal(count(success=="True")), Failure=todecimal(count(success=="False")) | project ErrorPercentage=round(Failure/(Success+Failure)*100,1)'
        },
        // {
        //     displayName: 'SQL Max DTU (%)',
        //     name: 'sqlMaxDtuPercent',
        //     query: 'AzureMetrics | where TimeGenerated between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) and MetricName =="dtu_consumption_percent" | summarize maxDTUPercent=round(max(Average),0) by MetricName'
        // },
        {
            displayName: 'Total Requests',
            name: 'totalRequests',
            query: 'requests | where timestamp between (datetime("<FromDateGoesHere>") .. datetime("<ToDateGoesHere>")) | summarize RequestCount=count()'
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
