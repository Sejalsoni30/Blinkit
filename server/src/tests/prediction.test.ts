import { describe, it, expect } from 'vitest';
import { predictionService } from '../services/prediction.service.js';

describe('PredictionService - Delay Probability Heuristics & Model Metrics', () => {
  it('should predict low delay risk for small standard order in non-peak hours', async () => {
    const res = await predictionService.predictDelay({
      itemCount: 2,
      hour: 14, // afternoon non-peak
      storeLoadIndex: 0.8,
      aisleSpreadCount: 1,
      pickerExperience: 'SENIOR',
      weatherCondition: 'CLEAR',
    });

    expect(res.delayProbability).toBeLessThan(0.30);
    expect(res.predictedBreach).toBe(false);
    expect(res.riskLevel).toBe('LOW');
    expect(res.modelMetrics.rocAuc).toBe(0.884);
  });

  it('should predict critical risk for large multi-aisle basket in rain peak hours with junior picker', async () => {
    const res = await predictionService.predictDelay({
      itemCount: 9,
      hour: 20, // peak evening
      storeLoadIndex: 1.8,
      aisleSpreadCount: 6,
      pickerExperience: 'JUNIOR',
      weatherCondition: 'RAIN',
    });

    expect(res.delayProbability).toBeGreaterThan(0.65);
    expect(res.predictedBreach).toBe(true);
    expect(['HIGH', 'CRITICAL']).toContain(res.riskLevel);
    expect(res.contributingFactors.length).toBeGreaterThan(1);
  });
});
