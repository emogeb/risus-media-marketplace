<script setup lang="ts">
import InfoPageTemplate from '@/components/shared/InfoPageTemplate.vue'
import InfoPageSection from '@/components/shared/InfoPageSection.vue'
import InfoCallout from '@/components/shared/InfoCallout.vue'
import InfoPageCTA from '@/components/shared/InfoPageCTA.vue'

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Satıcı Ol' },
]

const tocItems = [
  { id: 'neden-satici', text: 'Neden Satıcı Olmalısınız?', level: 2 },
  { id: 'komisyonlar', text: 'Komisyon ve Ücretler', level: 2 },
  { id: 'basvuru-sureci', text: 'Başvuru Süreci', level: 2 },
  { id: 'gereksinimler', text: 'Gereksinimler', level: 2 },
  { id: 'destekler', text: 'Satıcı Destekleri', level: 2 },
]
</script>

<template>
  <InfoPageTemplate
    title="Satıcı Olmak İster misiniz?"
    description="Türkiye'nin lider gelinlik marketplace'inde işinizi büyütün"
    :breadcrumbs="breadcrumbs"
    :toc-items="tocItems"
  >
    <InfoPageSection id="neden-satici" title="Neden Risus Media'da Satıcı Olmalısınız?" :level="2">
      <p>
        Gelinlik, gece elbisesi ve aksesuar sektöründe faaliyet gösteren tasarımcı ve mağazalar için 
        Türkiye'nin en büyük online platformunda yerinizi alın.
      </p>
      <div class="grid md:grid-cols-2 gap-6 my-6">
        <div class="p-6 bg-muted/30 rounded-lg">
          <h4 class="font-semibold text-lg mb-2">🎯 Geniş Müşteri Kitlesi</h4>
          <p>Binlerce potansiyel müşteriye tek bir platformdan ulaşın</p>
        </div>
        <div class="p-6 bg-muted/30 rounded-lg">
          <h4 class="font-semibold text-lg mb-2">💰 Düşük Komisyon</h4>
          <p>Sektörün en rekabetçi komisyon oranları ile satış yapın</p>
        </div>
        <div class="p-6 bg-muted/30 rounded-lg">
          <h4 class="font-semibold text-lg mb-2">📱 Kolay Yönetim</h4>
          <p>Kullanıcı dostu admin paneli ile stok ve siparişlerinizi yönetin</p>
        </div>
        <div class="p-6 bg-muted/30 rounded-lg">
          <h4 class="font-semibold text-lg mb-2">🚀 Pazarlama Desteği</h4>
          <p>Profesyonel dijital pazarlama ve tanıtım hizmetleri</p>
        </div>
      </div>
    </InfoPageSection>

    <InfoPageSection id="komisyonlar" title="Komisyon ve Ücretler" :level="2">
      <p>
        Şeffaf ve makul fiyatlandırma ile işinizi büyütün:
      </p>
      <ul>
        <li><strong>Satış Komisyonu:</strong> Satış fiyatının %12-18'i (kategori ve satış hacmine göre değişir)</li>
        <li><strong>Üyelik Ücreti:</strong> İlk 3 ay ücretsiz, sonrası aylık 99 TL</li>
        <li><strong>Listeleme Ücreti:</strong> Yok! Sınırsız ürün ekleyebilirsiniz</li>
        <li><strong>Ödeme Süresi:</strong> Teslimattan sonraki 7 iş günü içinde</li>
      </ul>
      <InfoCallout type="info" title="Özel İndirim">
        İlk 50 satıcıya özel: İlk 6 ay komisyon indirimi ve üyelik ücretsiz!
      </InfoCallout>
    </InfoPageSection>

    <InfoPageSection id="basvuru-sureci" title="Başvuru Süreci" :level="2">
      <p>
        Satıcı olmak için basit adımları takip edin:
      </p>
      <ol class="list-decimal list-inside space-y-2">
        <li>Online başvuru formunu doldurun</li>
        <li>Gerekli belgeleri yükleyin (Vergi levhası, imza sirküleri)</li>
        <li>Başvurunuz 2-3 iş günü içinde değerlendirilir</li>
        <li>Onay sonrası satıcı panel bilgileriniz e-posta ile gönderilir</li>
        <li>Ürünlerinizi eklemeye başlayın!</li>
      </ol>
    </InfoPageSection>

    <InfoPageSection id="gereksinimler" title="Gereksinimler" :level="2">
      <p>
        Satıcı olmak için aşağıdaki kriterleri sağlamanız gerekmektedir:
      </p>
      <ul>
        <li><strong>Yasal Durum:</strong> Geçerli vergi levhası ve ticari sicil belgesi</li>
        <li><strong>Ürün Kalitesi:</strong> Yüksek kaliteli ve özgün ürünler</li>
        <li><strong>Fotoğraf Standartları:</strong> Profesyonel ürün fotoğrafları (min. 1200x1200px)</li>
        <li><strong>Müşteri Hizmeti:</strong> 24-48 saat içinde müşteri sorularına yanıt</li>
        <li><strong>Teslimat:</strong> Belirtilen sürelerde teslimat yapabilme</li>
      </ul>
    </InfoPageSection>

    <InfoPageSection id="destekler" title="Satıcı Destekleri" :level="2">
      <p>
        Başarınız bizim başarımızdır. Size sunduğumuz destekler:
      </p>
      <ul>
        <li><strong>Eğitim Programı:</strong> Ücretsiz satıcı paneli kullanım eğitimi</li>
        <li><strong>Fotoğraf Desteği:</strong> Profesyonel ürün fotoğraf çekimi hizmeti</li>
        <li><strong>Pazarlama:</strong> Instagram, Google Ads ve influencer iş birlikleri</li>
        <li><strong>7/24 Destek:</strong> Satıcı özel destek hattı</li>
        <li><strong>Analitik Raporlar:</strong> Detaylı satış ve performans raporları</li>
      </ul>
    </InfoPageSection>

    <InfoPageCTA
      title="Hemen Satıcı Olun!"
      description="Formu doldurun, onay alın ve satışa başlayın. Başarı hikayeniz burada başlıyor."
      button-text="Başvuru Formu"
      button-href="/become-seller/apply"
      variant="primary"
    />
  </InfoPageTemplate>
</template>
