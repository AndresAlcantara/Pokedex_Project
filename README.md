# 🔴 Pokédex — Estadísticas Base de Pokémon

Una aplicación web que se conecta a la [PokéAPI](https://pokeapi.co/) para mostrar las estadísticas base de cualquier Pokémon, buscando por **nombre** o **número**.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## ✨ Características

| Función | Descripción |
|---|---|
| 🔍 **Búsqueda** | Busca Pokémon por nombre (`pikachu`) o por número (`25`) |
| 📊 **Estadísticas base** | PS, Ataque, Defensa, At. Esp., Def. Esp. y Velocidad con barras animadas |
| 🎨 **Tipos coloreados** | Cada tipo tiene su color distintivo, traducido al idioma seleccionado |
| ✨ **Modo Shiny** | Alterna entre sprite normal y shiny con un botón |
| ⬅️➡️ **Navegación** | Botones Anterior/Siguiente para recorrer la Pokédex |
| 🎲 **Pokémon aleatorio** | Descubre Pokémon al azar con un solo clic |
| 📖 **Descripción** | Texto descriptivo del Pokémon obtenido de la API en el idioma actual |
| 🌐 **Multilingüe** | Soporte para **6 idiomas**: Español (ES), Inglés (EN), Japonés (JA), Alemán (DE), Francés (FR) e Italiano (IT) |
| ⌨️ **Atajos de teclado** | Usa `←` y `→` para navegar entre Pokémon |
| 📱 **Responsive** | Diseño adaptado a móvil, tablet y escritorio |

---

## 📂 Estructura del Proyecto

```
Proyecto pokedex/
├── index.html              # Página principal
├── README.md               # Este archivo
└── src/
    ├── css/
    │   └── styles.css      # Estilos y animaciones
    └── js/
        └── app.js          # Lógica de la aplicación
```

---

## 🚀 Cómo Usar

1. **Abre** `index.html` directamente en tu navegador (no necesita servidor).
2. **Escribe** el nombre o número de un Pokémon en la barra de búsqueda.
3. **Pulsa** _Buscar_ o presiona `Enter`.
4. **Explora** las estadísticas, cambia a modo shiny, o navega con los botones ← →.

> **Nota:** Requiere conexión a internet para obtener datos de la PokéAPI.

---

## 🛠️ Tecnologías

- **HTML5** — Estructura semántica
- **CSS3** — Diseño dark-mode con animaciones, gradientes y glassmorphism
- **JavaScript (ES6+)** — Fetch API, async/await, manipulación del DOM
- **[PokéAPI v2](https://pokeapi.co/)** — API REST gratuita con datos de todos los Pokémon

---

## 📡 API Utilizada

La aplicación consume dos endpoints de la PokéAPI:

| Endpoint | Uso |
|---|---|
| `GET /api/v2/pokemon/{id o nombre}` | Datos del Pokémon: sprites, tipos, stats, habilidades |
| `GET /api/v2/pokemon-species/{id}` | Descripción / flavor text del Pokémon |

---

## 📋 Funcionalidades Detalladas

### Búsqueda
- Acepta tanto el **nombre** (`mewtwo`, `eevee`) como el **número** (`150`, `133`).
- Los nombres no distinguen mayúsculas/minúsculas.

### Estadísticas Base
Cada stat se muestra con una barra de color animada y su valor numérico:
- 🟢 **PS** (Hit Points)
- 🔴 **Ataque**
- 🟠 **Defensa**
- 🟣 **Ataque Especial**
- 🔵 **Defensa Especial**
- 🩷 **Velocidad**

### Información Adicional
- **Altura** y **Peso** del Pokémon
- **Experiencia base** que otorga
- **Habilidades** disponibles

---

## 📄 Licencia

Proyecto educativo. Los datos de Pokémon pertenecen a Nintendo, Game Freak y The Pokémon Company.
Datos obtenidos a través de [PokéAPI](https://pokeapi.co/) (uso libre y gratuito).
