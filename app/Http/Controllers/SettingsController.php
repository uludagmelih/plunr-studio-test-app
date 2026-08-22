<?php

namespace App\Http\Controllers;

use App\Models\PlunrCountry;
use App\Models\PlunrCurrency;
use App\Models\PlunrEmailTemplate;
use App\Models\PlunrSetting;
use App\Models\User;
use App\Services\QuickAccessService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function __construct(
        private readonly QuickAccessService $quickAccessService,
    ) {}

    public function index(Request $request): Response
    {
        $activeTab = (string) $request->query('tab', 'workspace');
        $payload = ['activeTab' => $activeTab];

        if ($activeTab === 'quick-access') {
            $stored = is_array($request->user()?->quick_access)
                ? $request->user()->quick_access
                : [];
            $items = $this->quickAccessService->sanitizeItems($stored);

            $payload['quickAccess'] = [
                'items' => $items !== [] ? $items : $this->quickAccessService->defaults(),
                'catalog' => $this->quickAccessService->catalogForSettings(),
                'icons' => $this->quickAccessService->iconOptions(),
                'tones' => $this->quickAccessService->toneOptions(),
                'max' => 12,
            ];
        }

        if ($activeTab === 'security') {
            $user = $request->user();
            $payload['twoFactor'] = [
                'enabled' => filled($user?->two_factor_secret)
                    && filled($user?->two_factor_confirmed_at),
                'trustedDevices' => [],
            ];
            $payload['browserSessions'] = [];
        }

        if ($activeTab === 'account') {
            $payload['accountProfile'] = PlunrSetting::valueFor('account');
        }

        if ($activeTab === 'localization') {
            $payload['localizationSettings'] = PlunrSetting::valueFor('localization');
        }

        if ($activeTab === 'currencies') {
            $query = PlunrCurrency::query();
            $this->applyListFilters($request, $query, ['name', 'code', 'symbol']);
            $payload['currencySettings'] = [
                'filters' => $this->filters($request),
                'currencies' => $this->pagination($query->latest('updated_at')->paginate($this->perPage($request))),
            ];
        }

        if ($activeTab === 'countries') {
            $query = PlunrCountry::query();
            $this->applyListFilters($request, $query, ['name', 'country_code', 'currency']);
            $payload['countrySettings'] = [
                'filters' => $this->filters($request),
                'countries' => $this->pagination($query->latest('updated_at')->paginate($this->perPage($request))),
                'currencyOptions' => PlunrCurrency::query()
                    ->where('status', 'active')
                    ->orderBy('code')
                    ->get(['code', 'name'])
                    ->map(fn (PlunrCurrency $currency) => [
                        'value' => $currency->code,
                        'label' => $currency->code.' — '.$currency->name,
                    ])
                    ->values(),
            ];
        }

        if ($activeTab === 'email-templates') {
            $payload['emailTemplates'] = PlunrEmailTemplate::query()->orderBy('module')->orderBy('name')->get();
        }

        if ($activeTab === 'menu-codes') {
            $payload['menuCodeOverrides'] = PlunrSetting::valueFor('menu_codes');
        }

        if ($activeTab === 'notifications') {
            $payload['ticketAutomation'] = PlunrSetting::valueFor('ticket_automation', [
                'reminders_enabled' => true,
                'notification_bell_polling_enabled' => true,
                'due_soon_hours' => [24, 4],
                'stale_days' => 3,
                'auto_stop_minutes' => 240,
            ]);
            $payload['outgoingEmailSettings'] = $this->publicSecrets(
                PlunrSetting::valueFor('outgoing_email'),
                'password_encrypted',
            );
            $payload['emailIngestion'] = $this->publicSecrets(
                PlunrSetting::valueFor('email_ingestion'),
                'imap_password_encrypted',
            );
            $payload['emailIngestionUsers'] = User::query()->orderBy('name')->get(['id', 'name', 'email']);
            $payload['emailIngestionTeams'] = [];
            $payload['emailIngestionStatuses'] = [
                ['value' => 'open', 'label' => 'Open'],
                ['value' => 'pending_verification', 'label' => 'Pending verification'],
                ['value' => 'closed', 'label' => 'Closed'],
            ];
            $payload['emailIngestionLogs'] = [];
            $payload['automationHealth'] = [
                'queue_driver' => config('queue.default'),
                'pending_jobs' => 0,
                'failed_jobs' => 0,
                'dead_letters' => 0,
            ];
            $payload['infrastructureDiagnostics'] = [];
        }

        return Inertia::render('Settings/Index', $payload);
    }

    private function applyListFilters(Request $request, $query, array $columns): void
    {
        $search = trim((string) $request->query('search', ''));
        if ($search !== '') {
            $query->where(function ($nested) use ($columns, $search) {
                foreach ($columns as $index => $column) {
                    $method = $index === 0 ? 'where' : 'orWhere';
                    $nested->{$method}($column, 'like', '%'.$search.'%');
                }
            });
        }
        $status = (string) $request->query('status', 'all');
        if (in_array($status, ['active', 'inactive'], true)) {
            $query->where('status', $status);
        }
    }

    private function filters(Request $request): array
    {
        return [
            'search' => (string) $request->query('search', ''),
            'status' => (string) $request->query('status', 'all'),
            'per_page' => $this->perPage($request),
        ];
    }

    private function perPage(Request $request): int
    {
        return min(100, max(10, (int) $request->query('per_page', 20)));
    }

    private function pagination($paginator): array
    {
        return [
            'data' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];
    }

    private function publicSecrets(array $settings, string $encryptedKey): array
    {
        if (filled($settings[$encryptedKey] ?? null)) {
            $settings[(string) str($encryptedKey)->before('_encrypted')] = '***encrypted***';
        }
        unset($settings[$encryptedKey]);
        return $settings;
    }
}
