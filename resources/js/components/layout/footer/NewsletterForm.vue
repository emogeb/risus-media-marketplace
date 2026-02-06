<template>
  <div class="max-w-2xl">
    <div class="mb-6">
      <h3 class="text-2xl font-bold text-white mb-2 font-serif tracking-wide">Bültenimize Katılın</h3>
      <p class="text-gray-400 mb-1">En yeni koleksiyonlar ve özel davetlerden ilk siz haberdar olun.</p>
      <p class="text-xs text-gray-500 flex items-center gap-2">
        <span class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Ayda 2-4 e-posta
        </span>
        <span class="w-1 h-1 bg-gray-600 rounded-full"></span>
        <span class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Spam yok, sadece ilham.
        </span>
      </p>
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <input 
          v-model="email"
          type="email" 
          placeholder="E-posta adresiniz"
          class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          required
        />
        <button 
          type="submit"
          :disabled="!kvkkAccepted || loading"
          class="px-8 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {{ loading ? 'Gönderiliyor...' : 'Abone Ol' }}
        </button>
      </div>
      
      <label class="flex items-start gap-3 cursor-pointer group">
        <div class="relative flex items-center">
          <input 
            v-model="kvkkAccepted" 
            type="checkbox" 
            class="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-600 bg-gray-800 transition-all checked:border-primary checked:bg-primary hover:border-primary focus:ring-offset-0"
          />
          <svg class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <span class="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
          <a href="/legal/kvkk" class="underline decoration-gray-600 underline-offset-2 hover:text-white hover:decoration-white transition-all">KVKK Aydınlatma Metni</a>'ni 
          okudum ve kişisel verilerimin işlenmesini kabul ediyorum.
        </span>
      </label>

      <p v-if="message" :class="messageType === 'success' ? 'text-green-400' : 'text-red-400'" class="text-sm font-medium animate-fade-in">
        {{ message }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const kvkkAccepted = ref(false)
const loading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const handleSubmit = async () => {
  if (!kvkkAccepted.value) {
    message.value = 'Lütfen KVKK metnini okuyup kabul edin.'
    messageType.value = 'error'
    return
  }

  loading.value = true
  message.value = ''

  try {
    // TODO: Implement newsletter API endpoint
    // const response = await axios.post('/api/newsletter/subscribe', { email: email.value })
    
    // Simulated success for now
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.value = 'Başarıyla abone oldunuz! Teşekkür ederiz.'
    messageType.value = 'success'
    email.value = ''
    kvkkAccepted.value = false
  } catch (error) {
    message.value = 'Bir hata oluştu. Lütfen tekrar deneyin.'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>
