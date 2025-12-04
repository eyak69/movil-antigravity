import * as SQLite from 'expo-sqlite';

const API_URL = 'http://192.168.1.64:3000/api/sync';

export const syncPersonas = async (db) => {
    if (!db) return;

    try {
        // 1. Get last sync time
        const metadata = await db.getFirstAsync('SELECT value FROM metadata WHERE key = ?', 'last_sync');
        const lastSync = metadata ? metadata.value : null;

        // 2. Get unsynced records (Push)
        const unsynced = await db.getAllAsync('SELECT * FROM personas WHERE is_synced = 0');

        // 3. Send to backend
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personas: unsynced,
                lastSync: lastSync
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Sync failed:', response.status, errorText);
            throw new Error(`Sync failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();

        // 4. Mark pushed records as synced
        for (const id of data.syncedIds) {
            await db.runAsync('UPDATE personas SET is_synced = 1 WHERE id = ?', id);
        }

        // 5. Process Pull (Server -> Client)
        if (data.updatedPersonas && data.updatedPersonas.length > 0) {
            for (const p of data.updatedPersonas) {
                // Check if exists
                const existing = await db.getFirstAsync('SELECT id FROM personas WHERE id = ?', p.id);

                if (existing) {
                    await db.runAsync(
                        'UPDATE personas SET nombre = ?, telefono = ?, email = ?, direccion = ?, updatedAt = ?, is_synced = 1, deleted = ? WHERE id = ?',
                        p.nombre, p.telefono, p.email, p.direccion, p.updatedAt, p.deleted ? 1 : 0, p.id
                    );
                } else {
                    await db.runAsync(
                        'INSERT INTO personas (id, nombre, telefono, email, direccion, updatedAt, is_synced, deleted) VALUES (?, ?, ?, ?, ?, ?, 1, ?)',
                        p.id, p.nombre, p.telefono, p.email, p.direccion, p.updatedAt, p.deleted ? 1 : 0
                    );
                }
            }
        }

        // 6. Update last sync time
        const now = new Date().toISOString();
        await db.runAsync('INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)', 'last_sync', now);

        return { success: true, count: unsynced.length + (data.updatedPersonas ? data.updatedPersonas.length : 0) };

    } catch (error) {
        console.error('SyncService Error:', error);
        return { success: false, error };
    }
};
