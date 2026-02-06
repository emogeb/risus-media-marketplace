<script setup lang="ts">
import InfoPageTemplate from '@/components/shared/InfoPageTemplate.vue'
import InfoPageSection from '@/components/shared/InfoPageSection.vue'
import InfoCallout from '@/components/shared/InfoCallout.vue'
import InfoPageCTA from '@/components/shared/InfoPageCTA.vue'

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Yardım', href: '/help/faq' },
  { label: 'Nasıl Sipariş Verilir' },
]

const tocItems = [
  { id: 'step-1', text: '1. Hesap Oluşturma', level: 2 },
  { id: 'step-2', text: '2. Ürün Arama ve Bulma', level: 2 },
  { id: 'step-3', text: '3. Sepete Ekleme', level: 2 },
  { id: 'step-4', text: '4. Sipariş Onayı', level: 2 },
  { id: 'step-5', text: '5. Ödeme', level: 2 },
  { id: 'step-6', text: '6. Sipariş Takibi', level: 2 },
]
</script>

<template>
  <InfoPageTemplate
    title="Nasıl Sipariş Verilir?"
    description="Risus Media'dan gelinlik ve gece elbisesi siparişi vermek için adım adım rehber"
    :breadcrumbs="breadcrumbs"
    :toc-items="tocItems"
  >
    <InfoPageSection id="step-1" title="1. Hesap Oluşturma" :level="2">
      <p>
        Sipariş vermek için öncelikle bir hesap oluşturmanız gerekmektedir. Sağ üst köşedeki 
        "Giriş Yap" butonuna tıklayın ve ardından "Hesap Oluştur" seçeneğini seçin.
      </p>
      <p>
        Ad, soyad, e-posta ve telefon bilgilerinizi girin. Ardından güvenli bir şifre belirleyin. 
        KVKK Aydınlatma Metni'ni okuyup onayladıktan sonra "Hesap Oluştur" butonuna tıklayın.
      </p>
      <InfoCallout type="info" title="İpucu">
        Sosyal medya hesaplarınız (Google, Facebook) ile de hızlı giriş yapabilirsiniz.
      </InfoCallout>
    </InfoPageSection>

    <InfoPageSection id="step-2" title="2. Ürün Arama ve Bulma" :level="2">
      <p>
        Ana sayfadaki arama çubuğunu kullanarak istediğiniz ürünü arayabilir veya kategorilere göz atabilirsiniz:
      </p>
      <ul>
        <li><strong>Gelinlikler:</strong> A kesim, prenses, balon, rustik gibi tarzlar</li>
        <li><strong>Gece Elbiseleri:</strong> Mezuniyet, nişan, düğün davetlisi için</li>
        <li><strong>Aksesuarlar:</strong> Taç, buket, ayakkabı, takı</li>
      </ul>
      <p>
        Filtreleme seçenekleri ile fiyat aralığı, beden, renk, stil gibi kriterlere göre sonuçları daraltabilirsiniz.
      </p>
    </InfoPageSection>

    <InfoPageSection id="step-3" title="3. Sepete Ekleme" :level="2">
      <p>
        Beğendiğiniz ürünün detay sayfasına girin. Ürün açıklamasını, fotoğraflarını ve satıcı bilgilerini inceleyin.
      </p>
      <p>
        <strong>Beden Seçimi:</strong> Doğru bedeni seçmek için beden tablosunu mutlaka kontrol edin. 
        Özel ölçü gerekiyorsa satıcı notlarına dikkat edin.
      </p>
      <p>
        <strong>Varyant Seçimi:</strong> Renk, tel boy, kumaş gibi seçenekler varsa tercihlerinizi yapın.
      </p>
      <p>
        "Sepete Ekle" butonuna tıklayın. İsterseniz alışverişe devam edebilir veya sepeti görüntüleyebilirsiniz.
      </p>

      <InfoCallout type="warning" title="Dikkat">
        Gelinlik siparişlerinde teslimat süresi genellikle 2-6 ay arasındadır. Düğün tarihinizi göz önünde bulundurarak erken sipariş verin.
      </InfoCallout>
    </InfoPageSection>

    <InfoPageSection id="step-4" title="4. Sipariş Onayı" :level="2">
      <p>
        Sepetinize gitmek için sağ üst köşedeki sepet ikonuna tıklayın. Sepetinizdeki ürünleri gözden geçirin:
      </p>
      <ul>
        <li>Ürün adı, varyantlar, beden bilgilerini kontrol edin</li>
        <li>Adet sayısını istediğiniz gibi ayarlayın</li>
        <li>İstemediğiniz ürünleri silebilirsiniz</li>
        <li>Toplam tutarı ve kargo ücretini görüntüleyin</li>
      </ul>
      <p>
        Her şey doğruysa "Sipariş Ver" butonuna tıklayarak ödeme adımına geçin.
      </p>
    </InfoPageSection>

    <InfoPageSection id="step-5" title="5. Ödeme" :level="2">
      <p>
        Ödeme sayfasında teslimat adresinizi girin veya kayıtlı adreslerinizden birini seçin.
      </p>
      <p>
        <strong>Ödeme Yöntemleri:</strong>
      </p>
      <ul>
        <li><strong>Kredi/Banka Kartı:</strong> Tüm kartlar kabul edilir (tek çekim veya taksit)</li>
        <li><strong>Havale/EFT:</strong> Banka havalesi ile güvenli ödeme</li>

      </ul>
      <p>
        Fatura bilgilerinizi doldurun. Kurumsal fatura talep ediyorsanız vergi dairesi ve vergi numaranızı girin.
      </p>
      <InfoCallout type="success" title="Güvenli Ödeme">
        Tüm ödemeler 256-bit SSL sertifikası ile şifrelenmektedir. Kart bilgileriniz güvendedir.
      </InfoCallout>
    </InfoPageSection>

    <InfoPageSection id="step-6" title="6. Sipariş Takibi" :level="2">
      <p>
        Siparişiniz onaylandıktan sonra e-posta ve SMS ile bilgilendirme alacaksınız.
      </p>
      <p>
        <strong>Sipariş Durumunuzu Takip Edin:</strong>
      </p>
      <ul>
        <li>"Hesabım" > "Siparişlerim" bölümünden durumu görüntüleyin</li>
        <li>Kargo takip numarası ile kargo firması üzerinden takip yapın</li>
        <li>Satıcı ile mesajlaşarak özel notlar paylaşabilirsiniz</li>
      </ul>
      <p>
        Özel dikim ürünlerde satıcı sizi ara durumlarda fotoğraflarla bilgilendirebilir. 
        Bu süreçte satıcı ile iletişim kurmayı ihmal etmeyin.
      </p>
    </InfoPageSection>

    <InfoPageCTA
      title="Hala Sorunuz mu Var?"
      description="Müşteri hizmetleri ekibimiz size yardımcı olmaktan mutluluk duyar."
      button-text="İletişime Geçin"
      button-href="/help/contact"
      variant="primary"
    />
  </InfoPageTemplate>
</template>
