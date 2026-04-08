import { AnalyticsService } from '../services/analytics.service';

export const startAnalyticsWorker = () => {
  const FLUSH_INTERVAL = 10 * 1000; // 10 seconds

  console.log('Starting Analytics Worker (Batch insertion every 10s)...');

  setInterval(async () => {
    try {
      await AnalyticsService.flushEvents();
    } catch (error) {
      console.error('Critical error in Analytics Worker:', error);
    }
  }, FLUSH_INTERVAL);
};
