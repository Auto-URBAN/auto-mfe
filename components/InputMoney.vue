<template>
    <UInput
      v-model="formattedValue"
      placeholder="Valor total"
      @input="updateValue"
    />
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    modelValue: Number
  });
  const emit = defineEmits(['update:modelValue']);
  
  const formattedValue = ref('');
  
  watch(
    () => props.modelValue,
    (newValue) => {
      if (!isNaN(newValue)) {
        formattedValue.value = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(newValue);
      } else {
        formattedValue.value = '';
      }
    },
    { immediate: true }
  );
  
  const updateValue = (event) => {
    let rawValue = event.target.value
      .replace(/[^0-9]/g, ''); // Remove tudo que não for número
    
    if (rawValue) {
      let numericValue = parseFloat(rawValue) / 100; // Divide por 100 para obter casas decimais
      emit('update:modelValue', numericValue);
    }
  };
  </script>
  