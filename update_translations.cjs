const fs = require('fs');

let content = fs.readFileSync('src/mock/translations.ts', 'utf8');

// Use regex to add `ma: "..."` right after `hi: "..."`
// Handling both double quotes and single quotes if any.
content = content.replace(/hi:\s*("(?:[^"\\]|\\.)*")/g, (match, p1) => {
  return `${match}, ma: ${p1}`;
});

// Update type interface
content = content.replace('export interface TranslationItem {\n  en: string;\n  hi: string;\n}', 'export interface TranslationItem {\n  en: string;\n  hi: string;\n  ma: string;\n}');

// Manual Maithili replacements for prominent keys
content = content.replace(/namaste: \{ en: "Namaste", hi: "नमस्ते", ma: "नमस्ते" \}/, 'namaste: { en: "Namaste", hi: "नमस्ते", ma: "प्रणाम" }');
content = content.replace(/brand_serif: \{ en: "Maithil", hi: "मैथिल", ma: "मैथिल" \}/, 'brand_serif: { en: "Maithil", hi: "मैथिल", ma: "मैथिल" }');

fs.writeFileSync('src/mock/translations.ts', content);
console.log("Translations updated!");
