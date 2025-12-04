# 🚀 Bitácora de Desarrollo - Proyecto "Mi Agenda"

Bienvenido al registro de desarrollo de **Mi Agenda**. Aquí documentamos el viaje técnico, las decisiones arquitectónicas y las victorias diarias en la construcción de esta aplicación móvil híbrida offline-first.

---

## 📅 04 de Diciembre de 2025 (Madrugada)
**Foco:** *Experiencia de Usuario, Multimedia y Robustez*

Hoy fue un día de pulido intenso y nuevas funcionalidades visuales. Transformamos una lista de texto en una experiencia más rica y aseguramos que la aplicación sea a prueba de balas ante reinicios.

### ✨ Nuevas Funcionalidades
- **📸 Soporte Multimedia Completo:**
    - ¡Adiós a los contactos aburridos! Ahora cada Persona puede tener su propia foto.
    - Implementamos `expo-image-picker` permitiendo elegir entre **Cámara** (para fotos al instante) y **Galería**.
    - Las imágenes se almacenan en Base64 (TEXT LONG) tanto en SQLite como en MySQL, asegurando que viajen con la sincronización.
    - **UI:** Los avatares ahora adornan la lista de contactos, dando vida a la interfaz.

- **🛠️ Herramientas de Desarrollo (Dev Tools 2.0):**
    - Agregamos un botón salvavidas: **"Borrar Solo Local"**. Esto permite simular un dispositivo nuevo o limpio para probar la bajada masiva de datos (Initial Pull) sin perder la información del servidor.
    - Refinamos la lógica de "Nuke": Ahora, al borrar datos, también reiniciamos la metadata de sincronización (`last_sync`), evitando bugs donde la app creía estar al día cuando estaba vacía.

### 🔧 Mejoras Técnicas y Fixes
- **⚡ Optimización de Rendimiento:**
    - La lista de personas se sentía pesada. Implementamos `React.memo` en los componentes de tarjeta y `useCallback` en las funciones de renderizado. Resultado: Scroll suave como la seda.
- **🛡️ Persistencia de Datos (Critical Fix):**
    - Encontramos un "gremlin" en el código: un `DROP TABLE` olvidado en la inicialización de la base de datos borraba todo al reiniciar la app. ¡Eliminado! Ahora los datos sobreviven al cierre de la aplicación como debe ser.

### 🚀 Despliegue
- **Git & GitHub:**
    - Inicializamos el repositorio oficial.
    - Configuramos `.gitignore` para mantener el repo limpio.
    - Código subido y asegurado en: [https://github.com/eyak69/movil-antigravity](https://github.com/eyak69/movil-antigravity)

---

## 📅 03 de Diciembre de 2025
**Foco:** *Cimientos, Navegación y CRUD*

El día donde todo comenzó a tomar forma. Pasamos de archivos sueltos a una arquitectura estructurada y funcional.

### 🏗️ Arquitectura y Navegación
- **Navegación Híbrida:**
    - Implementamos un sistema robusto usando `React Navigation`.
    - **Bottom Tabs:** Acceso rápido a las secciones principales (Inicio, Personas, Productos, Dev).
    - **Stacks:** Navegación fluida para los formularios de alta y edición, manteniendo el historial de navegación limpio.

### 📦 Gestión de Productos
- **Módulo Completo:**
    - Diseñamos y construimos el flujo completo para Productos.
    - **Listado:** Vista clara con precios formateados.
    - **Formularios:** Validaciones y conexión directa con el backend para operaciones CRUD (Crear, Leer, Actualizar, Borrar).

### 🎨 UI/UX (Look & Feel)
- **React Native Paper:**
    - Adoptamos Material Design a través de `react-native-paper`.
    - Unificamos la paleta de colores, tipografías y componentes (Tarjetas, Botones, Appbars) para una experiencia visual coherente y profesional.
    - **HomeScreen:** Diseñamos un menú de inicio intuitivo con accesos directos.

### ⚙️ Backend & Configuración
- **Puesta en Marcha:**
    - Configuramos el entorno dual: Node.js/Express para el backend y Expo para el móvil.
    - Verificamos la conexión base de datos (MySQL) y la correcta creación de tablas mediante Sequelize.

---
*Bitácora mantenida por el equipo de desarrollo (Humano + AI).* 🤖👨‍💻
