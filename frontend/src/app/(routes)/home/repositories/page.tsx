'use client';

import { Suspense } from 'react';
import RepoSyncWrapper from './[component]/RepoSyncWrapper';
import { SyncingDisplay } from './[component]/syncing_display';

export default function HomePage() {
    return (
        <Suspense fallback={<SyncingDisplay />}>
            <RepoSyncWrapper />
        </Suspense>
    );
}
