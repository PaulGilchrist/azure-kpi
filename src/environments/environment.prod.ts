export const environment = {
    appInsights: {
        instrumentationKey: '6cf7b8be-bdd5-4505-a9f8-fb68f1f594c0'
    },
    applications: [
        {
            apiKey: 'pfnglu5k3zpujbutgj7dhxldcfludk731samgqys',
            applicationId: '8730f15e-5653-4809-97c5-d4047e9f4b9a',
            fullName: 'Automated Market Based Pricing & Positioning',
            name: 'AMPP',
            roleName: 'amppapiprod'
        },
        {
            apiKey: 'pwt3ssx57nqnu4uex66he0ktlzkvp1fqwzpiya82',
            applicationId: '9cd4c50b-c5f5-4067-aad0-4d0b1c07f7cc',
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
            fullName: 'Home Designer',
            name: 'PHD',
            roleName: 'phdapiwestprod'
        },
        {
            apiKey: 'dxdu77fex5yzyj04ktoqa5eb4eikqeknjuj8x4d3',
            applicationId: '902cbed5-4db7-4656-9134-6ffd10246492',
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
    azureAuthProvider: {
        aadInstance: 'https://login.microsoftonline.com/{0}',
        clientId: 'bd065891-b008-4968-9b26-5f2bcb9c1b66',
        domainHint: 'pulte.com',
        tenant: 'pulte.onmicrosoft.com'
    },
    envName: 'production',
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
    production: true
};
