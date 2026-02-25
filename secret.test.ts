import { describe, expect, it, beforeEach } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

function createContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: () => {},
    } as TrpcContext['res'],
  };
}

describe('secret router', () => {
  describe('login', () => {
    it('should reject invalid credentials', async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.secret.login({
          username: 'wrong',
          password: 'wrong',
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('UNAUTHORIZED');
        expect(error.message).toContain('Invalid credentials');
      }
    });

    it('should accept valid credentials and return session token', async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.secret.login({
        username: 'admin',
        password: 'secret123',
      });

      expect(result).toHaveProperty('sessionToken');
      expect(result).toHaveProperty('expiresAt');
      expect(result.sessionToken).toBeTruthy();
      expect(result.sessionToken.length).toBeGreaterThan(0);
      expect(new Date(result.expiresAt).getTime()).toBeGreaterThan(Date.now());
    });

    it('should reject empty credentials', async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.secret.login({
          username: '',
          password: '',
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('UNAUTHORIZED');
      }
    });
  });

  describe('chat', () => {
    it('should reject invalid session token', async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.secret.chat({
          message: 'Hello',
          sessionToken: 'invalid-token',
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('UNAUTHORIZED');
      }
    });

    it('should return a response for valid session', async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      const loginResult = await caller.secret.login({
        username: 'admin',
        password: 'secret123',
      });

      const chatResult = await caller.secret.chat({
        message: 'What is 2+2?',
        sessionToken: loginResult.sessionToken,
      });

      expect(chatResult).toHaveProperty('response');
      expect(chatResult.response).toContain('2 + 2');
    });

    it('should handle image upload in chat requests', async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      const loginResult = await caller.secret.login({
        username: 'admin',
        password: 'secret123',
      });

      const chatResult = await caller.secret.chat({
        message: 'Solve this problem',
        sessionToken: loginResult.sessionToken,
        imageUrl: 'https://example.com/image.jpg',
      });

      expect(chatResult.response).toContain('I\'d be happy to help you solve this problem');
    });
  });

  describe('proxy', () => {
    it('should reject invalid session token', async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.secret.proxy({
          url: 'https://example.com',
          sessionToken: 'invalid-token',
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('UNAUTHORIZED');
      }
    });

    it('should reject invalid URLs', async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      const loginResult = await caller.secret.login({
        username: 'admin',
        password: 'secret123',
      });

      try {
        await caller.secret.proxy({
          url: 'not-a-valid-url',
          sessionToken: loginResult.sessionToken,
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.code).toBe('BAD_REQUEST');
      }
    });
  });
});
