# Dashi na Ilha da Fruta 🥭

Jogo de corrida/plataforma em **HTML5 Canvas + JavaScript**, com interface em **Bootstrap 5** (instalado via npm, sem CDN), inspirado nos clássicos jogos de plataforma de marsupial dos anos 90 — com personagem, arte e identidade visual **totalmente originais** (não é possível reproduzir personagens registrados, então criamos o **Dashi**, nosso próprio mascote).

## Estrutura de pastas

```
dashi-ilha-fruta/
├── package.json          # dependências (bootstrap, vite)
├── vite.config.js        # configuração do bundler
├── .gitignore
├── index.html            # HTML com grid Bootstrap, navbar, cards e form
├── public/
│   ├── favicon.svg
│   └── assets/           # identidade visual (SVGs originais)
│       ├── logo.svg
│       ├── dashi-hero.svg
│       ├── fruit.svg
│       ├── crate.svg
│       ├── boulder.svg
│       └── bg-jungle.svg
└── src/
    ├── main.js           # importa bootstrap (CSS + JS) via npm e inicializa tudo
    ├── style.css          # tokens de cor/tipografia e identidade visual
    ├── game.js            # motor do jogo (física, colisão, loop)
    ├── sprites.js         # carregamento dos SVGs para o canvas
    └── leaderboard.js     # ranking local (localStorage)
```

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (por padrão `http://localhost:5173`).

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Como jogar

- **Espaço** ou **↑**: pular
- **↓**: giro-ataque (quebra caixas de madeira no ar)
- Colete as **frutas-cristal** (+10 pontos)
- Quebre **caixas** girando sobre elas (+25 pontos)
- Desvie dos **rochedos** — eles não se quebram
- Você tem **3 vidas**; a velocidade aumenta com o tempo
- No celular, use os botões "Pular" e "Giro" abaixo do jogo

O nome digitado no formulário lateral entra automaticamente no ranking local ao final de cada corrida.

## Requisitos técnicos atendidos

- ✅ Bootstrap instalado via `npm install bootstrap`, importado em `src/main.js` (CSS e JS), sem uso de CDN
- ✅ Grid responsivo `container > row > col-*` no layout principal
- ✅ Utilities de cor (`bg-*`, `text-*`), espaçamento (`p-*`, `m-*`, `gap-*`) e tipografia (`fw-bold`, `small`, `fs-*`) aplicadas por todo o HTML
- ✅ Componentes Bootstrap: **Navbar**, **Card** e **Form**
- ✅ `package.json` com `bootstrap` nas dependências
- ✅ `.gitignore` incluindo `node_modules`, `dist`, etc.
