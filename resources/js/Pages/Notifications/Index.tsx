import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import WorkspaceTitle from '@plunr/Components/WorkspaceTitle';
import { Button } from '@plunr/Components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Bell, CheckCheck } from 'lucide-react';
import { useState } from 'react';

type NotificationItem = {
    id: string;
    title: string;
    message: string;
    url?: string;
    read_at?: string | null;
    created_at?: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export default function NotificationsIndex() {
    const { notifications, unreadCount = 0 } = usePage().props as unknown as {
        notifications: { data: NotificationItem[]; links: PaginationLink[] };
        unreadCount?: number;
    };
    const [markingAll, setMarkingAll] = useState(false);

    const markAllRead = async () => {
        setMarkingAll(true);
        try {
            await axios.post(route('notifications.mark-all-read'));
            router.reload({ only: ['notifications', 'unreadCount'] });
        } finally {
            setMarkingAll(false);
        }
    };

    const markRead = async (item: NotificationItem) => {
        if (!item.read_at) {
            await axios.post(route('notifications.mark-read'), { ids: [item.id] });
        }
    };

    return (
        <AuthenticatedLayout
            header={<WorkspaceTitle icon={Bell} title="Notifications" />}
        >
            <Head title="Notifications" />

            <div className="mx-auto max-w-5xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {unreadCount} unread
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={markingAll || unreadCount === 0}
                        onClick={markAllRead}
                    >
                        <CheckCheck className="h-4 w-4" />
                        Mark all read
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    {notifications.data.length === 0 ? (
                        <p className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                            No notifications yet.
                        </p>
                    ) : (
                        notifications.data.map((item) => (
                            <Link
                                key={item.id}
                                href={item.url || route('notifications.index')}
                                onClick={() => void markRead(item)}
                                className={`block border-b border-slate-200 p-4 transition last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70 ${
                                    item.read_at ? '' : 'bg-primary/5'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-slate-100">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                            {item.message}
                                        </p>
                                    </div>
                                    {!item.read_at ? (
                                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                                    ) : null}
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                <nav className="flex flex-wrap gap-2" aria-label="Notification pages">
                    {notifications.links.map((link) =>
                        link.url ? (
                            <Link
                                key={link.label}
                                href={link.url}
                                preserveScroll
                                className={`rounded-md border px-3 py-1.5 text-sm ${
                                    link.active
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : null,
                    )}
                </nav>
            </div>
        </AuthenticatedLayout>
    );
}
