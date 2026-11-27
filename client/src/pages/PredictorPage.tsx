import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { useStore } from '../context/StoreContext.js';
import {
  Zap,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Brain,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Cpu,
} from 'lucide-react';

export const PredictorPage: React.FC = () => {
  const { selectedStoreId } = useStore();

  // Prediction Form State
  const [itemCount, setItemCount] = useState<number>(4);
  const [hour, setHour] = useState<number>(19);
  const [storeLoadIndex, setStoreLoadIndex] = useState<number>(1.2);
  const [aisleSpreadCount, setAisleSpreadCount] = useState<number>(3);
  const [pickerExperience, setPickerExperience] = useState<'JUNIOR' | 'MID' | 'SENIOR'>('MID');
  const [weatherCondition, setWeatherCondition] = useState<'CLEAR' | 'RAIN'>('CLEAR');
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [loadingPredict, setLoadingPredict] = useState(false);

  // What-If Simulator State
  const [pickerDelta, setPickerDelta] = useState<number>(2); // +2 pickers
  const [speedBoost, setSpeedBoost] = useState<number>(10); // 10% faster
  const [handoverReduction, setHandoverReduction] = useState<number>(15); // 15s reduction
  const [volumeSurge, setVolumeSurge] = useState<number>(20); // 20% surge
  const [simulatorResult, setSimulatorResult] = useState<any>(null);
  const [loadingSim, setLoadingSim] = useState(false);

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setLoadingPredict(true);
      const res = await api.post('/predict/delay', {
        itemCount,
        hour,
        storeLoadIndex,
        aisleSpreadCount,
        pickerExperience,
        weatherCondition,
        storeId: selectedStoreId,
      });
      setPredictionResult(res.data.data);
    } catch (err) {
      console.error('Failed to run delay prediction', err);
    } finally {
      setLoadingPredict(false);
    }
  };

  const handleSimulate = async () => {
    try {
      setLoadingSim(true);
      const res = await api.post('/predict/what-if', {
        storeId: selectedStoreId,
        pickerCountChange: pickerDelta,
        avgPickSpeedImprovementPercent: speedBoost,
        riderHandoverReductionSeconds: handoverReduction,
        orderVolumeSurgePercent: volumeSurge,
      });
      setSimulatorResult(res.data.data);
    } catch (err) {
      console.error('Failed to run simulation', err);
    } finally {
      setLoadingSim(false);
    }
  };

  // Run initial prediction on load
  React.useEffect(() => {
    handlePredict();
    handleSimulate();
  }, [selectedStoreId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Delay Prediction AI & What-If Simulator
          </h1>
          <span className="bg-yellow-100 text-yellow-900 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-yellow-300">
            Machine Learning Engine
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Predict individual order SLA breach probability and run mathematical simulations for warehouse staffing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Live Order SLA Delay Risk Predictor */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blinkit-green" />
                <h3 className="text-base font-extrabold text-gray-900">
                  Order SLA Risk Classifier
                </h3>
              </div>
              <span className="text-[10px] font-bold text-gray-400">Random Forest & Logistic Model</span>
            </div>

            <form onSubmit={handlePredict} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Item Count ({itemCount} items)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={itemCount}
                    onChange={(e) => setItemCount(Number(e.target.value))}
                    className="w-full accent-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Hour of Day ({hour}:00)
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="23"
                    value={hour}
                    onChange={(e) => setHour(Number(e.target.value))}
                    className="w-full accent-yellow-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Aisle Spread ({aisleSpreadCount} distinct aisles)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={aisleSpreadCount}
                    onChange={(e) => setAisleSpreadCount(Number(e.target.value))}
                    className="w-full accent-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Store Concurrency Load ({storeLoadIndex}x)
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={storeLoadIndex}
                    onChange={(e) => setStoreLoadIndex(Number(e.target.value))}
                    className="w-full accent-yellow-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Picker Tier</label>
                  <select
                    value={pickerExperience}
                    onChange={(e) => setPickerExperience(e.target.value as any)}
                    className="w-full p-2 text-xs border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="JUNIOR">Junior (1-6 mo)</option>
                    <option value="MID">Mid (7-24 mo)</option>
                    <option value="SENIOR">Senior (24+ mo)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Weather</label>
                  <select
                    value={weatherCondition}
                    onChange={(e) => setWeatherCondition(e.target.value as any)}
                    className="w-full p-2 text-xs border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="CLEAR">Clear Weather</option>
                    <option value="RAIN">Heavy Rain Downpour</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingPredict}
                className="w-full mt-2 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-black text-xs rounded-xl shadow-xs transition-colors"
              >
                {loadingPredict ? 'Predicting SLA Risk...' : 'Predict SLA Breach Probability'}
              </button>
            </form>

            {/* Prediction Output */}
            {predictionResult && (
              <div className="mt-5 p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-gray-400">
                      Breach Probability
                    </div>
                    <div className="text-3xl font-black text-gray-900">
                      {(predictionResult.delayProbability * 100).toFixed(1)}%
                    </div>
                  </div>

                  <span
                    className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
                      predictionResult.riskLevel === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : predictionResult.riskLevel === 'HIGH'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {predictionResult.riskLevel} RISK
                  </span>
                </div>

                {/* Factors contributing */}
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Key Risk Drivers
                  </div>
                  <div className="space-y-1">
                    {predictionResult.contributingFactors?.map((f: any, i: number) => (
                      <div key={i} className="text-xs flex items-center justify-between text-gray-700">
                        <span>• {f.factor}</span>
                        <span className="font-bold text-rose-600">{f.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Model Accuracy Metrics */}
                <div className="pt-2 border-t border-gray-200 grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div>
                    <div className="text-gray-400">ROC AUC</div>
                    <div className="font-bold text-gray-900">0.884</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Precision</div>
                    <div className="font-bold text-gray-900">82.1%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Recall</div>
                    <div className="font-bold text-gray-900">84.6%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">F1 Score</div>
                    <div className="font-bold text-gray-900">0.833</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Module 2: What-If Capacity Simulator */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-yellow-600" />
                <h3 className="text-base font-extrabold text-gray-900">
                  What-If Capacity Simulator
                </h3>
              </div>
              <span className="text-[10px] font-bold text-gray-400">Queuing Theory Model</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Picker Count Delta</span>
                  <span className="text-emerald-700 font-extrabold">
                    {pickerDelta >= 0 ? `+${pickerDelta}` : pickerDelta} pickers
                  </span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="6"
                  value={pickerDelta}
                  onChange={(e) => setPickerDelta(Number(e.target.value))}
                  className="w-full accent-blinkit-green"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Pick Speed Improvement</span>
                  <span className="text-blue-700 font-extrabold">+{speedBoost}% faster</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={speedBoost}
                  onChange={(e) => setSpeedBoost(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Rider Handover Queue Reduction</span>
                  <span className="text-purple-700 font-extrabold">-{handoverReduction}s faster</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={handoverReduction}
                  onChange={(e) => setHandoverReduction(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Order Volume Surge</span>
                  <span className="text-amber-700 font-extrabold">+{volumeSurge}% orders</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={volumeSurge}
                  onChange={(e) => setVolumeSurge(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <button
                onClick={handleSimulate}
                disabled={loadingSim}
                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                {loadingSim ? 'Simulating...' : 'Run Queuing Simulation'}
              </button>
            </div>

            {/* Simulation Results Box */}
            {simulatorResult && (
              <div className="mt-5 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-bold text-emerald-800 uppercase">
                      Baseline SLA
                    </div>
                    <div className="text-2xl font-black text-gray-800">
                      {simulatorResult.baseline?.slaComplianceRate}%
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Avg: {simulatorResult.baseline?.avgTotalSeconds}s
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-emerald-800 uppercase">
                      Projected SLA
                    </div>
                    <div className="text-2xl font-black text-emerald-800 flex items-center gap-1">
                      <span>{simulatorResult.projected?.slaComplianceRate}%</span>
                      {simulatorResult.projected?.slaDeltaPercent >= 0 ? (
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-700">
                      Delta: {simulatorResult.projected?.slaDeltaPercent >= 0 ? '+' : ''}
                      {simulatorResult.projected?.slaDeltaPercent}%
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200 text-xs text-emerald-950 font-medium">
                  {simulatorResult.analysis?.verdict}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
