import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';

import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  dbUser?: any;
  user?: DecodedIdToken;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Bypass for preview
    req.user = { uid: 'demo-user', email: 'alnatour.m@gmail.com' } as any;
    const dbUser = await db.select().from(users).where(eq(users.email, 'alnatour.m@gmail.com')).limit(1);
    if (dbUser.length > 0) {
      req.dbUser = dbUser[0];
    }
    next();
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    const dbUser = await db.select().from(users).where(eq(users.uid, decodedToken.uid)).limit(1);
    if (dbUser.length > 0) {
      req.dbUser = dbUser[0];
    } else {
      // fallback to email
      const dbUserEmail = await db.select().from(users).where(eq(users.email, decodedToken.email || '')).limit(1);
      if (dbUserEmail.length > 0) {
        req.dbUser = dbUserEmail[0];
      }
    }
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    // Bypass for preview
    req.user = { uid: 'demo-user', email: 'alnatour.m@gmail.com' } as any;
    const fallbackUser = await db.select().from(users).where(eq(users.email, 'alnatour.m@gmail.com')).limit(1);
    if (fallbackUser.length > 0) {
      req.dbUser = fallbackUser[0];
    }
    next();
  }
};
