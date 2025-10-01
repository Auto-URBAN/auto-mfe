<template>
  <div class="space-y-4">
    <!-- Header with back button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="heroicons:building-office-2-20-solid" class="w-3 h-3 text-blue-600" />
        </div>
        <label class="text-sm font-medium text-gray-800">
          {{ currentState === 'brands' ? 'Escolha a Marca' : `Modelos da ${selectedBrandName}` }}
        </label>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          v-if="currentState === 'models'"
          @click="backToBrands"
          class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4" />
          Voltar
        </button>
        
      </div>
    </div>

    <!-- Selected Brand-Model combinations -->
    <div v-if="selectedBrandModels.length > 0" class="space-y-2">
      <p class="text-xs text-gray-500 uppercase tracking-wide font-medium">Selecionados:</p>
      <div class="flex flex-wrap gap-2">
        <div 
          v-for="(combo, index) in selectedBrandModels" 
          :key="`combo-${index}`"
          class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm border border-blue-200"
        >
          <img 
            :src="combo.brandLogo" 
            :alt="combo.brandName"
            class="w-4 h-4 object-contain mr-2"
            @error="onImageError"
          />
          <span class="font-medium">{{ combo.brandName }}</span>
          <Icon name="heroicons:chevron-right-20-solid" class="w-3 h-3 mx-1 text-gray-400" />
          <span>{{ combo.modelName }}</span>
          <button @click="removeBrandModel(index)" class="ml-2 hover:bg-blue-200 rounded-full p-1">
            <Icon name="heroicons:x-mark-20-solid" class="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <!-- Add Another Brand Button -->
      <div class="mt-3">
        <button 
          @click="addAnotherBrand"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-sm font-medium"
        >
          <Icon name="heroicons:plus-20-solid" class="w-4 h-4" />
          Adicionar outra marca
        </button>
      </div>
    </div>

    <!-- Brand Selection State -->
    <div v-if="currentState === 'brands' && (selectedBrandModels.length === 0 || showBrandsAfterSelection)" class="space-y-3 overflow-y-scroll max-h-80">
      <div class="grid grid-cols-2 gap-2">
        <div 
          v-for="brand in brands" 
          :key="brand.id"
          @click="selectBrand(brand)"
          class="p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300 group relative"
        >
          
            <div class="flex flex-col justify-center items-center">
              <div class="flex items-center justify-center w-12 h-12">
                <img 
                :src="brand.logo" 
                :alt="brand.name"
                class="object-contain group-hover:scale-110 transition-transform"
                @error="onImageError"
              />
              </div>
              <span class="text-sm font-medium">{{ brand.name }}</span>
            </div>
            <span class="text-xs text-gray-500 absolute right-2 top-2">{{ brand.count }}</span>
        </div>
      </div>
    </div>

    <!-- Model Selection State -->
    <div v-else-if="currentState === 'models' && selectedBrand" class="space-y-3">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div class="flex items-center gap-2">
          <img 
            :src="selectedBrand.logo" 
            :alt="selectedBrand.name"
            class="w-5 h-5 object-contain"
            @error="onImageError"
          />
          <span class="text-sm font-medium text-blue-800">{{ selectedBrand.name }}</span>
          <span class="text-xs text-blue-600">{{ availableModels.length }} modelos disponíveis</span>
          <span v-if="selectedModelsForCurrentBrand.length > 0" class="text-xs text-green-600 ml-auto">
            {{ selectedModelsForCurrentBrand.length }} selecionado{{ selectedModelsForCurrentBrand.length > 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <div class="space-y-2 max-h-64 overflow-y-auto">
        <div 
          v-for="model in availableModels" 
          :key="model.id"
          @click="toggleModel(model)"
          class="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="isModelSelected(model.id) ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'"
        >
          <div class="flex items-center gap-3">
            <!-- Checkbox -->
            <div class="relative">
              <input 
                type="checkbox" 
                :checked="isModelSelected(model.id)"
                @click.stop
                @change="toggleModel(model)"
                class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
            </div>
            <span class="text-sm font-medium">{{ model.name }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">{{ model.count }} disponíveis</span>
            <Icon 
              :name="isModelSelected(model.id) ? 'heroicons:check-circle-20-solid' : 'heroicons:chevron-right-20-solid'" 
              class="w-4 h-4"
              :class="isModelSelected(model.id) ? 'text-purple-500' : 'text-gray-400'"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 pt-3 border-t">
        <UiButton 
          @click="backToBrands"
          variant="outline" 
          size="sm"
          class="flex-1"
        >
          <Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4 mr-1" />
          Voltar
        </UiButton>
        
        <UiButton 
          @click="finishModelSelection"
          :disabled="selectedModelsForCurrentBrand.length === 0"
          size="sm"
          class="flex-1"
        >
          <Icon name="heroicons:check-20-solid" class="w-4 h-4 mr-1" />
          Adicionar {{ selectedModelsForCurrentBrand.length }} modelo{{ selectedModelsForCurrentBrand.length > 1 ? 's' : '' }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Brand {
  id: string
  name: string
  logo: string
  count: number
  models: string[]
}

interface Model {
  id: string
  name: string
  brandId: string
  count: number
}

interface BrandModelCombo {
  brandId: string
  brandName: string
  brandLogo: string
  modelId: string
  modelName: string
}

interface Props {
  brands: Brand[]
  models: Model[]
}

interface Emits {
  (e: 'update:selection', combos: BrandModelCombo[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const currentState = ref<'brands' | 'models' | 'hidden'>('brands')
const selectedBrand = ref<Brand | null>(null)
const selectedBrandModels = ref<BrandModelCombo[]>([])
const showBrandsAfterSelection = ref(false)
const selectedModelsForCurrentBrand = ref<string[]>([])

// Computed
const selectedBrandName = computed(() => selectedBrand.value?.name || '')

const availableModels = computed(() => {
  if (!selectedBrand.value) return []
  return props.models.filter(model => model.brandId === selectedBrand.value!.id)
})

// Methods
const selectBrand = (brand: Brand) => {
  selectedBrand.value = brand
  selectedModelsForCurrentBrand.value = []
  currentState.value = 'models'
}

const toggleModel = (model: Model) => {
  const index = selectedModelsForCurrentBrand.value.indexOf(model.id)
  if (index > -1) {
    selectedModelsForCurrentBrand.value.splice(index, 1)
  } else {
    selectedModelsForCurrentBrand.value.push(model.id)
  }
}

const isModelSelected = (modelId: string): boolean => {
  return selectedModelsForCurrentBrand.value.includes(modelId)
}

const finishModelSelection = () => {
  if (!selectedBrand.value || selectedModelsForCurrentBrand.value.length === 0) return
  
  // Create combos for all selected models
  const selectedModels = availableModels.value.filter(model => 
    selectedModelsForCurrentBrand.value.includes(model.id)
  )
  
  selectedModels.forEach(model => {
    const combo: BrandModelCombo = {
      brandId: selectedBrand.value!.id,
      brandName: selectedBrand.value!.name,
      brandLogo: selectedBrand.value!.logo,
      modelId: model.id,
      modelName: model.name
    }
    selectedBrandModels.value.push(combo)
  })
  
  emit('update:selection', selectedBrandModels.value)
  
  // Hide brands after selection
  selectedBrand.value = null
  selectedModelsForCurrentBrand.value = []
  currentState.value = 'hidden'
  showBrandsAfterSelection.value = false
}

const selectModel = (model: Model) => {
  // This method is kept for backward compatibility but now just toggles
  toggleModel(model)
}

const backToBrands = () => {
  selectedBrand.value = null
  selectedModelsForCurrentBrand.value = []
  currentState.value = 'brands'
  showBrandsAfterSelection.value = true
}

const addAnotherBrand = () => {
  selectedModelsForCurrentBrand.value = []
  currentState.value = 'brands'
  showBrandsAfterSelection.value = true
}

const removeBrandModel = (index: number) => {
  selectedBrandModels.value.splice(index, 1)
  emit('update:selection', selectedBrandModels.value)
}

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

// Watch for external clear
defineExpose({
  clearSelection: () => {
    selectedBrandModels.value = []
    currentState.value = 'brands'
    showBrandsAfterSelection.value = false
  }
})
</script>