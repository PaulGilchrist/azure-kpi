export interface Month {
    date: string;
    applicationsMakingRequests?: number; // Total unique application making requests during the month
    partnersMakingRequests?: number;
    employeesMakingRequests?: number;
    homeJobsCreated?: number;
    activeEndpointActions?: number;
    totalRequests?: number;
    readPercent?: number;
    requestErrorPercent?: number;
    avgResponseTimeMilliseconds?: number;
    avgResponseTimeAsposeMilliseconds?: number;
    avgResponseTimeDocusignMilliseconds?: number;
    avgResponseTimeEBillExpressMilliseconds?: number;
    avgResponseTimeEdhMilliseconds?: number;
    avgResponseTimeMicrosoftOnlineMilliseconds?: number;
    avgResponseTimePictureParkMilliseconds?: number;
    avgResponseTimeSqlMilliseconds?: number;
    minAvailableMemoryMB?: number;
    maxNormalizedPercentProcessorTime?: number;
    avgIODataBytesPerSec?: number;
    sqlMaxDtuPercent?: number;
}
