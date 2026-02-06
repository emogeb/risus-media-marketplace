<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Store extends Model
{
    /** @use HasFactory<\Database\Factories\StoreFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'owner_user_id',
        'name',
        'slug',
        'address_json',
        'status',
        'hero_video',
        'is_featured_on_hero',
        'hero_order',
        'bank_iban',
        'bank_qr_path',
        'bank_swiss_code',
    ];

    protected function casts(): array
    {
        return [
            'address_json' => 'array',
            'is_featured_on_hero' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the store.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function orderStores()
    {
        return $this->hasMany(OrderStore::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
