import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const locales = ['tr', 'en', 'ar'];
const langDir = path.join(__dirname, '../lang');

const dictionaries = {};

// Load all dictionaries
locales.forEach(locale => {
    const filePath = path.join(langDir, `${locale}.json`);
    if (fs.existsSync(filePath)) {
        dictionaries[locale] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
        console.error(`❌ Missing dictionary file: ${locale}.json`);
        process.exit(1);
    }
});

// Get all unique keys
const allKeys = new Set();
Object.values(dictionaries).forEach(dict => {
    Object.keys(dict).forEach(key => allKeys.add(key));
});

let hasErrors = false;

// Check each locale against all keys
locales.forEach(locale => {
    const dictKeys = new Set(Object.keys(dictionaries[locale]));
    const missing = [...allKeys].filter(key => !dictKeys.has(key));

    if (missing.length > 0) {
        hasErrors = true;
        console.error(`\n❌ Missing keys in [${locale}]:`);
        missing.forEach(key => console.error(`   - ${key}`));
    }
});

if (hasErrors) {
    console.error('\n⚠️  Translation mismatch detected!');
    process.exit(1);
} else {
    console.log('\n✅ All translation keys are synced.');
}
