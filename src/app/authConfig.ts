import {AuthConfig} from 'angular-oauth2-oidc';
import {environment} from '../environments/environment';
export const config: AuthConfig ={
    issuer: 'https://login.microsoftonline.com/1a9277a3-ef66-41f6-96b5-c5390ee468a7/v2.0',
    clientId: `${environment.azureClientId}`,
    responseType: 'code',
    clearHashAfterLogin: true,
    requestAccessToken: true,
    scope: `api://${environment.azureClientId}/user_impersonation profile openid`,
    showDebugInformation: true,
    skipIssuerCheck: false,
    strictDiscoveryDocumentValidation: false,
    redirectUri:window.location.origin,
};
