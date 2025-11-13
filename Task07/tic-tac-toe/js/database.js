class Database {
    constructor() {
        this.dbName = 'TicTacToeDB';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('games')) {
                    const gamesStore = db.createObjectStore('games', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    gamesStore.createIndex('date', 'date', { unique: false });
                    gamesStore.createIndex('playerName', 'playerName', { unique: false });
                }
            };
        });
    }

    async saveGame(gameData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['games'], 'readwrite');
            const store = transaction.objectStore('games');
            
            const request = store.add({
                ...gameData,
                date: new Date().toISOString()
            });

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllGames() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['games'], 'readonly');
            const store = transaction.objectStore('games');
            const request = store.getAll();

            request.onsuccess = () => {
                const games = request.result.sort((a, b) => 
                    new Date(b.date) - new Date(a.date)
                );
                resolve(games);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getGame(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['games'], 'readonly');
            const store = transaction.objectStore('games');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}