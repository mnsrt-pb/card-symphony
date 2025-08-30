export function loackBack() {
  const modules = import.meta.glob("../assets/Back/*.png", { eager: true });
  return Object.values(modules).map((mod: any) => mod.default);
}

export function loadDeck() {
  const modules = import.meta.glob("../assets/Deck/*.png", { eager: true });
  return Object.values(modules).map((mod: any) => mod.default);
}

export function loadBg() {
  const modules = import.meta.glob("../assets/Background/*.png", { eager: true });
  return Object.values(modules).map((mod: any) => mod.default);
}