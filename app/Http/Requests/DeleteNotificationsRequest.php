<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeleteNotificationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'ids' => ['required_without:all_filtered', 'array', 'min:1'],
            'ids.*' => ['required_with:ids', 'string', 'max:64'],
            'mode' => ['required', 'in:soft,hard'],
            'all_filtered' => ['nullable', 'boolean'],
            'search' => ['nullable', 'string', 'max:150'],
            'type' => ['nullable', 'string', 'max:80'],
            'read' => ['nullable', 'in:all,unread,read'],
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:start_date'],
        ];
    }
}
