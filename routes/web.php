<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SettingsFormController;
use App\Http\Controllers\SettingsQuickAccessController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)
        ->name('dashboard');

    Route::get('/notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');

    Route::get('/notifications/latest', [NotificationController::class, 'latest'])
        ->name('notifications.latest');

    Route::post('/notifications/mark-read', [NotificationController::class, 'markRead'])
        ->name('notifications.mark-read');

    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllRead'])
        ->name('notifications.mark-all-read');

    Route::post('/notifications/delete', [NotificationController::class, 'delete'])
        ->name('notifications.delete');

    Route::get('/settings', [SettingsController::class, 'index'])
        ->name('settings.index');

    Route::put('/settings/quick-access', [SettingsQuickAccessController::class, 'update'])
        ->name('settings.quick-access.update');

    Route::put('/settings/account', [SettingsFormController::class, 'updateAccount'])->name('settings.account.update');
    Route::post('/settings/sidebar-branding', [SettingsFormController::class, 'updateSidebarBranding'])->name('settings.sidebar-branding.update');
    Route::put('/settings/localization', [SettingsFormController::class, 'updateLocalization'])->name('settings.localization.update');
    Route::post('/settings/currencies', [SettingsFormController::class, 'storeCurrency'])->name('settings.currencies.store');
    Route::put('/settings/currencies/{currency}', [SettingsFormController::class, 'updateCurrency'])->name('settings.currencies.update');
    Route::delete('/settings/currencies/{currency}', [SettingsFormController::class, 'destroyCurrency'])->name('settings.currencies.destroy');
    Route::post('/settings/countries', [SettingsFormController::class, 'storeCountry'])->name('settings.countries.store');
    Route::put('/settings/countries/{country}', [SettingsFormController::class, 'updateCountry'])->name('settings.countries.update');
    Route::delete('/settings/countries/{country}', [SettingsFormController::class, 'destroyCountry'])->name('settings.countries.destroy');
    Route::post('/settings/email-templates', [SettingsFormController::class, 'storeEmailTemplate'])->name('settings.email-templates.store');
    Route::put('/settings/email-templates/{template}', [SettingsFormController::class, 'updateEmailTemplate'])->name('settings.email-templates.update');
    Route::delete('/settings/email-templates/{template}', [SettingsFormController::class, 'destroyEmailTemplate'])->name('settings.email-templates.destroy');
    Route::post('/settings/email-templates/{template}/restore', [SettingsFormController::class, 'restoreEmailTemplate'])->name('settings.email-templates.restore');
    Route::put('/settings/menu-codes', [SettingsFormController::class, 'updateMenuCodes'])->name('settings.menu-codes.update');
    Route::put('/settings/ticket-automation', [SettingsFormController::class, 'updateTicketAutomation'])->name('settings.ticket-automation.update');
    Route::put('/settings/email-ingestion', [SettingsFormController::class, 'updateEmailIngestion'])->name('settings.email-ingestion.update');
    Route::put('/settings/outgoing-email', [SettingsFormController::class, 'updateOutgoingEmail'])->name('settings.outgoing-email.update');
    Route::post('/settings/notifications/test-reminder', [SettingsFormController::class, 'testReminder'])->name('settings.notifications.test-reminder');
    Route::post('/settings/notifications/test-email-connection', [SettingsFormController::class, 'testOutgoingEmail'])->name('settings.notifications.test-email-connection');
    Route::post('/settings/email-ingestion/test', [SettingsFormController::class, 'testEmailIngestion'])->name('settings.email-ingestion.test');
    Route::post('/settings/email-ingestion/run', [SettingsFormController::class, 'runEmailIngestion'])->name('settings.email-ingestion.run');
    Route::delete('/settings/security/trusted-devices/{device}', [SettingsFormController::class, 'destroyTrustedDevice'])->name('settings.security.trusted-devices.destroy');
    Route::post('/settings/security/browser-sessions/logout-other', [SettingsFormController::class, 'logoutOtherSessions'])->name('settings.security.browser-sessions.logout-other');

    Route::get('/settings/ai', [SettingsFormController::class, 'aiShow'])->name('settings.ai.show');
    Route::post('/settings/ai', [SettingsFormController::class, 'aiStore'])->name('settings.ai.store');
    Route::post('/settings/ai/test-connection', [SettingsFormController::class, 'aiTest'])->name('settings.ai.test');
    Route::post('/settings/ai/toggle-status', [SettingsFormController::class, 'aiToggleStatus'])->name('settings.ai.toggle-status');
    Route::post('/settings/ai/toggle-assistant', [SettingsFormController::class, 'aiToggleAssistant'])->name('settings.ai.toggle-assistant');
    Route::post('/settings/ai/reset-usage', [SettingsFormController::class, 'aiResetUsage'])->name('settings.ai.reset-usage');

    Route::put('/workspace-settings/appearance', function (Request $request) {
        $appearance = $request->validate([
            'template_id' => ['required', 'string'],
            'layout_id' => ['required', 'string'],
            'primary_color' => ['required', 'string'],
            'sidebar_color' => ['required', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'font_family' => ['required', 'string'],
            'font_size' => ['required', 'string'],
            'table_density' => ['required', 'string'],
            'off_canvas' => ['required', 'boolean'],
            'off_canvas_keep_open' => ['required', 'boolean'],
        ]);

        $request->session()->put('workspace_appearance', $appearance);

        return back();
    })->name('settings.workspace.appearance.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

require __DIR__.'/auth.php';
