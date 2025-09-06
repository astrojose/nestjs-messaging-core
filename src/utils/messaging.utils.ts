import { RmqOptions, Transport } from '@nestjs/microservices';

/**
 * Utility functions for creating RabbitMQ configurations.
 */
export class MessagingUtils {
  /**
   * Creates RabbitMQ options for a given URI and queue.
   * @param uri - The RabbitMQ connection URI
   * @param queue - The queue name
   * @param persistent - Whether to persist messages (default: true)
   * @returns RabbitMQ client options
   */
  static createRabbitMQOptions(
    uri: string,
    queue: string,
    persistent = true,
  ): RmqOptions {
    if (!uri) {
      throw new Error('RabbitMQ URI is required');
    }

    return {
      transport: Transport.RMQ,
      options: {
        urls: [uri],
        queue,
        queueOptions: {
          durable: true,
        },
        socketOptions: {
          heartbeatIntervalInSeconds: 60,
          reconnectTimeInSeconds: 5,
        },
        prefetchCount: 1,
        isGlobalPrefetchCount: false,
        noAssert: false,
        persistent,
      },
    };
  }

  /**
   * Validates that required configuration values are present.
   * @param config - Configuration object to validate
   * @param requiredFields - Array of required field names
   * @throws Error if any required field is missing
   */
  static validateConfig(config: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      if (!config[field]) {
        throw new Error(`Missing required configuration: ${field}`);
      }
    }
  }

  /**
   * Creates a standardized service name for clients.
   * @param baseName - Base name for the service
   * @param suffix - Optional suffix (default: 'SERVICE')
   * @returns Formatted service name
   */
  static createServiceName(baseName: string, suffix = 'SERVICE'): string {
    return `${baseName.toUpperCase()}_${suffix}`;
  }

  /**
   * Creates a standardized queue name.
   * @param baseName - Base name for the queue
   * @param suffix - Optional suffix (default: 'queue')
   * @returns Formatted queue name
   */
  static createQueueName(baseName: string, suffix = 'queue'): string {
    return `${baseName.toLowerCase()}_${suffix}`;
  }

  /**
   * Formats a message pattern for consistent usage.
   * @param domain - Domain or service area
   * @param action - Action being performed
   * @returns Formatted pattern string
   */
  static createPattern(domain: string, action: string): string {
    return `${domain.toLowerCase()}.${action.toLowerCase()}`;
  }
}
