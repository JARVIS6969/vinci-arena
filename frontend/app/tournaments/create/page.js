'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTournamentRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/studio/point-table'); }, []);
  return null;
}