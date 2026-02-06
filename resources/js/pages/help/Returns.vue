<script setup lang="ts">
import InfoPageTemplate from '@/components/shared/InfoPageTemplate.vue'
import InfoPageSection from '@/components/shared/InfoPageSection.vue'
import InfoCallout from '@/components/shared/InfoCallout.vue'
import InfoPageCTA from '@/components/shared/InfoPageCTA.vue'

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Yardım', href: '/help/faq' },
  { label: 'İade ve Değişim' },
]

const tocItems = [
  { id: 'iade-kosullari', text: 'İade Koşulları', level: 2 },
  { id: 'iade-sureci', text: 'İade Süreci', level: 2 },
  { id: 'degisim', text: 'Ürün Değişimi', level: 2 },
  { id: 'iade-edilemeyen', text: 'İade Edilemeyen Ürünler', level: 2 },
  { id: 'para-iadesi', text: 'Para İadesi', level: 2 },
]
</script>

<template>
  <InfoPageTemplate
    title="İade ve Değişim"
    description="Ürün iade ve değişim sürecine dair tüm detaylar"
    :breadcrumbs="breadcrumbs"
    :toc-items="tocItems"
  >
    <InfoPageSection id="iade-kosullari" title="İade Koşulları" :level="2">
      <p>
        Mesafeli Satış Sözleşmesi gereğince, ürünü teslim aldığınız tarihten itibaren <strong>14 gün içinde</strong> 
        cayma hakkınızı kullanabilirsiniz.
      </p>
      <p>
        <strong>İade Edilebilir Ürün Koşulları:</strong>
      </p>
      <ul>
        <li>Ürün kullan ılmamış, denenmemiş ve hasarsız olmalıdır</li>
        <li>Orijinal ambalajında, etiketleriyle birlikte olmalıdır</li>
        <li>Fatura ve iade formu eksiksiz doldurulmalıdır</li>
        <li>14 gün içinde iade talebinde bulunulmalıdır</li>
      </ul>
      <InfoCallout type="warning" title="Önemli">
        Özel dikim (kişiye özel ölçülerde üretilen) ürünlerde cayma hakkı kullanılamaz.
      </InfoCallout>
    </InfoPageSection>

    <InfoPageSection id="iade-sureci" title="İade Süreci" :level="2">
      <p>
        <strong>İade Adımları:</strong>
      </p>
      <ol class="list-decimal list-inside space-y-2">
        <li>"Hesabım" > "Siparişlerim" bölümünden iade talebinde bulunun</li>
        <li>İade nedeninizi seçin ve gerekli bilgileri doldurun</li>
        <li>İade talebiniz satıcı tarafından onaylanır (1-2 iş günü)</li>
        <li>İade kargo kodu size gönderilir</li>
        <li>Ürünü anlaşmalı kargo firmasına teslim edin (ücretsiz)</li>
        <li>Ürün satıcıya ulaştığında kontrol edilir (2-3 iş günü)</li>
        <li>Onay sonrası para iadeniz yapılır</li>
      </ol>
      <InfoCallout type="info" title="İade Kargo Ücreti">
        Ürünün ayıplı/hatalı olması durumunda iade kargo ücreti tarafımızca karşılanır. Cayma hakkı kullanımında iade kargo ücretsizdir.
      </InfoCallout>
    </InfoPageSection>

    <InfoPageSection id="degisim" title="Ürün Değişimi" :level="2">
      <p>
        Aldığınız ürünü farklı beden, renk veya modelle değiştirebilirsiniz. Değişim işlemi de 14 gün içinde 
        gerçekleştirilmelidir.
      </p>
      <p>
        <strong>Değişim Süreci:</strong>
      </p>
      <ul>
        <li>Değişim talebinizi "Siparişlerim" bölümünden oluşturun</li>
        <li>Değiştirmek istediğiniz ürün varyantını seçin</li>
        <li>İlk ürünü iade kargosu ile gönderin</li>
        <li> Yeni ürün size kargo ile gönderilir</li>
      </ul>
      <p>
        Eğer değiştirmek istediğiniz ürünün fiyatı farklı ise, fark tutarı ödenecek veya iade edilecektir.
      </p>
    </InfoPageSection>

    <InfoPageSection id="iade-edilemeyen" title="İade Edilemeyen Ürünler" :level="2">
      <p>
        Aşağıdaki ürün ve durumlar için cayma hakkı kullanılamaz:
      </p>
      <ul>
        <li><strong>Özel Dikim Ürünler:</strong> Kişiye özel ölçülerde üretilen gelinlikler</li>
        <li><strong>Kişiselleştirilmiş Ürünler:</strong> İsim, logo vb. özel baskılı ürünler</li>
        <li><strong>Hijyen Ürünleri:</strong> İç giyim, mayo gibi hijyenik koruma gerektiren ürünler</li>
        <li><strong>Kullanılmış Ürünler:</strong> Ambalajı açılmış, etiketleri koparılmış ürünler</li>
        <li><strong>İndirimli/Kampanyalı Ürünler:</strong> Belirli kampanya ürünlerinde iade hakkı sınırlı olabilir</li>
      </ul>
      <InfoCallout type="error" title="Cayma Hakkı Dışı">
        Bu ürünler için sipariş vermeden önce tüm detayları dikkatlice incelemenizi öneririz.
      </InfoCallout>
    </InfoPageSection>

    <InfoPageSection id="para-iadesi" title="Para İadesi" :level="2">
      <p>
        İade edilen ürün satıcı tarafından kontrol edilip onaylandıktan sonra para iadeniz başlatılır.
      </p>
      <p>
        <strong>İade Süreleri:</strong>
      </p>
      <ul>
        <li><strong>Kredi Kartı:</strong> 2-10 iş günü (bankanıza bağlı olarak)</li>
        <li><strong>Havale/EFT:</strong> 2-5 iş günü</li>
        <li><strong>Kapıda Ödeme:</strong> Banka hesabınıza havale ile 3-7 iş günü</li>
      </ul>
      <p>
        Kredi kartına yapılan iadelerde, tutar önce bankanıza iletilir, ardından ekstrenize yansır. 
        Bu süreç bankanızın dönem kapanış tarihine göre 1-2 hesap döngüsü alabilir.
      </p>
    </InfoPageSection>

    <InfoPageCTA
      title="İade Sürecinizde Yardıma İhtiyacınız Var?"
      description="Müşteri hizmetleri ekibimiz tüm sorularınızı yanıtlamaya hazır."
      button-text="Destek Al"
      button-href="/help/contact"
      variant="primary"
    />
  </InfoPageTemplate>
</template>
