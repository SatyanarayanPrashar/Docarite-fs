'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import SettingPage from './[component]/settingwrap';

export default function HomePage() {
    return (
        <Suspense fallback={<Skeleton />}>
            <SettingPage />
        </Suspense>
    );
}
