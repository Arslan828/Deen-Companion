
const DB_NAME = 'DeenCompanionDB';
const DB_VERSION = 1;

export interface DBSetting {
    key: string;
    value: any;
}

export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            
            // Settings Store
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' });
            }
            
            // Content Stores
            if (!db.objectStoreNames.contains('duas')) {
                const store = db.createObjectStore('duas', { keyPath: 'id' });
                store.createIndex('category', 'category', { unique: false });
            }
            if (!db.objectStoreNames.contains('names99')) {
                db.createObjectStore('names99', { keyPath: 'transliteration' });
            }
            if (!db.objectStoreNames.contains('hadiths')) {
                const store = db.createObjectStore('hadiths', { keyPath: 'id' });
                store.createIndex('collectionId', 'collectionId', { unique: false });
            }

            // User Data Stores
            if (!db.objectStoreNames.contains('tasbih_history')) {
                const store = db.createObjectStore('tasbih_history', { keyPath: 'id', autoIncrement: true });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
            if (!db.objectStoreNames.contains('favorites')) {
                db.createObjectStore('favorites', { keyPath: 'id' }); // id can be 'hadith-bukhari-1' or 'dua-1'
            }
        };
    });
};

// Generic Helper Methods
export const dbGet = async <T>(storeName: string, key: string | number): Promise<T | undefined> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const dbGetAll = async <T>(storeName: string): Promise<T[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const dbPut = async (storeName: string, value: any): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(value);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const dbDelete = async (storeName: string, key: string | number): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const dbClear = async (storeName: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};
