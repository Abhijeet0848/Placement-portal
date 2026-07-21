const host = window.location.hostname;
const BASE_URL = (import.meta.env.VITE_API_URL as string) || `http://${host}:5000/api`;

class ApiService {
  private getTokens() {
    const tokens = localStorage.getItem('tokens');
    return tokens ? JSON.parse(tokens) : null;
  }

  private setTokens(tokens: { accessToken: string; refreshToken: string }) {
    localStorage.setItem('tokens', JSON.stringify(tokens));
  }

  private clearTokens() {
    localStorage.removeItem('tokens');
  }

  private async refreshAccessToken(): Promise<string | null> {
    const tokens = this.getTokens();
    if (!tokens || !tokens.refreshToken) return null;

    try {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokens.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const data = await response.json();
      this.setTokens({
        accessToken: data.tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
      return data.tokens.accessToken;
    } catch (error) {
      this.clearTokens();
      return null;
    }
  }

  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    let tokens = this.getTokens();
    const headers = new Headers();
    
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    if (tokens && tokens.accessToken) {
      headers.set('Authorization', `Bearer ${tokens.accessToken}`);
    }

    const config = { ...options, headers };

    try {
      let response = await fetch(`${BASE_URL}${endpoint}`, config);

      // Auto-refresh token if 401 Unauthorized occurs
      if (response.status === 401 && tokens && tokens.refreshToken) {
        const newAccessToken = await this.refreshAccessToken();
        if (newAccessToken) {
          headers.set('Authorization', `Bearer ${newAccessToken}`);
          response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
        } else {
          // Force logout event
          window.dispatchEvent(new Event('auth-logout'));
        }
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }

  get(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint: string, body: any, options?: RequestInit) {
    const isFormData = body instanceof FormData;
    const headers: any = options?.headers || {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  put(endpoint: string, body: any, options?: RequestInit) {
    const headers: any = options?.headers || {};
    headers['Content-Type'] = 'application/json';
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
  }
}

export const api = new ApiService();
