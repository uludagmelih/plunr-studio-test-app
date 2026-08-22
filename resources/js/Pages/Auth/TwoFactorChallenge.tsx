import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@plunr/Components/InputError';
import InputLabel from '@plunr/Components/InputLabel';
import PrimaryButton from '@plunr/Components/PrimaryButton';
import TextInput from '@plunr/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function TwoFactorChallenge({ email }: { email: string }) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        recovery_code: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(route('two-factor.login.store'));
    };

    return (
        <GuestLayout>
            <Head title="Two-Factor Verification" />

            <div className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                Enter your authenticator code to continue as{' '}
                <span className="font-medium text-slate-900 dark:text-slate-100">{email}</span>.
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="code" value="Authentication code" />
                    <TextInput
                        id="code"
                        value={data.code}
                        className="mt-1 block w-full"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        autoFocus
                        onChange={(event) => setData('code', event.target.value)}
                    />
                </div>

                <div>
                    <InputLabel htmlFor="recovery_code" value="Or use a recovery code" />
                    <TextInput
                        id="recovery_code"
                        value={data.recovery_code}
                        className="mt-1 block w-full"
                        autoComplete="one-time-code"
                        onChange={(event) => setData('recovery_code', event.target.value)}
                    />
                    <InputError message={errors.code || errors.recovery_code} className="mt-2" />
                </div>

                <PrimaryButton disabled={processing}>Verify and Continue</PrimaryButton>
            </form>
        </GuestLayout>
    );
}
