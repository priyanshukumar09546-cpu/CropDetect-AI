/**
 * CropDetect AI — Streamlit Custom Component Communication Bridge
 * Enables the React frontend to communicate with Streamlit Community Cloud Python backend
 * when embedded as a custom component, while maintaining standard fetch fallbacks.
 */

import { PredictionResponse, ModelInfo, DatasetMetadata, HealthStatus } from '../types';

interface StreamlitRenderArgs {
  model_info?: ModelInfo;
  dataset_info?: DatasetMetadata;
  health_status?: HealthStatus;
  prediction?: PredictionResponse;
  prediction_id?: string;
}

interface StreamlitMessageData {
  isStreamlitMessage?: boolean;
  type?: string;
  args?: StreamlitRenderArgs;
  theme?: Record<string, any>;
  value?: any;
}

type PredictionResolver = (data: PredictionResponse) => void;
let pendingResolver: PredictionResolver | null = null;
let cachedModelInfo: ModelInfo | null = null;
let cachedDatasetInfo: DatasetMetadata | null = null;
let cachedHealthStatus: HealthStatus | null = null;
let bridgeInitialized = false;

/**
 * Checks whether the React app is currently running inside an iframe
 * (such as a Streamlit custom component wrapper).
 */
export function isRunningInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

/**
 * Initializes listeners for Streamlit component events.
 */
export function initStreamlitBridge(
  onModelInfo?: (info: ModelInfo) => void,
  onDatasetInfo?: (info: DatasetMetadata) => void,
  onHealthStatus?: (status: HealthStatus) => void
) {
  if (!isRunningInIframe() || bridgeInitialized) return;
  bridgeInitialized = true;

  window.addEventListener('message', (event: MessageEvent<StreamlitMessageData>) => {
    const data = event.data;
    if (!data || data.type !== 'streamlit:render') return;

    const args = data.args || {};

    if (args.model_info) {
      cachedModelInfo = args.model_info;
      onModelInfo?.(args.model_info);
    }
    if (args.dataset_info) {
      cachedDatasetInfo = args.dataset_info;
      onDatasetInfo?.(args.dataset_info);
    }
    if (args.health_status) {
      cachedHealthStatus = args.health_status;
      onHealthStatus?.(args.health_status);
    }

    if (args.prediction && pendingResolver) {
      const resolver = pendingResolver;
      pendingResolver = null;
      resolver(args.prediction);
    }

    // Auto-update frame height on render
    sendFrameHeight();
  });

  // Notify Streamlit that the React component is mounted and ready
  try {
    window.parent.postMessage(
      {
        isStreamlitMessage: true,
        type: 'streamlit:componentReady',
        apiVersion: 1,
      },
      '*'
    );
  } catch (err) {
    console.warn('Failed to send componentReady to parent:', err);
  }

  // Observe body and root DOM resizes to resize iframe dynamically
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => {
      sendFrameHeight();
    });
    ro.observe(document.documentElement);
    ro.observe(document.body);
  }

  // Send initial frame height
  sendFrameHeight();
}

/**
 * Sends current document height to Streamlit parent iframe
 */
export function sendFrameHeight() {
  if (!isRunningInIframe()) return;
  try {
    const scrollH = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.offsetHeight,
      document.body.offsetHeight,
      window.innerHeight
    );
    window.parent.postMessage(
      {
        isStreamlitMessage: true,
        type: 'streamlit:setFrameHeight',
        height: Math.max(scrollH, 950),
      },
      '*'
    );
  } catch {
    // Ignore cross-origin issues
  }
}

/**
 * Sends an image prediction request via Streamlit postMessage bridge
 */
export function requestStreamlitPrediction(file: File): Promise<PredictionResponse> {
  return new Promise((resolve, reject) => {
    if (!isRunningInIframe()) {
      reject(new Error('Not running inside Streamlit component iframe'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const base64Data = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;
      const reqId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      pendingResolver = resolve;

      // 30s timeout fallback
      setTimeout(() => {
        if (pendingResolver === resolve) {
          pendingResolver = null;
          reject(new Error('Prediction timed out. Please verify backend inference service.'));
        }
      }, 30000);

      window.parent.postMessage(
        {
          isStreamlitMessage: true,
          type: 'streamlit:setComponentValue',
          value: {
            action: 'predict',
            image: base64Data,
            filename: file.name,
            request_id: reqId,
          },
        },
        '*'
      );
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export function getCachedBridgeMetadata() {
  return {
    modelInfo: cachedModelInfo,
    datasetInfo: cachedDatasetInfo,
    healthStatus: cachedHealthStatus,
  };
}
