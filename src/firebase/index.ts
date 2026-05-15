'use client';

import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, onSnapshot, Query, DocumentData } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDF-12mGxtEZn2k-fqh-KTFB4cczuK5wNc",
  authDomain: "cubarenta.firebaseapp.com",
  projectId: "cubarenta",
  storageBucket: "cubarenta.firebasestorage.app",
  messagingSenderId: "989320615168",
  appId: "1:989320615168:web:f2fbf9d2c6db9e91a40fe5"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export function useFirestore() {
  return db;
}

export function useCollection(query: Query<DocumentData> | null) {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
