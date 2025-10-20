# Remoção Automática de Comentários

## ✅ Configuração Completa

O projeto está configurado para **remover automaticamente todos os comentários** de arquivos Vue, TypeScript e JavaScript.

---

## 📋 O Que Foi Configurado

### 1. **Script de Remoção de Comentários**

- 📄 Arquivo: `scripts/strip-comments.js`
- 🎯 Remove:
  - ✅ Comentários HTML `<!-- -->`
  - ✅ Comentários de linha `//`
  - ✅ Comentários de bloco `/* */`
  - ✅ Linhas em branco excessivas

### 2. **Diretórios Processados**

```
components/
pages/
layouts/
composables/
utils/
schemas/
server/
plugins/
middleware/
```

### 3. **Extensões Suportadas**

- `.vue` (Template + Script + Style)
- `.ts` (TypeScript)
- `.js` (JavaScript)
- `.mjs` (ES Modules)

---

## 🚀 Como Usar

### **Opção 1: Comando Manual**

```bash
# Remover todos os comentários do projeto
pnpm strip-comments

# Remover comentários + formatar com Prettier
pnpm format
```

### **Opção 2: Git Hooks (Automático)**

- ✅ **lint-staged** configurado
- ✅ Executa automaticamente no `git commit`
- ✅ Processa apenas arquivos staged

### **Opção 3: VS Code Save (Requer Extensão)**

- Instale: **Run on Save** (emeraldwalk.runonsave)
- Remove comentários automaticamente ao salvar
- Configurado em `.vscode/settings.json`

---

## 📦 Pacotes Instalados

```json
{
	"husky": "^9.1.7",
	"lint-staged": "^16.2.4",
	"strip-comments": "^2.0.1"
}
```

---

## ⚙️ Scripts Disponíveis

| Script                | Descrição                     |
| --------------------- | ----------------------------- |
| `pnpm strip-comments` | Remove todos os comentários   |
| `pnpm format`         | Remove comentários + Prettier |
| `pnpm format:check`   | Verifica formatação           |
| `pnpm lint:fix`       | Fix ESLint                    |

---

## 🔧 Configurações

### **package.json**

```json
{
	"lint-staged": {
		"*.{vue,ts,js,mjs}": ["node scripts/strip-comments.js", "prettier --write", "eslint --fix"]
	}
}
```

### **eslint.config.mjs**

```js
export default withNuxt({
	rules: {
		'no-inline-comments': 'error',
		'spaced-comment': ['error', 'never'],
		'no-warning-comments': 'off'
	}
})
```

### **.vscode/settings.json**

```json
{
	"emeraldwalk.runonsave": {
		"commands": [
			{
				"match": "\\.(vue|ts|js|mjs)$",
				"cmd": "node scripts/strip-comments.js ${file}"
			}
		]
	}
}
```

---

## 📊 Exemplo de Uso

### **Antes:**

```vue
<template>
	<!-- Header principal -->
	<div class="header">
		<h1>Título</h1>
		<!-- Título da página -->
	</div>
</template>

<script setup lang="ts">
// Import do Vue
import { ref } from 'vue'

/*
 * Estado reativo
 * @type {Ref<string>}
 */
const title = ref('Hello') // Valor inicial
</script>
```

### **Depois:**

```vue
<template>
	<div class="header">
		<h1>Título</h1>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('Hello')
</script>
```

---

## ✅ Resultado do Teste

```bash
$ pnpm strip-comments

🧹 Removing all comments from source files...

📁 Found 91 files

✓ components\ActiveFiltersFooter.vue
✓ components\AISearchSuggestions.vue
✓ pages\anuncios\index.vue
✓ server\api\vehicles\index.get.ts
... (74 arquivos processados)

✨ Done! Stripped comments from 74 files
```

---

## 🎯 Fluxo de Trabalho Recomendado

### **Desenvolvimento:**

1. Escreva código normalmente (com ou sem comentários)
2. Salve o arquivo → VS Code remove comentários automaticamente (se extensão instalada)
3. OU execute `pnpm format` manualmente

### **Antes de Commit:**

```bash
git add .
git commit -m "feat: nova feature"
```

- ✅ **lint-staged** remove comentários automaticamente
- ✅ Prettier formata o código
- ✅ ESLint corrige problemas

### **CI/CD:**

```bash
pnpm format:check
```

- Valida que não há comentários nem problemas de formatação

---

## 🔍 Troubleshooting

### **Comentários não foram removidos**

```bash
# Execute manualmente
pnpm strip-comments

# Verifique o resultado
git diff
```

### **Erro ao salvar no VS Code**

1. Instale a extensão: **Run on Save**
2. Recarregue o VS Code: `Ctrl+Shift+P` → "Reload Window"

### **Git hook não funciona**

```bash
# Re-instale husky
pnpm prepare

# Verifique os hooks
ls -la .git/hooks/
```

---

## 📝 Notas Importantes

- ⚠️ **Backup:** Faça commit antes de executar pela primeira vez
- ✅ **Seguro:** Script não modifica arquivos sem mudanças
- 🚀 **Performance:** Processa apenas arquivos necessários
- 🎯 **Específico:** Ignora `node_modules`, `.nuxt`, `.output`, etc.

---

**Status**: ✅ Totalmente funcional  
**Última atualização**: Outubro 2025  
**Arquivos processados**: 74 de 91 arquivos
