# Documentación de la Aplicación Móvil "Mi Agenda"

## 1. Introducción y Arquitectura

"Mi Agenda" es una aplicación móvil híbrida desarrollada con React Native y Expo que permite la gestión de contactos (Personas) y productos. La aplicación está diseñada para funcionar **offline-first**, utilizando una base de datos local SQLite, y cuenta con un sistema de **sincronización bidireccional** con un servidor backend centralizado.

**Repositorio:** [https://github.com/eyak69/movil-antigravity](https://github.com/eyak69/movil-antigravity)

### Arquitectura del Sistema

#### Frontend (Móvil)
- **Framework:** React Native (Expo SDK 52)
- **UI Library:** React Native Paper (Material Design)
- **Base de Datos Local:** Expo SQLite
- **Navegación:** React Navigation (Bottom Tabs + Stack)
- **Funcionalidades Clave:** Persistencia local, Sincronización Push/Pull, Importación de contactos, Indicadores de estado.

#### Backend (Servidor)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de Datos:** MySQL
- **ORM:** Sequelize
- **Funcionalidades Clave:** API RESTful, Soft Deletes, Endpoints de desarrollo ("Nuke").

---

## 2. Funcionalidades (Personas, Productos, Sync)

### 2.1. Gestión de Personas
- **Listado:** Visualización de contactos con indicadores de sincronización (nube verde/roja).
- **CRUD:** Crear, Leer, Actualizar y Eliminar contactos localmente.
- **Importación:** Capacidad de importar contactos desde la agenda del teléfono.
- **Fotos:** Soporte para agregar fotos desde la **Cámara** o **Galería**.
- **Búsqueda y Ordenamiento:** Filtrado por nombre y ordenamiento ascendente/descendente.
- **Validación:** Prevención de actualizaciones innecesarias si no hay cambios en los datos.

### 2.2. Gestión de Productos
- **Listado:** Visualización de productos con precios formateados.
- **CRUD:** Gestión completa de productos.
- **Búsqueda:** Filtrado rápido por nombre de producto.

### 2.3. Sincronización
El sistema utiliza un algoritmo de sincronización robusto:
1.  **Push (Subida):** Los cambios locales (creaciones, ediciones, eliminaciones) marcados como `is_synced = 0` se envían al servidor.
2.  **Pull (Bajada):** El servidor responde con los registros que han sido modificados desde la última fecha de sincronización (`lastSync`).
3.  **Resolución de Conflictos:** Se utiliza la estrategia "Last Write Wins" (el último cambio gana) basada en timestamps (`updatedAt`).
4.  **Feedback Visual:** Un indicador de carga ("ruedita") informa al usuario durante el proceso.

---

## 3. Guía de Uso

### Pantalla de Personas
1.  **Crear:** Tocar el botón `+` en la barra superior.
2.  **Editar:** Tocar el botón "Editar" en la tarjeta del contacto.
3.  **Eliminar:** Tocar el botón "Eliminar". El registro se marcará como borrado y se sincronizará la eliminación.
4.  **Sincronizar:** Tocar el icono de actualización (flechas circulares) en la barra superior.
5.  **Importar:** Tocar el icono de descarga (flecha abajo) para traer contactos del teléfono.

### Pantalla de Productos
1.  Funciona de manera análoga a la pantalla de Personas, permitiendo gestionar el inventario de productos.

---

## 4. Detalles Técnicos y Configuración

Esta sección detalla los objetos y componentes específicos creados en el código.

### 4.1. Modelos de Datos (Database Models)

#### Persona (Contactos)
Ubicación: `back/models/Persona.js` y `front/context/DatabaseContext.js`

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único (v4). |
| `nombre` | STRING | Nombre del contacto. |
| `telefono` | STRING | Número de teléfono. |
| `email` | STRING | Email (Opcional). |
| `direccion` | STRING | Dirección (Opcional). |
| `foto` | TEXT | Foto en Base64 (Opcional). |
| `updatedAt` | DATETIME | Timestamp para sincronización. |
| `is_synced` | BOOLEAN | (Frontend) Estado de sincronización. |
| `deleted` | BOOLEAN | Flag para borrado lógico. |

#### Producto
Ubicación: `back/models/Producto.js` y `front/context/DatabaseContext.js`

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INTEGER | ID Autoincremental. |
| `nombre` | STRING | Nombre del producto. |
| `precio` | DECIMAL | Precio del producto. |

### 4.2. Componentes Frontend

#### Pantallas
- **`SplashScreen.js`**: Carga inicial y preparación de DB.
- **`HomeScreen.js`**: Menú principal con tarjetas.
- **`PersonasScreen.js`**: Lógica de listado, búsqueda, ordenamiento, importación y sync.
- **`PersonaFormScreen.js`**: Formulario con validación y detección de cambios.
- **`ProductosScreen.js`**: Gestión de inventario.
- **`DeveloperScreen.js`**: Herramientas "Nuke" para limpiar datos (Local/Servidor) y opción de "Borrar Solo Local" para pruebas de sync.

#### Servicios y Contexto
- **`DatabaseContext.js`**: Inicializa SQLite y expone el objeto `db`.
- **`SyncService.js`**: Maneja la lógica de Push/Pull con el endpoint `/api/sync`.

### 4.3. API Backend (Controladores)

- **`syncController.js`**: Maneja `POST /api/sync`. Realiza upserts y devuelve diferencias, filtrando los datos recién recibidos.
- **`productoController.js`**: CRUD estándar para productos.
- **`devController.js`**: Endpoints `DELETE` para borrado masivo (iterativo) de datos.

### 4.4. Configuración e Instalación

**Backend:**
```bash
cd back
npm install
npm run dev
```

**Frontend:**
```bash
cd front
npm install
npm start
```

**Configuración de IP:**
Editar `API_URL` en `front/services/SyncService.js` y `front/screens/DeveloperScreen.js` para apuntar a la IP de tu máquina.
