<script setup lang="ts">
import InfoPageTemplate from '@/components/shared/InfoPageTemplate.vue'
import InfoPageSection from '@/components/shared/InfoPageSection.vue'
import FAQAccordion from '@/components/shared/FAQAccordion.vue'
import InfoPageCTA from '@/components/shared/InfoPageCTA.vue'

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Yardım', href: '/help/faq' },
  { label: 'Sıkça Sorulan Sorular' },
]

const tocItems = [
  { id: 'siparis', text: 'Sipariş ve Ödeme', level: 2 },
  { id: 'kargo', text: 'Kargo ve Teslimat', level: 2 },
  { id: 'iade', text: 'İade ve Değişim', level: 2 },
  { id: 'urun', text: 'Ürün ve Beden', level: 2 },
  { id: 'hesap', text: 'Hesap İşlemleri', level: 2 },
]

const siparisItems = [
  {
    question: 'Nasıl sipariş verebilirim?',
    answer: 'Beğendiğiniz ürünü sepete ekleyin, beden ve renk seçimlerinizi yapın. Ardından sepete gidip "Ödemeye Geç" butonuna tıklayın. Teslimat adresinizi ve ödeme bilgilerinizi girdikten sonra siparişinizi onaylayın.'
  },
  {
    question: 'Hangi ödeme yöntemlerini kullanabilirim?',
    answer: 'Kredi/banka kartı (taksitli veya tek çekim), havale/EFT ve kapıda ödeme seçeneklerini kullanabilirsiniz. Tüm kartlar (Visa, Mastercard, Amex, Troy) kabul edilmektedir.'
  },
  {
    question: 'Taksit seçenekleri nelerdir?',
    answer: '2-3 taksit tüm kartlarda geçerlidir. 6 taksit minimum 1.000 TL, 9 taksit minimum 2.000 TL, 12 taksit minimum 3.000 TL alışverişlerde kullanılabilir. Faiz oranları bankanıza göre değişiklik gösterir.'
  },
  {
    question: 'Siparişimi iptal edebilir miyim?',
    answer: 'Evet. Sipariş henüz kargoya verilmediyse "Siparişlerim" bölümünden iptal edebilirsiniz. Kargoya verildikten sonra iptal için iade sürecini başlatmanız gerekir.'
  },
  {
    question: 'Fatura nasıl alırım?',
    answer: 'E-fatura otomatik olarak e-posta adresinize gönderilir. Kurumsal fatura için sipariş esnasında vergi dairesi ve vergi numaranızı girmeniz gerekir.'
  },
]

const kargoItems = [
  {
    question: 'Kargo ücreti ne kadar?',
    answer: '500 TL ve üzeri alışverişlerde kargo ücretsizdir. 500 TL altı alışverişlerde sabit 29.90 TL kargo ücreti uygulanır.'
  },
  {
    question: 'Ne kadar sürede teslim alırım?',
    answer: 'Hazır ürünlerde 2-5 iş günü, özel dikim (made-to-order) ürünlerde 2-6 ay (ürüne bağlı), aksesuarlarda 1-3 iş günü teslimat süresi vardır.'
  },
  {
    question: 'Kargo takibi nasıl yapılır?',
    answer: '"Hesabım" > "Siparişlerim" bölümünden veya size gönderilen kargo takip numarası ile kargo firmasının web sitesinden takip yapabilirsiniz.'
  },
  {
    question: 'Kargo hasarlı gelirse ne yapmalıyım?',
    answer: 'Kargo hasarlı gelirse ürünü teslim almayın veya tutanak tutarak teslim alın. Hemen müşteri hizmetlerimizle iletişime geçin. Kargo sigortamız tüm hasarları kapsar.'
  },
]

const iadeItems = [
  {
    question: 'İade süresi ne kadardır?',
    answer: 'Ürünü teslim aldığınız tarihten itibaren 14 gün içinde cayma hakkınızı kullanabilirsiniz. Özel dikim ürünlerde cayma hakkı geçerli değildir.'
  },
  {
    question: 'İade kargo ücreti kim tarafından ödenir?',
    answer: 'Ürün ayıplı veya hatalı ise iade kargo ücreti tarafımızca karşılanır. Normal cayma hakkı kullanımında iade kargo ücretsizdir.'
  },
  {
    question: 'Hangi ürünler iade edilemez?',
    answer: 'Özel dikim ürünler, kişiselleştirilmiş ürünler, hijyen ürünleri (iç giyim), kullanılmış veya etiketi koparılmış ürünler iade edilemez.'
  },
  {
    question: 'Para iadem ne zaman yapılır?',
    answer: 'İade edilen ürün satıcı tarafından onaylandıktan sonra kredi kartına 2-10 iş günü, havale/EFT ile 2-5 iş günü içinde iade yapılır.'
  },
]

const urunItems = [
  {
    question: 'Beden tablosu nasıl kullanılır?',
    answer: 'Her ürünün detay sayfasında beden tablosu bulunur. Göğüs, bel ve kalça ölçülerinizi alarak tabloda size uygun bedeni bulabilirsiniz. Özel ölçü gereken ürünlerde satıcı ile iletişime geçin.'
  },
  {
    question: 'Ürün fotoğrafları gerçeği yansıtıyor mu?',
    answer: 'Ürün fotoğrafları gerçeğe en yakın şekilde çekilir ancak ekran ayarlarına göre renk tonları değişebilir. Detaylı bilgi için satıcı ile iletişime geçebilirsiniz.'
  },
  {
    question: 'Özel dikim (made-to-order) nedir?',
    answer: 'Özel dikim, kişiye özel ölçülerde üretilen ürünlerdir. Sipariş verdikten sonra ölçüleriniz alınır ve size özel olarak dikilir. Teslimat süresi 2-6 ay arasıdır.'
  },
  {
    question: 'Ürün stoğu nasıl öğrenilir?',
    answer: 'Ürün detay sayfasında stok durumu gösterilir. "Tükendi" yazıyorsa stok yoktur. Stok bildirimi almak için e-posta adresinizi bırakabilirsiniz.'
  },
]

const hesapItems = [
  {
    question: 'Hesap nasıl oluşturulur?',
    answer: 'Sağ üst köşedeki "Giriş Yap" butonuna tıklayın ve "Hesap Oluştur" seçeneğini seçin. E-posta ve telefon bilgilerinizle kayıt olabilir veya Google/Facebook ile hızlı giriş yapabilirsiniz.'
  },
  {
    question: 'Şifremi unuttum, ne yapmalıyım?',
    answer: 'Giriş sayfasında "Şifremi Unuttum" linkine tıklayın. E-posta adresinizi girin, size şifre sıfırlama linki gönderilecektir.'
  },
  {
    question: 'Hesap bilgilerimi nasıl güncellerim?',
    answer: '"Hesabım" > "Profil Ayarları" bölümünden ad, soyad, telefon ve adres bilgilerinizi güncelleyebilirsiniz.'
  },
  {
    question: 'Hesabımı silebilir miyim?',
    answer: 'Evet. "Hesap Ayarları" bölümünden hesap silme talebinde bulunabilirsiniz. Aktif siparişiniz varsa hesap silinmez.'
  },
]
</script>

<template>
  <InfoPageTemplate
    title="Sıkça Sorulan Sorular"
    description="En çok merak edilen sorulara yanıtlar"
    :breadcrumbs="breadcrumbs"
    :toc-items="tocItems"
  >
    <InfoPageSection id="siparis" title="Sipariş ve Ödeme" :level="2">
      <FAQAccordion :items="siparisItems" />
    </InfoPageSection>

    <InfoPageSection id="kargo" title="Kargo ve Teslimat" :level="2">
      <FAQAccordion :items="kargoItems" />
    </InfoPageSection>

    <InfoPageSection id="iade" title="İade ve Değişim" :level="2">
      <FAQAccordion :items="iadeItems" />
    </InfoPageSection>

    <InfoPageSection id="urun" title="Ürün ve Beden" :level="2">
      <FAQAccordion :items="urunItems" />
    </InfoPageSection>

    <InfoPageSection id="hesap" title="Hesap İşlemleri" :level="2">
      <FAQAccordion :items="hesapItems" />
    </InfoPageSection>

    <InfoPageCTA
      title="Cevabını Bulamadınız mı?"
      description="Müşteri hizmetleri ekibimiz size yardımcı olmaktan mutluluk duyar."
      button-text="İletişime Geçin"
      button-href="/help/contact"
      variant="primary"
    />
  </InfoPageTemplate>
</template>
