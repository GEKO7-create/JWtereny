# Tereny Management App - Instrukcja

## 🎯 Opis aplikacji
Progressive Web App (PWA) do zarządzania terenami głoszenia. Działa na iOS, iPadOS i można ją dodać do ekranu głównego iPhone'a i iPada.

## 📱 Funkcje
- ✅ Filtrowanie terenów: wolne, zajęte, spóźnione
- ✅ Sortowanie: po numerze, ilości dni, statusie
- ✅ Szybkie przypisywanie terenów
- ✅ Synchronizacja z Google Sheets
- ✅ Działa offline (PWA)
- ✅ Optymalizacja dla iOS/iPadOS

## 🚀 Instalacja na GitHub Pages

### Krok 1: Utwórz repozytorium GitHub
1. Zaloguj się na GitHub
2. Utwórz nowe repozytorium (np. `tereny-app`)
3. Może być publiczne lub prywatne

### Krok 2: Wgraj pliki
Przenieś do repozytorium następujące pliki:
- `index.html` - główna strona aplikacji
- `app.js` - logika aplikacji
- `manifest.json` - konfiguracja PWA
- `sw.js` - service worker dla offline
- `icon-192.png` i `icon-512.png` - ikony aplikacji

**Jak wygenerować ikony:**
1. Otwórz plik `generate-icons.html` w przeglądarce
2. Automatycznie pobiorą się dwie ikony
3. Przenieś je do repozytorium

### Krok 3: Włącz GitHub Pages
1. W repozytorium przejdź do: **Settings** → **Pages**
2. W sekcji "Source" wybierz: **main branch**
3. Zapisz
4. Po chwili aplikacja będzie dostępna pod adresem:
   ```
   https://TWOJA-NAZWA.github.io/tereny-app/
   ```

## 🔑 Konfiguracja Google Sheets API

### Krok 1: Utwórz Google Cloud Project
1. Przejdź do: https://console.cloud.google.com/
2. Utwórz nowy projekt
3. Włącz **Google Sheets API**:
   - APIs & Services → Enable APIs and Services
   - Wyszukaj "Google Sheets API"
   - Kliknij Enable

### Krok 2: Utwórz API Key
1. APIs & Services → Credentials
2. Kliknij "+ CREATE CREDENTIALS" → API key
3. Skopiuj wygenerowany klucz
4. (Opcjonalnie) Ogranicz klucz do Google Sheets API

### Krok 3: Udostępnij arkusz Google Sheets
1. Otwórz swój arkusz TERENY-KARTY
2. Kliknij "Udostępnij" (Share)
3. Zmień ustawienia na: **"Anyone with the link can view"**
4. Skopiuj ID arkusza z URL:
   ```
   https://docs.google.com/spreadsheets/d/[TO_JEST_ID]/edit
   ```

## 📲 Dodawanie do ekranu głównego iOS

### iPhone/iPad:
1. Otwórz aplikację w Safari
2. Kliknij przycisk "Udostępnij" (kwadrat ze strzałką)
3. Przewiń w dół i wybierz **"Dodaj do ekranu początkowego"**
4. Potwierdź nazwę i kliknij "Dodaj"
5. Ikona aplikacji pojawi się na ekranie głównym

## 🎨 Struktura arkusza Google Sheets

### Arkusz 1: Główne dane terenów
- Kolumna A: numery terenów
- Pozostałe kolumny: dane głosicieli, daty rozpoczęcia/zakończenia
- **Aplikacja zaktualizuje tylko wartości komórek, zachowa formatowanie**

### Arkusz 2: Obliczenia statusów
- Formuły sprawdzające status terenu (wolne/zajęte/spóźnione)
- Liczenie dni od rozpoczęcia

### Ostatni arkusz: "lista głosicieli"
- Lista wszystkich dostępnych głosicieli
- Aplikacja wczyta te nazwy do listy rozwijanej

## 🔧 Pierwsze uruchomienie aplikacji

1. Otwórz aplikację w przeglądarce
2. Wprowadź:
   - **ID Google Sheets** - skopiowane z URL arkusza
   - **Google API Key** - wygenerowany w Google Cloud Console
3. Kliknij "Połącz z Google Sheets"
4. Aplikacja zapisze konfigurację w pamięci urządzenia

## 💡 Użytkowanie

### Przeglądanie terenów:
- Użyj filtrów na górze: Wszystkie / Wolne / Zajęte / Spóźnione
- Sortuj według: numeru, ilości dni, statusu

### Przypisywanie terenu:
1. Kliknij zielony przycisk "+" w prawym dolnym rogu
2. Wypełnij formularz:
   - Numer terenu
   - Głosiciel (z listy)
   - Data rozpoczęcia
   - Data zakończenia (opcjonalnie)
3. Kliknij "Zapisz przypisanie"
4. Zmiany zostaną zapisane w Google Sheets

## ⚠️ Ważne uwagi

### Struktura kolumn
Aplikacja **musi być dostosowana** do struktury Twojego arkusza. W pliku `app.js` w funkcji `assignTerrain()` znajduje się kod:

```javascript
// Update głosiciel in column B, startDate in column C, endDate in column D
await this.updateSheetCell(`${sheetName}!B${row}`, głosiciel);
await this.updateSheetCell(`${sheetName}!C${row}`, startDate);
```

**Musisz zmienić litery kolumn (B, C, D)** na odpowiadające Twojej strukturze arkusza!

### Jak znaleźć właściwe kolumny?
1. Otwórz swój arkusz Google Sheets
2. Zobacz, w których kolumnach znajdują się:
   - Imiona głosicieli
   - Daty rozpoczęcia
   - Daty zakończenia
3. Zaktualizuj kod w `app.js` odpowiednio

### Bezpieczeństwo
- **Nie udostępniaj publicznie swojego API Key**
- API Key jest zapisywany lokalnie na urządzeniu
- Jeśli chcesz udostępnić kod publicznie, usuń API Key przed wgraniem

## 🐛 Rozwiązywanie problemów

### "Błąd połączenia"
- Sprawdź czy API Key jest poprawny
- Sprawdź czy Google Sheets API jest włączony
- Sprawdź czy arkusz jest udostępniony (Anyone with link can view)

### "Nie można załadować danych"
- Sprawdź ID arkusza w URL
- Sprawdź nazwę arkusza w `app.js` (domyślnie "Sheet1")
- Sprawdź czy arkusz ma dane w kolumnie A

### Aplikacja nie zapisuje zmian
- Sprawdź czy kolumny w `app.js` są poprawne (B, C, D)
- Sprawdź czy masz uprawnienia do edycji arkusza
- Może być potrzebne OAuth zamiast API Key dla zapisów

## 📞 Następne kroki

Po przetestowaniu podstawowej wersji możemy:
1. Dostosować parsing danych do Twojej dokładnej struktury arkusza
2. Dodać więcej funkcji (edycja, historia zmian)
3. Ulepszyć UI/UX
4. Dodać powiadomienia push

---

**Wersja:** 1.0  
**Data utworzenia:** 2026-09-14  
**Kompatybilność:** iOS 15+, iPadOS 15+, Safari, Chrome
