import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <AuthenticatedLayout>
            <Head title="Products" />
            <div className="p-6">
                <h1 className="text-2xl font-semibold">Products</h1>
            </div>
        </AuthenticatedLayout>
    );
}
