<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('users') || Schema::hasColumn('users', 'quick_access')) {
            return;
        }

        Schema::table('users', function (Blueprint $table): void {
            $table->json('quick_access')->nullable();
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('users') || ! Schema::hasColumn('users', 'quick_access')) {
            return;
        }

        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('quick_access');
        });
    }
};
