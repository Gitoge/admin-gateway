import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationConfigService {
  private endpointPrefix = '';
  private endpointPrefixBackend = '';
  private endpointPrefixCarriere = '';
  private endpointPrefixPaie = '';
  private microfrontend = false;

  setEndpointPrefix(endpointPrefix: string): void {
    this.endpointPrefix = endpointPrefix;
  }

  setEndpointPrefixBackend(endpointPrefixBackend: string): void {
    this.endpointPrefixBackend = endpointPrefixBackend;
  }

  setEndpointPrefixCarriere(endpointPrefixCarriere: string): void {
    this.endpointPrefixCarriere = endpointPrefixCarriere;
  }
  setEndpointPrefixPaie(endpointPrefixPaie: string): void {
    this.endpointPrefixPaie = endpointPrefixPaie;
  }

  setMicrofrontend(microfrontend = true): void {
    this.microfrontend = microfrontend;
  }

  isMicrofrontend(): boolean {
    return this.microfrontend;
  }

  getEndpointFor(api: string, microservice?: string): string {
    if (microservice) {
      return `${this.endpointPrefix}services/${microservice}/${api}`;
    }
    return `${this.endpointPrefix}${api}`;
  }

  getEndpointForBackend(api: string, microservice?: string): string {
    if (microservice) {
      return `${this.endpointPrefixBackend}services/${microservice}/${api}`;
    }
    return `${this.endpointPrefixBackend}${api}`;
  }

  getEndpointForCarriere(api: string, microservice?: string): string {
    if (microservice) {
      return `${this.endpointPrefixCarriere}services/${microservice}/${api}`;
    }
    return `${this.endpointPrefixCarriere}${api}`;
  }
  getEndpointForPaie(api: string, microservice?: string): string {
    if (microservice) {
      return `${this.endpointPrefixPaie}services/${microservice}/${api}`;
    }
    return `${this.endpointPrefixPaie}${api}`;
  }
}
