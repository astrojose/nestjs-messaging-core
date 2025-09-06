// Core messaging library exports
// This file serves as the main entry point for the core messaging package

// Base client
export { BaseClient } from './clients/base.client';

// Core module
export { CoreMessagingModule } from './core-messaging.module';
export * from './interfaces/messaging-options.interface';
export * from './types/messaging.types';
export * from './utils/messaging.utils';

// Version info (would be managed by package.json in npm package)
export const MESSAGING_CORE_VERSION = '1.0.0';

