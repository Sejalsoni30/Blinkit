import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import {
  MOCK_USERS,
  MOCK_STORES,
  MOCK_OVERVIEW,
  MOCK_STAGES,
  MOCK_CAUSES,
  MOCK_HOURLY,
  MOCK_HEATMAP,
  MOCK_SLOW_SKUS,
  MOCK_LEADERBOARD,
  MOCK_PICKERS,
  MOCK_INVENTORY_ITEMS,
  MOCK_INSIGHTS,
  MOCK_ALERTS,
  generateMockOrders,
} from './mockData';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock response dispatcher for standalone / static preview mode
export const getMockResponse = (config: InternalAxiosRequestConfig | any): any => {
  const url = (config.url || '').replace('/api/v1', '');
  const method = (config.method || 'get').toLowerCase();

  // Auth: Login
  if (url.includes('/auth/login') && method === 'post') {
    let email = 'admin@blinkit.com';
    try {
      const parsed = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      if (parsed?.email) email = parsed.email;
    } catch {}

    const user = MOCK_USERS[email] || MOCK_USERS['admin@blinkit.com'];
    localStorage.setItem('blinkit_user', JSON.stringify(user));
    return {
      success: true,
      message: 'Logged in successfully (Demo Mode)',
      data: {
        user,
        accessToken: 'mock-jwt-token-2026',
        refreshToken: 'mock-refresh-token-2026',
      },
    };
  }

  // Auth: Me
  if (url.includes('/auth/me') && method === 'get') {
    const saved = localStorage.getItem('blinkit_user');
    const user = saved ? JSON.parse(saved) : MOCK_USERS['admin@blinkit.com'];
    return { success: true, data: user };
  }

  // Auth: Logout
  if (url.includes('/auth/logout')) {
    localStorage.removeItem('blinkit_user');
    return { success: true, message: 'Logged out' };
  }

  // Stores
  if (url.startsWith('/stores') || url.includes('/stores')) {
    return { success: true, data: MOCK_STORES };
  }

  // Analytics: Overview
  if (url.includes('/analytics/overview')) {
    return { success: true, data: MOCK_OVERVIEW };
  }

  // Analytics: Stage Funnel
  if (url.includes('/analytics/stage-breakdown')) {
    return {
      success: true,
      data: {
        stages: MOCK_STAGES,
        avgTotalSeconds: 440,
        p90TotalSeconds: 580,
        slaTargetSeconds: 600,
        totalOrdersEvaluated: 10000,
      },
    };
  }

  // Analytics: Root Causes
  if (url.includes('/analytics/root-causes')) {
    return {
      success: true,
      data: {
        causes: MOCK_CAUSES,
        totalBreaches: 880,
      },
    };
  }

  // Analytics: Hourly Demand
  if (url.includes('/analytics/hourly-demand')) {
    return {
      success: true,
      data: MOCK_HOURLY,
    };
  }

  // Analytics: Aisle Heatmap
  if (url.includes('/analytics/aisle-heatmap')) {
    return { success: true, data: MOCK_HEATMAP };
  }

  // Analytics: Slowest SKUs
  if (url.includes('/analytics/sku-pick-times')) {
    return { success: true, data: MOCK_SLOW_SKUS };
  }

  // Analytics: Store Comparison Leaderboard
  if (url.includes('/analytics/store-comparison')) {
    return { success: true, data: MOCK_LEADERBOARD };
  }

  // Orders Explorer List
  if (url.startsWith('/orders') || url.includes('/orders')) {
    return {
      success: true,
      data: {
        orders: generateMockOrders(15),
        total: 10000,
        page: 1,
        totalPages: 667,
      },
    };
  }

  // Picker Leaderboard
  if (url.includes('/pickers')) {
    return { success: true, data: MOCK_PICKERS };
  }

  // Products / Inventory Risk
  if (url.includes('/products/inventory-risk')) {
    return {
      success: true,
      data: {
        totalLowStockItems: 4,
        criticalStockoutRiskCount: 2,
        items: MOCK_INVENTORY_ITEMS,
      },
    };
  }

  // Predict: Delay Risk
  if (url.includes('/predict/delay')) {
    let itemCount = 4;
    let hour = 19;
    try {
      const parsed = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      if (parsed?.itemCount) itemCount = parsed.itemCount;
      if (parsed?.hour) hour = parsed.hour;
    } catch {}

    const isPeak = (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 22);
    const prob = Math.min(0.95, Math.max(0.08, Number(((itemCount * 0.08) + (isPeak ? 0.32 : 0.05)).toFixed(3))));
    const riskLevel = prob >= 0.7 ? 'CRITICAL' : prob >= 0.4 ? 'HIGH' : prob >= 0.2 ? 'MEDIUM' : 'LOW';

    return {
      success: true,
      data: {
        delayProbability: prob,
        predictedBreach: prob >= 0.5,
        riskLevel,
        confidence: 0.88,
        contributingFactors: [
          { factor: `${itemCount} items in basket`, impact: `+${itemCount * 4}% pick time` },
          { factor: isPeak ? 'Peak evening intake' : 'Normal window', impact: isPeak ? 'High congestion' : 'Nominal' },
        ],
        modelMetrics: {
          rocAuc: 0.884,
          precision: 0.821,
          recall: 0.846,
          f1Score: 0.833,
        },
      },
    };
  }

  // Predict: What-If Simulator
  if (url.includes('/predict/what-if')) {
    let pickerChange = 2;
    try {
      const parsed = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      if (parsed?.pickerCountChange !== undefined) pickerChange = parsed.pickerCountChange;
    } catch {}

    const baseSla = 91.2;
    const projectedSla = Number(Math.min(99.0, Math.max(70.0, baseSla + pickerChange * 1.8)).toFixed(1));

    return {
      success: true,
      data: {
        baseline: { slaComplianceRate: baseSla, avgTotalSeconds: 440 },
        projected: {
          slaComplianceRate: projectedSla,
          avgTotalSeconds: Math.round(440 - pickerChange * 16),
          slaDeltaPercent: Number((projectedSla - baseSla).toFixed(1)),
        },
        analysis: {
          verdict: projectedSla >= 92 ? 'OPTIMAL (Achieves >92% target)' : 'AT RISK (Requires staff)',
        },
      },
    };
  }

  // Predict: Insights
  if (url.includes('/predict/insights')) {
    return { success: true, data: MOCK_INSIGHTS };
  }

  // Alerts: Resolve
  if (url.includes('/alerts') && (url.includes('/resolve') || method === 'patch')) {
    return { success: true, message: 'Alert marked as resolved' };
  }

  // Alerts: List
  if (url.includes('/alerts')) {
    return { success: true, data: MOCK_ALERTS };
  }

  return { success: true, data: [] };
};

// Request Interceptor: If deployed on Vercel or cloud static preview without external backend URL, fulfill immediately via mock adapter
api.interceptors.request.use((config) => {
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0');

  const isStandalone =
    typeof window !== 'undefined' &&
    !import.meta.env.VITE_API_URL &&
    (!isLocalhost || window.location.search.includes('mock=true'));

  if (isStandalone) {
    config.adapter = async () => {
      // 80ms simulated latency for realistic feeling UI transitions
      await new Promise((resolve) => setTimeout(resolve, 80));
      const mockResult = getMockResponse(config);
      return {
        data: mockResult,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as AxiosResponse;
    };
  }

  return config;
});

// Response Error Interceptor: Fallback to mock data if backend returned 405/404 or connection refused
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 405 ||
      error.response?.status === 404 ||
      error.code === 'ERR_NETWORK' ||
      !error.response
    ) {
      console.warn('API returned status:', error.response?.status || 'Network Error', '- fulfilling with mock dataset.');
      const mockResult = getMockResponse(originalRequest);
      return {
        data: mockResult,
        status: 200,
        statusText: 'OK (Mock Fallback)',
        headers: {},
        config: originalRequest,
      } as AxiosResponse;
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        window.dispatchEvent(new CustomEvent('auth:expired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
