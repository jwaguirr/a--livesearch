// Update your TestRoute component:
'use client';

import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import io from 'socket.io-client';

interface ProgressUpdate {
    letter: string;
    timestamp: Date;
}

let socket: any;

export default function TestRoute() {
    const [fingerprint, setFingerprint] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [updates, setUpdates] = useState<ProgressUpdate[]>([]);

    useEffect(() => {
        // Initialize Socket.io
        const socketInitializer = async () => {
            await fetch('/api/socket');
            
            if (!socket) {
                const socket = io({
                    path: '/api/socket/io',
                    addTrailingSlash: false,
                    transports: ['polling', 'websocket']
                });

                socket.on('connect', () => {
                    console.log('Socket connected');
                });

                socket.on('progressUpdate', (data: any) => {
                    if (data.updates.progress) {
                        const newProgress = data.updates.progress;
                        setUpdates(prev => [...prev, {
                            letter: Object.keys(newProgress[newProgress.length - 1])[0],
                            timestamp: new Date(Object.values(newProgress[newProgress.length - 1])[0])
                        }]);
                    }
                });
            }
        };

        socketInitializer();

        // Get fingerprint
        async function getFingerprint() {
            try {
                const fp = await FingerprintJS.load();
                const result = await fp.get();
                setFingerprint(result.visitorId);
            } catch (error) {
                console.error('Error getting fingerprint:', error);
            } finally {
                setLoading(false);
            }
        }

        getFingerprint();

        // Cleanup socket connection
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Device Fingerprint</h1>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <code>{fingerprint}</code>
            </div>
            
            <h2 className="text-xl font-bold mb-4">Real-time Progress Updates</h2>
            <div className="space-y-2">
                {updates.map((update, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg shadow border border-gray-200">
                        <p className="font-medium">Node {update.letter}</p>
                        <p className="text-sm text-gray-600">
                            {new Date(update.timestamp).toLocaleString()}
                        </p>
                    </div>
                ))}
                {updates.length === 0 && (
                    <p className="text-gray-500">No updates yet...</p>
                )}
            </div>
        </div>
    );
}