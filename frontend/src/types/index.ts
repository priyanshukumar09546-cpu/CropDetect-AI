export type PlantStatus = 'Healthy' | 'Diseased';

export interface TopPrediction {
  raw_class: string;
  crop: string;
  disease: string;
  status: string;
  confidence: number;
}

export interface DiseaseInfo {
  crop: string;
  disease: string;
  status: string;
  severity: string;
  causal_agent: string;
  description: string;
  possible_symptoms: string[];
  affected_parts: string[];
  general_management: string[];
}

export interface PredictionSuccessResponse {
  success: true;
  crop: string;
  disease: string;
  status: string;
  confidence: number;
  plant_validation_confidence?: number;
  raw_class?: string;
  top_predictions: TopPrediction[];
  disease_info: DiseaseInfo;
}

export interface PredictionErrorResponse {
  success: false;
  error_type: 'INVALID_IMAGE' | 'LOW_CONFIDENCE' | 'MODEL_ERROR';
  message: string;
  confidence?: number;
  threshold?: number;
  plant_validation_confidence?: number;
  top_predictions?: TopPrediction[];
}

export type PredictionResponse = PredictionSuccessResponse | PredictionErrorResponse;

export interface PredictionHistoryItem {
  id: string;
  image_url: string;
  crop: string;
  disease: string;
  confidence: number;
  status: string;
  timestamp: string;
  full_result: PredictionSuccessResponse;
}

export interface DatasetClassItem {
  raw_class: string;
  crop: string;
  disease: string;
  status: string;
  severity: string;
  sample_count: number;
  causal_agent: string;
}

export interface DatasetSplit {
  percentage: number;
  images: number;
}

export interface DatasetMetadata {
  name: string;
  description: string;
  total_images: number;
  total_classes: number;
  total_crops: number;
  crops_list: string[];
  image_resolution: string;
  splits: {
    train: DatasetSplit;
    validation: DatasetSplit;
    test: DatasetSplit;
  };
  classes: DatasetClassItem[];
}

export interface ModelLayer {
  type: string;
  shape?: number[];
  filters?: number;
  kernel_size?: number[];
  pool_size?: number[];
  units?: number;
  rate?: number;
  activation?: string;
  description?: string;
}

export interface EpochMetric {
  epoch: number;
  accuracy: number;
  val_accuracy: number;
  loss: number;
  val_loss: number;
}

export interface ConfusionSample {
  label: string;
  predicted_true: number;
  predicted_false: number;
  f1: number;
}

export interface TrainingMetrics {
  is_trained: boolean;
  model_status: string;
  overall_accuracy: number;
  validation_accuracy: number;
  test_accuracy: number;
  final_training_loss: number;
  final_validation_loss: number;
  precision: number;
  recall: number;
  f1_score: number;
  total_parameters: number;
  trainable_parameters: number;
  evaluation_dataset: string;
  hardware: string;
  training_history: EpochMetric[];
  confusion_sample: ConfusionSample[];
}

export interface ModelInfo {
  is_loaded: boolean;
  architecture: string;
  input_shape: number[];
  num_classes: number;
  prediction_threshold?: number;
  out_of_distribution_validation?: Record<string, any>;
  layers: ModelLayer[];
  training_metrics: TrainingMetrics;
}

export interface HealthStatus {
  status: string;
  service: string;
  model_loaded: boolean;
  validator_ready?: boolean;
  total_classes: number;
  tensorflow_version: string;
  devices: string[];
}
