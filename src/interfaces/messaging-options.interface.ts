/**
 * Options for messaging operations like timeout and retry configuration.
 */
export interface MessagingOptions {
  /** Timeout in milliseconds for the operation */
  timeoutMs?: number;
  /** Number of retries to attempt */
  retries?: number;
}

/**
 * Base configuration for messaging clients.
 */
export interface MessagingClientConfig {
  /** Default timeout for operations */
  defaultTimeout?: number;
  /** Default number of retries */
  defaultRetries?: number;
  /** Service name for logging and identification */
  serviceName?: string;
}

/**
 * Configuration for RabbitMQ connection.
 */
export interface RabbitMQConfig {
  /** RabbitMQ connection URI */
  uri: string;
  /** Queue name */
  queue: string;
  /** Whether to persist messages */
  persistent?: boolean;
  /** Whether to auto-acknowledge messages */
  noAck?: boolean;
}

/**
 * Generic message pattern interface.
 */
export interface MessagePattern {
  pattern: string;
  [key: string]: any;
}

/**
 * Base response interface for all messaging operations.
 */
export interface BaseMessageResponse {
  /** Status of the operation */
  status: string;
  /** Human-readable message */
  message: string;
  /** Optional additional data */
  data?: any;
}
