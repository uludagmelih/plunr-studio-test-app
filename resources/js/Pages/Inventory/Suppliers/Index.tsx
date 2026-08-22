import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Page() {
    return (
        <AuthenticatedLayout>
            <Head title="Suppliers" />
            <div className="p-6">
                <h1 className="text-2xl font-semibold">Suppliers</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    This page was scaffolded by PLUNR Studio. Replace this
                    placeholder with your screen.
                </p>
            </div>
        </AuthenticatedLayout>
    );
}
