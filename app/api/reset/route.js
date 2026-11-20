import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import logic from '../../../lib/logic';

export const dynamic = 'force-dynamic';

// POST /api/reset -> demo helper: clears all swipes and matches
export async function POST() {
  db.saveState(logic.emptyState());
  return NextResponse.json({ ok: true });
}
