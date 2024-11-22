// app/api/teams/route.ts
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI!;

export async function GET() {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('fingerprint_db');
    
    const teams = await db.collection('users')
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
    
    await client.close();
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}