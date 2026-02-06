<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $input['is_company'] = filter_var($input['is_company'] ?? false, FILTER_VALIDATE_BOOLEAN);

        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone' => ['required', 'string', 'max:255'],
            'is_company' => ['boolean'],
            'company_name' => ['nullable', 'required_if:is_company,true', 'string', 'max:255'],
            'tax_number' => ['nullable', 'required_if:is_company,true', 'string', 'max:255'],
            'address' => ['nullable', 'required_if:is_company,true', 'string'],
            'password' => $this->passwordRules(),
        ])->validate();

        return \Illuminate\Support\Facades\DB::transaction(function () use ($input) {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => \Illuminate\Support\Facades\Hash::make($input['password']),
                'type' => User::TYPE_CUSTOMER,
                'status' => 'active',
            ]);

            $user->customerProfile()->create([
                'customer_type' => $input['is_company'] ? 'business' : 'retail',
                'first_name' => $input['is_company'] ? null : $input['name'], // Basitlik için name'i kullanıyoruz, ileride ayrılabilir
                'last_name' => null, // Şimdilik boş
                'company_name' => $input['is_company'] ? $input['company_name'] : null,
                'tax_number' => $input['is_company'] ? $input['tax_number'] : null,
                'address' => $input['address'] ?? null, // Bireysel için opsiyonel olabilir şimdilik
                'phone' => $input['phone'],
                'email' => $input['email'],
            ]);

            return $user;
        });
    }
}
