<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class VariantOption extends Pivot
{
    /** @use HasFactory<\Database\Factories\VariantOptionFactory> */
    use HasFactory;

    protected $table = 'variant_options';

    public $incrementing = false;

    protected $primaryKey = ['variant_id', 'attribute_id'];

    protected $fillable = [
        'variant_id',
        'attribute_id',
        'attribute_value_id',
    ];

    /**
     * Get the variant.
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    /**
     * Get the attribute.
     */
    public function attribute(): BelongsTo
    {
        return $this->belongsTo(Attribute::class, 'attribute_id');
    }

    /**
     * Get the attribute value.
     */
    public function value()
    {
        return $this->belongsTo(AttributeValue::class, 'attribute_value_id');
    }
}
