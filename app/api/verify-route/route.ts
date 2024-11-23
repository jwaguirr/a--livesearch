import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  const { fingerprint, number, letter, gCost } = await request.json();

  if (!fingerprint || !number || !letter || gCost === undefined) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('fingerprint_db');
    
    const user = await db.collection('users').findOne({ fingerPrint: fingerprint });
    
    if (!user) {
      await client.close();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if group number matches
    if (user.groupColorCounter !== parseInt(number)) {
      await client.close();
      return NextResponse.json(
        { error: `Invalid group. Expected ${user.groupColorCounter}, got ${number}` }, 
        { status: 403 }
      );
    }

    const remainingRoutes = user.idealRoute.filter(
      (route: string) => !user.goodProgress.includes(route)
    );

    // First, record the attempt regardless of g-cost correctness
    const progressEntry = {
      node: letter,
      timestamp: new Date(),
      gCost: gCost,
      isCorrect: gCost === 100 && remainingRoutes[0] === letter
    };
    
    await db.collection('users').updateOne(
      { fingerPrint: fingerprint },
      { $push: { progress: progressEntry } }
    );

    // Check g-cost first
    if (gCost !== 100) {
      await client.close();
      return NextResponse.json({ 
        error: 'Incorrect g-cost value', 
        recorded: true 
      }, { status: 400 });
    }

    // Then check if it's the correct route
    if (remainingRoutes[0] !== letter) {
      await client.close();
      return NextResponse.json(
        { 
          error: `Invalid route. Expected ${remainingRoutes[0]}, got ${letter}`,
          recorded: true
        }, 
        { status: 400 }
      );
    }

    // If both g-cost and route are correct, update goodProgress
    await db.collection('users').updateOne(
      { fingerPrint: fingerprint },
      { $push: { goodProgress: letter } }
    );

    await client.close();
    return NextResponse.json({ 
      success: true,
      message: 'Route verified successfully',
      nextNode: remainingRoutes[1] || null
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}