<script setup lang="ts">
import BaseSection from '@/components/ui/BaseSection.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import { Star, Quote } from 'lucide-vue-next';

const testimonials = [
  {
    id: 1,
    text: "Risus Media sayesinde hayalimdeki gelinliği buldum. Mağaza iletişimi harikaydı ve ürün tam zamanında geldi.",
    author: "Elif Y.",
    location: "İstanbul",
    rating: 5
  },
  {
    id: 2,
    text: "Özel tasarım abiye arıyordum, buradaki seçenekler gerçekten çok kaliteli. Kesinlikle tavsiye ederim.",
    author: "Ayşe K.",
    location: "İzmir",
    rating: 5
  },
  {
    id: 3,
    text: "Güvenli ödeme ve hızlı kargo süreci beni çok memnun etti. Teşekkürler!",
    author: "Gizem T.",
    location: "Ankara",
    rating: 5
  }
];
</script>

<template>
  <BaseSection class-name="bg-background border-t border-border">
    <SectionHeader 
      title="Mutlu Müşteriler" 
      subtitle="Binlerce gelin ve davetli aradığını Risus Media'da buldu."
      centered
    />
    
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div 
        v-for="testimonial in testimonials" 
        :key="testimonial.id" 
        class="relative rounded-2xl bg-muted p-8 transition-transform hover:-translate-y-1"
      >
        <Quote class="absolute right-6 top-6 h-8 w-8 text-primary/20" />
        
        <div class="mb-4 flex text-primary">
          <Star v-for="i in 5" :key="i" class="h-4 w-4 fill-current" />
        </div>
        
        <p class="mb-6 text-foreground/80 italic">"{{ testimonial.text }}"</p>
        
        <div>
          <div class="font-bold text-foreground">{{ testimonial.author }}</div>
          <div class="text-sm text-muted-foreground">{{ testimonial.location }}</div>
        </div>
      </div>
    </div>
  </BaseSection>
</template>
