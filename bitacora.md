# Bitácora de Desarrollo - Proyecto "Mi Agenda"

**Fecha:** 04 de Diciembre de 2025

## Resumen de la Sesión

En esta sesión nos enfocamos en optimizar la aplicación, agregar soporte multimedia, corregir errores críticos de persistencia y sincronización, y finalmente desplegar el código en un repositorio remoto.

## Cambios Realizados

### 1. Optimización y Correcciones
- **PersonasScreen:** Se solucionó un `ReferenceError` y se optimizó el rendimiento de la lista (`FlatList`) utilizando `React.memo` y `useCallback` para evitar re-renderizados innecesarios.
- **Persistencia de Datos:** Se eliminó una sentencia `DROP TABLE` accidental que borraba la base de datos local al reiniciar la aplicación, asegurando que los datos persistan offline.

### 2. Soporte para Fotos
- **Backend (MySQL):** Se agregó la columna `foto` (tipo TEXT para Base64) a la tabla `personas`.
- **Frontend (SQLite):** Se actualizó el esquema local para incluir el campo `foto`.
- **UI:**
    - Se integró `expo-image-picker` para permitir seleccionar fotos de la **Galería** o tomar fotos con la **Cámara**.
    - Se actualizó el listado de contactos para mostrar un **Avatar** con la foto del contacto.
- **Sincronización:** Se actualizó la lógica de Sync para transmitir las imágenes en Base64 entre el cliente y el servidor.

### 3. Herramientas de Desarrollo (Dev Tools)
- **Corrección de "Nuke":** Se corrigió la lógica de borrado masivo para que también elimine la metadata `last_sync`. Esto soluciona el problema donde, tras borrar los datos locales, la app no volvía a descargar los datos del servidor (Initial Pull).
- **Nueva Funcionalidad:** Se agregó un botón **"Borrar Solo Local"** para facilitar las pruebas de sincronización (bajada de datos) sin afectar al servidor.

### 4. Despliegue y Documentación
- **Git:** Se inicializó el repositorio, se configuró el `.gitignore` y se subió el código a GitHub.
- **Repositorio:** [https://github.com/eyak69/movil-antigravity](https://github.com/eyak69/movil-antigravity)
- **Documentación:** Se actualizó `documentation.md` con las nuevas funcionalidades y detalles técnicos.

---
*Generado automáticamente por Antigravity AI.*
