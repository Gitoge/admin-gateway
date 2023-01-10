import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ProfileInfo, InfoResponse } from './profile-info.model';
import { IProfils } from 'app/entities/profils/profils.model';
import { SERVER_API_URL_BACKEND } from 'app/app.constants';

export type EntityResponseType = HttpResponse<IProfils>;

@Injectable({ providedIn: 'root' })
export class ProfileService {
  protected resourceUrl = SERVER_API_URL_BACKEND + 'api/profils';

  private infoUrl = this.applicationConfigService.getEndpointFor('management/info');
  private profileInfo$?: Observable<ProfileInfo>;

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProfils>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProfileInfo(): Observable<ProfileInfo> {
    if (this.profileInfo$) {
      return this.profileInfo$;
    }

    this.profileInfo$ = this.http.get<InfoResponse>(this.infoUrl).pipe(
      map((response: InfoResponse) => {
        const profileInfo: ProfileInfo = {
          activeProfiles: response.activeProfiles,
          inProduction: response.activeProfiles?.includes('prod'),
          openAPIEnabled: response.activeProfiles?.includes('api-docs'),
        };
        if (response.activeProfiles && response['display-ribbon-on-profiles']) {
          const displayRibbonOnProfiles = response['display-ribbon-on-profiles'].split(',');
          const ribbonProfiles = displayRibbonOnProfiles.filter(profile => response.activeProfiles?.includes(profile));
          if (ribbonProfiles.length > 0) {
            profileInfo.ribbonEnv = ribbonProfiles[0];
          }
        }
        return profileInfo;
      }),
      shareReplay()
    );
    return this.profileInfo$;
  }
}
