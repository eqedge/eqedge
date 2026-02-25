import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { createSecretSession, getSecretSession, addChatMessage } from '../db';
import { nanoid } from 'nanoid';
import { TRPCError } from '@trpc/server';

// Secret credentials (in production, these should be environment variables)
const SECRET_USERNAME = process.env.SECRET_USERNAME || 'admin';
const SECRET_PASSWORD = process.env.SECRET_PASSWORD || 'secret123';

// Store active sessions in memory for demo purposes
const activeSessions = new Map<string, { expiresAt: Date; isActive: boolean }>();

// Helper function to generate math responses
function generateMathResponse(message: string, hasImage: boolean): string {
  const lowerMessage = message.toLowerCase();
  
  // Simple pattern matching for common math questions
  if (lowerMessage.includes('2+2') || lowerMessage.includes('2 + 2')) {
    return `**Solution: 2 + 2 = 4**\n\n**Step-by-step:**\n1. Start with the first number: 2\n2. Add the second number: 2\n3. Combine: 2 + 2 = 4\n\nThis is basic addition. When you add two numbers together, you're combining their quantities.`;
  }
  
  if (lowerMessage.includes('solve') || lowerMessage.includes('solve for')) {
    return `I'd be happy to help you solve this problem!\n\n**To get the best help:**\n1. Please provide the complete equation or problem\n2. If you have an image, make sure it's clear and well-lit\n3. Let me know what topic this is related to (algebra, geometry, calculus, etc.)\n\n**I can help with:**\n- Solving equations\n- Step-by-step solutions\n- Explaining mathematical concepts\n- Checking your work\n- Providing alternative methods\n\nPlease share the specific problem you need help with!`;
  }
  
  if (lowerMessage.includes('derivative') || lowerMessage.includes('integral')) {
    return `**Calculus Help**\n\nYou're asking about calculus concepts. Here's what I can help with:\n\n**Derivatives:**\n- Find the rate of change\n- Power rule: d/dx(x^n) = n*x^(n-1)\n- Chain rule and product rule\n\n**Integrals:**\n- Find the area under a curve\n- Antiderivatives\n- Definite and indefinite integrals\n\nPlease provide the specific function or problem you'd like me to solve!`;
  }
  
  if (lowerMessage.includes('algebra') || lowerMessage.includes('equation')) {
    return `**Algebra Help**\n\nI can help you with:\n- Linear equations: ax + b = c\n- Quadratic equations: ax² + bx + c = 0\n- Systems of equations\n- Factoring and expanding\n- Working with variables and exponents\n\nPlease share the specific equation or problem, and I'll provide step-by-step solutions!`;
  }
  
  if (lowerMessage.includes('geometry') || lowerMessage.includes('triangle') || lowerMessage.includes('circle')) {
    return `**Geometry Help**\n\nI can assist with:\n- Triangle properties and theorems\n- Circle equations and properties\n- Area and perimeter calculations\n- Volume and surface area\n- Coordinate geometry\n- Proofs and logical reasoning\n\nPlease describe the shape or problem you need help with!`;
  }
  
  // Default response
  let response = `**Math Tutoring Assistant**\n\nI received your question: "${message}"\n\n`;
  
  if (hasImage) {
    response += `I can see you've uploaded an image. Please describe what's in the image or what specific problem you need help solving.\n\n`;
  }
  
  response += `**How I can help:**\n- Solve equations and problems\n- Explain mathematical concepts\n- Provide step-by-step solutions\n- Help with homework\n- Prepare for tests\n\n**Topics I cover:**\n- Algebra\n- Geometry\n- Trigonometry\n- Calculus\n- Statistics\n- Pre-Calculus\n\nPlease provide more details about what you need help with!`;
  
  return response;
}

// Helper to verify secret session
async function verifySecretSession(sessionToken: string) {
  // First check in-memory sessions
  const memorySession = activeSessions.get(sessionToken);
  if (memorySession && memorySession.isActive && memorySession.expiresAt > new Date()) {
    return memorySession;
  }

  // Then check database
  const session = await getSecretSession(sessionToken);
  if (!session || !session.isActive || new Date(session.expiresAt) < new Date()) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired secret session',
    });
  }
  return session;
}

export const secretRouter = router({
  login: publicProcedure
    .input(z.object({
      username: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (input.username !== SECRET_USERNAME || input.password !== SECRET_PASSWORD) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      // Create a session token
      const sessionToken = nanoid(64);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store session in memory and database
      activeSessions.set(sessionToken, { expiresAt, isActive: 1 as any });

      // Also store in database (if user is authenticated)
      if (ctx.user) {
        await createSecretSession(ctx.user.id, sessionToken, expiresAt);
      }

      return {
        sessionToken,
        expiresAt,
      };
    }),

  chat: publicProcedure
    .input(z.object({
      message: z.string(),
      sessionToken: z.string(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify session
      await verifySecretSession(input.sessionToken);

      // Generate a helpful math response
      const response = generateMathResponse(input.message, !!input.imageUrl);

      // Store chat message if user is authenticated
      if (ctx.user) {
        await addChatMessage(ctx.user.id, 'user', input.message, input.imageUrl);
        await addChatMessage(ctx.user.id, 'assistant', response);
      }

      return {
        response,
      };
    }),

  proxy: publicProcedure
    .input(z.object({
      url: z.string().url(),
      sessionToken: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Verify session
      await verifySecretSession(input.sessionToken);

      try {
        const response = await fetch(input.url);
        const content = await response.text();

        // Return HTML content for iframe
        return {
          content,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch proxy content',
        });
      }
    }),
});
