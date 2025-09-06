import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ClientsModule, ClientsModuleOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MessagingUtils } from './utils/messaging.utils';

/**
 * Core messaging module that provides base functionality for messaging clients.
 * This module can be extended by application-specific messaging modules.
 */
@Module({})
export class CoreMessagingModule {
  /**
   * Creates a dynamic module with RabbitMQ client registrations.
   * @param clients - Array of client configurations
   * @returns Dynamic module configuration
   */
  static forRoot(clients: ClientsModuleOptions): DynamicModule {
    return {
      module: CoreMessagingModule,
      imports: [ClientsModule.register(clients)],
      exports: [ClientsModule],
    };
  }

  /**
   * Creates a dynamic module with async RabbitMQ client registrations.
   * @param clients - Array of async client configurations
   * @returns Dynamic module configuration
   */
  static forRootAsync(clients: ClientsModuleOptions): DynamicModule {
    return {
      module: CoreMessagingModule,
      imports: [ClientsModule.registerAsync(clients)],
      exports: [ClientsModule],
    };
  }

  /**
   * Creates a RabbitMQ client registration configuration.
   * @param name - Client name/token
   * @param queueConfigKey - Configuration key for the queue
   * @param uriConfigKey - Configuration key for the URI
   * @returns Client registration configuration
   */
  static createRabbitMQClient(
    name: string,
    queueConfigKey: string,
    uriConfigKey = 'rabbitmq.uri',
  ) {
    return {
      name,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>(uriConfigKey);
        const queue = configService.get<string>(queueConfigKey);
        
        if (!uri || !queue) {
          throw new Error(`Missing configuration: uri=${uri}, queue=${queue}`);
        }
        
        return MessagingUtils.createRabbitMQOptions(uri, queue);
      },
    };
  }
}
