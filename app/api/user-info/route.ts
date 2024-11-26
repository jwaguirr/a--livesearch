import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  const { fingerprint } = await request.json();

  const getRouteColor = (colorNumber: number | null): { name: string; hex: string } => {
    switch (colorNumber) {
      case 1:
        return { name: 'Yellow', hex: '#FCD34D' };
      case 2:
        return { name: 'Red', hex: '#EF4444' };
      case 3:
        return { name: 'Green', hex: '#10B981' };
      case 4:
        return { name: 'Blue', hex: '#3B82F6' };
      default:
        return { name: 'Unknown', hex: '#6B7280' };
    }
  };

  if (!fingerprint) {
    return NextResponse.json({ error: 'Missing fingerprint' }, { status: 400 });
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

    const progress = {
      completedRoutes: user.goodProgress.length,
      totalRoutes: user.idealRoute.length,
      remainingRoutes: remainingRoutes,
      groupNumber: user.groupColorCounter,
      groupColor: getRouteColor(user.groupColorCounter),
      currentProgress: ((user.goodProgress.length / user.idealRoute.length) * 100).toFixed(1),
      recentAttempts: user.progress.slice(-5).reverse() // Get last 5 attempts
    };

    await client.close();
    return NextResponse.json(progress);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}