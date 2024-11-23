import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  const { fingerprint, number, letter } = await request.json();

  if (!fingerprint || !number || !letter) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('fingerprint_db');
    
    const user = await db.collection('users').findOne({ fingerPrint: fingerprint });
    
    if (!user) {
        console.error("USER NOT FOUND", fingerprint);
        await client.close();
        return NextResponse.json({ 
          error: 'User not found',
          needsVerification: true 
        }, { status: 404 });
      }

    // Check if group number matches
    if (user.groupColorCounter !== parseInt(number)) {
        console.error("WRONG GROUP NUMBER")
      await client.close();
      return NextResponse.json(
        { error: `Invalid group. Expected ${user.groupColorCounter}, got ${number}`, groupCount : user.groupColorCounter }, 
        { status: 403 }
      );
    }

    const remainingRoutes = user.idealRoute.filter(
      (route: string) => !user.goodProgress.includes(route)
    );

    // Check if it's the correct route
    if (remainingRoutes[0] !== letter) {
      // Record the incorrect attempt
      const progressEntry = {
        node: letter,
        timestamp: new Date(),
        isCorrect: false
      };
      
      await db.collection('users').updateOne(
        { fingerPrint: fingerprint },
        { $push: { progress: progressEntry } }
      );
      
      await client.close();
      return NextResponse.json(
        { 
          error: `Invalid route. Expected ${remainingRoutes[0]}, got ${letter}`,
          recorded: true
        }, 
        { status: 400 }
      );
    }

    await client.close();
    return NextResponse.json({ 
      success: true,
      validNode: true
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}