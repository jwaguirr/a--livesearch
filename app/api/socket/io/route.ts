import { Server as ServerIO } from 'socket.io';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const socketConfig = {
    path: '/api/socket/io',
    addTrailingSlash: false,
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
};

export async function GET() {
    const headersList = headers();
    const url = headersList.get('origin') || '';

    if (!global.io) {
        console.log('Creating new Socket.io server...');
        // @ts-ignore
        global.io = new ServerIO(socketConfig);
    }

    try {
        const io = global.io;
        
        io.on('connection', (socket) => {
            console.log('Socket connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('Socket disconnected:', socket.id);
            });
        });

    } catch (error) {
        console.error('Socket error:', error);
    }

    return NextResponse.json({ success: true });
}