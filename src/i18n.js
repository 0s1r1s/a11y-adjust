// Translations. Plain text only: strings are always inserted via textContent.

const KEYS = [
  'title', 'close', 'text', 'visual', 'interaction', 'reading',
  'textSize', 'decrease', 'increase', 'lineHeight', 'letterSpacing', 'readableFont',
  'highContrast', 'grayscale', 'highlightLinks', 'highlightHeadings',
  'reduceMotion', 'focusHighlight', 'largeCursor', 'readingGuide', 'readingMask',
  'reset', 'resetDone', 'note'
];

// Each entry lists the values in the order of KEYS.
const TABLE = {
  en: [
    'Accessibility preferences', 'Close', 'Text', 'Visual', 'Interaction', 'Reading',
    'Text size', 'Decrease text size', 'Increase text size', 'Line height', 'Letter spacing', 'Readable font',
    'High contrast', 'Grayscale', 'Highlight links', 'Highlight headings',
    'Reduce motion', 'Focus highlight', 'Large cursor', 'Reading guide', 'Reading mask',
    'Reset all', 'All preferences reset.', 'Preferences are stored only in this browser.'
  ],
  de: [
    'Barrierefreiheit anpassen', 'Schließen', 'Text', 'Darstellung', 'Bedienung', 'Lesen',
    'Textgröße', 'Text verkleinern', 'Text vergrößern', 'Zeilenabstand', 'Zeichenabstand', 'Gut lesbare Schrift',
    'Hoher Kontrast', 'Graustufen', 'Links hervorheben', 'Überschriften hervorheben',
    'Bewegung reduzieren', 'Fokus hervorheben', 'Großer Mauszeiger', 'Leselinie', 'Lesemaske',
    'Alles zurücksetzen', 'Alle Einstellungen zurückgesetzt.', 'Einstellungen werden nur in diesem Browser gespeichert.'
  ],
  fr: [
    "Préférences d'accessibilité", 'Fermer', 'Texte', 'Affichage', 'Interaction', 'Lecture',
    'Taille du texte', 'Réduire le texte', 'Agrandir le texte', 'Interligne', 'Espacement des lettres', 'Police lisible',
    'Contraste élevé', 'Niveaux de gris', 'Surligner les liens', 'Surligner les titres',
    'Réduire les animations', 'Mettre en évidence le focus', 'Grand curseur', 'Guide de lecture', 'Masque de lecture',
    'Tout réinitialiser', 'Toutes les préférences ont été réinitialisées.', 'Les préférences sont enregistrées uniquement dans ce navigateur.'
  ],
  es: [
    'Preferencias de accesibilidad', 'Cerrar', 'Texto', 'Visual', 'Interacción', 'Lectura',
    'Tamaño del texto', 'Reducir texto', 'Aumentar texto', 'Interlineado', 'Espaciado entre letras', 'Fuente legible',
    'Alto contraste', 'Escala de grises', 'Resaltar enlaces', 'Resaltar encabezados',
    'Reducir movimiento', 'Resaltar foco', 'Cursor grande', 'Guía de lectura', 'Máscara de lectura',
    'Restablecer todo', 'Todas las preferencias se han restablecido.', 'Las preferencias se guardan solo en este navegador.'
  ],
  it: [
    'Preferenze di accessibilità', 'Chiudi', 'Testo', 'Visualizzazione', 'Interazione', 'Lettura',
    'Dimensione del testo', 'Riduci il testo', 'Ingrandisci il testo', 'Interlinea', 'Spaziatura lettere', 'Carattere leggibile',
    'Contrasto elevato', 'Scala di grigi', 'Evidenzia link', 'Evidenzia titoli',
    'Riduci animazioni', 'Evidenzia focus', 'Cursore grande', 'Guida di lettura', 'Maschera di lettura',
    'Ripristina tutto', 'Tutte le preferenze sono state ripristinate.', 'Le preferenze sono salvate solo in questo browser.'
  ],
  pt: [
    'Preferências de acessibilidade', 'Fechar', 'Texto', 'Visual', 'Interação', 'Leitura',
    'Tamanho do texto', 'Diminuir texto', 'Aumentar texto', 'Altura da linha', 'Espaçamento entre letras', 'Fonte legível',
    'Alto contraste', 'Escala de cinza', 'Destacar links', 'Destacar títulos',
    'Reduzir movimento', 'Destacar foco', 'Cursor grande', 'Guia de leitura', 'Máscara de leitura',
    'Repor tudo', 'Todas as preferências foram repostas.', 'As preferências são guardadas apenas neste navegador.'
  ],
  nl: [
    'Toegankelijkheidsvoorkeuren', 'Sluiten', 'Tekst', 'Weergave', 'Bediening', 'Lezen',
    'Tekstgrootte', 'Tekst verkleinen', 'Tekst vergroten', 'Regelafstand', 'Letterafstand', 'Leesbaar lettertype',
    'Hoog contrast', 'Grijstinten', 'Links markeren', 'Koppen markeren',
    'Beweging beperken', 'Focus markeren', 'Grote cursor', 'Leeslijn', 'Leesmasker',
    'Alles herstellen', 'Alle voorkeuren zijn hersteld.', 'Voorkeuren worden alleen in deze browser opgeslagen.'
  ],
  pl: [
    'Ustawienia dostępności', 'Zamknij', 'Tekst', 'Wygląd', 'Obsługa', 'Czytanie',
    'Rozmiar tekstu', 'Zmniejsz tekst', 'Powiększ tekst', 'Wysokość linii', 'Odstępy między literami', 'Czytelna czcionka',
    'Wysoki kontrast', 'Skala szarości', 'Wyróżnij linki', 'Wyróżnij nagłówki',
    'Ogranicz animacje', 'Wyróżnij fokus', 'Duży kursor', 'Linijka do czytania', 'Maska do czytania',
    'Resetuj wszystko', 'Wszystkie ustawienia zostały zresetowane.', 'Ustawienia są zapisywane tylko w tej przeglądarce.'
  ]
};

export const LANGUAGES = Object.keys(TABLE);

// Accepts a BCP 47 tag such as "de-AT" and returns a supported language code.
export function resolveLanguage(...candidates) {
  for (const tag of candidates) {
    if (typeof tag !== 'string') continue;
    const primary = tag.trim().toLowerCase().split(/[-_]/)[0];
    if (TABLE[primary]) return primary;
  }
  return 'en';
}

export function messages(language) {
  const values = TABLE[language] || TABLE.en;
  const result = {};
  KEYS.forEach((key, i) => {
    result[key] = values[i];
  });
  return result;
}
