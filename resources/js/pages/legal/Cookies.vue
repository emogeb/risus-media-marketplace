<template>
  <LegalPageTemplate title="Çerez Politikası">
    <div class="space-y-6">
      <section>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Çerezler Nedir?</h2>
        <p class="text-gray-700 mb-4">
          Çerezler, web sitelerinin kullanıcı deneyimini iyileştirmek için kullandığı küçük metin dosyalarıdır.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Kullanılan Çerez Türleri</h2>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>Zorunlu Çerezler:</strong> Sitenin çalışması için gereklidir</li>
          <li><strong>Performans Çerezleri:</strong> Site performansını ölçmek için kullanılır</li>
          <li><strong>Fonksiyonel Çerezler:</strong> Kullanıcı tercihlerini hatırlar</li>
          <li><strong>Reklam Çerezleri:</strong> Kişiselleştirilmiş reklamlar için</li>
        </ul>
      </section>
    </div>
  </LegalPageTemplate>
</template>

<script setup lang="ts">
import LegalPageTemplate from './LegalPageTemplate.vue'
</script>
