export interface Month {
    date: string;
    activeApplications?: number; // Total unique application making requests during the month
    activeEndpointActions?: number;
    activePartners?: number;
    activeUsers?: number;
    avgIODataBytesPerSec?: number;
    avgResponseTimeMilliseconds?: number;
    avgResponseTimeAsposeMilliseconds?: number;
    avgResponseTimeDocusignMilliseconds?: number;
    avgResponseTimeEBillExpressMilliseconds?: number;
    avgResponseTimeEdhMilliseconds?: number;
    avgResponseTimeMicrosoftOnlineMilliseconds?: number;
    avgResponseTimePictureParkMilliseconds?: number;
    avgResponseTimeSqlMilliseconds?: number;
    homeJobsCreated?: number;
    minAvailableMemoryMB?: number;
    maxNormalizedPercentProcessorTime?: number;
    readPercent?: number;
    requestErrorPercent?: number;
    sqlMaxDtuPercent?: number;
    totalRequests?: number;
}
