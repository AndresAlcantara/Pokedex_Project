// ========== Pokemon API App ==========
const API_BASE = 'https://pokeapi.co/api/v2/pokemon/';
const SPECIES_API = 'https://pokeapi.co/api/v2/pokemon-species/';
const MAX_POKEMON = 1025; // Total known Pokémon (Gen 1–9)

// State
let currentPokemonId = null;
let currentPokemonData = null;
let isShiny = false;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const loader = document.getElementById('loader');
const errorContainer = document.getElementById('errorContainer');
const errorMessage = document.getElementById('errorMessage');
const pokemonCard = document.getElementById('pokemonCard');

// Stat name mappings (API → Spanish)
const STAT_NAMES = {
    'hp': 'PS',
    'attack': 'Ataque',
    'defense': 'Defensa',
    'special-attack': 'At. Esp.',
    'special-defense': 'Def. Esp.',
    'speed': 'Velocidad'
};

// Stat CSS class mappings
const STAT_CLASSES = {
    'hp': 'stat-hp',
    'attack': 'stat-attack',
    'defense': 'stat-defense',
    'special-attack': 'stat-sp-attack',
    'special-defense': 'stat-sp-defense',
    'speed': 'stat-speed'
};

// Type colors
const TYPE_COLORS = {
    normal: { bg: '#a8a878', glow: 'rgba(168,168,120,0.5)' },
    fire: { bg: '#f08030', glow: 'rgba(240,128,48,0.5)' },
    water: { bg: '#6890f0', glow: 'rgba(104,144,240,0.5)' },
    electric: { bg: '#f8d030', glow: 'rgba(248,208,48,0.5)' },
    grass: { bg: '#78c850', glow: 'rgba(120,200,80,0.5)' },
    ice: { bg: '#98d8d8', glow: 'rgba(152,216,216,0.5)' },
    fighting: { bg: '#c03028', glow: 'rgba(192,48,40,0.5)' },
    poison: { bg: '#a040a0', glow: 'rgba(160,64,160,0.5)' },
    ground: { bg: '#e0c068', glow: 'rgba(224,192,104,0.5)' },
    flying: { bg: '#a890f0', glow: 'rgba(168,144,240,0.5)' },
    psychic: { bg: '#f85888', glow: 'rgba(248,88,136,0.5)' },
    bug: { bg: '#a8b820', glow: 'rgba(168,184,32,0.5)' },
    rock: { bg: '#b8a038', glow: 'rgba(184,160,56,0.5)' },
    ghost: { bg: '#705898', glow: 'rgba(112,88,152,0.5)' },
    dragon: { bg: '#7038f8', glow: 'rgba(112,56,248,0.5)' },
    dark: { bg: '#705848', glow: 'rgba(112,88,72,0.5)' },
    steel: { bg: '#b8b8d0', glow: 'rgba(184,184,208,0.5)' },
    fairy: { bg: '#ee99ac', glow: 'rgba(238,153,172,0.5)' },
};

// ========== Initialize ==========
function init() {
    createParticles();
    bindEvents();
}

// ========== Background Particles ==========
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 120 + 40;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 15) + 's';
        particle.style.animationDelay = (Math.random() * -20) + 's';
        container.appendChild(particle);
    }
}

// ========== Event Bindings ==========
function bindEvents() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Random button
    randomBtn.addEventListener('click', handleRandom);

    // Hint tags
    document.querySelectorAll('.hint-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            searchInput.value = tag.dataset.search;
            handleSearch();
        });
    });

    // Shiny toggle
    document.getElementById('shinyToggle').addEventListener('click', toggleShiny);

    // Navigation buttons
    document.getElementById('prevBtn').addEventListener('click', () => navigatePokemon(-1));
    document.getElementById('nextBtn').addEventListener('click', () => navigatePokemon(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!currentPokemonId) return;
        if (document.activeElement === searchInput) return;
        if (e.key === 'ArrowLeft') navigatePokemon(-1);
        if (e.key === 'ArrowRight') navigatePokemon(1);
    });
}

// ========== Search Handler ==========
async function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        showError('Por favor, introduce un nombre o número de Pokémon.');
        return;
    }
    await fetchPokemon(query);
}

// ========== Random Handler ==========
async function handleRandom() {
    const randomId = Math.floor(Math.random() * MAX_POKEMON) + 1;
    searchInput.value = randomId;
    await fetchPokemon(randomId);
}

// ========== Navigate (Prev/Next) ==========
async function navigatePokemon(direction) {
    if (!currentPokemonId) return;
    const newId = currentPokemonId + direction;
    if (newId < 1 || newId > MAX_POKEMON) return;
    searchInput.value = newId;
    await fetchPokemon(newId);
}

// ========== Fetch Pokemon ==========
async function fetchPokemon(query) {
    showLoader();
    hideError();
    hideCard();
    isShiny = false;

    try {
        // Fetch pokemon data and species data in parallel
        const pokemonRes = await fetch(API_BASE + encodeURIComponent(query));
        if (!pokemonRes.ok) {
            if (pokemonRes.status === 404) throw new Error('not_found');
            throw new Error('api_error');
        }
        const pokemonData = await pokemonRes.json();
        currentPokemonId = pokemonData.id;
        currentPokemonData = pokemonData;

        // Fetch species for description + legendary status (best-effort)
        let description = '';
        let isLegendary = false;
        try {
            const speciesRes = await fetch(SPECIES_API + pokemonData.id);
            if (speciesRes.ok) {
                const speciesData = await speciesRes.json();
                isLegendary = speciesData.is_legendary || speciesData.is_mythical;
                // Get Spanish flavor text, fallback to English
                const spanishEntry = speciesData.flavor_text_entries.find(
                    e => e.language.name === 'es'
                );
                const englishEntry = speciesData.flavor_text_entries.find(
                    e => e.language.name === 'en'
                );
                const entry = spanishEntry || englishEntry;
                if (entry) {
                    description = entry.flavor_text
                        .replace(/\f/g, ' ')
                        .replace(/\n/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                }
            }
        } catch (e) {
            // Species fetch failed silently — non-critical
        }

        renderPokemon(pokemonData, description, isLegendary);
    } catch (err) {
        if (err.message === 'not_found') {
            showError(`No se encontró ningún Pokémon con "${query}". Verifica el nombre o número.`);
        } else {
            showError('Error al conectar con la API. Comprueba tu conexión a internet.');
        }
    } finally {
        hideLoader();
    }
}

// ========== Shiny Toggle ==========
function toggleShiny() {
    if (!currentPokemonData) return;
    isShiny = !isShiny;

    const btn = document.getElementById('shinyToggle');
    btn.classList.toggle('active', isShiny);

    const pokemonImage = document.getElementById('pokemonImage');
    const data = currentPokemonData;

    if (isShiny) {
        const shinyArtwork = data.sprites.other?.['official-artwork']?.front_shiny;
        const shinySprite = data.sprites.front_shiny;
        pokemonImage.src = shinyArtwork || shinySprite || pokemonImage.src;
        pokemonImage.style.imageRendering = shinyArtwork ? 'auto' : 'pixelated';
    } else {
        const artwork = data.sprites.other?.['official-artwork']?.front_default;
        const sprite = data.sprites.front_default;
        pokemonImage.src = artwork || sprite || '';
        pokemonImage.style.imageRendering = artwork ? 'auto' : 'pixelated';
    }
}

// ========== Render Pokemon ==========
function renderPokemon(data, description, isLegendary = false) {
    const cardHeader = document.getElementById('cardHeader');
    const pokemonGlow = document.getElementById('pokemonGlow');
    const pokemonImage = document.getElementById('pokemonImage');
    const pokemonName = document.getElementById('pokemonName');
    const pokemonNumber = document.getElementById('pokemonNumber');
    const pokemonTypes = document.getElementById('pokemonTypes');
    const pokemonDesc = document.getElementById('pokemonDescription');
    const statsGrid = document.getElementById('statsGrid');
    const pokemonHeight = document.getElementById('pokemonHeight');
    const pokemonWeight = document.getElementById('pokemonWeight');
    const pokemonExp = document.getElementById('pokemonExp');
    const pokemonAbilities = document.getElementById('pokemonAbilities');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const shinyToggle = document.getElementById('shinyToggle');

    // Reset shiny state
    shinyToggle.classList.remove('active');

    // Primary type for theming
    const primaryType = data.types[0].type.name;
    const typeColor = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;

    // Card header gradient
    cardHeader.style.background = `linear-gradient(145deg, ${hexToRGBA(typeColor.bg, 0.3)}, ${hexToRGBA(typeColor.bg, 0.08)})`;

    // Dynamic body background based on type
    document.body.classList.add('type-themed');
    document.body.style.setProperty('--type-color', typeColor.bg);

    // Legendary sparkle effect
    clearSparkles();
    if (isLegendary) {
        document.body.classList.add('legendary');
        createSparkles(typeColor.bg);
    } else {
        document.body.classList.remove('legendary');
    }

    // Glow
    pokemonGlow.style.background = typeColor.glow;

    // Image — official artwork or sprite
    const artwork = data.sprites.other?.['official-artwork']?.front_default;
    const sprite = data.sprites.front_default;
    pokemonImage.src = artwork || sprite || '';
    pokemonImage.alt = data.name;
    pokemonImage.style.imageRendering = artwork ? 'auto' : 'pixelated';

    // Name & Number
    pokemonName.textContent = data.name;
    pokemonNumber.textContent = '#' + String(data.id).padStart(3, '0');

    // Types
    pokemonTypes.innerHTML = data.types.map(t => {
        const color = TYPE_COLORS[t.type.name]?.bg || '#999';
        return `<span class="type-badge" style="background: ${color}">${translateType(t.type.name)}</span>`;
    }).join('');

    // Description
    pokemonDesc.textContent = description || 'Sin descripción disponible.';

    // Stats
    let total = 0;
    statsGrid.innerHTML = '';
    data.stats.forEach(stat => {
        const name = stat.stat.name;
        const value = stat.base_stat;
        total += value;
        const maxStat = 255;
        const percentage = Math.min((value / maxStat) * 100, 100);
        const cssClass = STAT_CLASSES[name] || 'stat-hp';

        const row = document.createElement('div');
        row.className = 'stat-row';
        row.innerHTML = `
            <span class="stat-name">${STAT_NAMES[name] || name}</span>
            <span class="stat-value">${value}</span>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill ${cssClass}" style="width: 0%"></div>
            </div>
        `;
        statsGrid.appendChild(row);

        // Animate bars
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                row.querySelector('.stat-bar-fill').style.width = percentage + '%';
            });
        });
    });

    document.getElementById('statsTotal').textContent = total;

    // Info
    pokemonHeight.textContent = (data.height / 10).toFixed(1) + ' m';
    pokemonWeight.textContent = (data.weight / 10).toFixed(1) + ' kg';
    pokemonExp.textContent = data.base_experience ?? '—';
    pokemonAbilities.textContent = data.abilities
        .map(a => a.ability.name.replace(/-/g, ' '))
        .join(', ');

    // Navigation buttons state
    prevBtn.disabled = data.id <= 1;
    nextBtn.disabled = data.id >= MAX_POKEMON;

    showCard();
}

// ========== UI State Helpers ==========
function showLoader() { loader.style.display = 'flex'; }
function hideLoader() { loader.style.display = 'none'; }
function showError(msg) {
    errorMessage.textContent = msg;
    errorContainer.style.display = 'block';
}
function hideError() { errorContainer.style.display = 'none'; }
function showCard() { pokemonCard.style.display = 'block'; }
function hideCard() { pokemonCard.style.display = 'none'; }

// ========== Legendary Lightning Bolts ==========
let sparkleInterval = null;

function createSparkles(color) {
    const container = document.getElementById('particles');
    // Initial burst of bolts
    for (let i = 0; i < 8; i++) {
        setTimeout(() => spawnLightningBolt(container, color), Math.random() * 600);
    }
    // Continuously spawn new bolts
    sparkleInterval = setInterval(() => {
        spawnLightningBolt(container, color);
    }, 400);
}

function spawnLightningBolt(container, color) {
    const bolt = document.createElement('div');
    bolt.className = 'lightning-bolt';

    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 80;

    // Random rotation and size
    const rotation = Math.random() * 60 - 30;  // -30° to 30°
    const scale = Math.random() * 0.6 + 0.5;   // 0.5 to 1.1
    const duration = Math.random() * 0.6 + 0.6; // 0.6s to 1.2s
    const hueShift = (Math.random() - 0.5) * 40;

    // Generate a random zigzag SVG path for variety
    const segments = Math.floor(Math.random() * 3) + 3; // 3–5 segments
    let points = '0,0 ';
    let cx = 0, cy = 0;
    for (let i = 1; i <= segments; i++) {
        cx += (Math.random() - 0.5) * 16;
        cy += Math.random() * 14 + 6;
        points += `${cx.toFixed(1)},${cy.toFixed(1)} `;
    }

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '-15 -2 30 80');
    svg.setAttribute('class', 'lightning-svg');

    const polyline = document.createElementNS(svgNS, 'polyline');
    polyline.setAttribute('points', points.trim());
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', color);
    polyline.setAttribute('stroke-width', '2.5');
    polyline.setAttribute('stroke-linecap', 'round');
    polyline.setAttribute('stroke-linejoin', 'round');

    // Glow layer (duplicate for glow)
    const glowLine = polyline.cloneNode();
    glowLine.setAttribute('stroke-width', '6');
    glowLine.setAttribute('opacity', '0.4');
    glowLine.setAttribute('filter', 'blur(3px)');

    svg.appendChild(glowLine);
    svg.appendChild(polyline);
    bolt.appendChild(svg);

    bolt.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        --bolt-color: ${color};
        --bolt-hue-shift: ${hueShift}deg;
        transform: rotate(${rotation}deg) scale(${scale});
        animation-duration: ${duration}s;
    `;

    container.appendChild(bolt);
    bolt.addEventListener('animationend', () => bolt.remove());
}

function clearSparkles() {
    if (sparkleInterval) {
        clearInterval(sparkleInterval);
        sparkleInterval = null;
    }
    document.querySelectorAll('.lightning-bolt').forEach(s => s.remove());
}

// ========== Utilities ==========
function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function translateType(type) {
    const translations = {
        normal: 'Normal', fire: 'Fuego', water: 'Agua', electric: 'Eléctrico',
        grass: 'Planta', ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno',
        ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
        rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro',
        steel: 'Acero', fairy: 'Hada',
    };
    return translations[type] || type;
}

// ========== Start ==========
init();
