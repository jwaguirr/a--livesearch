import { MongoClient, ServerApiVersion } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

// Validate environment variables
if (!uri) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

// Create a MongoClient with stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function POST(request: Request) {
  try {
    // Validate request body
    if (!request.body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.fingerPrint || !body.netID || !body.section) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db('fingerprint_db');
    
    // Check if fingerprint already exists
    const existingFingerprint = await db.collection('users')
      .findOne({ fingerPrint: body.fingerPrint });
    
    if (existingFingerprint) {
      return NextResponse.json(
        { error: 'You have already registered a team' },
        { status: 400 }
      );
    }

    // Check if netID already exists
    const existingNetID = await db.collection('users')
      .findOne({ netID: body.netID });
    
    if (existingNetID) {
      return NextResponse.json(
        { error: 'This NetID has already been registered' },
        { status: 400 }
      );
    }

    // Get the last user and calculate next group color
    const lastUser = await db.collection('users')
      .findOne({}, { sort: { _id: -1 } });
    
    const nextGroupColor = lastUser ? 
      (lastUser.groupColorCounter % 4) + 1 : 1;

    const userData = {
      ...body,
      groupColorCounter: nextGroupColor,
      initialTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(userData);
    
    return NextResponse.json({ 
      success: true,
      insertedId: result.insertedId,
      groupColorCounter: nextGroupColor 
    });
  } catch (error) {
    console.error('Database error:', error);
    
    // Specific error handling
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'Duplicate entry found' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Database connection failed' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  } finally {
    // Close the connection in finally block
    try {
      await client.close();
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  }
}