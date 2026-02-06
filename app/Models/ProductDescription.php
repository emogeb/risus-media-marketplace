<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductDescription extends Model
{
    /** @use HasFactory<\Database\Factories\ProductDescriptionFactory> */
    use HasFactory;

    protected $fillable = [
        'product_id',
        'short_text',
        'long_text',
        'care_text',
        'meta_title',
        'meta_description',
    ];

    /**
     * Get the product that owns the description.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
