<script setup lang="ts">
import InfoPageTemplate from '@/components/shared/InfoPageTemplate.vue'
import InfoPageSection from '@/components/shared/InfoPageSection.vue'
import InfoCallout from '@/components/shared/InfoCallout.vue'
import InfoPageCTA from '@/components/shared/InfoPageCTA.vue'

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Satıcı', href: '/become-seller' },
  { label: 'Komisyon Oranları' },
]

const tocItems = [
  { id: 'genel-bilgi', text: 'Genel Bilgiler', level: 2 },
  { id: 'kategori-komisyonlari', text: 'Kategori Bazlı Komisyonlar', level: 2 },
  { id: 'hacim-indirimi', text: 'Satış Hacmi İndirimleri', level: 2 },
  { id: 'odeme-sureci', text: 'Ödeme Süreci', level: 2 },
]
</script>

<template>
  <InfoPageTemplate
    title="Komisyon Oranları"
    description="Satıcılar için şeffaf ve rekabetçi komisyon yapısı"
    :breadcrumbs="breadcrumbs"
    :toc-items="tocItems"
  >
    <InfoPageSection id="genel-bilgi" title="Genel Bilgiler" :level="2">
      <p>
        Risus Media marketplace olarak şeffaf ve adil bir komisyon sistemi uyguluyoruz. 
        Komisyon oranları ürün kategorisine, satış fiyat ına ve aylık satış hacminize göre değişiklik gösterir.
      </p>
      <InfoCallout type="info" title="Komisyon Hesaplama">
        Komisyon, ürünün satış fiyatı üzerinden (KDV dahil) hesaplanır. Kargo bedeli komisyon hesabına dahil edilmez.
      </InfoCallout>
    </InfoPageSection>

    <InfoPageSection id="kategori-komisyonlari" title="Kategori Bazlı Komisyonlar" :level="2">
      <p>
        <strong>Gelinlik Kategorisi:</strong>
      </p>
      <ul>
        <li>5.000 TL'ye kadar: %12</li>
        <li>5.000 - 15.000 TL arası: %15</li>
        <li>15.000 TL ve üzeri: %18</li>
      </ul>
      <p class="mt-4">
        <strong>Gece Elbisesi / Mezuniyet:</strong>
      </p>
      <ul>
        <li>3.000 TL'ye kadar: %12</li>
        <li>3.000 - 10.000 TL arası: %14</li>
        <li>10.000 TL ve üzeri: %16</li>
      </ul>
      <p class="mt-4">
        <strong>Aksesuar (Ayakkabı, Taç, Buket, vb.):</strong>
      </p>
      <ul>
        <li>Tüm fiyat aralıkları: %10</li>
      </ul>
    </InfoPageSection>

    <InfoPageSection id="hacim-indirimi" title="Satış Hacmi İndirimleri" :level="2">
      <p>
        Aylık satış hacminize göre komisyon indirimlerinden yararlanabilirsiniz:
      </p>
      <ul>
        <li><strong>50.000 TL - 100.000 TL arası:</strong> %1 indirim</li>
        <li><strong>100.000 TL - 250.000 TL arası:</strong> %2 indirim</li>
        <li><strong>250.000 TL ve üzeri:</strong> %3 indirim</li>
      </ul>
      <InfoCallout type="success" title="Örnek">
        Aylık 120.000 TL satış yapan bir satıcı, normal %15 komisyon yerine %13 komisyon öder.
      </InfoCallout>
    </InfoPageSection>

    <InfoPageSection id="odeme-sureci" title="Ödeme Süreci" :level="2">
      <p>
        Satıcı ödemelerimiz düzenli ve zamanında yapılır:
      </p>
      <ul>
        <li>Ödeme Sıklığı: Haftalık (her Cuma)</li>
        <li>Ödeme Süresi: Teslimattan sonraki 7 iş günü</li>
        <li>Minimum Ödeme Tutarı: 500 TL</li>
        <li>Ödeme Yöntemi: Banka havalesi (EFT)</li>
      </ul>
      <p class="mt-4">
        <strong>Kesintiler:</strong>
      </p>
      <ul>
        <li>Satış komisyonu (kategori bazlı)</li>
        <li>Aylık platform üyelik ücreti (99 TL)</li>
        <li>İade/iptal işlemlerinde komisyon iadesi</li>
      </ul>
      <p class="mt-4">
        Satış performansınızı ve komisyon detaylarınızı satıcı panelinizdeki 
        "Finansal Raporlar" bölümünden anlık olarak takip edebilirsiniz.
      </p>
    </InfoPageSection>

    <InfoPageCTA
      title="Satıcı Olmak İster misiniz?"
      description="Türkiye'nin lider gelinlik marketplace'inde satış yapmaya başlayın."
      button-text="Hemen Başvur"
      button-href="/become-seller"
      variant="primary"
    />
  </InfoPageTemplate>
</template>
