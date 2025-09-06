# @absa/nestjs-messaging-core

A robust, reusable messaging library for NestJS microservices with RabbitMQ support.

## Features

- **Base Client**: Abstract client with built-in retry logic, timeout handling, and comprehensive logging
- **Core Module**: Dynamic module factory for easy RabbitMQ client registration
- **Type Safety**: Full TypeScript support with comprehensive interfaces and types
- **Utilities**: Helper functions for creating patterns, service names, and configurations
- **Observability**: Built-in logging and health checks
- **Performance**: Optimized for high-throughput messaging scenarios

## Installation

```bash
npm install @absa/nestjs-messaging-core
```

## Quick Start

### 1. Create a Custom Client

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseClient } from '@absa/nestjs-messaging-core';

@Injectable()
export class MyServiceClient extends BaseClient {
  constructor(@Inject('MY_SERVICE') client: ClientProxy) {
    super(client);
  }

  async sendMessage(data: any): Promise<any> {
    return this.send('my.pattern', data, { timeoutMs: 10000, retries: 3 });
  }

  async emitEvent(data: any): Promise<void> {
    return this.emit('my.event', data);
  }
}
```

### 2. Configure Your Module

```typescript
import { Module } from '@nestjs/common';
import { CoreMessagingModule } from '@absa/nestjs-messaging-core';

@Module({
  imports: [
    CoreMessagingModule.forRootAsync([
      CoreMessagingModule.createRabbitMQClient(
        'MY_SERVICE',
        'myapp.queue',
        'rabbitmq.uri'
      ),
    ]),
  ],
  providers: [MyServiceClient],
  exports: [MyServiceClient],
})
export class MyMessagingModule {}
```

## API Reference

### BaseClient

Abstract base class providing common messaging functionality:

- `send<TRequest, TResponse>(pattern, data, options)` - Send message and wait for response
- `emit<TEvent>(pattern, data)` - Emit event without waiting for response  
- `sendAndReceive<TResponse>(pattern, data, options)` - Alias for send method
- `healthCheck()` - Check client connection health

### MessagingUtils

Utility functions for messaging operations:

- `createRabbitMQOptions(uri, queue, persistent)` - Create RabbitMQ configuration
- `createPattern(domain, action)` - Create standardized message patterns
- `createServiceName(baseName, suffix)` - Create service names
- `createQueueName(baseName, suffix)` - Create queue names
- `validateConfig(config, requiredFields)` - Validate configuration

## Configuration

The library expects configuration keys for RabbitMQ connection:

```typescript
// Example configuration
{
  rabbitmq: {
    uri: 'amqp://localhost:5672'
  },
  queues: {
    myservice: 'my_service_queue'
  }
}
```

## Best Practices

1. **Extend BaseClient**: Always extend the BaseClient for your specific service clients
2. **Use Type Safety**: Leverage TypeScript interfaces for request/response types
3. **Handle Timeouts**: Configure appropriate timeouts for your use cases
4. **Health Checks**: Implement health checks using the built-in healthCheck method
5. **Logging**: The library provides comprehensive logging out of the box

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## License

MIT
