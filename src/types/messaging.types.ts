/**
 * Common message status enumeration for consistent status handling across the messaging library.
 */
export enum MessageStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
  TIMEOUT = 'TIMEOUT',
  RETRY = 'RETRY',
}

/**
 * Message handler status for processing results.
 */
export enum MessageHandlerStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
}

/**
 * Transport types supported by the messaging library.
 */
export enum TransportType {
  RABBITMQ = 'RABBITMQ',
  REDIS = 'REDIS',
  KAFKA = 'KAFKA',
  TCP = 'TCP',
}

/**
 * Log levels for messaging operations.
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}
