<script setup lang="ts">
import InfoPageTemplate from '@/components/shared/InfoPageTemplate.vue'
import InfoPageSection from '@/components/shared/InfoPageSection.vue'
import InfoCallout from '@/components/shared/InfoCallout.vue'
import InfoPageCTA from '@/components/shared/InfoPageCTA.vue'

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Yardım', href: '/help/faq' },
  { label: 'Ödeme Seçenekleri' },
]

const tocItems = [
  { id: 'kredi-karti', text: 'Kredi ve Banka Kartı', level: 2 },
  { id: 'taksit', text: 'Taksit Seçenekleri', level: 2 },
  { id: 'havale-eft', text: 'Havale ve EFT', level: 2 },

  { id: 'guvenlik', text: 'Ödeme Güvenliği', level: 2 },
]
</script>

<template>
  <InfoPageTemplate
    title="Ödeme Seçenekleri"
    description="Güvenli ve esnek ödeme yöntemleriyle alışverişinizi tamamlayın"
    :breadcrumbs="breadcrumbs"
    :toc-items="tocItems"
  >
    <InfoPageSection id="kredi-karti" title="Kredi ve Banka Kartı" :level="2">
      <p>
        Tüm kredi ve banka kartlarıyla güvenli ödeme yapabilirsiniz. Aşağıdaki kartlar kabul edilmektedir:
      </p>
      <ul>
        <li><strong>Visa:</strong> Taksitli ve tek çekim</li>
        <li><strong>Mastercard:</strong> Taksitli ve tek çekim</li>
        <li><strong>American Express:</strong> Tek çekim</li>
        <li><strong>Troy:</strong> Yerli kart ile güvenli alışveriş</li>
      </ul>
      <p>
        Kart bilgileriniz hiçbir şekilde sistemimizde saklanmaz. Ödeme işlemi SSL sertifikası ile şifrelenir 
        ve güvenli ödeme altyapısı üzerinden gerçekleştirilir.
      </p>
    </InfoPageSection>

    <InfoPageSection id="taksit" title="Taksit Seçenekleri" :level="2">
      <p>
        Kredi kartınızla taksitli alışveriş yapabilirsiniz. Taksit seçenekleri bankanıza ve kart tipinize göre değişiklik gösterir.
      </p>
      <p>
        <strong>Taksit Tablosu:</strong>
      </p>
      <ul>
        <li>2-3 Taksit: Tüm kartlarda geçerli</li>
        <li>6 Taksit: Minimum 1.000 TL alışverişlerde</li>
        <li>9 Taksit: Minimum 2.000 TL alışverişlerde</li>
        <li>12 Taksit: Minimum 3.000 TL alışverişlerde</li>
      </ul>
      <InfoCallout type="info" title="Taksit Faiz Oranları">
        Taksit faiz oranları bankanıza göre değişkenlik göstermektedir. Ödeme adımında güncel faiz oranlarını görebilirsiniz.
      </InfoCallout>
    </InfoPageSection>

    <InfoPageSection id="havale-eft" title="Havale ve EFT" :level="2">
      <p>
        Banka havalesi veya EFT ile de ödeme yapabilirsiniz. Bu yöntem özellikle yüksek tutarlı alışverişlerde tercih edilmektedir.
      </p>
      <p>
        <strong>Havale Ödeme Adımları:</strong>
      </p>
      <ol class="list-decimal list-inside space-y-2">
        <li>Siparişinizi tamamlayın ve ödeme yöntemi olarak "Havale/EFT" seçin</li>
        <li>Size gönderilen e-postada banka hesap bilgilerini bulacaksınız</li>
        <li>Sipariş numaranızı açıklama kısmına yazarak ödemeyi yapın</li>
        <li>Ödeme dekontunu sistemdeki "Siparişlerim" bölümünden yükleyin</li>
        <li>Ödeme onaylandıktan sonra siparişiniz işleme alınır</li>
      </ol>
      <InfoCallout type="warning" title="Önemli">
        Havale/EFT ödemeleri 3 iş günü içinde yapılmalıdır. Bu süre içinde ödeme yapılmaz ise siparişiniz otomatik olarak iptal edilir.
      </InfoCallout>
    </InfoPageSection>



    <InfoPageSection id="guvenlik" title="Ödeme Güvenliği" :level="2">
      <p>
        Alışverişinizin güvenliği bizim için çok önemlidir. Bu nedenle en yüksek güvenlik standartlarını kullanıyoruz:
      </p>
      <ul>
        <li><strong>SSL Sertifikası:</strong> 256-bit şifreleme ile verileriniz korunur</li>
        <li><strong>3D Secure:</strong> Tüm kart ödemelerinde ek güvenlik katmanı</li>
        <li><strong>PCI-DSS Uyumlu:</strong> Uluslararası ödeme güvenliği standartlarına uygunluk</li>
        <li><strong>Kart Bilgisi Saklanmaz:</strong> Hiçbir kart bilginiz sistemimizde saklanmaz</li>
      </ul>
      <InfoCallout type="success" title="Güvende Alışveriş">
        Tüm ödemeleriniz bankalar arası güvenli ödeme altyapısı ile gerçekleştirilmektedir.
      </InfoCallout>
    </InfoPageSection>

    <InfoPageCTA
      title="Ödeme ile İlgili Sorunuz mu Var?"
      description="Müşteri hizmetleri ekibimiz size yardımcı olmaktan mutluluk duyar."
      button-text="Bize Ulaşın"
      button-href="/help/contact"
      variant="primary"
    />
  </InfoPageTemplate>
</template>
