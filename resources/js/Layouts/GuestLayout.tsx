import { Link } from '@inertiajs/react';
import ThemeToggle from '@plunr/Components/theme-toggle';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-svh flex-col items-center bg-slate-100 px-4 pt-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:justify-center sm:pt-0">
            <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                <ThemeToggle />
            </div>
            <div>
                <Link href="/" className="flex items-center gap-3">
                    <img
                        src="/images/plunr-logo-light.svg"
                        alt="Plunr"
                        className="h-10 w-auto dark:hidden sm:h-12"
                    />
                    <img
                        src="/images/plunr-logo2.svg"
                        alt="Plunr"
                        className="hidden h-10 w-auto dark:block sm:h-12"
                    />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-lg shadow-slate-900/5 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:max-w-md">
                {children}
            </div>
        </div>
    );
}

