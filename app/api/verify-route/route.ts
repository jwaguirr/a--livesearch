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
        (route: any) => !user.goodProgress.includes(route)
    );

    if (remainingRoutes[0] !== letter) {
        // Create an object with letter as the key and timestamp as the value
        const progressEntry = { [letter]: new Date() };
        
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

    // Update both progress and goodProgress in a single operation
    const progressEntry = { [letter]: new Date() };
    
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
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}