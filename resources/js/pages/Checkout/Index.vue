<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import Navbar from '@/components/layout/Navbar.vue';

interface Store {
  name: string;
  bank_iban: string | null;
  bank_swiss_code: string | null;
  bank_qr_url: string | null;
  company_name: string;
  tax_number: string;
}

interface CartItem {
  title: string;
  qty: number;
  price: number;
}

interface Cart {
  total: number;
  items: CartItem[];
}

interface Props {
  store: Store;
  cart: Cart;
}

const props = defineProps<Props>();

const formatPrice = (price: number) => {
  return price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
};
</script>

<template>
  <div class="min-h-screen bg-[#FDFCFB]">
    <Head title="Ödeme Bilgileri" />
    <Navbar />

    <div class="pt-32 pb-24 px-6">
      <div class="max-w-4xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-serif text-gray-900 mb-4 tracking-tight">Ödeme ve Banka Bilgileri</h1>
          <p class="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Siparişinizi tamamlamak için lütfen aşağıda belirtilen banka hesabına toplam tutarı gönderiniz.
            Ödeme açıklama kısmına sipariş numaranızı (veya isminizi) eklemeyi unutmayınız.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Left: Store & Bank Details -->
          <div class="space-y-8">
            <!-- Store Seller Info -->
            <div class="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-bold text-gray-900">{{ store.name }}</h2>
                  <p class="text-xs text-gray-500 uppercase tracking-widest font-medium">Satıcı Bilgileri</p>
                </div>
              </div>

              <div class="space-y-4 pt-4 border-t border-gray-50">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500">Firma Adı</span>
                  <span class="text-gray-900 font-semibold">{{ store.company_name }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500">Vergi Numarası</span>
                  <span class="text-gray-900 font-mono">{{ store.tax_number }}</span>
                </div>
              </div>
            </div>

            <!-- Bank Details -->
            <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
              <!-- Decorative element -->
              <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
              
              <h3 class="text-xl font-serif mb-8 flex items-center gap-3">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Banka Hesap Bilgileri
              </h3>

              <div class="space-y-6">
                <div>
                  <label class="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1 block">IBAN</label>
                  <p class="text-lg font-mono tracking-wider break-all bg-white/5 p-3 rounded-xl border border-white/10">
                    {{ store.bank_iban || 'Hesap bilgisi atanmamış' }}
                  </p>
                </div>

                <div v-if="store.bank_swiss_code">
                  <label class="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1 block">Swiss Code / BIC</label>
                  <p class="text-sm font-mono tracking-widest">{{ store.bank_swiss_code }}</p>
                </div>
              </div>

              <!-- QR Code if exists -->
              <div v-if="store.bank_qr_url" class="mt-8 pt-8 border-t border-white/10 flex items-center gap-6">
                <div class="p-3 bg-white rounded-2xl">
                  <img :src="store.bank_qr_url" alt="Bank QR" class="w-24 h-24 object-contain" />
                </div>
                <div>
                  <p class="text-xs text-gray-400 leading-relaxed">
                    Hızlı ödeme için banka uygulamanızdan <br/> QR kodu taratabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Summary & Total -->
          <div class="space-y-8">
            <div class="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h3 class="text-lg font-bold text-gray-900 mb-6">Sipariş Özeti</h3>
              
              <div class="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                <div v-for="(item, idx) in cart.items" :key="idx" class="flex justify-between items-start gap-4">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 line-clamp-1">{{ item.title }}</p>
                    <p class="text-xs text-gray-500">Adet: {{ item.qty }}</p>
                  </div>
                  <span class="text-sm font-semibold text-gray-900 text-right">{{ formatPrice(item.price * item.qty) }}</span>
                </div>
              </div>

              <div class="pt-6 border-t border-gray-100 space-y-4">
                <div class="flex justify-between items-center text-xl font-serif">
                  <span class="text-gray-900">Toplam Ödenecek</span>
                  <span class="text-black font-bold tracking-tight">{{ formatPrice(cart.total) }}</span>
                </div>

                <div class="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                  <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-xs text-blue-700 leading-relaxed">
                    Ödemeniz onaylandığında siparişiniz işleme alınacaktır. Dekontunuzu saklamayı unutmayınız.
                  </p>
                </div>

                <a 
                  href="/dashboard"
                  class="block w-full text-center py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-black/20"
                >
                  Ödemeyi Tamamladım, Ana Sayfaya Dön
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
</style>
