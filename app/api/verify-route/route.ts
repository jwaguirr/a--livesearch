import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  const { fingerprint, number, letter, gCost } = await request.json();

  if (!fingerprint || !number || !letter || gCost === undefined) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // Validate g-cost
  if (gCost !== 100) {
    return NextResponse.json({ error: 'Invalid g-cost value' }, { status: 400 });
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

    if (remainingRoutes[0] !== letter) {
      // Create a progress entry with letter, timestamp, and g-cost
      const progressEntry = {
        node: letter,
        timestamp: new Date(),
        gCost: gCost
      };
      
      await db.collection('users').updateOne(
        { fingerPrint: fingerprint },
        { $push: { progress: progressEntry } }
      );
      await client.close();
      return NextResponse.json(
        { error: `Invalid route. Expected ${remainingRoutes[0]}, got ${letter}` }, 
        { status: 400 }
      );
    }

    // Update both progress and goodProgress with the successful attempt
    const progressEntry = {
      node: letter,
      timestamp: new Date(),
      gCost: gCost,
      isCorrect: true
    };
    
    await db.collection('users').updateOne(
      { fingerPrint: fingerprint },
      { 
        $push: { 
          progress: progressEntry,
          goodProgress: letter 
        }
      }
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