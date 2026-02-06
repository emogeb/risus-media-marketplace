export type CustomerType = 'individual' | 'company'

export interface BaseCustomer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
}

export interface IndividualCustomer extends BaseCustomer {
  type: 'individual'
  firstName?: string
  lastName?: string
}

export interface CompanyCustomer extends BaseCustomer {
  type: 'company'
  companyName: string
  taxNumber?: string
  contactPerson?: string
}

export type Customer = IndividualCustomer | CompanyCustomer

export interface CustomersResponse {
  data: Customer[]
  total: number
  page: number
  pageSize: number
}

export interface CustomersQueryParams {
  type?: CustomerType
  page?: number
  pageSize?: number
  search?: string
}
