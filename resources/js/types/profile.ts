// Profile-related type definitions

export interface User {
    id: number;
    name: string;
    email: string;
    customer_profile?: CustomerProfile;
}

export interface CustomerProfile {
    id: number;
    user_id: number;
    company_name?: string;
    tax_number?: string;
    first_name?: string;
    last_name?: string;
    address?: string;
    phone?: string;
    email?: string;
}

export interface ProfileUpdateData {
    name: string;
    email: string;
    company_name?: string;
    tax_number?: string;
}

export interface PasswordUpdateData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface Order {
    id: number;
    formatted_date: string;
    formatted_total: string;
    status: string;
}
