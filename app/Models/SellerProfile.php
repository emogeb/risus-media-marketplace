<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerProfile extends Model
{
    /** @use HasFactory<\Database\Factories\SellerProfileFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tax_number',
        'company_name',
        'address',
        'phone',
        'email',
    ];

    /**
     * Get the user that owns the seller profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
