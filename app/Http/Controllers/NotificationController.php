<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeleteNotificationsRequest;
use App\Http\Requests\MarkNotificationsReadRequest;
use App\Http\Requests\NotificationIndexRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(NotificationIndexRequest $request): Response
    {
        $user = $request->user();
        $validated = $request->validated();
        $filters = [
            'search' => trim((string) ($validated['search'] ?? '')),
            'type' => (string) ($validated['type'] ?? 'all'),
            'read' => (string) ($validated['read'] ?? 'all'),
            'per_page' => (int) ($validated['per_page'] ?? 10),
            'start_date' => (string) ($validated['start_date'] ?? ''),
            'end_date' => (string) ($validated['end_date'] ?? ''),
        ];

        $notifications = $this->applyFilters(
            $user->notifications()->whereNull('archived_at')->latest(),
            $filters,
        )->paginate($filters['per_page'])->withQueryString()
            ->through(fn ($item) => $this->transformNotification($item));

        $eventTypes = $user->notifications()
            ->whereNull('archived_at')
            ->reorder()
            ->select('data->event_type as event_type')
            ->whereNotNull('data->event_type')
            ->distinct()
            ->orderBy('event_type')
            ->pluck('event_type')
            ->values();

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $this->countUnread($user),
            'filters' => $filters,
            'eventTypes' => $eventTypes,
        ]);
    }

    public function latest(Request $request): JsonResponse
    {
        $user = $request->user();
        $items = $user->notifications()->whereNull('archived_at')->latest()->limit(5)->get()
            ->map(fn ($item) => $this->transformNotification($item))->values();

        return response()->json([
            'items' => $items,
            'unread_count' => $this->countUnread($user),
        ]);
    }

    public function markRead(MarkNotificationsReadRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->notifications()->whereNull('archived_at')->whereNull('read_at')
            ->whereIn('id', $request->validated('ids'))->update(['read_at' => now()]);

        return response()->json(['success' => true, 'unread_count' => $this->countUnread($user)]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->notifications()->whereNull('archived_at')->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['success' => true, 'unread_count' => 0]);
    }

    public function delete(DeleteNotificationsRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();
        $query = ($validated['all_filtered'] ?? false)
            ? $this->applyFilters($user->notifications()->whereNull('archived_at'), $validated)
            : $user->notifications()->whereIn('id', (array) ($validated['ids'] ?? []));

        if ($validated['mode'] === 'hard') {
            $query->delete();
        } else {
            $query->update(['archived_at' => now()]);
        }

        return response()->json(['success' => true, 'unread_count' => $this->countUnread($user)]);
    }

    private function transformNotification(object $notification): array
    {
        $data = (array) ($notification->data ?? []);

        return [
            'id' => $notification->id,
            'event_type' => (string) ($data['event_type'] ?? 'general'),
            'title' => (string) ($data['title'] ?? 'Notification'),
            'message' => (string) ($data['message'] ?? ''),
            'ticket_id' => $data['ticket_id'] ?? null,
            'ticket_title' => $data['ticket_title'] ?? null,
            'url' => (string) ($data['url'] ?? ''),
            'read_at' => $notification->read_at,
            'created_at' => $notification->created_at,
        ];
    }

    private function countUnread(object $user): int
    {
        return (int) $user->notifications()->whereNull('archived_at')->whereNull('read_at')->count();
    }

    private function applyFilters($query, array $filters)
    {
        $search = trim((string) ($filters['search'] ?? ''));
        $type = (string) ($filters['type'] ?? 'all');
        $read = (string) ($filters['read'] ?? 'all');

        if ($read === 'unread') {
            $query->whereNull('read_at');
        } elseif ($read === 'read') {
            $query->whereNotNull('read_at');
        }
        if ($type !== '' && $type !== 'all') {
            $query->where('data->event_type', $type);
        }
        if (! empty($filters['start_date'])) {
            $query->where('created_at', '>=', Carbon::parse($filters['start_date'])->startOfDay());
        }
        if (! empty($filters['end_date'])) {
            $query->where('created_at', '<=', Carbon::parse($filters['end_date'])->endOfDay());
        }
        if ($search !== '') {
            $query->where(function (Builder $inner) use ($search): void {
                $inner->where('data->title', 'like', "%{$search}%")
                    ->orWhere('data->message', 'like', "%{$search}%")
                    ->orWhere('data->ticket_title', 'like', "%{$search}%");
            });
        }

        return $query;
    }
}
