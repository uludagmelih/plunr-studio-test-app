<?php

namespace App\Http\Middleware;

use App\Models\PlunrSetting;
use App\Services\QuickAccessService;
use Plunr\AdminStarterKit\ProjectModuleRegistry;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'outgoing_email_test' => fn () => $request->session()->get('outgoing_email_test'),
                'email_ingestion_test' => fn () => $request->session()->get('email_ingestion_test'),
                'email_ingestion_run' => fn () => $request->session()->get('email_ingestion_run'),
            ],
            'quickAccessShortcuts' => fn () => app(QuickAccessService::class)
                ->resolveForUser($request->user()),
            'projectNavigation' => fn () => app(ProjectModuleRegistry::class)
                ->navigation($request->user()),
            'branding' => fn () => PlunrSetting::valueFor('account'),
            'workspaceAppearance' => $request->session()->get('workspace_appearance', [
                'template_id' => 'default',
                'layout_id' => 'dual_sidebar_tabs_pie_dark_nav',
                'primary_color' => '#237d66',
                'sidebar_color' => '#0b0d18',
                'font_family' => 'jakarta',
                'font_size' => 'medium',
                'table_density' => 'comfortable',
                'off_canvas' => false,
                'off_canvas_keep_open' => false,
            ]),
            'plunrTheme' => config('plunr.theme', 'classic'),
            'installedTemplates' => [[
                'id' => 'default',
                'name' => 'Default',
                'version' => '1.0.0',
                'layouts' => collect([
                    'classic', 'classic_dark', 'dual_sidebar', 'dual_sidebar_dark',
                    'dual_sidebar_dark_nav', 'dual_sidebar_tabs', 'dual_sidebar_tabs_dark',
                    'dual_sidebar_tabs_dark_nav', 'dual_sidebar_tabs_pie',
                    'dual_sidebar_tabs_pie_dark', 'dual_sidebar_tabs_pie_dark_nav', 'pie',
                ])->map(fn (string $id) => ['id' => $id])->all(),
            ]],
        ];
    }
}
