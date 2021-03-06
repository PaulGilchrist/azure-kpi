# Azure App Insights KPI & Capacity Planning Automation (Angular edition)

## Project Name – `azure-kpi`

## Current State

Azure stores many separate logs for each hosted application. These logs are brought together in Azure’s “Log Analytics” of “Application Insights” along with a powerful query engine and language named “Kusto” for parsing through the logs to reveal important information.  This query engine is also used for monitoring, alerting, and visualizing metrics.

Logging is circular with a rolling 90-day window due to the sheer size of data collected, and processing required to directly query against them.  This limits their ability to be used for longer term trend analysis such as Key Performance Indicators (KPI) or resource capacity planning.

Other limitations include each question requiring a separate query, the difficulty running a query against all applications, the lack of a query repository, and the storing of previous query results for historical reference or comparison.

## Project Solution

This application in combination with two remote services (Azure Functions, but AWS Lambda or similar would work equally as well), allows for storing multiple queries in a repository along with a list of applications to run against.  The service runs all queries against all applications in parallel for very fast performance, then stores the results in a JSON heiarchy on remote storage, along with all previous runs.  This data is viewable within the browser application, or exportable to JSON or CSV file formats for use in other systems.

New results are automatically added monthly allowing for long term retaining of the queries aggregations long past Azures 90 day logging limits.

## Future Opportunities

* UI for adding, removing, or editing applications and queries - Currently configurable through environment
* Graphical dashboards or integration with Power BI
