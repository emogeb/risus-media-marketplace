<script setup lang="ts">
import InfoPageTemplate from '@/components/shared/InfoPageTemplate.vue'
import InfoPageSection from '@/components/shared/InfoPageSection.vue'
import InfoCallout from '@/components/shared/InfoCallout.vue'
import InfoPageCTA from '@/components/shared/InfoPageCTA.vue'

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Yardım', href: '/help/faq' },
  { label: 'İletişim' },
]

const tocItems = [
  { id: 'iletisim-kanallari', text: 'İletişim Kanalları', level: 2 },
  { id: 'musteri-hizmetleri', text: 'Müşteri Hizmetleri', level: 2 },
  { id: 'sikca-sorulanlar', text: 'Sıkça Sorulan Sorular', level: 2 },
  { id: 'ofis-bilgileri', text: 'Ofis Bilgileri', level: 2 },
]
</script>

<template>
  <InfoPageTemplate
    title="İletişim"
    description="Bizimle iletişime geçmek için tüm kanallar"
    :breadcrumbs="breadcrumbs"
    :toc-items="tocItems"
  >
    <InfoPageSection id="iletisim-kanallari" title="İletişim Kanalları" :level="2">
      <p>
        Size en iyi hizmeti sunmak için birden fazla iletişim kanalı sunuyoruz:
      </p>
      <div class="grid md:grid-cols-2 gap-6 my-6">
        <div class="p-6 border border-border rounded-lg">
          <h4 class="font-semibold text-lg mb-2">📞 Telefon</h4>
          <p class="text-muted-foreground mb-2">Çağrı Merkezi (Hafta İçi 09:00-18:00)</p>
          <p class="font-semibold text-xl">0850 XXX XX XX</p>
        </div>
        <div class="p-6 border border-border rounded-lg">
          <h4 class="font-semibold text-lg mb-2">✉️ E-posta</h4>
          <p class="text-muted-foreground mb-2">24 saat içinde yanıt</p>
          <p class="font-semibold text-xl">destek@risusmedia.com</p>
        </div>
        <div class="p-6 border border-border rounded-lg">
          <h4 class="font-semibold text-lg mb-2">💬 Canlı Destek</h4>
          <p class="text-muted-foreground mb-2">Anında yanıt (09:00-22:00)</p>
          <a href="/help/live-support" class="text-primary hover:underline font-semibold">Sohbeti Başlat</a>
        </div>
        <div class="p-6 border border-border rounded-lg">
          <h4 class="font-semibold text-lg mb-2">📱 WhatsApp</h4>
          <p class="text-muted-foreground mb-2">Hızlı destek hattı</p>
          <p class="font-semibold text-xl">0532 XXX XX XX</p>
        </div>
      </div>
    </InfoPageSection>

    <InfoPageSection id="musteri-hizmetleri" title="Müşteri Hizmetleri" :level="2">
      <p>
        Müşteri hizmetleri ekibimiz aşağıdaki konularda size yardımcı olmaya hazır:
      </p>
      <ul>
        <li>Sipariş takibi ve durum sorgulama</li>
        <li>Ürün iade ve değişim işlemleri</li>
        <li>Ödeme ve fatura sorunları</li>
        <li>Ürün ve beden danışmanlığı</li>
        <li>Satıcı ile iletişim desteği</li>
        <li>Teknik destek ve hesap sorunları</li>
      </ul>
      <InfoCallout type="info" title="Hızlı Çözüm">
        Sipariş numaranızı veya hesap e-posta adresinizi hazır bulundurmanız süreci hızlandıracaktır.
      </InfoCallout>
    </InfoPageSection>

    <InfoPageSection id="sikca-sorulanlar" title="Sıkça Sorulan Sorular" :level="2">
      <p>
        Hemen yanıt almak isterseniz, Sıkça Sorulan Sorular sayfamızı ziyaret edebilirsiniz:
      </p>
      <ul>
        <li>Nasıl sipariş veririm?</li>
        <li>Kargo ne zaman gelir?</li>
        <li>İade nasıl yapılır?</li>
        <li>Ödeme seçenekleri nelerdir?</li>
        <li>Beden tablosu nasıl kullanılır?</li>
      </ul>
      <p class="mt-4">
        <a href="/help/faq" class="text-primary hover:underline font-semibold">
          Tüm Sıkça Sorulan Soruları Görüntüle →
        </a>
      </p>
    </InfoPageSection>

    <InfoPageSection id="ofis-bilgileri" title="Ofis Bilgileri" :level="2">
      <p>
        <strong>Risus Media Gelinlik Marketplace</strong>
      </p>
      <p class="mt-4">
        <strong>Adres:</strong><br>
        Örnek Mahallesi, Örnek Cadde No:123<br>
        Şişli / İstanbul<br>
        Türkiye
      </p>
      <p class="mt-4">
        <strong>Vergi Dairesi:</strong> Şişli Vergi Dairesi<br>
        <strong>Vergi No:</strong> 1234567890
      </p>
      <p class="mt-4">
        <strong>Çalışma Saatleri:</strong><br>
        Pazartesi - Cuma: 09:00 - 18:00<br>
        Cumartesi: 10:00 - 16:00<br>
        Pazar: Kapalı
      </p>
    </InfoPageSection>

    <InfoPageCTA
      title="Hemen İletişime Geçin"
      description="Sorularınız için bize ulaşın, size yardımcı olmaktan mutluluk duyarız."
      button-text="Canlı Destek"
      button-href="/help/live-support"
      variant="primary"
    />
  </InfoPageTemplate>
</template>
