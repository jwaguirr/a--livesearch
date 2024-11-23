// app/api/teams/route.ts
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI!;

export async function GET() {
  let client;
  try {
    client = await MongoClient.connect(uri);
    const db = client.db('fingerprint_db');
    
    // Create indexes if they don't exist (you can also do this in a setup script)
    await db.collection('users').createIndex({ initialTime: -1 });
    await db.collection('users').createIndex({ groupColorCounter: 1 });

    // Fetch teams with proper sorting
    const teams = await db.collection('users')
      .find({})
      .sort({ 
        initialTime: -1,  // Sort by most recent first
        groupColorCounter: 1  // Then by group color
      })
      .project({
        _id: 1,
        netID: 1,
        section: 1,
        fullName: 1,
        groupMembers: 1,
        progress: 1,
        goodProgress: 1,
        idealRoute: 1,
        groupColorCounter: 1,
        initialTime: 1,
        fingerPrint: 1
      })
      .toArray();

    return NextResponse.json(teams);

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Optional: Add a type for better type safety
interface TeamMember {
  netid: string;
  name: string;
  section: string;
}

interface Team {
  _id: string;
  netID: string;
  section: string;
  fullName: string;
  groupMembers: TeamMember[];
  progress: Array<Record<string, Date>>;
  goodProgress: string[];
  idealRoute: string[];
  groupColorCounter: number;
  initialTime: string;
  fingerPrint: string;
}