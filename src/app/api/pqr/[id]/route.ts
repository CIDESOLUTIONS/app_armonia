// src/app/api/pqr/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const updateSchema = z.object({
  status: z.enum(['open', 'in_progress', 'closed']).optional(),
  response: z.string().optional(),
});
