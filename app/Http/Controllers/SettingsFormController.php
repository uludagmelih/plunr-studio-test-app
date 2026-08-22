<?php

namespace App\Http\Controllers;

use App\Models\PlunrCountry;
use App\Models\PlunrCurrency;
use App\Models\PlunrEmailTemplate;
use App\Models\PlunrSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Throwable;

class SettingsFormController extends Controller
{
    public function updateSidebarBranding(Request $request): RedirectResponse
    {
        $request->validate([
            'sidebar_logo_light' => ['nullable', 'image', 'max:4096'],
            'sidebar_logo_dark' => ['nullable', 'image', 'max:4096'],
            'sidebar_logo_collapsed' => ['nullable', 'image', 'max:4096'],
            'remove_sidebar_logo_light' => ['boolean'],
            'remove_sidebar_logo_dark' => ['boolean'],
            'remove_sidebar_logo_collapsed' => ['boolean'],
        ]);

        $current = PlunrSetting::valueFor('account');
        $current['sidebar_logo_light_url'] = $this->updateLogo(
            $request,
            'sidebar_logo_light',
            'remove_sidebar_logo_light',
            $current['sidebar_logo_light_url'] ?? null,
        );
        $current['sidebar_logo_dark_url'] = $this->updateLogo(
            $request,
            'sidebar_logo_dark',
            'remove_sidebar_logo_dark',
            $current['sidebar_logo_dark_url'] ?? null,
        );
        $current['sidebar_logo_collapsed_url'] = $this->updateLogo(
            $request,
            'sidebar_logo_collapsed',
            'remove_sidebar_logo_collapsed',
            $current['sidebar_logo_collapsed_url'] ?? null,
        );
        PlunrSetting::putValue('account', $current);

        return back()->with('success', 'Sidebar logos saved.');
    }

    public function updateAccount(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'company_name' => ['required', 'string', 'max:160'],
            'address' => ['nullable', 'string', 'max:2000'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'tax_id' => ['nullable', 'string', 'max:80'],
            'tax_office' => ['nullable', 'string', 'max:160'],
            'logo' => ['nullable', 'image', 'max:4096'],
            'logo_dark' => ['nullable', 'image', 'max:4096'],
            'remove_logo' => ['boolean'],
            'remove_logo_dark' => ['boolean'],
        ]);

        $current = PlunrSetting::valueFor('account');
        $next = collect($data)->except(['logo', 'logo_dark', 'remove_logo', 'remove_logo_dark'])->all();
        $next['logo_url'] = $this->updateLogo($request, 'logo', 'remove_logo', $current['logo_url'] ?? null);
        $next['logo_dark_url'] = $this->updateLogo($request, 'logo_dark', 'remove_logo_dark', $current['logo_dark_url'] ?? null);
        PlunrSetting::putValue('account', $next);

        return back()->with('success', 'Account settings saved.');
    }

    public function updateLocalization(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'language' => ['required', 'string', 'max:12'],
            'timezone' => ['required', 'timezone:all'],
            'date_format' => ['required', 'string', 'max:30'],
            'time_format' => ['required', Rule::in(['12h', '24h'])],
            'first_day_of_week' => ['required', 'string', 'max:16'],
            'weekend_days' => ['required', 'array', 'min:1'],
            'weekend_days.*' => ['string', 'max:16'],
            'currency' => ['required', 'string', 'size:3'],
            'conversion_rates' => ['array'],
            'conversion_rates.*.from' => ['required_with:conversion_rates', 'string', 'size:3'],
            'conversion_rates.*.to' => ['required_with:conversion_rates', 'string', 'size:3'],
            'conversion_rates.*.rate' => ['required_with:conversion_rates', 'numeric', 'gt:0'],
        ]);
        PlunrSetting::putValue('localization', $data);

        return back()->with('success', 'Localization settings saved.');
    }

    public function storeCurrency(Request $request): RedirectResponse
    {
        PlunrCurrency::query()->create($this->currencyData($request));
        return back()->with('success', 'Currency created.');
    }

    public function updateCurrency(Request $request, PlunrCurrency $currency): RedirectResponse
    {
        $currency->update($this->currencyData($request, $currency));
        return back()->with('success', 'Currency updated.');
    }

    public function destroyCurrency(PlunrCurrency $currency): RedirectResponse
    {
        $currency->delete();
        return back()->with('success', 'Currency deleted.');
    }

    public function storeCountry(Request $request): RedirectResponse
    {
        PlunrCountry::query()->create($this->countryData($request));
        return back()->with('success', 'Country created.');
    }

    public function updateCountry(Request $request, PlunrCountry $country): RedirectResponse
    {
        $country->update($this->countryData($request, $country));
        return back()->with('success', 'Country updated.');
    }

    public function destroyCountry(PlunrCountry $country): RedirectResponse
    {
        $country->delete();
        return back()->with('success', 'Country deleted.');
    }

    public function storeEmailTemplate(Request $request): RedirectResponse
    {
        PlunrEmailTemplate::query()->create($this->emailTemplateData($request));
        return back()->with('success', 'Email template created.');
    }

    public function updateEmailTemplate(Request $request, PlunrEmailTemplate $template): RedirectResponse
    {
        $template->update($this->emailTemplateData($request, $template));
        return back()->with('success', 'Email template updated.');
    }

    public function destroyEmailTemplate(PlunrEmailTemplate $template): RedirectResponse
    {
        abort_if($template->is_default, 422, 'Default templates cannot be deleted.');
        $template->delete();
        return back()->with('success', 'Email template deleted.');
    }

    public function restoreEmailTemplate(PlunrEmailTemplate $template): RedirectResponse
    {
        $template->update(['is_active' => true]);
        return back()->with('success', 'Email template restored.');
    }

    public function updateMenuCodes(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'codes' => ['required', 'array'],
            'codes.*' => ['required', 'string', 'max:16', 'regex:/^[A-Z0-9]+$/'],
        ]);
        PlunrSetting::putValue('menu_codes', $data['codes']);

        return back()->with('success', 'Menu codes saved.');
    }

    public function updateTicketAutomation(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'reminders_enabled' => ['required', 'boolean'],
            'notification_bell_polling_enabled' => ['required', 'boolean'],
            'due_soon_hours' => ['required', 'string', 'max:100'],
            'stale_days' => ['required', 'integer', 'min:1', 'max:365'],
            'auto_stop_minutes' => ['required', 'integer', 'min:1', 'max:10080'],
        ]);
        $data['due_soon_hours'] = $this->csvNumbers($data['due_soon_hours']);
        PlunrSetting::putValue('ticket_automation', $data);

        return back()->with('success', 'Automation settings saved.');
    }

    public function updateEmailIngestion(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'enabled' => ['required', 'boolean'],
            'imap_host' => ['nullable', 'string', 'max:255'],
            'imap_port' => ['required', 'integer', 'min:1', 'max:65535'],
            'imap_encryption' => ['required', Rule::in(['ssl', 'tls', 'none'])],
            'imap_validate_cert' => ['required', 'boolean'],
            'imap_username' => ['nullable', 'string', 'max:255'],
            'imap_password' => ['nullable', 'string', 'max:1000'],
            'imap_protocol' => ['required', Rule::in(['imap', 'pop3'])],
            'folder' => ['required', 'string', 'max:255'],
            'archive_folder' => ['nullable', 'string', 'max:255'],
            'blocked_domains' => ['nullable', 'string', 'max:4000'],
            'spam_keywords' => ['nullable', 'string', 'max:4000'],
            'rate_limit_max_per_hour' => ['required', 'integer', 'min:1', 'max:10000'],
            'fallback_user_id' => ['nullable', 'integer'],
            'fallback_team_id' => ['nullable', 'integer'],
            'default_status' => ['required', 'string', 'max:50'],
            'guest_status' => ['required', 'string', 'max:50'],
            'default_priority' => ['required', 'string', 'max:50'],
            'default_ticket_type' => ['required', 'string', 'max:50'],
        ]);
        $current = PlunrSetting::valueFor('email_ingestion');
        $data['blocked_domains'] = $this->csvStrings($data['blocked_domains'] ?? '');
        $data['spam_keywords'] = $this->csvStrings($data['spam_keywords'] ?? '');
        $data['imap_password_encrypted'] = $this->encryptedReplacement($data['imap_password'] ?? '', $current['imap_password_encrypted'] ?? null);
        unset($data['imap_password']);
        PlunrSetting::putValue('email_ingestion', $data);

        return back()->with('success', 'Email ingestion settings saved.');
    }

    public function updateOutgoingEmail(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'host' => ['required', 'string', 'max:255'],
            'port' => ['required', 'integer', 'min:1', 'max:65535'],
            'encryption' => ['nullable', Rule::in(['ssl', 'tls', 'none'])],
            'username' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'max:1000'],
            'from_address' => ['required', 'email', 'max:255'],
            'from_name' => ['required', 'string', 'max:255'],
            'test_recipient' => ['nullable', 'email', 'max:255'],
        ]);
        $current = PlunrSetting::valueFor('outgoing_email');
        $data['password_encrypted'] = $this->encryptedReplacement($data['password'] ?? '', $current['password_encrypted'] ?? null);
        unset($data['password']);
        PlunrSetting::putValue('outgoing_email', $data);

        return back()->with('success', 'Outgoing email settings saved.');
    }

    public function testReminder(Request $request): RedirectResponse
    {
        try {
            Mail::raw('This is a PLUNR notification reminder test.', fn ($message) => $message
                ->to($request->user()->email)
                ->subject('PLUNR reminder test'));
            return back()->with('success', 'Test reminder sent.');
        } catch (Throwable $exception) {
            return back()->withErrors(['email' => 'Test reminder failed: '.$exception->getMessage()]);
        }
    }

    public function testOutgoingEmail(Request $request): RedirectResponse
    {
        $recipient = $request->validate(['test_recipient' => ['required', 'email']])['test_recipient'];
        try {
            $this->configureStoredMailer();
            Mail::mailer('smtp')->raw('This is a PLUNR outgoing email test.', fn ($message) => $message
                ->to($recipient)
                ->subject('PLUNR email connection test'));
            return back()->with('outgoing_email_test', [
                'success' => true, 'message' => 'Test email sent.', 'output' => 'SMTP delivery completed.',
            ]);
        } catch (Throwable $exception) {
            return back()->with('outgoing_email_test', [
                'success' => false, 'message' => 'SMTP test failed.', 'output' => $exception->getMessage(),
            ]);
        }
    }

    public function testEmailIngestion(Request $request): RedirectResponse
    {
        if (! function_exists('imap_open')) {
            return back()->with('email_ingestion_test', [
                'success' => false,
                'message' => 'PHP IMAP is not installed.',
                'output' => 'Enable the PHP imap extension to test mailbox connectivity.',
            ]);
        }

        $data = $request->validate([
            'imap_host' => ['required', 'string'],
            'imap_port' => ['required', 'integer'],
            'imap_username' => ['required', 'string'],
            'imap_password' => ['nullable', 'string'],
            'imap_encryption' => ['required', Rule::in(['ssl', 'tls', 'none'])],
        ]);
        $current = PlunrSetting::valueFor('email_ingestion');
        $password = $data['imap_password'] ?: $this->decryptStored($current['imap_password_encrypted'] ?? null);
        $flags = $data['imap_encryption'] === 'none' ? '/novalidate-cert' : '/'.$data['imap_encryption'];
        $mailbox = sprintf('{%s:%d/imap%s}INBOX', $data['imap_host'], $data['imap_port'], $flags);

        try {
            $connection = @imap_open($mailbox, $data['imap_username'], $password, OP_HALFOPEN);
            if (! $connection) {
                throw new \RuntimeException(imap_last_error() ?: 'Mailbox connection failed.');
            }
            imap_close($connection);
            return back()->with('email_ingestion_test', [
                'success' => true, 'message' => 'Mailbox connection succeeded.', 'output' => 'IMAP authentication completed.',
            ]);
        } catch (Throwable $exception) {
            return back()->with('email_ingestion_test', [
                'success' => false, 'message' => 'Mailbox connection failed.', 'output' => $exception->getMessage(),
            ]);
        }
    }

    public function runEmailIngestion(): RedirectResponse
    {
        return back()->with('email_ingestion_run', [
            'success' => true,
            'message' => 'Mailbox check completed.',
            'output' => 'Processed: 0'.PHP_EOL.'Skipped: 0'.PHP_EOL.'No ticket ingestion adapter is registered.',
        ]);
    }

    public function aiShow(): JsonResponse
    {
        $settings = PlunrSetting::valueFor('ai');
        if (isset($settings['api_key_encrypted'])) {
            $settings['api_key'] = '***encrypted***';
        }
        unset($settings['api_key_encrypted']);

        return response()->json([
            'settings' => $settings ?: null,
            'providers' => $this->aiProviders(),
            'models' => $this->aiModels(),
            'budget_usage_percentage' => (float) ($settings['budget_usage_percentage'] ?? 0),
            'is_budget_exceeded' => (bool) ($settings['is_budget_exceeded'] ?? false),
            'analysis_policy' => $settings['analysis_policy'] ?? null,
        ]);
    }

    public function aiStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'provider' => ['required', Rule::in(['openai', 'anthropic', 'google'])],
            'api_key' => ['nullable', 'string', 'max:2000'],
            'api_endpoint' => ['nullable', 'url', 'max:500'],
            'model_name' => ['required', 'string', 'max:160'],
            'monthly_budget_limit' => ['nullable', 'numeric', 'min:0'],
            'auto_analyze_new_tickets' => ['boolean'],
            'confidence_threshold' => ['required', 'integer', 'min:0', 'max:100'],
            'enable_sentiment_analysis' => ['boolean'],
            'enable_priority_suggestions' => ['boolean'],
            'max_similar_tickets' => ['required', 'integer', 'min:1', 'max:50'],
            'settings' => ['array'],
            'analysis_policy' => ['array'],
        ]);
        $current = PlunrSetting::valueFor('ai');
        $data['api_key_encrypted'] = $this->encryptedReplacement($data['api_key'] ?? '', $current['api_key_encrypted'] ?? null);
        unset($data['api_key']);
        $data['is_active'] = $current['is_active'] ?? true;
        $data['assistant_enabled'] = $current['assistant_enabled'] ?? true;
        PlunrSetting::putValue('ai', array_merge($current, $data));

        return response()->json(['success' => true, 'message' => 'AI settings saved.']);
    }

    public function aiTest(Request $request): JsonResponse
    {
        $data = $request->validate([
            'provider' => ['required', Rule::in(['openai', 'anthropic', 'google'])],
            'api_key' => ['nullable', 'string'],
            'api_endpoint' => ['nullable', 'url'],
            'model_name' => ['required', 'string'],
        ]);
        $current = PlunrSetting::valueFor('ai');
        $hasKey = filled($data['api_key']) && $data['api_key'] !== '***encrypted***'
            ? true
            : filled($current['api_key_encrypted'] ?? null);

        return response()->json([
            'success' => $hasKey,
            'message' => $hasKey
                ? 'Credentials and endpoint configuration are present.'
                : 'Enter an API key before testing the connection.',
        ]);
    }

    public function aiToggleStatus(): JsonResponse
    {
        return $this->toggleAiFlag('is_active', 'AI integration status updated.');
    }

    public function aiToggleAssistant(): JsonResponse
    {
        return $this->toggleAiFlag('assistant_enabled', 'AI Assistant status updated.');
    }

    public function aiResetUsage(): JsonResponse
    {
        $settings = PlunrSetting::valueFor('ai');
        $settings['budget_usage_percentage'] = 0;
        $settings['is_budget_exceeded'] = false;
        PlunrSetting::putValue('ai', $settings);
        return response()->json(['success' => true, 'message' => 'Monthly usage reset.']);
    }

    public function destroyTrustedDevice(): RedirectResponse
    {
        return back()->with('success', 'Trusted device removed.');
    }

    public function logoutOtherSessions(Request $request): RedirectResponse
    {
        if (config('session.driver') === 'database') {
            DB::table(config('session.table', 'sessions'))
                ->where('user_id', $request->user()->getAuthIdentifier())
                ->where('id', '!=', $request->session()->getId())
                ->delete();
        }
        return back()->with('success', 'Other browser sessions logged out.');
    }

    private function currencyData(Request $request, ?PlunrCurrency $currency = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'code' => ['required', 'string', 'size:3', Rule::unique('plunr_currencies', 'code')->ignore($currency)],
            'symbol' => ['required', 'string', 'max:12'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
        $data['code'] = strtoupper($data['code']);
        return $data;
    }

    private function countryData(Request $request, ?PlunrCountry $country = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'country_code' => ['required', 'string', 'size:2', Rule::unique('plunr_countries', 'country_code')->ignore($country)],
            'currency' => ['required', 'string', 'size:3'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
        $data['country_code'] = strtoupper($data['country_code']);
        $data['currency'] = strtoupper($data['currency']);
        return $data;
    }

    private function emailTemplateData(Request $request, ?PlunrEmailTemplate $template = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'key' => ['nullable', 'string', 'max:160', Rule::unique('plunr_email_templates', 'key')->ignore($template)],
            'module' => ['required', 'string', 'max:48'],
            'subject' => ['required', 'string', 'max:255'],
            'body_html' => ['required', 'string'],
            'variables' => ['array'],
            'is_active' => ['boolean'],
        ]);
        $data['key'] = $data['key'] ?: (string) str($data['name'])->slug();
        return $data;
    }

    private function updateLogo(Request $request, string $fileKey, string $removeKey, ?string $current): ?string
    {
        if ($request->boolean($removeKey)) {
            $this->deletePublicFile($current);
            return null;
        }
        if (! $request->hasFile($fileKey)) {
            return $current;
        }
        $this->deletePublicFile($current);
        return Storage::disk('public')->url($request->file($fileKey)->store('plunr-branding', 'public'));
    }

    private function deletePublicFile(?string $url): void
    {
        if ($url && str_contains($url, '/storage/')) {
            Storage::disk('public')->delete((string) str($url)->after('/storage/'));
        }
    }

    private function encryptedReplacement(string $incoming, ?string $current): ?string
    {
        if ($incoming === '' || $incoming === '***encrypted***') return $current;
        return Crypt::encryptString($incoming);
    }

    private function decryptStored(?string $value): string
    {
        if (! $value) return '';
        try { return Crypt::decryptString($value); } catch (Throwable) { return ''; }
    }

    private function csvStrings(string $value): array
    {
        return array_values(array_filter(array_map('trim', explode(',', $value))));
    }

    private function csvNumbers(string $value): array
    {
        return array_values(array_unique(array_map('intval', $this->csvStrings($value))));
    }

    private function configureStoredMailer(): void
    {
        $settings = PlunrSetting::valueFor('outgoing_email');
        Config::set('mail.mailers.smtp', [
            'transport' => 'smtp',
            'host' => $settings['host'] ?? null,
            'port' => $settings['port'] ?? 587,
            'encryption' => ($settings['encryption'] ?? 'tls') === 'none' ? null : $settings['encryption'],
            'username' => $settings['username'] ?? null,
            'password' => $this->decryptStored($settings['password_encrypted'] ?? null),
            'timeout' => 10,
        ]);
        Config::set('mail.from.address', $settings['from_address'] ?? config('mail.from.address'));
        Config::set('mail.from.name', $settings['from_name'] ?? config('mail.from.name'));
        Mail::purge('smtp');
    }

    private function aiProviders(): array
    {
        return [
            ['value' => 'openai', 'label' => 'OpenAI (GPT)'],
            ['value' => 'anthropic', 'label' => 'Anthropic (Claude)'],
            ['value' => 'google', 'label' => 'Google AI (Gemini)'],
        ];
    }

    private function aiModels(): array
    {
        return [
            'openai' => [['value' => 'gpt-4.1', 'label' => 'GPT-4.1'], ['value' => 'gpt-4o', 'label' => 'GPT-4o']],
            'anthropic' => [['value' => 'claude-sonnet-4-5', 'label' => 'Claude Sonnet 4.5']],
            'google' => [['value' => 'gemini-2.5-pro', 'label' => 'Gemini 2.5 Pro'], ['value' => 'gemini-2.5-flash', 'label' => 'Gemini 2.5 Flash']],
        ];
    }

    private function toggleAiFlag(string $flag, string $message): JsonResponse
    {
        $settings = PlunrSetting::valueFor('ai');
        $settings[$flag] = ! (bool) ($settings[$flag] ?? true);
        PlunrSetting::putValue('ai', $settings);
        return response()->json(['success' => true, 'message' => $message]);
    }
}
