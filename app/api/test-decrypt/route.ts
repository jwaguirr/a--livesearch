import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { encryptedData } = body;
    
    // Same decryption logic as the original
    const key = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);
    const standardBase64 = encryptedData.replace(/-/g, '+').replace(/_/g, '/');
    const encryptedBytes = CryptoJS.enc.Base64.parse(standardBase64);
    const iv = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_ENCRYPTION_IV!);
    const actualData = CryptoJS.enc.Hex.parse(encryptedBytes.toString().slice(32));
    const decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext: actualData
      },
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    
    const paramsString = decrypted.toString(CryptoJS.enc.Utf8).replace('AND', '&');
    
    if (!paramsString) {
      return NextResponse.json({ error: 'Decryption resulted in empty string' }, { status: 400 });
    }
    
    const urlParams = new URLSearchParams(paramsString);
    const decryptedParams = {
      number: urlParams.get('number'),
      node: urlParams.get('node')
    };
    
    return NextResponse.json(decryptedParams);
    
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json({ error: 'Decryption failed' }, { status: 400 });
  }
}