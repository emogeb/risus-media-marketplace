<script setup lang="ts">
import { ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import ProfileTabs from '@/pages/user-profile/ProfileTabs.vue';
import ProfileInfoForm from '@/pages/user-profile/ProfileInfoForm.vue';
import OrderList from '@/pages/user-profile/OrderList.vue';
import FavoriteList from '@/pages/user-profile/FavoriteList.vue';
import RecentlyViewed from '@/pages/user-profile/RecentlyViewed.vue';
import ActivityLogList from '@/pages/user-profile/ActivityLogList.vue';

defineProps<{
  user: any;
  orders?: any;
  favorites?: any[];
  activity_logs?: any[];
  recently_viewed?: any[];
  status?: string;
  mustVerifyEmail?: boolean;
}>();

const activeTab = ref('profile');
</script>

<template>
    <Head title="Hesabım" />
    
    <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />

        <main class="flex-grow container mx-auto px-4 py-8 max-w-7xl">
            <h1 class="text-3xl font-bold text-gray-900 mb-8 font-serif">Hesabım</h1>

            <div class="flex flex-col lg:flex-row gap-8">
                 <div class="w-full">
                     <ProfileTabs v-model="activeTab">
                        <template #profile>
                            <ProfileInfoForm :user="user" />
                        </template>
                        
                        <template #orders>
                             <div v-if="orders">
                                <OrderList :orders="orders" />
                             </div>
                             <div v-else class="p-4 bg-white rounded-lg shadow-sm">
                                Siparişler yüklenemedi.
                             </div>
                        </template>

                        <template #favorites>
                             <FavoriteList :favorites="favorites || []" />
                        </template>

                        <template #addresses>
                             <div class="p-8 text-center bg-white rounded-lg shadow-sm">
                                <p class="text-gray-500">Adres yönetimi yakında eklenecek.</p>
                             </div>
                        </template>

                        <template #billing>
                             <div class="p-8 text-center bg-white rounded-lg shadow-sm">
                                <p class="text-gray-500">Fatura bilgileri yakında eklenecek.</p>
                             </div>
                        </template>

                        <template #security>
                             <div class="p-8 text-center bg-white rounded-lg shadow-sm">
                                <p class="text-gray-500">Güvenlik ayarları özelliği yakında eklenecek.</p>
                             </div>
                        </template>
                        
                        <template #recently_viewed>
                             <RecentlyViewed :initial-products="recently_viewed" />
                        </template>
                        
                        <template #activity>
                             <ActivityLogList :logs="activity_logs || []" />
                        </template>
                     </ProfileTabs>
                 </div>
            </div>
        </main>

        <Footer />
    </div>
</template>
