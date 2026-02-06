# Entity Relationship Diagram (ERD)
## Multi-Vendor Fashion Marketplace Platform

```mermaid
erDiagram
    %% =====================
    %% IDENTITY & STORES
    %% =====================
    User ||--o{ Store : "owns (1:N)"
    User {
        bigint id PK
        string email UK
        string type
        string seller_kind
        string status
        timestamp created_at
        timestamp updated_at
    }
    
    Store {
        bigint id PK
        bigint owner_user_id FK
        string name
        string slug UK
        json address_json
        string status
        timestamp created_at
        timestamp updated_at
    }
    
    %% =====================
    %% CATEGORIES & PRODUCTS
    %% =====================
    Category ||--o{ Category : "parent (self-ref)"
    Category ||--o{ Product : "has (1:N)"
    Store ||--o{ Product : "sells (1:N)"
    Product ||--|| ProductDescription : "has (1:1)"
    Product ||--o{ ProductMedia : "has (1:N)"
    ProductVariant ||--o{ ProductMedia : "has (0:N)"
    
    Category {
        bigint id PK
        bigint parent_id FK "nullable"
        string name
        string slug UK
        int sort_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    Product {
        bigint id PK
        bigint store_id FK
        bigint category_id FK
        string name
        string slug "UK per store"
        string status
        decimal base_price
        string currency
        boolean made_to_order
        int lead_time_days
        boolean has_variants
        timestamp created_at
        timestamp updated_at
    }
    
    ProductDescription {
        bigint id PK
        bigint product_id FK "UK"
        text short_text
        text long_text
        text care_text
        string meta_title
        text meta_description
        timestamp created_at
        timestamp updated_at
    }
    
    ProductMedia {
        bigint id PK
        bigint product_id FK
        bigint variant_id FK "nullable"
        string type
        string path
        string alt_text
        int sort_order
        timestamp created_at
        timestamp updated_at
    }
    
    %% =====================
    %% ATTRIBUTES & FILTERING
    %% =====================
    Attribute ||--o{ AttributeValue : "has (1:N)"
    Category ||--o{ CategoryAttribute : "has (M:N)"
    Attribute ||--o{ CategoryAttribute : "belongs to (M:N)"
    Product ||--o{ ProductAttributeValue : "has (1:N)"
    Attribute ||--o{ ProductAttributeValue : "used by (1:N)"
    AttributeValue ||--o{ ProductAttributeValue : "used by (0:N)"
    
    Attribute {
        bigint id PK
        string code UK
        string name
        string data_type
        boolean is_filterable
        boolean is_variant
        int sort_order
        timestamp created_at
        timestamp updated_at
    }
    
    AttributeValue {
        bigint id PK
        bigint attribute_id FK
        string value
        string slug
        int sort_order
        timestamp created_at
        timestamp updated_at
    }
    
    CategoryAttribute {
        bigint category_id PK "FK"
        bigint attribute_id PK "FK"
        boolean is_required
        int sort_order
        timestamp created_at
        timestamp updated_at
    }
    
    ProductAttributeValue {
        bigint id PK
        bigint product_id FK
        bigint attribute_id FK
        bigint attribute_value_id FK "nullable"
        text value_text "nullable"
        decimal value_number "nullable"
        boolean value_boolean "nullable"
        timestamp created_at
        timestamp updated_at
    }
    
    %% =====================
    %% VARIANTS
    %% =====================
    Product ||--o{ ProductVariant : "has (1:N)"
    ProductVariant ||--o{ VariantOption : "has (M:N)"
    Attribute ||--o{ VariantOption : "used by (M:N)"
    AttributeValue ||--o{ VariantOption : "used by (M:N)"
    
    ProductVariant {
        bigint id PK
        bigint product_id FK
        string sku UK
        decimal price "nullable"
        string currency
        decimal compare_at_price
        int stock_quantity
        string stock_status
        boolean is_default
        string variant_signature
        timestamp created_at
        timestamp updated_at
    }
    
    VariantOption {
        bigint variant_id PK "FK"
        bigint attribute_id PK "FK"
        bigint attribute_value_id FK
    }
    
    %% =====================
    %% ORDERS (MARKETPLACE)
    %% =====================
    User ||--o{ Order : "places (1:N)"
    Order ||--o{ OrderStore : "contains (1:N)"
    Store ||--o{ OrderStore : "fulfills (1:N)"
    OrderStore ||--o{ OrderItem : "contains (1:N)"
    Product ||--o{ OrderItem : "referenced by (1:N)"
    ProductVariant ||--o{ OrderItem : "referenced by (0:N)"
    OrderItem ||--o| OrderItemMeasurement : "has (1:0..1)"
    
    Order {
        bigint id PK
        bigint user_id FK
        string status
        string currency
        decimal subtotal
        decimal shipping_total
        decimal tax_total
        decimal grand_total
        json shipping_address_json
        json billing_address_json
        string payment_status
        timestamp created_at
        timestamp updated_at
    }
    
    OrderStore {
        bigint id PK
        bigint order_id FK
        bigint store_id FK
        string status
        decimal subtotal
        decimal shipping_total
        decimal tax_total
        decimal grand_total
        string tracking_code
        timestamp created_at
        timestamp updated_at
    }
    
    OrderItem {
        bigint id PK
        bigint order_id FK
        bigint order_store_id FK
        bigint store_id FK
        bigint product_id FK
        bigint variant_id FK "nullable"
        int qty
        decimal unit_price
        string currency
        string title_snapshot
        json variant_snapshot
        decimal line_total
        text notes
        timestamp created_at
        timestamp updated_at
    }
    
    OrderItemMeasurement {
        bigint id PK
        bigint order_item_id FK "UK"
        json data
        timestamp created_at
        timestamp updated_at
    }
```

## Key Relationships Summary

### Identity & Stores
- **User 1 → N Store**: A user can own multiple stores

### Categories & Products
- **Category 1 → N Category**: Self-referential hierarchy (parent_id)
- **Category 1 → N Product**: Products belong to categories
- **Store 1 → N Product**: Products belong to stores
- **Product 1 → 1 ProductDescription**: One-to-one product descriptions
- **Product 1 → N ProductMedia**: Products have multiple media items
- **ProductVariant 0 → N ProductMedia**: Variants can have their own media

### Attributes & Filtering
- **Attribute 1 → N AttributeValue**: Attributes have multiple possible values
- **Category M → N Attribute**: Categories can have multiple attributes (via CategoryAttribute pivot)
- **Product 1 → N ProductAttributeValue**: Products have attribute values
- **Attribute 1 → N ProductAttributeValue**: Attributes are used by products
- **AttributeValue 0 → N ProductAttributeValue**: Attribute values are used (nullable if text/number/boolean)

### Variants
- **Product 1 → N ProductVariant**: Products have variants
- **ProductVariant M → N Attribute M → N AttributeValue**: Variants have options (via VariantOption pivot)

### Orders (Marketplace)
- **User 1 → N Order**: Users place orders
- **Order 1 → N OrderStore**: Orders contain store-level sub-orders
- **Store 1 → N OrderStore**: Stores fulfill store-level orders
- **OrderStore 1 → N OrderItem**: Store orders contain items
- **Product 1 → N OrderItem**: Order items reference products (read-only snapshot)
- **ProductVariant 0 → N OrderItem**: Order items may reference variants (read-only snapshot)
- **OrderItem 1 → 0..1 OrderItemMeasurement**: Order items may have custom measurements

## Important Notes

1. **Products do NOT directly connect to Attributes or AttributeValues** - all connections go through ProductAttributeValue
2. **Orders do NOT directly connect to Products or ProductVariants** - OrderItem is the only bridge, storing snapshots
3. **Marketplace entities (Orders) are separated from catalog entities (Products)** while maintaining proper relationships through OrderItem
