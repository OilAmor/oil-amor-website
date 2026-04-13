/**
 * Structured Logger
 * Enterprise-grade logging with multiple transports and log levels
 */

import * as Sentry from '@sentry/nextjs'

// ============================================================================
// LOG LEVELS & TYPES
// ============================================================================

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export interface LogContext {
  [key: string]: unknown
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  service: string
  environment: string
  version: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
  requestId?: string
  userId?: string
  sessionId?: string
  duration?: number
}

// ============================================================================
// TRANSPORT INTERFACES
// ============================================================================

interface LogTransport {
  name: string
  log(entry: LogEntry): void | Promise<void>
  isEnabled(): boolean
}

// ============================================================================
// CONSOLE TRANSPORT
// ============================================================================

class ConsoleTransport implements LogTransport {
  name = 'console'

  isEnabled(): boolean {
    return true
  }

  log(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString()
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.service}]`
    
    const styles: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: 'color: #6b7280',
      [LogLevel.INFO]: 'color: #3b82f6',
      [LogLevel.WARN]: 'color: #f59e0b',
      [LogLevel.ERROR]: 'color: #ef4444',
      [LogLevel.FATAL]: 'color: #dc2626; font-weight: bold',
    }

    const style = styles[entry.level]
    
    // Format context as JSON for readability
    const contextStr = entry.context 
      ? `\n${JSON.stringify(entry.context, null, 2)}`
      : ''
    
    const errorStr = entry.error
      ? `\nError: ${entry.error.name}: ${entry.error.message}\n${entry.error.stack || ''}`
      : ''

    // Use appropriate console method based on level
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(`%c${prefix}`, style, entry.message, contextStr, errorStr)
        break
      case LogLevel.INFO:
        console.info(`%c${prefix}`, style, entry.message, contextStr, errorStr)
        break
      case LogLevel.WARN:
        console.warn(`%c${prefix}`, style, entry.message, contextStr, errorStr)
        break
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(`%c${prefix}`, style, entry.message, contextStr, errorStr)
        break
    }
  }
}

// ============================================================================
// SENTRY TRANSPORT
// ============================================================================

class SentryTransport implements LogTransport {
  name = 'sentry'

  isEnabled(): boolean {
    return typeof process !== 'undefined' && !!process.env.SENTRY_DSN
  }

  log(entry: LogEntry): void {
    if (!this.isEnabled()) return

    const sentryLevelMap: Record<LogLevel, Sentry.SeverityLevel> = {
      [LogLevel.DEBUG]: 'debug',
      [LogLevel.INFO]: 'info',
      [LogLevel.WARN]: 'warning',
      [LogLevel.ERROR]: 'error',
      [LogLevel.FATAL]: 'fatal',
    }

    Sentry.captureMessage(entry.message, {
      level: sentryLevelMap[entry.level],
      tags: {
        service: entry.service,
        environment: entry.environment,
        log_level: entry.level,
      },
      extra: {
        ...entry.context,
        duration: entry.duration,
        requestId: entry.requestId,
      },
    })
  }
}

// ============================================================================
// API TRANSPORT (Send to logging endpoint)
// ============================================================================

class ApiTransport implements LogTransport {
  name = 'api'
  private buffer: LogEntry[] = []
  private flushInterval: ReturnType<typeof setInterval> | null = null
  private readonly bufferSize = 10
  private readonly flushIntervalMs = 5000

  constructor() {
    // Set up periodic flush
    this.flushInterval = setInterval(() => {
      this.flush()
    }, this.flushIntervalMs)

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush()
      })
    }
  }

  isEnabled(): boolean {
    return typeof window !== 'undefined'
  }

  log(entry: LogEntry): void {
    this.buffer.push(entry)
    
    if (this.buffer.length >= this.bufferSize) {
      this.flush()
    }
  }

  private async flush(): Promise<void> {
    if (this.buffer.length === 0) return

    const logs = [...this.buffer]
    this.buffer = []

    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs }),
        keepalive: true,
      })
    } catch (error) {
      // Silent fail - don't cause infinite logging loops
      console.error('Failed to send logs to API:', error)
    }
  }
}

// ============================================================================
// LOGGER CLASS
// ============================================================================

class Logger {
  private transports: LogTransport[] = []
  private serviceName: string
  private environment: string
  private version: string
  private minLevel: LogLevel

  constructor(options: {
    serviceName?: string
    environment?: string
    version?: string
    minLevel?: LogLevel
    transports?: LogTransport[]
  } = {}) {
    this.serviceName = options.serviceName || 'oil-amor'
    this.environment = options.environment || process.env.NODE_ENV || 'development'
    this.version = options.version || process.env.npm_package_version || '1.0.0'
    this.minLevel = options.minLevel || LogLevel.INFO

    // Initialize default transports
    this.transports = options.transports || [
      new ConsoleTransport(),
      new SentryTransport(),
      new ApiTransport(),
    ]
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL]
    const currentLevelIndex = levels.indexOf(this.minLevel)
    const logLevelIndex = levels.indexOf(level)
    return logLevelIndex >= currentLevelIndex
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      environment: this.environment,
      version: this.version,
      context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    }
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) return

    const entry = this.createLogEntry(level, message, context, error)

    this.transports.forEach((transport) => {
      if (transport.isEnabled()) {
        try {
          transport.log(entry)
        } catch (err) {
          // Prevent logging failures from breaking the app
          console.error(`Transport ${transport.name} failed:`, err)
        }
      }
    })
  }

  // ==========================================================================
  // PUBLIC LOGGING METHODS
  // ==========================================================================

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context, error)
  }

  fatal(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.FATAL, message, context, error)
  }

  // ==========================================================================
  // PERFORMANCE LOGGING
  // ==========================================================================

  time<T>(
    label: string,
    fn: () => T | Promise<T>,
    context?: LogContext
  ): Promise<T> {
    const start = performance.now()
    
    return Promise.resolve(fn()).finally(() => {
      const duration = performance.now() - start
      this.info(`${label} completed`, {
        ...context,
        duration: Math.round(duration * 100) / 100,
      })
    })
  }

  // ==========================================================================
  // CHILD LOGGER
  // ==========================================================================

  child(defaultContext: LogContext): Logger {
    const childLogger = new Logger({
      serviceName: this.serviceName,
      environment: this.environment,
      version: this.version,
      minLevel: this.minLevel,
      transports: this.transports,
    })

    // Override log method to include default context
    const originalLog = childLogger.log.bind(childLogger)
    childLogger.log = (level, message, context, error) => {
      originalLog(level, message, { ...defaultContext, ...context }, error)
    }

    return childLogger
  }
}

// ============================================================================
// LOGGER INSTANCE
// ============================================================================

export const logger = new Logger()

// ============================================================================
// HOOK FOR REQUEST CONTEXT
// ============================================================================

export function createRequestLogger(requestId: string, userId?: string): Logger {
  return logger.child({
    requestId,
    userId,
    timestamp: new Date().toISOString(),
  })
}
