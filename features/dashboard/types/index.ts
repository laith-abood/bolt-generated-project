import { Timestamp } from 'firebase/firestore';

/**
 * Dashboard statistics and metrics types
 */
export interface DashboardStats {
  totalCalls: number;
  totalSales: number;
  conversionRate: number;
  performance: {
    daily: MetricData[];
    weekly: MetricData[];
    monthly: MetricData[];
  };
}

export interface MetricData {
  date: Timestamp;
  value: number;
  trend: MetricTrend;
  change?: number; // Percentage change from previous period
}

export type MetricTrend = 'up' | 'down' | 'stable';

export type DateRange = 'day' | 'week' | 'month' | 'custom';

export interface DateRangeConfig {
  type: DateRange;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Dashboard configuration types
 */
export interface DashboardConfig {
  refreshInterval: number; // Milliseconds
  defaultDateRange: DateRange;
  metrics: MetricType[];
  layout?: DashboardLayout;
}

export type MetricType = 'calls' | 'sales' | 'conversion' | 'performance';

export interface DashboardLayout {
  columns: number;
  widgets: DashboardWidget[];
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  metric: MetricType;
  size: WidgetSize;
  position: {
    column: number;
    row: number;
  };
}

export type WidgetType = 'chart' | 'stat' | 'list' | 'table';
export type WidgetSize = 'small' | 'medium' | 'large';

/**
 * Dashboard service types
 */
export interface DashboardService {
  getStats(dateRange?: DateRangeConfig): Promise<DashboardStats>;
  getMetrics(
    type: MetricType,
    dateRange?: DateRangeConfig
  ): Promise<MetricData[]>;
  updateConfig(config: Partial<DashboardConfig>): Promise<void>;
}

/**
 * Dashboard error types
 */
export class DashboardError extends Error {
  constructor(
    public code: DashboardErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'DashboardError';
  }
}

export type DashboardErrorCode =
  | 'invalid_date_range'
  | 'invalid_metric_type'
  | 'data_fetch_failed'
  | 'invalid_configuration'
  | 'update_failed';

/**
 * Dashboard state types
 */
export interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: DashboardError | null;
  config: DashboardConfig;
  dateRange: DateRangeConfig;
}

/**
 * Dashboard action types
 */
export type DashboardAction =
  | { type: 'SET_STATS'; payload: DashboardStats }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: DashboardError | null }
  | { type: 'UPDATE_CONFIG'; payload: Partial<DashboardConfig> }
  | { type: 'SET_DATE_RANGE'; payload: DateRangeConfig };

/**
 * Dashboard context types
 */
export interface DashboardContextValue {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
}
