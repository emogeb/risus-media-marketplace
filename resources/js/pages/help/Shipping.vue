<script setup lang="ts">
import InfoPageTemplate from '@/components/shared/InfoPageTemplate.vue'
import InfoPageSection from '@/components/shared/InfoPageSection.vue'
import InfoCallout from '@/components/shared/InfoCallout.vue'
import InfoPageCTA from '@/components/shared/InfoPageCTA.vue'

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Yardım', href: '/help/faq' },
  { label: 'Kargo ve Teslimat' },
]

const tocItems = [
  { id: 'kargo-suresi', text: 'Teslimat Süreleri', level: 2 },
  { id: 'kargo-ucreti', text: 'Kargo Ücretleri', level: 2 },
  { id: 'kargo-firmalar', text: 'Kargo Firmaları', level: 2 },
  { id: 'ozel-dikim', text: 'Özel Dikim Teslimat', level: 2 },
  { id: 'kargo-takip', text: 'Kargo Takibi', level: 2 },
]
</script>

<template>
  <InfoPageTemplate
    title="Kargo ve Teslimat"
description="Siparişlerinizin kargo ve teslimat süreci hakkında bilgiler"
    :breadcrumbs="breadcrumbs"
    :toc-items="tocItems"
  >
    <InfoPageSection id="kargo-suresi" title="Teslimat Süreleri" :level="2">
      <p>
        Teslimat süreleri ürün tipine ve stok durumuna göre değişiklik göstermektedir:
      </p>
      <ul>
        <li><strong>Hazır Ürünler:</strong> 2-5 iş günü</li>
        <li><strong>Özel Dikim (Made-to-Order):</strong> 2-6 ay (ürüne göre değişir)</li>
        <li><strong>Aksesuarlar:</strong> 1-3 iş günü</li>
      </ul>
      <p>
        Sipariş verdikten sonra satıcı ürünü hazırlar ve kargo firmasına teslim eder. Kargo firması 
        tarafından tahmini teslimat süresi size bildirilir.
      </p>
      <InfoCallout type="warning" title="Önemli">
        Gelinlik gibi özel dikim ürünlerde teslimat süresi uzun olabilir. Düğün tarihinizi göz önünde 
        bulundurarak en az 6 ay öncesinden sipariş vermenizi öneririz.
      </InfoCallout>
    </InfoPageSection>

    <InfoPageSection id="kargo-ucreti" title="Kargo Ücretleri" :level="2">
      <p>
        <strong>Kargo Ücreti Hesaplama:</strong>
      </p>
      <ul>
        <li>500 TL ve üzeri alışverişlerde <strong>kargo ücretsiz</strong></li>
        <li>500 TL altı alışverişlerde sabit 29.90 TL kargo ücreti</li>
        <li>Özel paketleme talepleri için ek ücret uygulanabilir</li>
      </ul>
      <p>
        Kargo ücreti sepet tutarınıza göre otomatik olarak hesaplanır ve ödeme adımında görüntülenir.
      </p>
    </InfoPageSection>

    <InfoPageSection id="kargo-firmalar" title="Kargo Firmaları" :level="2">
      <p>
        Güvenli teslimat için anlaşmalı olduğumuz kargo firmaları:
      </p>
      <ul>
        <li><strong>Aras Kargo:</strong> Türkiye geneli teslimat</li>
        <li><strong>Yurtiçi Kargo:</strong> Hızlı teslimat seçeneği</li>
        <li><strong>MNG Kargo:</strong> Ekonomik kargo seçeneği</li>
        <li><strong>PTT Kargo:</strong> Ulaşılması zor bölgeler için</li>
      </ul>
      <p>
        Satıcı, ürünün özelliğine ve teslimat adresinize göre en uygun kargo firmasını seçer.
      </p>
      <InfoCallout type="info" title="Kargo Sigortası">
        Tüm gönderi lerimiz kargo sigortası ile güvence altındadır. Hasarlı teslimat durumunda ücretsiz iade hakkınız vardır.
      </InfoCallout>
    </InfoPageSection>

    <InfoPageSection id="ozel-dikim" title="Özel Dikim Teslimat" :level="2">
      <p>
        Özel dikim (made-to-order) ürünler sipariş üzerine üretildiği için teslimat süresi daha uzundur:
      </p>
      <p>
        <strong>Özel Dikim Süreci:</strong>
      </p>
      <ol class="list-decimal list-inside space-y-2">
        <li>Sipariş onayı ve ölçü bilgilerinizin alınması (1-2 gün)</li>
        <li>Üretim süreci (ürüne göre 1-5 ay)</li>
        <li>Kalite kontrol ve paketleme (3-5 gün)</li>
        <li>Kargo teslimatı (2-5 gün)</li>
      </ol>
      <p>
        Satıcı üretim sürecinde sizi düzenli olarak bilgilendirir ve ara fotoğraflar gönderebilir.
      </p>
    </InfoPageSection>

    <InfoPageSection id="kargo-takip" title="Kargo Takibi" :level="2">
      <p>
        Siparişiniz kargoya verildikten sonra kargo takip numaranız size e-posta ve SMS ile iletilir.
      </p>
      <p>
        <strong>Takip Yöntemleri:</strong>
      </p>
      <ul>
        <li>"Hesabım" > "Siparişlerim" sayfasından canlı takip</li>
        <li>Kargo firmasının web sitesi veya mobil uygulaması</li>
        <li>Kargo firmasının müşteri hizmetleri</li>
      </ul>
      <p>
        Teslimat sırasında sorun yaşarsanız hemen müşteri hizmetlerimiz ile iletişime geçin.
      </p>
    </InfoPageSection>

    <InfoPageCTA
      title="Kargo ile İlgili Sorunuz mu Var?"
      description="Size yardımcı olmaktan mutluluk duyarız."
      button-text="İletişim"
      button-href="/help/contact"
      variant="primary"
    />
  </InfoPageTemplate>
</template>
