<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plunr_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->timestamps();
        });

        Schema::create('plunr_currencies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 3)->unique();
            $table->string('symbol', 12);
            $table->string('status', 16)->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('plunr_countries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('country_code', 2)->unique();
            $table->string('currency', 3);
            $table->string('status', 16)->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('plunr_email_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('key')->unique();
            $table->string('module', 48)->default('common');
            $table->string('subject');
            $table->longText('body_html');
            $table->json('variables')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plunr_email_templates');
        Schema::dropIfExists('plunr_countries');
        Schema::dropIfExists('plunr_currencies');
        Schema::dropIfExists('plunr_settings');
    }
};
