<template>
	<ClientOnly>
		<div>
			<hr />
			<div class="grid grid-cols-2 gap-4 my-4">
				<UFormGroup label="Valor total" required>
					<InputMoney v-model="valueTotal" />
				</UFormGroup>
				<UFormGroup label="Valor de entrada" required>
					<InputMoney v-model="valueInitial" />
				</UFormGroup>
				<UFormGroup label="Quantidade de meses" required>
					<USelect
						v-model="qtdMonths"
						:options="[
							{ value: 12, label: '12x' },
							{ value: 24, label: '24x' },
							{ value: 36, label: '36x' },
							{ value: 48, label: '48x' },
							{ value: 60, label: '60x' }
						]"
					/>
				</UFormGroup>
				<UFormGroup label="Financeira" required>
					<USelect v-model="bank" :options="banks" />
				</UFormGroup>
				<UFormGroup label="Valor da parcela" required>
					<UiText as="h2" v-if="installment">{{
						new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
							installment
						)
					}}</UiText>
					<UiText as="h2" v-else>R$ *,**</UiText>
				</UFormGroup>
				<UFormGroup label="CET" required>
					<UiText as="h2">%{{ banksList?.[bank]?.taxMonth ?? 0 }} am</UiText>
				</UFormGroup>
			</div>

			<hr class="my-4" />
			<UiButton type="button" class="w-full" variant="primary" @click="calculate"
				>Calcular</UiButton
			>
		</div>
	</ClientOnly>
</template>
<script setup lang="ts">
import type { BankWithTax } from '@/schemas/bank'
const props = defineProps<{
	price: number
}>()

const valueTotal = ref<number>(0)
const valueInitial = ref<number>(0)
const qtdMonths = ref<number>(48)
const bank = ref<number>(0)
const installment = ref<number>(0)

watchEffect(() => {
	valueTotal.value = props.price
	valueInitial.value = props.price * 0.3
})

const { data: banksList } = useAsyncData(
	'banks-with-tax',
	async () => await $fetch('/api/banks/with-tax')
)
const banks = computed(() => {
	return (banksList.value || []).map((bank, key: number) => {
		const parsedBank = bank as unknown as BankWithTax
		return {
			value: key,
			label: parsedBank.bankName
		}
	})
})

watchEffect(() => {
	if (bank.value) {
		calculate()
	}
})

const calculate = () => {
	const selectedBank = banksList.value?.[bank.value] as BankWithTax | undefined
	console.log('input', {
		valueTotal: valueTotal.value,
		valueInitial: valueInitial.value,
		qtdMonths: qtdMonths.value,
		taxMonth: selectedBank?.taxMonth ?? 0,
		taxFixed: selectedBank?.taxYear ?? 0
	})
	const calculateInstallment = installments({
		valueTotal: valueTotal.value,
		valueInitial: valueInitial.value,
		qtdMonths: qtdMonths.value,
		taxMonth: selectedBank?.taxMonth ?? 0,
		taxFixed: selectedBank?.taxYear ?? 0
	})
	installment.value = calculateInstallment.installment
}
</script>
