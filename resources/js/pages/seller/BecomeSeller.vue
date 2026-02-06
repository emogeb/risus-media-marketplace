<template>
  <LegalPageTemplate title="Satıcı Olun">
    <div class="space-y-8">
      <section class="text-center py-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Platformumuza Katılın</h2>
        <p class="text-lg text-gray-600 mb-8">
          Binlerce müşteriye ulaşın, işinizi büyütün
        </p>
      </section>

      <section>
        <h3 class="text-2xl font-semibold text-gray-900 mb-4">Avantajlar</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="p-6 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-2">Geniş Müşteri Kitlesi</h4>
            <p class="text-gray-700">Binlerce potansiyel müşteriye ulaşın</p>
          </div>
          <div class="p-6 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-2">Kolay Yönetim</h4>
            <p class="text-gray-700">Satıcı panelinden kolayca yönetin</p>
          </div>
          <div class="p-6 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-2">Güvenli Ödeme</h4>
            <p class="text-gray-700">Ödemeleriniz güvence altında</p>
          </div>
          <div class="p-6 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-2">Destek Ekibi</h4>
            <p class="text-gray-700">7/24 teknik ve operasyonel destek</p>
          </div>
        </div>
      </section>

      <section class="text-center">
        <a href="/admin/register" class="inline-block px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-lg font-semibold">
          Hemen Başvur
        </a>
      </section>
    </div>
  </LegalPageTemplate>
</template>

<script setup lang="ts">
import LegalPageTemplate from '../legal/LegalPageTemplate.vue'
</script>
