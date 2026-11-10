// Decodificar exp permite programar el cierre; Laravel verifica la firma del JWT.
export function tokenExpiresAt(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const { exp } = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')));
        return typeof exp === 'number' && Number.isFinite(exp * 1000) && exp > 0 ? exp * 1000 : null;
    } catch {
        return null;
    }
}

export function isCurrentApiRequest(config, apiUrl, token) {
    if (!config || !apiUrl || !token) return false;
    const authorization = config.headers?.get?.('Authorization') ?? config.headers?.Authorization ?? config.headers?.authorization;
    if (authorization !== `Bearer ${token}`) return false;
    try {
        const api = new URL(apiUrl, window.location.origin);
        const requestUrl = config.baseURL && !/^([a-z][a-z\d+.-]*:)?\/\//i.test(config.url)
            ? `${config.baseURL.replace(/\/$/, '')}/${config.url.replace(/^\//, '')}`
            : config.url;
        const url = new URL(requestUrl, window.location.origin);
        const path = api.pathname.replace(/\/$/, '');
        return url.origin === api.origin && (url.pathname === path || url.pathname.startsWith(`${path}/`));
    } catch {
        return false;
    }
}
