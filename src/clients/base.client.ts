import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, lastValueFrom } from 'rxjs';
import { catchError, timeout, retry } from 'rxjs/operators';
import { Logger } from '@nestjs/common';
import { MessagingOptions } from '../interfaces/messaging-options.interface';

/**
 * Abstract base client for all messaging clients.
 * Provides common functionality for sending messages, handling timeouts, retries, and logging.
 */
export abstract class BaseClient {
  protected readonly logger = new Logger(this.constructor.name);
  protected readonly defaultTimeout = 5000;
  protected readonly defaultRetries = 2;

  protected constructor(protected readonly client: ClientProxy) {}

  /**
   * Private method to handle the common messaging logic with timeout, retry, and error handling.
   * @param pattern - The message pattern
   * @param data - The request payload
   * @param timeoutMs - Timeout in milliseconds
   * @param retries - Number of retries
   * @returns The observable result
   */
  private sendMessage<TResponse>(
    pattern: any,
    data: any,
    timeoutMs: number,
    retries: number,
  ) {
    this.logger.debug(`Sending message to pattern: ${JSON.stringify(pattern)}`);

    return this.client.send<TResponse, any>(pattern, data).pipe(
      timeout(timeoutMs),
      retry(retries),
      catchError(err => {
        if (err instanceof TimeoutError) {
          const errorMsg = `Timeout after ${timeoutMs}ms for pattern: ${JSON.stringify(
            pattern,
          )}`;
          this.logger.error(errorMsg);
          throw new Error(errorMsg);
        }
        this.logger.error(
          `Error sending message to pattern ${JSON.stringify(pattern)}: ${err.message}`,
        );
        throw err;
      }),
    );
  }

  /**
   * Sends a message and waits for a response with timeout and retry logic.
   * @param pattern - The message pattern
   * @param data - The request payload
   * @param options - Optional timeout and retry options
   * @returns Promise resolving to the response
   */
  public async send<TRequest, TResponse>(
    pattern: any,
    data: TRequest,
    options: MessagingOptions = {},
  ): Promise<TResponse> {
    const { timeoutMs = this.defaultTimeout, retries = this.defaultRetries } =
      options;

    const result = await lastValueFrom(
      this.sendMessage<TResponse>(pattern, data, timeoutMs, retries),
    );

    this.logger.debug(
      `Received response for pattern: ${JSON.stringify(pattern)}`,
    );
    return result;
  }

  /**
   * Emits an event without waiting for a response.
   * @param pattern - The event pattern
   * @param data - The event payload
   */
  public async emit<TEvent>(pattern: any, data: TEvent): Promise<void> {
    this.logger.debug(`Emitting event to pattern: ${JSON.stringify(pattern)}`);
    this.client.emit(pattern, data);
  }

  /**
   * Sends a message and waits for a response, with timeout and retry logic.
   * @param pattern - The message pattern
   * @param data - The request payload
   * @param options - Optional timeout and retry options
   * @returns Promise resolving to the response
   */
  protected async sendAndReceive<TResponse>(
    pattern: any,
    data: any,
    options: MessagingOptions = {},
  ): Promise<TResponse> {
    const { timeoutMs = this.defaultTimeout, retries = this.defaultRetries } =
      options;

    const result = await lastValueFrom(
      this.sendMessage<TResponse>(pattern, data, timeoutMs, retries),
    );

    this.logger.debug(
      `Received response for pattern: ${JSON.stringify(pattern)}`,
    );
    return result;
  }

  /**
   * Checks the health of the client connection.
   * @returns Promise resolving to true if healthy, false otherwise
   */
  public async healthCheck(): Promise<boolean> {
    try {
      await this.client.connect();
      this.logger.debug('Client connection is healthy');
      return true;
    } catch (error) {
      this.logger.error(
        `Client connection health check failed`,
      );
      return false;
    }
  }
}
