import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  try {
    const { netId, newFingerprint } = await request.json();

    if (!netId || !newFingerprint) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await MongoClient.connect(uri);
    const db = client.db('fingerprint_db');

    // Find user by netID
    const user = await db.collection('users').findOne({ netID: netId });

    if (!user) {
      await client.close();
      return NextResponse.json(
        { error: 'NetID not found' },
        { status: 404 }
      );
    }

    // Update user's fingerprint
    await db.collection('users').updateOne(
      { netID: netId },
      { $set: { fingerPrint: newFingerprint } }
    );

    await client.close();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}