# Tereny Management App

Progressive Web App do zarządzania terenami głoszenia. Zoptymalizowana dla iOS i iPadOS.

## 🚀 Quick Start

1. Utwórz repozytorium na GitHub
2. Wgraj wszystkie pliki z tego folderu
3. Włącz GitHub Pages w ustawieniach repozytorium
4. Skonfiguruj Google Sheets API (instrukcja w README.md)
5. Otwórz aplikację na iPhone/iPad i dodaj do ekranu głównego

## 📁 Struktura projektu

```
tereny-app/
├── index.html          # Główna strona aplikacji
├── app.js              # Logika aplikacji i Google Sheets API
├── manifest.json       # Konfiguracja PWA
├── sw.js               # Service Worker (offline support)
├── icon-192.png        # Ikona 192x192
├── icon-512.png        # Ikona 512x512
├── generate-icons.html # Generator ikon
└── README.md           # Pełna dokumentacja
```

## ⚙️ Wymagana konfiguracja

Przed użyciem aplikacji musisz:
1. Uzyskać Google API Key (Google Cloud Console)
2. Włączyć Google Sheets API
3. Udostępnić arkusz jako "Anyone with link can view"
4. Dostosować nazwy arkuszy w `app.js` (jeśli różnią się od domyślnych)

## 🔧 Dostosowanie do Twojego arkusza

**WAŻNE:** Musisz zmodyfikować `app.js` aby dopasować kolumny do Twojego arkusza!

W funkcji `assignTerrain()` znajdź i zaktualizuj:

```javascript
// Zmień B, C, D na odpowiednie kolumny w Twoim arkuszu:
await this.updateSheetCell(`${sheetName}!B${row}`, głosiciel);
await this.updateSheetCell(`${sheetName}!C${row}`, startDate);
await this.updateSheetCell(`${sheetName}!D${row}`, endDate);
```

## 📱 Instalacja na urządzeniu

### iOS/iPadOS (Safari):
1. Otwórz aplikację w Safari
2. Kliknij przycisk "Udostępnij"
3. Wybierz "Dodaj do ekranu początkowego"
4. Gotowe!

## 📖 Szczegółowa dokumentacja

Zobacz `README.md` dla pełnej instrukcji konfiguracji i użytkowania.

## 🎨 Funkcje

- ✅ Lista terenów z filtrowaniem (wolne/zajęte/spóźnione)
- ✅ Sortowanie (numer/dni/status)
- ✅ Szybkie przypisywanie terenów
- ✅ Synchronizacja z Google Sheets w czasie rzeczywistym
- ✅ Zachowuje formatowanie arkusza
- ✅ Działa offline (PWA)
- ✅ Zoptymalizowane dla urządzeń mobilnych

---

**Wersja:** 1.0  
**Data:** 2026-09-14  
**Kompatybilność:** iOS 15+, iPadOS 15+
