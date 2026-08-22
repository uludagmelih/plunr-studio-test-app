<?php

namespace App\Http\Controllers;

use App\Services\QuickAccessService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SettingsQuickAccessController extends Controller
{
    public function __construct(
        private readonly QuickAccessService $quickAccessService,
    ) {}

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user !== null, 403);

        $validated = $request->validate([
            'items' => ['required', 'array', 'max:12'],
            'items.*.key' => ['required', 'string', 'max:64'],
            'items.*.icon' => ['nullable', 'string', 'max:64'],
            'items.*.tone' => ['nullable', 'string', 'max:32'],
        ]);

        $this->quickAccessService->updateForUser($user, $validated['items']);

        return back()->with('success', 'Quick access shortcuts updated.');
    }
}
