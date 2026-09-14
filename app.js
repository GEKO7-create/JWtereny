// Tereny Management App - Main JavaScript
const app = {
    // Configuration
    config: {
        sheetId: null,
        apiKey: null,
        sheetName: 'Sheet1', // First sheet with main data
        statusSheetName: 'Sheet2', // Second sheet with status formulas
        głosicieleSheetName: 'lista głosicieli' // Last sheet with głosiciele list
    },

    // State
    state: {
        terrains: [],
        głosiciele: [],
        currentFilter: 'wszystkie',
        currentSort: 'number',
        connected: false
    },

    // Initialize app
    init() {
        // Load saved configuration
        const savedConfig = localStorage.getItem('terenyConfig');
        if (savedConfig) {
            const parsed = JSON.parse(savedConfig);
            this.config.sheetId = parsed.sheetId;
            this.config.apiKey = parsed.apiKey;

            if (this.config.sheetId && this.config.apiKey) {
                document.getElementById('sheetIdInput').value = this.config.sheetId;
                document.getElementById('apiKeyInput').value = this.config.apiKey;
                this.connect();
            }
        }

        // Set default start date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').value = today;

        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(err => {
                console.log('Service Worker registration failed:', err);
            });
        }
    },

    // Connect to Google Sheets
    async connect() {
        const sheetId = document.getElementById('sheetIdInput').value.trim();
        const apiKey = document.getElementById('apiKeyInput').value.trim();

        if (!sheetId || !apiKey) {
            this.showError('Proszę podać ID arkusza i API Key');
            return;
        }

        this.config.sheetId = sheetId;
        this.config.apiKey = apiKey;

        // Save configuration
        localStorage.setItem('terenyConfig', JSON.stringify({
            sheetId: this.config.sheetId,
            apiKey: this.config.apiKey
        }));

        try {
            // Test connection by loading głosiciele
            await this.loadGłosiciele();

            // Load terrain data
            await this.loadTerrains();

            // Switch to app view
            document.getElementById('authSection').classList.add('hidden');
            document.getElementById('appSection').classList.remove('hidden');
            document.getElementById('connectionStatus').textContent = '✓ Połączono';
            document.getElementById('connectionStatus').style.color = '#5CB85C';

            this.state.connected = true;
            this.showSuccess('Połączono z Google Sheets!');
        } catch (error) {
            console.error('Connection error:', error);
            this.showError('Błąd połączenia: ' + error.message);
        }
    },

    // Load głosiciele from last sheet
    async loadGłosiciele() {
        try {
            const range = `${this.config.głosicieleSheetName}!A1:Z100`;
            const data = await this.fetchSheetData(range);

            if (!data || !data.values) {
                throw new Error('Nie znaleziono listy głosicieli');
            }

            // Extract all non-empty text values
            const names = [];
            data.values.forEach(row => {
                row.forEach(cell => {
                    if (cell && typeof cell === 'string' && cell.trim().length > 1) {
                        names.push(cell.trim());
                    }
                });
            });

            this.state.głosiciele = [...new Set(names)].sort(); // Remove duplicates and sort

            // Populate select dropdown
            const select = document.getElementById('głosicielSelect');
            select.innerHTML = '<option value="">Wybierz głosiciela</option>';
            this.state.głosiciele.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });

            console.log(`Loaded ${this.state.głosiciele.length} głosicieli`);
        } catch (error) {
            console.error('Error loading głosiciele:', error);
            throw error;
        }
    },

    // Load terrain data
    async loadTerrains() {
        try {
            // Load main data from first sheet (A1:Z200 to capture all data)
            const mainRange = `${this.config.sheetName}!A1:Z200`;
            const mainData = await this.fetchSheetData(mainRange);

            // Load status data from second sheet
            const statusRange = `${this.config.statusSheetName}!A1:Z200`;
            const statusData = await this.fetchSheetData(statusRange);

            if (!mainData || !mainData.values) {
                throw new Error('Nie można załadować danych terenów');
            }

            // Parse terrain data
            this.state.terrains = this.parseTerrainData(mainData.values, statusData?.values || []);

            console.log(`Loaded ${this.state.terrains.length} terrains`);

            // Render terrain list
            this.renderTerrainList();
        } catch (error) {
            console.error('Error loading terrains:', error);
            throw error;
        }
    },

    // Parse terrain data from sheets
    parseTerrainData(mainData, statusData) {
        const terrains = [];

        // Column A contains terrain numbers
        for (let rowIdx = 0; rowIdx < mainData.length; rowIdx++) {
            const row = mainData[rowIdx];
            const terrainNumber = row[0]; // Column A

            // Skip if not a valid terrain number
            if (!terrainNumber || typeof terrainNumber !== 'number') continue;

            // Find corresponding status data
            let status = 'wolne';
            let daysCount = 0;
            let głosiciel = '';
            let startDate = '';
            let endDate = '';

            // Search for głosiciel and dates in the row (they're scattered horizontally)
            for (let colIdx = 1; colIdx < row.length; colIdx++) {
                const cellValue = row[colIdx];

                if (!cellValue) continue;

                // Check if it's a name (string)
                if (typeof cellValue === 'string' && cellValue.length > 2) {
                    głosiciel = cellValue;
                }

                // Check if it's a date (contains date pattern or is formatted date)
                if (this.isDate(cellValue)) {
                    if (!startDate) {
                        startDate = this.formatDate(cellValue);
                    } else {
                        endDate = this.formatDate(cellValue);
                    }
                }
            }

            // Get status from status sheet if available
            if (statusData[rowIdx]) {
                const statusRow = statusData[rowIdx];

                // Look for status indicators and days count
                for (let colIdx = 0; colIdx < statusRow.length; colIdx++) {
                    const val = statusRow[colIdx];

                    // Check for numeric days count
                    if (typeof val === 'number' && val > 0 && val <= 200) {
                        daysCount = val;

                        // Determine status based on days
                        if (daysCount <= 120) {
                            status = 'zajete';
                        } else {
                            status = 'spoznione';
                        }
                    }

                    // Check for status text
                    if (typeof val === 'string') {
                        const valLower = val.toLowerCase();
                        if (valLower.includes('wolne') || valLower.includes('wolny')) {
                            status = 'wolne';
                        } else if (valLower.includes('zajęt') || valLower.includes('zajety')) {
                            status = 'zajete';
                        } else if (valLower.includes('spóźnion') || valLower.includes('spoznion')) {
                            status = 'spoznione';
                        }
                    }
                }
            }

            // If no głosiciel and no dates, it's wolne
            if (!głosiciel && !startDate) {
                status = 'wolne';
                daysCount = 0;
            }

            terrains.push({
                number: terrainNumber,
                status: status,
                głosiciel: głosiciel || '-',
                startDate: startDate || '-',
                endDate: endDate || '-',
                daysCount: daysCount,
                rowIndex: rowIdx + 1 // 1-based for Google Sheets API
            });
        }

        return terrains;
    },

    // Helper: Check if value is a date
    isDate(value) {
        if (!value) return false;

        // Check if it's a string with date pattern
        if (typeof value === 'string') {
            return /\d{1,2}[\.\/\-]\d{1,2}[\.\/\-]\d{2,4}/.test(value) ||
                   /\d{4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}/.test(value);
        }

        // Check if it's a Date object
        return value instanceof Date || !isNaN(Date.parse(value));
    },

    // Helper: Format date
    formatDate(value) {
        if (!value) return '';

        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) return value.toString();

            return date.toLocaleDateString('pl-PL');
        } catch {
            return value.toString();
        }
    },

    // Fetch data from Google Sheets
    async fetchSheetData(range) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.sheetId}/values/${range}?key=${this.config.apiKey}`;

        const response = await fetch(url);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Błąd pobierania danych');
        }

        return await response.json();
    },

    // Update cell in Google Sheets
    async updateSheetCell(range, value) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.sheetId}/values/${range}?valueInputOption=USER_ENTERED&key=${this.config.apiKey}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: [[value]]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Błąd aktualizacji danych');
        }

        return await response.json();
    },

    // Render terrain list
    renderTerrainList() {
        const container = document.getElementById('terrainList');

        // Filter terrains
        let filtered = this.state.terrains.filter(t => {
            if (this.state.currentFilter === 'wszystkie') return true;
            return t.status === this.state.currentFilter;
        });

        // Sort terrains
        filtered.sort((a, b) => {
            switch (this.state.currentSort) {
                case 'number':
                    return a.number - b.number;
                case 'days':
                    return b.daysCount - a.daysCount;
                case 'status':
                    const statusOrder = { 'spoznione': 0, 'zajete': 1, 'wolne': 2 };
                    return statusOrder[a.status] - statusOrder[b.status];
                default:
                    return 0;
            }
        });

        // Render cards
        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--gray-700);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <div>Brak terenów dla tego filtra</div>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(terrain => `
            <div class="terrain-card">
                <div class="terrain-header">
                    <div class="terrain-number">Teren ${terrain.number}</div>
                    <span class="status-badge status-${terrain.status}">
                        ${this.getStatusLabel(terrain.status)}
                    </span>
                </div>
                <div class="terrain-info">
                    <div><strong>Głosiciel:</strong> ${terrain.głosiciel}</div>
                    <div><strong>Rozpoczęcie:</strong> ${terrain.startDate}</div>
                    <div><strong>Zakończenie:</strong> ${terrain.endDate}</div>
                    ${terrain.daysCount > 0 ? `<div><strong>Dni:</strong> ${terrain.daysCount}</div>` : ''}
                </div>
            </div>
        `).join('');
    },

    // Get status label
    getStatusLabel(status) {
        const labels = {
            'wolne': 'Wolne',
            'zajete': 'Zajęte',
            'spoznione': 'Spóźnione'
        };
        return labels[status] || status;
    },

    // Set filter
    setFilter(filter) {
        this.state.currentFilter = filter;

        // Update UI
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
            if (chip.dataset.filter === filter) {
                chip.classList.add('active');
            }
        });

        this.renderTerrainList();
    },

    // Set sort by
    setSortBy(sortBy) {
        this.state.currentSort = sortBy;
        this.renderTerrainList();
    },

    // Show assign modal
    showAssignModal() {
        document.getElementById('assignModal').classList.add('active');
    },

    // Close modal
    closeModal() {
        document.getElementById('assignModal').classList.remove('active');
    },

    // Assign terrain
    async assignTerrain(event) {
        event.preventDefault();

        const terrainNumber = document.getElementById('terrainNumber').value.trim();
        const głosiciel = document.getElementById('głosicielSelect').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        if (!terrainNumber || !głosiciel || !startDate) {
            this.showError('Proszę wypełnić wszystkie wymagane pola');
            return;
        }

        try {
            // Find the terrain in our data
            const terrain = this.state.terrains.find(t => t.number == terrainNumber);

            if (!terrain) {
                this.showError(`Nie znaleziono terenu ${terrainNumber}`);
                return;
            }

            // Update the sheet (you'll need to determine the correct columns based on your sheet structure)
            // This is a simplified version - you'll need to adjust based on actual column positions

            const sheetName = this.config.sheetName;
            const row = terrain.rowIndex;

            // Example: Update głosiciel in column B, startDate in column C, endDate in column D
            // You'll need to adjust these column letters based on your actual sheet structure
            await this.updateSheetCell(`${sheetName}!B${row}`, głosiciel);
            await this.updateSheetCell(`${sheetName}!C${row}`, startDate);

            if (endDate) {
                await this.updateSheetCell(`${sheetName}!D${row}`, endDate);
            }

            this.showSuccess(`Teren ${terrainNumber} przypisany do ${głosiciel}`);

            // Reload data
            await this.loadTerrains();

            // Close modal and reset form
            this.closeModal();
            document.querySelector('#assignModal form').reset();
            document.getElementById('startDate').value = new Date().toISOString().split('T')[0];

        } catch (error) {
            console.error('Error assigning terrain:', error);
            this.showError('Błąd podczas przypisywania terenu: ' + error.message);
        }
    },

    // Show error message
    showError(message) {
        const existingError = document.querySelector('.error-message');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => errorDiv.remove(), 5000);
    },

    // Show success message
    showSuccess(message) {
        const existingSuccess = document.querySelector('.success-message');
        if (existingSuccess) existingSuccess.remove();

        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);

        setTimeout(() => successDiv.remove(), 3000);
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
