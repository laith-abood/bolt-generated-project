import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/features/auth';

import { dashboardService } from '../services/DashboardService';
import {
  DashboardError,
  DashboardStats,
  DateRangeConfig,
  MetricData,
  MetricType,
} from '../types';

interface UseDashboardOptions {
  refreshInterval?: number;
  defaultDateRange?: DateRangeConfig;
  autoRefresh?: boolean;
}

interface UseDashboardResult {
  stats: DashboardStats | null;
  loading: boolean;
  error: DashboardError | null;
  dateRange: Required<DateRangeConfig>;
  setDateRange: (range: DateRangeConfig) => void;
  refresh: () => Promise<void>;
  getMetrics: (
    type: MetricType,
    range?: DateRangeConfig
  ) => Promise<MetricData[]>;
}

const DEFAULT_OPTIONS: Required<UseDashboardOptions> = {
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  defaultDateRange: { type: 'week' },
  autoRefresh: true,
};

export function useDashboard(
  options?: UseDashboardOptions
): UseDashboardResult {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DashboardError | null>(null);
  const [dateRange, setDateRange] = useState<Required<DateRangeConfig>>(() => {
    const range = options?.defaultDateRange || DEFAULT_OPTIONS.defaultDateRange;
    return dashboardService.getDateRange(range);
  });

  // Memoize options with defaults
  const mergedOptions = useMemo(
    () => ({
      ...DEFAULT_OPTIONS,
      ...options,
    }),
    [options]
  );

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getStats(dateRange);
      setStats(data);
    } catch (err) {
      setError(err as DashboardError);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // Handle date range updates
  const handleDateRangeChange = useCallback((range: DateRangeConfig) => {
    const newRange = dashboardService.getDateRange(range);
    setDateRange(newRange);
  }, []);

  // Fetch metrics for a specific type
  const getMetrics = useCallback(
    async (
      type: MetricType,
      range?: DateRangeConfig
    ): Promise<MetricData[]> => {
      try {
        return await dashboardService.getMetrics(type, range || dateRange);
      } catch (err) {
        throw err as DashboardError;
      }
    },
    [dateRange]
  );

  // Initial fetch and auto-refresh
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchStats();

    // Set up auto-refresh if enabled
    if (mergedOptions.autoRefresh) {
      const intervalId = setInterval(fetchStats, mergedOptions.refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [
    user,
    fetchStats,
    mergedOptions.autoRefresh,
    mergedOptions.refreshInterval,
  ]);

  // Update stats when date range changes
  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, dateRange, fetchStats]);

  return {
    stats,
    loading,
    error,
    dateRange,
    setDateRange: handleDateRangeChange,
    refresh: fetchStats,
    getMetrics,
  };
}

// Export a hook for specific metrics
export function useMetrics(type: MetricType, options?: UseDashboardOptions) {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DashboardError | null>(null);
  const { dateRange } = useDashboard(options);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getMetrics(type, dateRange);
      setMetrics(data);
    } catch (err) {
      setError(err as DashboardError);
    } finally {
      setLoading(false);
    }
  }, [type, dateRange]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refresh: fetchMetrics,
  };
}

// Export a hook for real-time metrics
export function useRealtimeMetrics(
  type: MetricType,
  options?: UseDashboardOptions
) {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DashboardError | null>(null);

  const mergedOptions = useMemo(
    () => ({
      ...DEFAULT_OPTIONS,
      ...options,
      autoRefresh: true, // Force auto-refresh for real-time data
    }),
    [options]
  );

  const { dateRange } = useDashboard(mergedOptions);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getMetrics(type, dateRange);
      setMetrics(data);
    } catch (err) {
      setError(err as DashboardError);
    } finally {
      setLoading(false);
    }
  }, [type, dateRange]);

  useEffect(() => {
    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, mergedOptions.refreshInterval);
    return () => clearInterval(intervalId);
  }, [fetchMetrics, mergedOptions.refreshInterval]);

  return {
    metrics,
    loading,
    error,
    refresh: fetchMetrics,
  };
}
