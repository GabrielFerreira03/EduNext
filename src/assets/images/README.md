# Pasta de Imagens - EduNext

## 📁 Estrutura de Imagens

Esta pasta contém todas as imagens utilizadas na aplicação EduNext.

### 🎨 Logo da Aplicação

**Arquivo esperado:** `logo.png`

#### Especificações da Logo:
- **Formato recomendado:** PNG (com transparência) ou SVG
- **Dimensões recomendadas:** 200x50px ou proporção similar
- **Altura máxima:** 50px (será redimensionada automaticamente)
- **Fundo:** Transparente (recomendado)
- **Cores:** Preferencialmente em branco ou cores claras para contrastar com o fundo azul do header

#### Como adicionar a logo:
1. Coloque o arquivo da logo nesta pasta (`src/assets/images/`)
2. Renomeie o arquivo para `logo.png` (ou atualize o caminho no header.component.html)
3. A logo aparecerá automaticamente no header antes do texto "EduNext"

#### Formatos suportados:
- ✅ PNG (recomendado para logos com transparência)
- ✅ JPG/JPEG (para fotos)
- ✅ SVG (recomendado para ícones e logos vetoriais)
- ✅ WebP (formato moderno e otimizado)

### 🔧 Personalização

Se você quiser usar um nome diferente para o arquivo da logo, atualize o caminho em:
`src/app/components/header/header.component.html`

```html
<img src="assets/images/SEU_ARQUIVO_AQUI.png" alt="EduNext Logo" class="brand-logo">
```

### 📱 Responsividade

A logo foi configurada para:
- Manter proporção original
- Altura máxima de 50px
- Efeito hover com leve aumento (scale 1.05)
- Adaptação automática em dispositivos móveis

---

**Dica:** Para melhor qualidade, use imagens em alta resolução (2x o tamanho final) para suportar telas de alta densidade (Retina, etc.).