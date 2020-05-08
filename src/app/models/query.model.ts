// performanceCounters needs <RoleNameGoesHere> replaced with state.application.roleName
export enum Query {
    // Only applicable to EDH
    ActiveApplications = 'requests | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) and user_Id != "testing" | distinct user_Id | summarize ApplicationsUsingEdh=count(user_Id)',
    // Does not work for Construction Portal
    ActiveEndpointActions = 'requests | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) and name !contains("swagger") | project name = trim_end(@"[(](.*)[)]\S*", name) | project name = tolower(trim_end(@"[0-9]*", name))| summarize Endpoints=dcount(name)',
    // Only works for Construction Portal
    ActiveEndpointActionsCP = 'requests | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) | where name matches regex @"(DELETE|GET|PATCH|POST|PUT)\s[^/]" | summarize Endpoints=dcount(name)',
    ActiveUsers = 'requests | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) | distinct user_Id | summarize ActiveUsers=count(user_Id)',
    AvgIODataBytesPerSec = 'performanceCounters | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) and cloud_RoleName == "<RoleNameGoesHere>" and counter =="IO Data Bytes/sec" | summarize avgIODataBytesPerSec=round(avg(value),0) by category, counter | project avgIODataBytesPerSec',
    // Must replace <DependencyNameGoesHere> with DependencyName enum
    AvgResponseTimeDependencyMilliseconds = 'dependencies | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) and target contains("<DependencyNameGoesHere>") and success=="True" | summarize AvgResponseTimeMilliseconds=round(avg(duration),0)',
    // Does not work for Construction Portal
    AvgResponseTimeMilliseconds = 'requests | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) and url contains("/odata/") and success=="True" | summarize AvgResponseTimeMilliseconds=round(avg(duration),0)',
    // Only works for Construction Portal
    AvgResponseTimeMillisecondsCP = 'requests | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) and url contains("/api/") and success=="True" | summarize AvgResponseTimeMilliseconds=round(avg(duration),0)',
    AvgResponseTimeSqlMilliseconds = 'dependencies | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) and type == "SQL" and success=="True" | summarize AvgResponseTimeMilliseconds=round(avg(duration),0)',
    MaxNormalizedPercentProcessorTime = 'performanceCounters | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) and cloud_RoleName == "<RoleNameGoesHere>" and counter =="% Processor Time Normalized" | summarize maxNormalizedPercentProcessorTime=round(max(value),0) by category, counter | project maxNormalizedPercentProcessorTime',
    MinAvailableMemoryMB = 'performanceCounters | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) and cloud_RoleName == "<RoleNameGoesHere>" and counter =="Available Bytes" | summarize minAvailableMemoryMegabytes=round(min(value)/1024/1024,0) by category, counter | project minAvailableMemoryMegabytes',
    ReadPercent = 'requests | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) | summarize Reads=todecimal(countif(name startswith("GET"))), Writes=todecimal(countif(name !startswith("GET"))) | project ReadPercentage=round(Reads/(Reads+Writes)*100,1)',
    RequestErrorPercent = 'requests | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) and user_Id != "testing" | summarize Success=todecimal(count(success=="True")), Failure=todecimal(count(success=="False")) | project ErrorPercentage=round(Failure/(Success+Failure)*100,1)',
    SqlMaxDtuPercent = 'AzureMetrics | where TimeGenerated > ago(365d) and MetricName =="dtu_consumption_percent" | summarize maxDTUPercent=round(max(Average),0) by MetricName',
    TotalRequests = 'requests | where timestamp between (startofmonth(ago(30d)) .. endofmonth(ago(30d))) | summarize RequestCount=count()'
}
