import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <AuthenticatedLayout>
            <Head title="Warehouses" />
            <div className="p-6">
                <h1 className="text-2xl font-semibold">Warehouses</h1>
            </div>
        </AuthenticatedLayout>
    );
}
