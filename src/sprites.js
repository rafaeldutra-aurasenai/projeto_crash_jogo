// Carrega as artes SVG originais do jogo como Image() prontas para o canvas.

const paths = {
  hero: '/assets/hero-sheet.png',
  fruit: '/assets/fruit.svg',
  crate: '/assets/crate.svg',
  boulder: '/assets/boulder.svg',
  background: '/assets/fundo.jpeg'
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function loadSprites() {
  const entries = await Promise.all(
    Object.entries(paths).map(async ([key, src]) => [key, await loadImage(src)])
  );
  return Object.fromEntries(entries);
}