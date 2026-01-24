import { Injectable } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  appInsights: ApplicationInsights;

  constructor() {
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: environment.appInsights.instrumentationKey,
        enableAutoRouteTracking: true // Básico: rastreamento de rotas automático
      }
    });
    this.appInsights.loadAppInsights();
  }

  logEvent(name: string, properties?: { [key: string]: any }) {
    this.appInsights.trackEvent({ name }, properties);
  }

  logMetric(name: string, average: number, properties?: { [key: string]: any }) {
    this.appInsights.trackMetric({ name, average }, properties);
  }

  logException(exception: Error, severityLevel?: number) {
    try {
      this.appInsights.trackException({ exception, severityLevel });
    } catch (e) {
      console.error('Failed to log exception to AppInsights', e);
    }
  }

  logTrace(message: string, properties?: { [key: string]: any }) {
    this.appInsights.trackTrace({ message }, properties);
  }
}
