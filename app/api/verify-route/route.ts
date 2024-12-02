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
    console.debug(user)
    if (!user) {
      await client.close();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const remainingRoutes = user.idealRoute.filter(
      (route: string) => !user.goodProgress.includes(route)
    );


    // 7 total routes 
    const gCostDict = {0: 0, 1:50, 2:100, 3:120, 4:100, 5:150, 6 : 200}
    // Formula is 6 total routes - amount remaining times 50
    const correctGCost = gCostDict[(7 - remainingRoutes.length)]
    console.log("Remaining routes!", remainingRoutes.length)
    // Record the attempt with g-cost
    const progressEntry = {
      node: letter,
      timestamp: new Date(),
      gCost: gCost,
      isCorrect: gCost === correctGCost
    };
    
    await db.collection('users').updateOne(
      { fingerPrint: fingerprint },
      { $push: { progress: progressEntry } }
    );

    // Check g-cost
    if (gCost !== correctGCost) {
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

    console.log(user)

    if (user.goodProgress.length + 1 === 7) {
      console.log("YES CHANGE SCREENS")
      await client.close()
      return NextResponse.json({
        success: true,
        message: "Found all the nodes!",
      }, {status: 202})
    }
    await client.close();
    return NextResponse.json({ 
      success: true,
      message: 'Route verified successfully',
      nextNode: remainingRoutes[1] || null
    }, {status: 200});

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}