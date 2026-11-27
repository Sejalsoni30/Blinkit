import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { useStore } from '../context/StoreContext.js';
import { Order } from '../types/index.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { ExportButton } from '../components/common/ExportButton.js';
import { EmptyState } from '../components/common/EmptyState.js';
import {
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Eye,
  Upload,
  Download,
  X,
  Clock,
  User,
  Bike,
  Package,
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { selectedStoreId, stores } = useStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [delayedOnly, setDelayedOnly] = useState(false);
  const [delayReason, setDelayReason] = useState('NONE');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvInput, setCsvInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const queryParams = new URLSearchParams();
  if (selectedStoreId && selectedStoreId !== 'ALL') queryParams.append('storeId', selectedStoreId);
  if (status && status !== 'ALL') queryParams.append('status', status);
  if (delayReason && delayReason !== 'NONE') queryParams.append('delayReason', delayReason);
  if (delayedOnly) queryParams.append('delayedOnly', 'true');
  if (search) queryParams.append('search', search);
  queryParams.append('page', String(page));
  queryParams.append('limit', '15');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders', selectedStoreId, status, delayReason, delayedOnly, search, page],
    queryFn: async () => {
      const res = await api.get(`/orders?${queryParams.toString()}`);
      return res.data.data;
    },
  });

  const orders: Order[] = data?.orders || [];
  const totalPages = data?.totalPages || 1;

  const handleImport = async () => {
    try {
      setImportStatus('Importing...');
      const res = await api.post('/import/orders', { csvString: csvInput });
      if (res.data?.success) {
        setImportStatus(`Successfully imported ${res.data.data.importedCount} orders!`);
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportStatus(null);
          setCsvInput('');
          refetch();
        }, 1200);
      }
    } catch (err: any) {
      setImportStatus(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const downloadSampleTemplate = async () => {
    try {
      const res = await api.get('/import/template', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'blinkit_orders_template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download template', err);
    }
  };

  const exportColumns = [
    { header: 'Order ID', key: 'orderId' },
    { header: 'Store', key: 'storeId' },
    { header: 'Items', key: 'itemCount' },
    { header: 'Amount (Rs)', key: 'totalAmount' },
    { header: 'Duration (s)', key: 'totalDurationSeconds' },
    { header: 'Breached', key: 'isBreached' },
    { header: 'Delay Reason', key: 'delayReason' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Explorer</h1>
          <p className="text-xs text-gray-500 mt-1">
            Search, inspect fulfillment pipelines, audit stage delays & import real-world order logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <ExportButton
            data={orders}
            filename="blinkit_orders_export"
            title="Orders Telemetry"
            columns={exportColumns}
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search order ID, picker, SKU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:border-yellow-400"
            />
          </div>

          {/* Delay Filter */}
          <div className="flex items-center gap-2">
            <select
              aria-label="Filter by Delay Reason"
              value={delayReason}
              onChange={(e) => {
                setDelayReason(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:border-yellow-400 bg-white"
            >
              <option value="NONE">All Delay Causes</option>
              <option value="SLOW_PICK">Slow Pick</option>
              <option value="PACKING_QUEUE">Packing Queue</option>
              <option value="RIDER_WAIT">Rider Wait</option>
              <option value="STOCKOUT_SUBSTITUTION">Stockout Substitution</option>
              <option value="TRAFFIC_RAIN">Traffic / Weather</option>
            </select>
          </div>

          {/* Delayed Only Toggle */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={delayedOnly}
                onChange={(e) => {
                  setDelayedOnly(e.target.checked);
                  setPage(1);
                }}
                className="w-4 h-4 rounded text-blinkit-green focus:ring-yellow-400"
              />
              <span>SLA Breaches Only (&gt;10 min)</span>
            </label>
          </div>

          <div className="text-right text-xs text-gray-500 flex items-center justify-end">
            <span>
              Showing <strong className="text-gray-900">{orders.length}</strong> records
            </span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <LoadingSkeleton rows={8} />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Try broadening your search or clearing applied filters."
          actionText="Reset Filters"
          onAction={() => {
            setSearch('');
            setDelayReason('NONE');
            setDelayedOnly(false);
          }}
        />
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Store</th>
                  <th className="px-4 py-3">Placed At</th>
                  <th className="px-4 py-3">Total Time</th>
                  <th className="px-4 py-3">Stage Breakdown</th>
                  <th className="px-4 py-3">SLA Status</th>
                  <th className="px-4 py-3">Delay Reason</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const minutes = Math.floor(order.totalDurationSeconds / 60);
                  const seconds = order.totalDurationSeconds % 60;
                  const isBreached = order.isBreached;

                  return (
                    <tr key={order.orderId} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900">{order.orderId}</td>
                      <td className="px-4 py-3 text-gray-600 font-medium">
                        {stores.find((s) => s.storeId === order.storeId)?.city || order.storeId}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(order.placedAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3 font-extrabold text-gray-900">
                        <span className={isBreached ? 'text-red-600' : 'text-emerald-700'}>
                          {minutes}m {seconds}s
                        </span>
                      </td>

                      {/* Mini visual stage durations */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <span title="Pick duration" className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                            P: {order.stageDurations?.pick}s
                          </span>
                          <span title="Pack duration" className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold">
                            K: {order.stageDurations?.pack}s
                          </span>
                          <span title="Handover duration" className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold">
                            H: {order.stageDurations?.handover}s
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {isBreached ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
                            <AlertCircle className="w-3 h-3" />
                            Breached
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Within 10m
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {order.delayReason !== 'NONE' ? (
                          <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                            {order.delayReason}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 hover:bg-yellow-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
                          title="View Order Pipeline Timeline"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs">
            <span className="text-gray-500">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-gray-200 rounded-lg font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Per-Order Timeline Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto space-y-6 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-gray-900">
                    Order Timeline: {selectedOrder.orderId}
                  </h3>
                  {selectedOrder.isBreached ? (
                    <span className="text-xs font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-300">
                      SLA Breached
                    </span>
                  ) : (
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      SLA Compliant
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Store: {selectedOrder.storeId} • Placed at {new Date(selectedOrder.placedAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pipeline Stage Bar */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Fulfillment Funnel Timestamps
              </div>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Assign</div>
                  <div className="font-extrabold text-gray-900">
                    {selectedOrder.stageDurations?.assign}s
                  </div>
                </div>
                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                  <div className="text-[10px] text-blue-600 font-bold uppercase">Pick</div>
                  <div className="font-extrabold text-blue-900">
                    {selectedOrder.stageDurations?.pick}s
                  </div>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <div className="text-[10px] text-amber-600 font-bold uppercase">Pack</div>
                  <div className="font-extrabold text-amber-900">
                    {selectedOrder.stageDurations?.pack}s
                  </div>
                </div>
                <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200">
                  <div className="text-[10px] text-purple-600 font-bold uppercase">Handover</div>
                  <div className="font-extrabold text-purple-900">
                    {selectedOrder.stageDurations?.handover}s
                  </div>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <div className="text-[10px] text-emerald-600 font-bold uppercase">Ride</div>
                  <div className="font-extrabold text-emerald-900">
                    {selectedOrder.stageDurations?.ride}s
                  </div>
                </div>
              </div>
            </div>

            {/* Personnel Assigned */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Picker</div>
                  <div className="text-xs font-bold text-gray-900">
                    {selectedOrder.pickerId || 'Unassigned'}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center gap-3">
                <Bike className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Rider</div>
                  <div className="text-xs font-bold text-gray-900">
                    {selectedOrder.riderId || 'Auto Handover'}
                  </div>
                </div>
              </div>
            </div>

            {/* Items in order */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Order Items ({selectedOrder.items?.length || 0}) • Total ₹{selectedOrder.totalAmount}
              </div>
              <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-40 overflow-y-auto text-xs">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-[10px] text-gray-400">
                        {item.aisle} • Rack: {item.rack} • SKU: {item.sku}
                      </div>
                    </div>
                    <div className="font-bold text-gray-700">
                      Qty: {item.qty} × ₹{item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Substitutions */}
            {selectedOrder.substitutions?.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl">
                <div className="text-xs font-bold text-rose-900 mb-1">
                  Substitutions ({selectedOrder.substitutions.length})
                </div>
                {selectedOrder.substitutions.map((sub, idx) => (
                  <div key={idx} className="text-xs text-rose-800">
                    Replaced SKU: {sub.originalSku} with {sub.substituteSku} (Delay: +{sub.delaySeconds}s)
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-gray-900">
                Import Order Telemetry Data (CSV)
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Paste order CSV rows below. You can also download our documented CSV template to verify expected format.
            </p>

            <button
              onClick={downloadSampleTemplate}
              className="inline-flex items-center gap-1.5 text-xs text-blinkit-green font-bold hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download sample orders template (.csv)</span>
            </button>

            <textarea
              rows={8}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="orderId,storeId,itemCount,totalAmount,placedAt,assignDuration,pickDuration,packDuration,handoverDuration,rideDuration,delayReason&#10;BLK-CSV-101,BLR-KOR-01,4,350,2026-11-20T10:30:00Z,20,150,45,40,180,NONE"
              className="w-full p-3 font-mono text-[11px] border border-gray-200 rounded-xl focus:outline-hidden focus:border-yellow-400 bg-gray-50"
            />

            {importStatus && (
              <div className="text-xs font-semibold text-gray-800 p-2.5 rounded-lg bg-gray-100">
                {importStatus}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-xs font-semibold rounded-xl text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!csvInput.trim()}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 text-gray-950 font-bold text-xs rounded-xl shadow-xs"
              >
                Upload & Process
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
