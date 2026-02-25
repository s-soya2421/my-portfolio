import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type LogLevel, logger } from '@/lib/logger';

describe('logger', () => {
  beforeEach(() => {
    vi.stubEnv('LOG_LEVEL', 'debug');
    vi.stubEnv('NODE_ENV', 'test');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe('isEnabled', () => {
    it('returns true when log level meets threshold', () => {
      vi.stubEnv('LOG_LEVEL', 'info');
      expect(logger.isEnabled('info')).toBe(true);
      expect(logger.isEnabled('warn')).toBe(true);
      expect(logger.isEnabled('error')).toBe(true);
    });

    it('returns false when log level is below threshold', () => {
      vi.stubEnv('LOG_LEVEL', 'warn');
      expect(logger.isEnabled('debug')).toBe(false);
      expect(logger.isEnabled('info')).toBe(false);
    });

    it('defaults to info level when LOG_LEVEL is not set', () => {
      vi.stubEnv('LOG_LEVEL', '');
      expect(logger.isEnabled('info')).toBe(true);
      expect(logger.isEnabled('debug')).toBe(false);
    });

    it('defaults to info level for invalid LOG_LEVEL', () => {
      vi.stubEnv('LOG_LEVEL', 'invalid');
      expect(logger.isEnabled('info')).toBe(true);
      expect(logger.isEnabled('debug')).toBe(false);
    });
  });

  describe('log methods', () => {
    it('debug outputs to console.debug', () => {
      const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      logger.debug('test debug');
      expect(spy).toHaveBeenCalledOnce();
      const parsed = JSON.parse(spy.mock.calls[0][0] as string);
      expect(parsed.level).toBe('debug');
      expect(parsed.message).toBe('test debug');
    });

    it('info outputs to console.log', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      logger.info('test info');
      expect(spy).toHaveBeenCalledOnce();
      const parsed = JSON.parse(spy.mock.calls[0][0] as string);
      expect(parsed.level).toBe('info');
    });

    it('warn outputs to console.warn', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      logger.warn('test warn');
      expect(spy).toHaveBeenCalledOnce();
    });

    it('error outputs to console.error', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      logger.error('test error');
      expect(spy).toHaveBeenCalledOnce();
    });

    it('fatal outputs to console.error', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      logger.fatal('test fatal');
      expect(spy).toHaveBeenCalledOnce();
      const parsed = JSON.parse(spy.mock.calls[0][0] as string);
      expect(parsed.level).toBe('fatal');
    });
  });

  describe('log filtering', () => {
    it('does not output when level is below threshold', () => {
      vi.stubEnv('LOG_LEVEL', 'error');
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      logger.info('should not appear');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('log entry structure', () => {
    it('includes ts, level, message, and env', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      logger.info('structured');
      const parsed = JSON.parse(spy.mock.calls[0][0] as string);
      expect(parsed.ts).toBeDefined();
      expect(parsed.level).toBe('info');
      expect(parsed.message).toBe('structured');
      expect(parsed.env).toBe('test');
    });

    it('includes custom metadata', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      logger.info('with meta', { userId: 42, action: 'login' });
      const parsed = JSON.parse(spy.mock.calls[0][0] as string);
      expect(parsed.userId).toBe(42);
      expect(parsed.action).toBe('login');
    });
  });

  describe('truncation', () => {
    it('does not truncate short strings', () => {
      vi.stubEnv('LOG_STACK_MAX_LEN', '200');
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const err = new Error('short');
      err.stack = 'short stack';
      logger.error('fail', { error: err });
      const parsed = JSON.parse(spy.mock.calls[0][0] as string);
      expect(parsed.error.stack).toBe('short stack');
    });

    it('includes trace in log entry when trace meta is provided', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      logger.error('fail', { trace: 'trace-value-here' });
      const parsed = JSON.parse(spy.mock.calls[0][0] as string);
      expect(parsed.error.trace).toBe('trace-value-here');
    });

    it('includes stack from plain object error', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      logger.error('fail', { error: { name: 'CustomErr', message: 'oops', stack: 'at foo:1:1' } });
      const parsed = JSON.parse(spy.mock.calls[0][0] as string);
      expect(parsed.error.stack).toBe('at foo:1:1');
    });
  });

  describe('error formatting', () => {
    it('formats Error instance', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      logger.error('fail', { error: new TypeError('bad input') });
      const parsed = JSON.parse(spy.mock.calls[0][0] as string);
      expect(parsed.error.name).toBe('TypeError');
      expect(parsed.error.message).toBe('bad input');
      expect(parsed.error.stack).toBeDefined();
    });

    it('formats string error', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      logger.error('fail', { error: 'something broke' });
      const parsed = JSON.parse(spy.mock.calls[0][0] as string);
      expect(parsed.error.message).toBe('something broke');
    });

    it('formats plain object error', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      logger.error('fail', { error: { name: 'CustomErr', message: 'oops' } });
      const parsed = JSON.parse(spy.mock.calls[0][0] as string);
      expect(parsed.error.name).toBe('CustomErr');
      expect(parsed.error.message).toBe('oops');
    });

    it('does not include error field when no error is provided', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      logger.info('no error');
      const parsed = JSON.parse(spy.mock.calls[0][0] as string);
      expect(parsed.error).toBeUndefined();
    });

    it('truncates long stack traces', () => {
      vi.stubEnv('LOG_STACK_MAX_LEN', '50');
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const longStack = 'a'.repeat(200);
      logger.error('fail', { error: new Error('test'), stack: longStack });
      const parsed = JSON.parse(spy.mock.calls[0][0] as string);
      expect(parsed.error.stack.length).toBeLessThanOrEqual(53); // 50 + '...'
    });
  });
});
