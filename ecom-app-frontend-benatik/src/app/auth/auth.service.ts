import { Injectable } from '@angular/core';
import { OAuthService, OAuthSuccessEvent } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private oauthService: OAuthService) { }

    init(): Promise<void> {
        this.oauthService.configure(authConfig);
        this.oauthService.setStorage(localStorage);
        this.oauthService.setupAutomaticSilentRefresh();
        return this.oauthService.loadDiscoveryDocumentAndTryLogin() as Promise<void>;
    }

    login(): void {
        this.oauthService.initCodeFlow();
    }

    logout(): void {
        this.oauthService.logOut();
    }

    get accessToken(): string | null {
        const token = this.oauthService.getAccessToken();
        return token && token.length > 0 ? token : null;
    }

    get identityClaims(): Record<string, unknown> | null {
        return this.oauthService.getIdentityClaims() as Record<string, unknown> | null;
    }

    get events() {
        return this.oauthService.events;
    }
}
