<template>
  <LegalPageTemplate title="Gizlilik Politikası">
    <div class="space-y-6">
      <section>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Kişisel Verilerin Korunması</h2>
        <p class="text-gray-700 mb-4">
          Kişisel verilerinizin güvenliği ve gizliliği önceliğimizdir. Bu politika, toplanan verilerin nasıl kullanıldığını açıklar.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Toplanan Bilgiler</h2>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li>İsim ve iletişim bilgileri</li>
          <li>Sipariş geçmişi</li>
          <li>Ödeme bilgileri (güvenli şekilde saklanır)</li>
          <li>Çerez verileri</li>
        </ul>
      </section>
    </div>
  </LegalPageTemplate>
</template>

<script setup lang="ts">
import LegalPageTemplate from './LegalPageTemplate.vue'
</script>
