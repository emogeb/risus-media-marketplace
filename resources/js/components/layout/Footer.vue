<template>
  <footer class="bg-gray-900 text-gray-300">
    <!-- Newsletter Section -->
    <div class="border-b border-gray-800">
      <div class="container mx-auto px-6 pt-12 text-center">
         <Link href="/">
            <img src="/risuslogo_page-0001-Photoroom.png" alt="Risus Media" class="h-12 w-auto brightness-0 invert opacity-80 hover:opacity-100 transition-opacity mx-auto" />
         </Link>
      </div>
      <div class="container mx-auto px-6 py-12 max-w-7xl">
        <NewsletterForm />
      </div>
    </div>

    <!-- Links Grid -->
    <div class="container mx-auto px-6 py-12 max-w-7xl">
      <!-- Desktop: 6 columns grid -->
      <div class="hidden md:grid md:grid-cols-6 gap-8">
        <FooterColumn v-for="column in columns" :key="column.title" :column="column" />
      </div>
      
      <!-- Mobile: Accordion -->
      <div class="md:hidden space-y-0">
        <FooterAccordion v-for="column in columns" :key="column.title" :column="column" />
      </div>
    </div>

    <!-- Payment/Shipping Icons -->
    <div class="border-t border-gray-800">
      <div class="container mx-auto px-6 py-8 max-w-7xl">
        <PaymentShippingLogos />
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-800">
      <div class="container mx-auto px-6 py-6 max-w-7xl">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <FooterBottomBar />
          <div class="mb-4 md:mb-0">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import NewsletterForm from './footer/NewsletterForm.vue'
import FooterColumn from './footer/FooterColumn.vue'
import FooterAccordion from './footer/FooterAccordion.vue'
import PaymentShippingLogos from './footer/PaymentShippingLogos.vue'
import FooterBottomBar from './footer/FooterBottomBar.vue'
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

const { t } = useT();
import { useT } from '@/composables/useT';

interface FooterColumn {
  title: string
  links: FooterLink[]
}

const columns: FooterColumn[] = [
  {
    title: 'footer.discover',
    links: [
      { label: 'footer.bridal', href: '/collections?category=bridal' },
      { label: 'footer.evening', href: '/collections?category=evening' },
      { label: 'footer.accessories', href: '/collections?category=accessory' },
      { label: 'footer.new_collections', href: '/collections?sort=newest' },
      { label: 'footer.all_categories', href: '/collections' },
    ],
  },
  {
    title: 'footer.buyer',
    links: [
      { label: 'footer.how_to_order', href: '/help/how-to-order' },
      { label: 'footer.payment_options', href: '/help/payment' },
      { label: 'footer.shipping', href: '/help/shipping' },
      { label: 'footer.returns', href: '/help/returns' },
      { label: 'footer.faq', href: '/help/faq' },
    ],
  },
  {
    title: 'footer.seller',
    links: [
      { label: 'footer.become_seller', href: '/become-seller' },
      { label: 'footer.commissions', href: '/seller/commissions' },
      { label: 'footer.seller_agreement', href: '/legal/seller-agreement' },
    ],
  },
  {
    title: 'footer.support',
    links: [
      { label: 'footer.contact', href: '/help/contact' },
      { label: 'footer.help_center', href: '/help/faq' },
    ],
  },
  {
    title: 'footer.legal',
    links: [
      { label: 'footer.terms', href: '/legal/terms' },
      { label: 'footer.privacy', href: '/legal/privacy' },
      { label: 'footer.kvkk', href: '/legal/kvkk' },
      { label: 'footer.cookies', href: '/legal/cookies' },
      { label: 'footer.distance_sales', href: '/legal/distance-sales' },
    ],
  },
  {
    title: 'footer.social',
    links: [
      { label: 'footer.instagram', href: 'https://instagram.com', external: true },
      { label: 'footer.facebook', href: 'https://facebook.com', external: true },
      { label: 'footer.twitter', href: 'https://twitter.com', external: true },
      { label: 'footer.pinterest', href: 'https://pinterest.com', external: true },
      { label: 'footer.tiktok', href: 'https://tiktok.com', external: true },
    ],
  },
]
</script>
