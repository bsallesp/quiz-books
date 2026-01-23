# Setup Security and Monitoring for Quiz Books
# Usage: ./setup-security-monitoring.ps1 -ResourceGroup <ResourceGroup> -AppName <StaticWebAppName> -SqlServer <SqlServerName> -Location <Location>

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroup,

    [Parameter(Mandatory=$true)]
    [string]$AppName,

    [Parameter(Mandatory=$true)]
    [string]$SqlServerName,

    [Parameter(Mandatory=$true)]
    [string]$Location
)

# 1. Security Policies
Write-Host "Configuring Security Policies..."

# Set SQL Server Minimal TLS Version to 1.2
Write-Host "Setting SQL Server Minimal TLS Version to 1.2..."
az sql server update --resource-group $ResourceGroup --name $SqlServerName --minimal-tls-version "1.2"

# 2. Monitoring with Application Insights
Write-Host "Configuring Monitoring..."

$AppInsightsName = "$AppName-insights"

# Check if App Insights exists
$aiExists = az monitor app-insights component show --app $AppInsightsName --resource-group $ResourceGroup --query "id" -o tsv
if (-not $aiExists) {
    Write-Host "Creating Application Insights resource..."
    az monitor app-insights component create --app $AppInsightsName --location $Location --resource-group $ResourceGroup --application-type web
} else {
    Write-Host "Application Insights resource already exists."
}

# Get Instrumentation Key
$InstrumentationKey = az monitor app-insights component show --app $AppInsightsName --resource-group $ResourceGroup --query "instrumentationKey" -o tsv

# Link to Static Web App
Write-Host "Linking Application Insights to Static Web App..."
az staticwebapp appsettings set --name $AppName --resource-group $ResourceGroup --setting-names APPINSIGHTS_INSTRUMENTATIONKEY=$InstrumentationKey APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=$InstrumentationKey"

# 3. Log Retention and Cost Management
Write-Host "Configuring Log Retention and Cost Management..."

# Set Daily Cap to 0.1 GB (100 MB) to avoid surprise costs
az monitor app-insights component billing update --app $AppInsightsName --resource-group $ResourceGroup --cap 0.1 --stop-on-cap true

# 4. Security Alerts
Write-Host "Configuring Security Alerts..."

# Create an action group (email) - Placeholder, user needs to configure email
$ActionGroupName = "SecurityAlertsActionGroup"
# az monitor action-group create --name $ActionGroupName --resource-group $ResourceGroup --short-name "SecAlerts" --email-receiver "Admin" "admin@example.com"

# Alert on Failed Requests (HTTP 5xx)
# Note: For SWA, metrics might be different. We'll target the App Insights resource for failures.
Write-Host "Creating Alert for Failed Requests..."
az monitor metrics alert create --name "HighFailedRequests" --resource-group $ResourceGroup --scopes $(az monitor app-insights component show --app $AppInsightsName --resource-group $ResourceGroup --query "id" -o tsv) --condition "count requests/failed > 5" --window-size 5m --evaluation-frequency 1m --description "Alert when failed requests > 5 in 5 minutes"

# 5. Dashboard
Write-Host "Deploying Dashboard..."
$SubscriptionId = az account show --query "id" -o tsv
$DashboardJsonContent = Get-Content -Path "dashboard.json" -Raw
$DashboardJsonContent = $DashboardJsonContent.Replace("{subscriptionId}", $SubscriptionId)
$DashboardJsonContent = $DashboardJsonContent.Replace("{resourceGroup}", $ResourceGroup)
$DashboardJsonContent = $DashboardJsonContent.Replace("{appInsightsName}", $AppInsightsName)

$DashboardJsonPath = "dashboard-deploy.json"
$DashboardJsonContent | Set-Content -Path $DashboardJsonPath

az portal dashboard create --resource-group $ResourceGroup --name "$AppName-dashboard" --input-path $DashboardJsonPath

Remove-Item $DashboardJsonPath

Write-Host "Security and Monitoring setup complete!"
