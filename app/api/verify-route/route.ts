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

    const remainingRoutes = user.idealRoute.filter(
      (route: string) => !user.goodProgress.includes(route)
    );

    // Record the attempt with g-cost
    const progressEntry = {
      node: letter,
      timestamp: new Date(),
      gCost: gCost,
      isCorrect: gCost === 100
    };
    
    await db.collection('users').updateOne(
      { fingerPrint: fingerprint },
      { $push: { progress: progressEntry } }
    );

    // Check g-cost
    if (gCost !== 100) {
      await client.close();
      return NextResponse.json({ 
        error: 'Incorrect g-cost value', 
        recorded: true 
      }, { status: 400 });
    }

    // Update goodProgress since both node and g-cost are correct
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