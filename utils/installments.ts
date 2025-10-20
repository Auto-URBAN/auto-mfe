import type { Installment, InstallmentResolved } from '../schemas/installments'

export default function calculateInstallments({
	valueTotal = 0,
	valueInitial,
	qtdMonths,
	taxMonth,
	taxFixed = 0
}: Installment): InstallmentResolved {
	const financedValue = valueTotal - valueInitial

	if (taxMonth === 0) {
		const installmentNotInterest = financedValue / qtdMonths
		return {
			installment: parseFloat((installmentNotInterest + taxFixed).toFixed(2)),
			totalPaid: parseFloat(((installmentNotInterest + taxFixed) * qtdMonths).toFixed(2)),
			totalInterest: 0,
			financedValue: parseFloat(financedValue.toFixed(2))
		}
	}

	const i = taxMonth / 100
	const n = qtdMonths
	const PV = financedValue

	const installmentBase = PV * (i / (1 - Math.pow(1 + i, -n)))
	const installment = installmentBase + taxFixed

	const totalPaid = installment * n
	const totalInterest = totalPaid - financedValue - taxFixed * n

	return {
		installment: parseFloat(installment.toFixed(2)),
		totalPaid: parseFloat(totalPaid.toFixed(2)),
		totalInterest: parseFloat(totalInterest.toFixed(2)),
		financedValue: parseFloat(financedValue.toFixed(2))
	}
}
