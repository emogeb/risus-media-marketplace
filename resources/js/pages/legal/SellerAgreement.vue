<template>
  <LegalPageTemplate title="Satıcı Sözleşmesi">
    <div class="space-y-6">
      <section>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Satıcı Yükümlülükleri</h2>
        <p class="text-gray-700 mb-4">
          Platformda satış yapan satıcılar, ürün kalitesi, teslimat süreleri ve müşteri memnuniyetinden sorumludur.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Komisyon Yapısı</h2>
        <p class="text-gray-700 mb-4">
          Satış tutarının belirli bir yüzdesi platform komisyonu olarak alınmaktadır. Detaylar için <a href="/seller/commissions" class="text-blue-600 hover:underline">komisyon sayfasına</a> bakınız.
        </p>
      </section>
    </div>
  </LegalPageTemplate>
</template>

<script setup lang="ts">
import LegalPageTemplate from './LegalPageTemplate.vue'
</script>
