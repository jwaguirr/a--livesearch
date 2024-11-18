import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await MongoClient.connect(uri);
    const db = client.db('fingerprint_db');
    
    // Check if fingerprint already exists
    const existingUser = await db.collection('users')
      .findOne({ fingerPrint: body.fingerPrint });
    
    if (existingUser) {
      await client.close();
      return NextResponse.json(
        { error: 'User already registered' },
        { status: 400 }
      );
    }

    const lastUser = await db.collection('users')
      .findOne({}, { sort: { _id: -1 } });
    
    const nextGroupColor = lastUser ? 
      (lastUser.groupColorCounter % 4) + 1 : 1;

    const userData = {
      ...body,
      groupColorCounter: nextGroupColor,
      timestamp: new Date()
    };

    const result = await db.collection('users').insertOne(userData);
    
    await client.close();
    return NextResponse.json({ 
      insertedId: result.insertedId,
      groupColorCounter: nextGroupColor 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to submit to database' },
      { status: 500 }
    );
  }
}