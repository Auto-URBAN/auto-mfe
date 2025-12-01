interface ShareData {
	title: string
	text: string
	url: string
}

interface ShareOptions {
	whatsapp?: boolean
	facebook?: boolean
	twitter?: boolean
	linkedin?: boolean
	telegram?: boolean
	copyLink?: boolean
}

export const useShare = () => {
	//Função para compartilhar via Web Share API nativo
	const shareNative = async (data: ShareData): Promise<boolean> => {
		if (navigator.share && navigator.canShare && navigator.canShare(data)) {
			try {
				await navigator.share(data)
				return true
			} catch (error) {
				console.log('Compartilhamento cancelado:', error)
				return false
			}
		}
		return false
	}

	//Função para compartilhar via WhatsApp
	const shareWhatsApp = (data: ShareData): void => {
		const text = encodeURIComponent(`${data.text}\n\n${data.url}`)
		const whatsappUrl = `https://wa.me/?text=${text}`
		window.open(whatsappUrl, '_blank', 'width=600,height=400')
	}

	//Função para compartilhar via Facebook
	const shareFacebook = (data: ShareData): void => {
		const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`
		window.open(facebookUrl, '_blank', 'width=600,height=400')
	}

	//Função para compartilhar via Twitter/X
	const shareTwitter = (data: ShareData): void => {
		const text = encodeURIComponent(`${data.text} ${data.url}`)
		const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`
		window.open(twitterUrl, '_blank', 'width=600,height=400')
	}

	//Função para compartilhar via LinkedIn
	const shareLinkedIn = (data: ShareData): void => {
		const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`
		window.open(linkedinUrl, '_blank', 'width=600,height=400')
	}

	//Função para compartilhar via Telegram
	const shareTelegram = (data: ShareData): void => {
		const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.text)}`
		window.open(telegramUrl, '_blank', 'width=600,height=400')
	}

	//Função para copiar link
	const copyToClipboard = async (url: string): Promise<boolean> => {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(url)
				return true
			} else {
				//Fallback para navegadores mais antigos
				const textArea = document.createElement('textarea')
				textArea.value = url
				document.body.appendChild(textArea)
				textArea.select()
				document.execCommand('copy')
				document.body.removeChild(textArea)
				return true
			}
		} catch (error) {
			console.error('Erro ao copiar para área de transferência:', error)
			return false
		}
	}

	//Função principal para compartilhar com fallbacks
	const share = async (
		data: ShareData,
		options: ShareOptions = { copyLink: true }
	): Promise<void> => {
		//Tentar compartilhamento nativo primeiro
		const nativeShared = await shareNative(data)
		if (nativeShared) return

		//Se não tem compartilhamento nativo, tentar copiar link como fallback
		if (options.copyLink) {
			const copied = await copyToClipboard(data.url)
			if (copied) {
				//Aqui você pode mostrar uma notificação de sucesso
				console.log('Link copiado para área de transferência!')
			}
		}
	}

	//Função para criar dados de compartilhamento para veículos
	const createVehicleShareData = (
		vehicle: {
			title?: string
			brand: string
			model: string
			year: number
			price: number
			slug?: string
			id?: string
		},
		customUrl?: string
	): ShareData => {
		const vehicleTitle = vehicle.title || `${vehicle.brand} ${vehicle.model} ${vehicle.year}`
		const price = new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
			maximumFractionDigits: 0
		}).format(vehicle.price)

		const url = customUrl || `${window.location.origin}/carros/${vehicle.slug || vehicle.id}`

		return {
			title: vehicleTitle,
			text: `Confira este ${vehicleTitle} por ${price} na Auto URBAN!`,
			url
		}
	}

	//Função para mostrar modal de compartilhamento
	const showShareModal = (data: ShareData) => {
		//Esta função pode ser implementada para mostrar um modal customizado
		//Por enquanto, vamos usar o compartilhamento padrão
		return share(data)
	}

	return {
		shareNative,
		shareWhatsApp,
		shareFacebook,
		shareTwitter,
		shareLinkedIn,
		shareTelegram,
		copyToClipboard,
		share,
		createVehicleShareData,
		showShareModal
	}
}
