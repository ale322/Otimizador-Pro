export type AndroidVersion = 26 | 28 | 29 | 30 | 31 | 33 | 34 | 35;

export type Manufacturer = 'SAMSUNG' | 'XIAOMI' | 'MOTOROLA' | 'GOOGLE' | 'REALME';

export interface DeviceProfile {
  id: string;
  name: string;
  model: string;
  manufacturer: Manufacturer;
  brandDisplayName: string;
  androidVersion: number;
  apiLevel: AndroidVersion;
  androidName: string;
  uiName: string; // One UI 6.1, HyperOS 1.0, MyUX, Pixel UI
  storageTotalBytes: number; // e.g. 128 GB
  storageCommercialGB: number; // 128
  ramTotalBytes: number; // e.g. 12 GB
  zramBytes: number; // 4 GB / 8 GB RAM Plus
  sensorModel: string;
  biometricType: 'ULTRASONIC' | 'OPTICAL' | 'CAPACITIVE';
  hardwareNode: string;
  isLegacyStorage: boolean; // Android 8-10 (API 26-29)
}

export interface StorageCategoryBreakdown {
  id: string;
  name: string;
  bytes: number;
  color: string;
  iconName: string;
  description: string;
  canCleanDirectly: boolean;
  cleanableBytes: number;
}

export interface CleanableItem {
  id: string;
  title: string;
  category: 'TRASH' | 'SCENARIO_1' | 'SCENARIO_2' | 'ORPHAN_FOLDERS' | 'ZERO_PASSWORD';
  path: string;
  legacyPath?: string;
  sizeBytes: number;
  itemCount: number;
  riskLevel: 'ZERO_RISK' | 'SAFE' | 'ADVANCED_SAFE';
  selected: boolean;
  description: string;
  safeGuarantee: string;
  associatedPackage?: string;
}

export interface ProcessItem {
  packageName: string;
  appName: string;
  ramUsageBytes: number;
  cpuPercent: number;
  category: 'SOCIAL' | 'SEARCH' | 'ECOMMERCE' | 'SYSTEM_FILTER';
  isDraining: boolean;
  isKilled: boolean;
}

export interface AppStorageWeight {
  packageName: string;
  appName: string;
  icon: string;
  appCodeBytes: number;
  userDataBytes: number;
  cacheBytes: number;
  totalBytes: number;
  isZeroPasswordEligible: boolean;
  zeroPasswordReason?: string;
  lastUsed: string;
}

export interface BiometricDiagnosticResult {
  sensorPresent: boolean;
  biometricManagerCode: number; // BIOMETRIC_SUCCESS = 0
  statusMessage: string;
  hardwareNodeExists: boolean;
  hardwarePath: string;
  nodeReadValue: string;
  hardwareIntegrity: 'PASS' | 'DEGRADED' | 'DISCONNECTED';
  enrollmentCount: number;
  latencyMs: number;
}

export interface AccessibilityStep {
  stepNumber: number;
  screenTitle: string;
  targetNodeText: string;
  actionTaken: 'CLICK' | 'SCROLL' | 'WAIT';
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
}

export interface ScheduleConfig {
  isEnabled: boolean;
  scheduleMode: 'TIME' | 'IDLE' | 'BOTH';
  targetTime: string; // e.g. "03:00"
  frequency: 'DAILY' | 'EVERY_2_DAYS' | 'WEEKLY';
  requireIdle: boolean;
  requireCharging: boolean;
  requireBatteryNotLow: boolean;
  requireWifi: boolean;
  cleanTrash: boolean;
  cleanScenario1: boolean;
  cleanScenario2Private: boolean;
  cleanOrphanFolders: boolean;
  cleanZeroPasswordCache: boolean;
  killRamProcesses: boolean;
  showMorningNotification: boolean;
}

export interface ScheduleExecutionLog {
  id: string;
  timestamp: string;
  triggerReason: string;
  bytesFreed: number;
  itemsRemoved: number;
  durationMs: number;
  status: 'SUCCESS' | 'SKIPPED_USER_ACTIVE' | 'SKIPPED_BATTERY';
  criteriaMet: {
    idle: boolean;
    charging: boolean;
    batteryOk: boolean;
  };
}

