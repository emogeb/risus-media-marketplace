<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerProfile extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerProfileFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'customer_type',
        'tax_number',
        'company_name',
        'first_name',
        'last_name',
        'address',
        'phone',
        'email',
    ];

    /**
     * Get the user that owns the customer profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
