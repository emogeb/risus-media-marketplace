<script setup lang="ts">
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import FilterSection from '@/components/filters/FilterSection.vue';
import CheckboxList from '@/components/filters/CheckboxList.vue';
import PriceRangeInputs from '@/components/filters/PriceRangeInputs.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Button from '@/components/ui/Button.vue';

interface Category {
  id: number;
  name: string;
  slug: string;
  productsCount: number;
}

interface Store {
  id: number;
  name: string;
  slug: string;
  productsCount: number;
}

interface Filters {
  search: string;
  category: string;
  store: string;
  sort: string;
  min_price: number | null;
  max_price: number | null;
  type?: string;
  size?: string[];
  [key: string]: any;
}

interface Props {
  categories: Category[];
  stores: Store[];
  filters: Filters;
  filterOptions?: {
    attributes: Array<{
      code: string;
      name: string;
      data_type: string;
      values: Array<{ value: string; slug: string }>;
    }>;
    types: Array<{ label: string; value: string }>;
  };
}

const props = defineProps<Props>();

const searchQuery = ref(props.filters.search);
const selectedCategory = ref(props.filters.category);
const selectedStore = ref(props.filters.store);
const selectedSort = ref(props.filters.sort);
const minPrice = ref(props.filters.min_price?.toString?.() || (props.filters.min_price ? String(props.filters.min_price) : ''));
const maxPrice = ref(props.filters.max_price?.toString?.() || (props.filters.max_price ? String(props.filters.max_price) : ''));

const selectedType = ref(props.filters.type || 'all');
const selectedSize = ref<string[]>(Array.isArray(props.filters.size) ? props.filters.size : []);

const attributeSelections = ref<Record<string, string[]>>({});
if (props.filterOptions?.attributes?.length) {
  for (const attr of props.filterOptions.attributes) {
    const key = attr.code;
    const v = props.filters[key];
    attributeSelections.value[key] = Array.isArray(v) ? v : [];
  }
}

const applyFilters = () => {
  const params: any = {
    search: searchQuery.value || undefined,
    store: selectedStore.value !== 'all' ? selectedStore.value : undefined,
    sort: selectedSort.value,
    min_price: minPrice.value || undefined,
    max_price: maxPrice.value || undefined,
    type: selectedType.value !== 'all' ? selectedType.value : undefined,
    size: selectedSize.value?.length ? selectedSize.value : undefined,
  };

  // Dynamic attribute filters (by code)
  for (const [code, values] of Object.entries(attributeSelections.value)) {
    params[code] = values?.length ? values : undefined;
  }

  if (selectedCategory.value && selectedCategory.value !== 'all') {
    router.get(`/collections/${selectedCategory.value}`, params);
  } else {
    router.get('/collections', params);
  }
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  selectedStore.value = 'all';
  selectedSort.value = 'latest';
  minPrice.value = '';
  maxPrice.value = '';
  selectedType.value = 'all';
  selectedSize.value = [];
  for (const k of Object.keys(attributeSelections.value)) {
    attributeSelections.value[k] = [];
  }
  router.get('/collections');
};

const handleCategoryChange = (slug: string) => {
  selectedCategory.value = slug;
  applyFilters();
};

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value ||
    selectedCategory.value !== 'all' ||
    selectedStore.value !== 'all' ||
    minPrice.value ||
    maxPrice.value ||
    selectedSort.value !== 'latest' ||
    selectedType.value !== 'all' ||
    selectedSize.value.length > 0 ||
    Object.values(attributeSelections.value).some(v => v?.length)
  );
});
</script>

<template>
  <aside class="space-y-4">
    <FilterSection title="Arama" :default-open="true">
      <div class="relative">
        <Input
          v-model="searchQuery"
          placeholder="Ürün ara..."
          @keyup.enter="applyFilters"
          class="pr-10"
        />
        <button
          type="button"
          @click="applyFilters"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </FilterSection>

    <FilterSection title="Sıralama" :default-open="true">
      <Select
        v-model="selectedSort"
        :options="[
          { label: 'En Yeni', value: 'latest' },
          { label: 'Fiyat: Artan', value: 'price_asc' },
          { label: 'Fiyat: Azalan', value: 'price_desc' },
          { label: 'İsim: A-Z', value: 'name' }
        ]"
        @change="applyFilters"
      />
    </FilterSection>

    <FilterSection title="Kategori" :default-open="true">
      <div class="space-y-2">
        <button
          type="button"
          @click="handleCategoryChange('all')"
          :class="[
            'w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
            selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-gray-50 text-gray-700 hover:bg-gray-100',
          ]"
        >
          <span>Tümü</span>
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          @click="handleCategoryChange(category.slug)"
          :class="[
            'w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
            selectedCategory === category.slug ? 'bg-primary text-primary-foreground' : 'bg-gray-50 text-gray-700 hover:bg-gray-100',
          ]"
        >
          <span>{{ category.name }}</span>
          <span class="text-xs opacity-70">({{ category.productsCount }})</span>
        </button>
      </div>
    </FilterSection>

    <FilterSection title="Fiyat" :default-open="true">
      <PriceRangeInputs v-model:min="minPrice" v-model:max="maxPrice" currency-label="₺" />
      <Button @click="applyFilters" class="mt-3 w-full">
        Uygula
      </Button>
    </FilterSection>

    <FilterSection title="Mağaza" :default-open="false" :count-label="`${stores.length} mağaza`">
      <Select
        v-model="selectedStore"
        :options="[
            { label: 'Tümü', value: 'all' },
            ...stores.map(s => ({ label: `${s.name} (${s.productsCount})`, value: s.slug }))
        ]"
        @change="applyFilters"
      />
    </FilterSection>

    <FilterSection v-if="filterOptions?.types?.length" title="Tip" :default-open="false">
      <div class="space-y-2">
        <label class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50">
          <input
            type="radio"
            name="type"
            value="all"
            class="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
            v-model="selectedType"
            @change="applyFilters"
          />
          <span class="text-sm text-gray-800">Tümü</span>
        </label>
        <label
          v-for="t in filterOptions.types"
          :key="t.value"
          class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50"
        >
          <input
            type="radio"
            name="type"
            :value="t.value"
            class="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
            v-model="selectedType"
            @change="applyFilters"
          />
          <span class="text-sm text-gray-800">{{ t.label }}</span>
        </label>
      </div>
    </FilterSection>

    <FilterSection v-if="filterOptions?.attributes?.some(a => a.code === 'size')" title="Beden" :default-open="false">
      <CheckboxList
        v-model="selectedSize"
        :options="(filterOptions?.attributes?.find(a => a.code === 'size')?.values || []).map(v => ({ label: v.value, value: v.slug }))"
      />
      <Button variant="outline" @click="applyFilters" class="mt-3 w-full">
        Uygula
      </Button>
    </FilterSection>

    <FilterSection
      v-for="attr in (filterOptions?.attributes || []).filter(a => !['size'].includes(a.code))"
      :key="attr.code"
      :title="attr.name"
      :default-open="false"
    >
      <CheckboxList
        v-model="attributeSelections[attr.code]"
        :options="attr.values.map(v => ({ label: v.value, value: v.slug }))"
      />
      <button
        type="button"
        @click="applyFilters"
        class="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        Uygula
      </button>
    </FilterSection>

    <Button
      v-if="hasActiveFilters"
      variant="outline"
      @click="clearFilters"
      class="w-full"
    >
      Tüm Filtreleri Temizle
    </Button>
  </aside>
</template>
