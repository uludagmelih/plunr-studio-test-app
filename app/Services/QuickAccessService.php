<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Plunr\AdminStarterKit\ProjectModuleRegistry;

class QuickAccessService
{
    public function __construct(private readonly ProjectModuleRegistry $modules) {}
    /**
     * @return array<string, array{key: string, label: string, route: string, route_params?: array<string, mixed>, icon: string, tone: string}>
     */
    public function catalog(): array
    {
        return [
            'dashboard' => $this->item('dashboard', 'Dashboard', 'dashboard', 'BarChart3', 'sky'),
            'users' => $this->item('users', 'Users', 'iam.users.index', 'Users', 'sky'),
            'groups' => $this->item('groups', 'Groups', 'iam.groups.index', 'Building2', 'slate'),
            'roles' => $this->item('roles', 'Roles', 'iam.roles.index', 'Wrench', 'rose'),
            'api-keys' => $this->item('api-keys', 'API Keys & Tokens', 'iam.integrations.show', 'Plug', 'primary', ['page' => 'api-keys']),
            'webhooks' => $this->item('webhooks', 'Webhooks', 'iam.integrations.show', 'Sparkles', 'emerald', ['page' => 'webhooks']),
            'settings' => $this->item('settings', 'Settings', 'settings.index', 'Settings', 'slate'),
            ...$this->modules->quickAccessCatalog(request()->user()),
        ];
    }

    /** @return list<string> */
    public function iconOptions(): array
    {
        return [
            'BarChart3', 'Box', 'Building2', 'Cog', 'FileText', 'FolderTree',
            'Home', 'LayoutGrid', 'Package', 'Plug', 'Plus', 'Settings',
            'Sparkles', 'Truck', 'Users', 'Wallet', 'Wrench',
        ];
    }

    /** @return list<string> */
    public function toneOptions(): array
    {
        return ['primary', 'emerald', 'sky', 'amber', 'rose', 'slate'];
    }

    /** @return list<array{key: string, icon: string, tone: string}> */
    public function defaults(): array
    {
        return [
            ['key' => 'dashboard', 'icon' => 'BarChart3', 'tone' => 'sky'],
            ['key' => 'settings', 'icon' => 'Settings', 'tone' => 'slate'],
        ];
    }

    /** @return list<array{key: string, label: string, href: string, icon: string, tone: string}> */
    public function resolveForUser(?User $user): array
    {
        if (! $user) {
            return [];
        }

        $catalog = $this->catalog();
        $stored = $this->normalizeStored($user->quick_access);
        $items = $stored !== [] ? $stored : $this->defaults();
        $resolved = [];

        foreach ($items as $item) {
            $key = $item['key'];
            if (! isset($catalog[$key]) || ! Route::has($catalog[$key]['route'])) {
                continue;
            }

            $meta = $catalog[$key];
            $icon = in_array($item['icon'], $this->iconOptions(), true) ? $item['icon'] : $meta['icon'];
            $tone = in_array($item['tone'], $this->toneOptions(), true) ? $item['tone'] : $meta['tone'];

            $resolved[] = [
                'key' => $key,
                'label' => $meta['label'],
                'href' => route($meta['route'], $meta['route_params'] ?? []),
                'icon' => $icon,
                'tone' => $tone,
            ];
        }

        return $resolved;
    }

    /** @return list<array{key: string, label: string, icon: string, tone: string, available: bool}> */
    public function catalogForSettings(): array
    {
        return collect($this->catalog())
            ->map(static fn (array $meta): array => [
                'key' => $meta['key'],
                'label' => $meta['label'],
                'icon' => $meta['icon'],
                'tone' => $meta['tone'],
                'available' => Route::has($meta['route']),
            ])
            ->values()
            ->all();
    }

    /**
     * @param list<array{key?: string, icon?: string, tone?: string}> $items
     * @return list<array{key: string, icon: string, tone: string}>
     */
    public function sanitizeItems(array $items): array
    {
        $catalog = $this->catalog();
        $seen = [];
        $clean = [];

        foreach ($items as $item) {
            $key = (string) ($item['key'] ?? '');
            if ($key === '' || ! isset($catalog[$key]) || isset($seen[$key])) {
                continue;
            }

            $icon = (string) ($item['icon'] ?? $catalog[$key]['icon']);
            $tone = (string) ($item['tone'] ?? $catalog[$key]['tone']);
            $seen[$key] = true;
            $clean[] = [
                'key' => $key,
                'icon' => in_array($icon, $this->iconOptions(), true) ? $icon : $catalog[$key]['icon'],
                'tone' => in_array($tone, $this->toneOptions(), true) ? $tone : $catalog[$key]['tone'],
            ];
        }

        return array_slice($clean, 0, 12);
    }

    public function updateForUser(User $user, array $items): void
    {
        $user->forceFill(['quick_access' => $this->sanitizeItems($items)])->save();
    }

    /** @return list<array{key: string, icon: string, tone: string}> */
    private function normalizeStored(mixed $stored): array
    {
        return is_array($stored) ? $this->sanitizeItems($stored) : [];
    }

    /** @return array{key: string, label: string, route: string, route_params?: array<string, mixed>, icon: string, tone: string} */
    private function item(string $key, string $label, string $route, string $icon, string $tone, array $routeParams = []): array
    {
        return array_filter([
            'key' => $key,
            'label' => $label,
            'route' => $route,
            'route_params' => $routeParams ?: null,
            'icon' => $icon,
            'tone' => $tone,
        ], static fn (mixed $value): bool => $value !== null);
    }
}
