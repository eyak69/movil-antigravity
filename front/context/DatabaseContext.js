import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, ActivityIndicator } from 'react-native';

const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ children }) => {
    const [db, setDb] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initDB = async () => {
            try {
                const database = await SQLite.openDatabaseAsync('personas.db');
                await database.execAsync(`
                    PRAGMA journal_mode = WAL;

                    CREATE TABLE IF NOT EXISTS personas(
                    id TEXT PRIMARY KEY,
                    nombre TEXT NOT NULL,
                    telefono TEXT,
                    email TEXT,
                    direccion TEXT,
                    foto TEXT,
                    updatedAt TEXT,
                    is_synced INTEGER DEFAULT 0,
                    deleted INTEGER DEFAULT 0
                );
                    CREATE TABLE IF NOT EXISTS productos(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    precio REAL NOT NULL
                );
                    CREATE TABLE IF NOT EXISTS metadata(key TEXT PRIMARY KEY, value TEXT);
                `);
                setDb(database);
            } catch (error) {
                console.error('Error initializing database:', error);
            } finally {
                setLoading(false);
            }
        };
        initDB();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    return (
        <DatabaseContext.Provider value={db}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => useContext(DatabaseContext);
