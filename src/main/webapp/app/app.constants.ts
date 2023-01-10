// These constants are injected via webpack DefinePlugin variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

declare const __DEBUG_INFO_ENABLED__: boolean;
declare const __VERSION__: string;

export const VERSION = __VERSION__;
export const DEBUG_INFO_ENABLED = __DEBUG_INFO_ENABLED__;
//SERVEUR LOCAL
export const SERVER_API_URL_BACKEND = 'http://host.docker.internal:4041/';
export const SERVER_API_URL_CARRIERE = 'http://host.docker.internal:4042/';
export const SERVER_API_URL_PAIE = 'http://host.docker.internal:4043/';

//#deploy : SERVEUR DTAI SIGIF
// export const SERVER_API_URL_BACKEND = 'http://10.5.61.79:4041/';
// export const SERVER_API_URL_CARRIERE = 'http://10.5.61.79:4042/';
// export const SERVER_API_URL_PAIE = 'http://10.5.61.79:4043/';

//#deploy : SERVEUR DTAI VPN
// export const SERVER_API_URL_BACKEND = 'http://10.1.0.79:4041/';
// export const SERVER_API_URL_CARRIERE = 'http://10.1.0.79:4042/';
// export const SERVER_API_URL_PAIE = 'http://10.1.0.79:4043/';
