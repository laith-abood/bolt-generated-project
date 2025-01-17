import {
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  Timestamp,
  type WithFieldValue,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

import {
  DashboardConfig,
  DashboardError,
  DashboardStats,
  DateRangeConfig,
  DashboardService as IDashboardService,
  MetricData,
  MetricType,
} from '../types';
import { Sale, Submission, SubmissionData } from '../types/submission';

const DEFAULT_CONFIG: DashboardConfig = {
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  defaultDateRange: 'week',
  metrics: ['calls', 'sales', 'conversion'],
};

// Firestore converter for Submission type
const submissionConverter: FirestoreDataConverter<Submission> = {
  toFirestore(submission: WithFieldValue<Submission>): DocumentData {
    const { ...data } = submission;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Submission {
    const data = snapshot.data(options) as SubmissionData;
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

export class DashboardService implements IDashboardService {
  private static instance: DashboardService;
  private config: DashboardConfig;

  private constructor(config: Partial<DashboardConfig> = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  }

  public static getInstance(
    config?: Partial<DashboardConfig>
  ): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService(config);
    }
    return DashboardService.instance;
  }

  /**
   * Get dashboard statistics for the specified date range
   */
  public async getStats(dateRange?: DateRangeConfig): Promise<DashboardStats> {
    try {
      const range = this.getDateRange(dateRange);
      const submissions = await this.fetchSubmissions(range);

      // Calculate statistics
      const totalCalls = submissions.reduce(
        (sum, sub) => sum + sub.totalCalls,
        0
      );
      const totalSales = submissions.reduce(
        (sum, sub) =>
          sum + sub.sales.reduce((s: number, sale: Sale) => s + sale.count, 0),
        0
      );
      const conversionRate =
        totalCalls > 0 ? (totalSales / totalCalls) * 100 : 0;

      // Calculate performance metrics
      const performance = {
        daily: await this.calculateMetrics(submissions, 'day'),
        weekly: await this.calculateMetrics(submissions, 'week'),
        monthly: await this.calculateMetrics(submissions, 'month'),
      };

      return {
        totalCalls,
        totalSales,
        conversionRate,
        performance,
      };
    } catch {
      throw new DashboardError(
        'data_fetch_failed',
        'Failed to fetch dashboard statistics'
      );
    }
  }

  /**
   * Get specific metrics data
   */
  public async getMetrics(
    type: MetricType,
    dateRange?: DateRangeConfig
  ): Promise<MetricData[]> {
    try {
      const range = this.getDateRange(dateRange);
      const submissions = await this.fetchSubmissions(range);
      return this.calculateMetrics(submissions, 'day', type);
    } catch {
      throw new DashboardError(
        'data_fetch_failed',
        `Failed to fetch ${type} metrics`
      );
    }
  }

  /**
   * Get date range based on configuration
   */
  public getDateRange(dateRange?: DateRangeConfig): Required<DateRangeConfig> {
    if (
      dateRange?.type === 'custom' &&
      dateRange.startDate &&
      dateRange.endDate
    ) {
      return dateRange as Required<DateRangeConfig>;
    }

    const end = new Date();
    let start: Date;

    switch (dateRange?.type || this.config.defaultDateRange) {
      case 'day':
        start = new Date(end);
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start = new Date(end);
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start = new Date(end);
        start.setMonth(end.getMonth() - 1);
        break;
      default:
        start = new Date(end);
        start.setDate(end.getDate() - 7);
    }

    return {
      type: dateRange?.type || this.config.defaultDateRange,
      startDate: start,
      endDate: end,
    };
  }

  /**
   * Update dashboard configuration
   */
  public async updateConfig(config: Partial<DashboardConfig>): Promise<void> {
    try {
      this.config = {
        ...this.config,
        ...config,
      };
    } catch {
      throw new DashboardError(
        'update_failed',
        'Failed to update dashboard configuration'
      );
    }
  }

  /**
   * Get current dashboard configuration
   */
  public getConfig(): DashboardConfig {
    return { ...this.config };
  }

  /**
   * Fetch submissions for a date range
   */
  private async fetchSubmissions(
    range: Required<DateRangeConfig>
  ): Promise<Submission[]> {
    try {
      if (!db) {
        throw new DashboardError(
          'data_fetch_failed',
          'Firebase database not initialized'
        );
      }

      const submissionsRef = collection(db, 'submissions').withConverter(
        submissionConverter
      );

      const submissionsQuery = query<Submission, DocumentData>(
        submissionsRef,
        where('date', '>=', Timestamp.fromDate(range.startDate!)),
        where('date', '<=', Timestamp.fromDate(range.endDate!)),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(submissionsQuery);
      return snapshot.docs.map((doc) => doc.data() as Submission);
    } catch {
      throw new DashboardError(
        'data_fetch_failed',
        'Failed to fetch submissions'
      );
    }
  }

  /**
   * Calculate metrics for different time periods
   */
  private async calculateMetrics(
    submissions: Submission[],
    period: 'day' | 'week' | 'month',
    metricType: MetricType = 'calls'
  ): Promise<MetricData[]> {
    const metrics: MetricData[] = [];
    const grouped = this.groupByPeriod(submissions, period);

    // Convert Map entries to array for iteration
    Array.from(grouped.entries()).forEach(([date, data]) => {
      const value = this.calculateMetricValue(data, metricType);
      const previousValue = this.getPreviousPeriodValue(
        submissions,
        date,
        period,
        metricType
      );
      const change = previousValue
        ? ((value - previousValue) / previousValue) * 100
        : 0;

      metrics.push({
        date: Timestamp.fromDate(new Date(date)),
        value,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
        change,
      });
    });

    return metrics;
  }

  /**
   * Group submissions by time period
   */
  private groupByPeriod(
    submissions: Submission[],
    period: 'day' | 'week' | 'month'
  ): Map<string, Submission[]> {
    const grouped = new Map<string, Submission[]>();

    submissions.forEach((submission) => {
      const date = submission.date.toDate();
      let key: string;

      switch (period) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const week = this.getWeekNumber(date);
          key = `${date.getFullYear()}-W${week}`;
          break;
        case 'month':
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          break;
      }

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(submission);
    });

    return grouped;
  }

  /**
   * Calculate specific metric value
   */
  private calculateMetricValue(
    submissions: Submission[],
    metricType: MetricType
  ): number {
    switch (metricType) {
      case 'calls':
        return submissions.reduce((sum, sub) => sum + sub.totalCalls, 0);
      case 'sales':
        return submissions.reduce(
          (sum, sub) =>
            sum +
            sub.sales.reduce((s: number, sale: Sale) => s + sale.count, 0),
          0
        );
      case 'conversion':
        const calls = submissions.reduce((sum, sub) => sum + sub.totalCalls, 0);
        const sales = submissions.reduce(
          (sum, sub) =>
            sum +
            sub.sales.reduce((s: number, sale: Sale) => s + sale.count, 0),
          0
        );
        return calls > 0 ? (sales / calls) * 100 : 0;
      default:
        return 0;
    }
  }

  /**
   * Get value from previous period for comparison
   */
  private getPreviousPeriodValue(
    submissions: Submission[],
    currentDate: string,
    period: 'day' | 'week' | 'month',
    metricType: MetricType
  ): number {
    const date = new Date(currentDate);
    let previousDate: Date;

    switch (period) {
      case 'day':
        previousDate = new Date(date.setDate(date.getDate() - 1));
        break;
      case 'week':
        previousDate = new Date(date.setDate(date.getDate() - 7));
        break;
      case 'month':
        previousDate = new Date(date.setMonth(date.getMonth() - 1));
        break;
    }

    const previousSubmissions = submissions.filter((sub) => {
      const subDate = sub.date.toDate();
      return this.isSamePeriod(subDate, previousDate, period);
    });

    return this.calculateMetricValue(previousSubmissions, metricType);
  }

  /**
   * Helper method to get week number
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  /**
   * Check if two dates are in the same period
   */
  private isSamePeriod(
    date1: Date,
    date2: Date,
    period: 'day' | 'week' | 'month'
  ): boolean {
    switch (period) {
      case 'day':
        return (
          date1.toISOString().split('T')[0] ===
          date2.toISOString().split('T')[0]
        );
      case 'week':
        return this.getWeekNumber(date1) === this.getWeekNumber(date2);
      case 'month':
        return (
          date1.getMonth() === date2.getMonth() &&
          date1.getFullYear() === date2.getFullYear()
        );
    }
  }
}

export const dashboardService = DashboardService.getInstance();
