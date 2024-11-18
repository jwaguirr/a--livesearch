'use client';

import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const uri = process.env.MONGODB_URI!;
export default function TestRoute() {
  const [fingerprint, setFingerprint] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Device Fingerprint</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <code>{fingerprint}</code>
      </div>
    </div>
  );
}