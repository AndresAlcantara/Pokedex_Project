// ========== Pokemon API App ==========
const API_BASE = 'https://pokeapi.co/api/v2/pokemon/';
const SPECIES_API = 'https://pokeapi.co/api/v2/pokemon-species/';
const MAX_POKEMON = 1025; // Total known Pokémon (Gen 1–9)

// State
let currentPokemonId = null;
let currentPokemonData = null;
let isShiny = false;
let isMega = false;
let currentCryUrl = null;
let currentLang = 'es'; // 'es' or 'en'
let allPokemonNames = []; // For autocomplete
let megaVarieties = []; // To store mega evolution forms
let basePokemonData = null; // To revert from mega form

const TRANSLATIONS = {
    es: {
        'meta-description': "Pokédex — Busca las estadísticas base de cualquier Pokémon por nombre o número",
        'title': "Pokédex — Estadísticas Base",
        'logo-title': "Ir al inicio",
        'subtitle': "Estadísticas Base",
        'nav-search': "Buscar",
        'nav-battle': "Combate",
        'nav-pokedex': "Pokédex",
        'nav-combat': "Simulador de Combate",
        'search-placeholder': "Nombre o número del Pokémon...",
        'search-btn': "Buscar",
        'search-example': "Ejemplo",
        'random-btn': "Aleatorio",
        'loader-text': "Buscando Pokémon...",
        'error-not-found': "Pokémon no encontrado",
        'shiny-toggle': "Ver versión shiny",
        'shiny-label': "Shiny",
        'mega-toggle': "Mega Evolución",
        'mega-label': "Mega",
        'cry-toggle': "Reproducir grito",
        'stats-title': "Estadísticas Base",
        'stats-total': "Total",
        'info-height': "Altura",
        'info-weight': "Peso",
        'info-exp': "Experiencia Base",
        'info-abilities': "Habilidades",
        'evo-title': "Cadena Evolutiva",
        'nav-prev': "Anterior",
        'nav-next': "Siguiente",
        'combat-p1-title': "Tu Pokémon",
        'combat-p2-title': "Oponente",
        'combat-search-placeholder': "Buscar...",
        'combat-p1-empty': "Selecciona un Pokémon",
        'combat-p2-empty': "Selecciona un Oponente",
        'combat-start-btn': "¡COMENZAR SIMULACIÓN!",
        'combat-log-title': "Registro de Combate",
        'combat-log-empty': "Selecciona dos Pokémon para comenzar la simulación.",
        'footer-data': "Datos proporcionados por",
        'footer-project': "Proyecto Pokedex",
        // Stats mapping
        'hp': 'PS',
        'attack': 'Ataque',
        'defense': 'Defensa',
        'special-attack': 'At. Esp.',
        'special-defense': 'Def. Esp.',
        'speed': 'Velocidad'
    },
    en: {
        'meta-description': "Pokédex — Search base stats for any Pokémon by name or number",
        'title': "Pokédex — Base Stats",
        'logo-title': "Go home",
        'subtitle': "Base Stats",
        'nav-search': "Search",
        'nav-battle': "Battle",
        'nav-pokedex': "Pokédex",
        'nav-combat': "Combat Simulator",
        'search-placeholder': "Pokémon name or number...",
        'search-btn': "Search",
        'search-example': "Example",
        'random-btn': "Random",
        'loader-text': "Searching for Pokémon...",
        'error-not-found': "Pokémon not found",
        'shiny-toggle': "View shiny version",
        'shiny-label': "Shiny",
        'mega-toggle': "Mega Evolution",
        'mega-label': "Mega",
        'cry-toggle': "Play cry",
        'stats-title': "Base Stats",
        'stats-total': "Total",
        'info-height': "Height",
        'info-weight': "Weight",
        'info-exp': "Base Exp",
        'info-abilities': "Abilities",
        'evo-title': "Evolution Chain",
        'nav-prev': "Previous",
        'nav-next': "Next",
        'combat-p1-title': "Your Pokémon",
        'combat-p2-title': "Opponent",
        'combat-search-placeholder': "Search...",
        'combat-p1-empty': "Select a Pokémon",
        'combat-p2-empty': "Select an Opponent",
        'combat-start-btn': "START BATTLE!",
        'combat-log-title': "Battle Log",
        'combat-log-empty': "Select two Pokémon to start the simulation.",
        'footer-data': "Data provided by",
        'footer-project': "Pokedex Project",
        // Stats mapping
        'hp': 'HP',
        'attack': 'Attack',
        'defense': 'Defense',
        'special-attack': 'Sp. Atk',
        'special-defense': 'Sp. Def',
        'speed': 'Speed'
    }
};

// ========== DOM Elements ==========
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const loader = document.getElementById('loader');
const errorContainer = document.getElementById('errorContainer');
const errorMessage = document.getElementById('errorMessage');
const pokemonCard = document.getElementById('pokemonCard');
const cryBtn = document.getElementById('cryBtn');
const evolutionSection = document.getElementById('evolutionSection');
const evolutionChain = document.getElementById('evolutionChain');
const shinyToggle = document.getElementById('shinyToggle');
const nextBtn = document.getElementById('nextBtn');
const megaToggle = document.getElementById('megaToggle');
const pokemonImage = document.getElementById('pokemonImage');
const logoHome = document.getElementById('logoHome');

// Combat DOM
const viewPokedexBtn = document.getElementById('viewPokedexBtn');
const viewCombatBtn = document.getElementById('viewCombatBtn');
const pokedexView = document.getElementById('pokedex-view');
const combatView = document.getElementById('combat-view');
const combatSearch1 = document.getElementById('combatSearch1');
const combatSearch2 = document.getElementById('combatSearch2');
const combatRand1 = document.getElementById('combatRand1');
const combatRand2 = document.getElementById('combatRand2');
const startBattleBtn = document.getElementById('startBattleBtn');
const langToggle = document.getElementById('langToggle');
const currentLangDisplay = document.getElementById('currentLangDisplay');

// ========== Initialize ==========
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    createParticles();
    bindEvents();
    fetchAllPokemonNames();
}

// ========== Background Particles ==========
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

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
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    if (randomBtn) {
        randomBtn.addEventListener('click', handleRandom);
    }

    if (cryBtn) {
        cryBtn.addEventListener('click', playCry);
    }

    // Hint tags
    const tips = document.querySelectorAll('.hint-tag');
    if (tips) {
        tips.forEach(tag => {
            tag.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = tag.dataset.search;
                    handleSearch();
                }
            });
        });
    }

    if (shinyToggle) {
        shinyToggle.addEventListener('click', toggleShiny);
    }

    if (megaToggle) {
        megaToggle.addEventListener('click', toggleMega);
    }

    if (pokemonImage) {
        pokemonImage.addEventListener('click', playCry);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigatePokemon(-1));
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigatePokemon(1));
    }

    // View Navigation
    if (viewPokedexBtn) viewPokedexBtn.addEventListener('click', () => switchView('pokedex'));
    if (viewCombatBtn) viewCombatBtn.addEventListener('click', () => switchView('combat'));
    if (logoHome) logoHome.addEventListener('click', () => switchView('pokedex'));

    // Combat Events
    if (combatSearch1) combatSearch1.addEventListener('change', () => handleCombatSearch(1, combatSearch1.value));
    if (combatSearch2) combatSearch2.addEventListener('change', () => handleCombatSearch(2, combatSearch2.value));
    if (combatRand1) combatRand1.addEventListener('click', () => handleCombatRandom(1));
    if (combatRand2) combatRand2.addEventListener('click', () => handleCombatRandom(2));
    if (startBattleBtn) startBattleBtn.addEventListener('click', startBattle);

    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!currentPokemonId) return;
        if (document.activeElement === searchInput) return;
        if (e.key === 'ArrowLeft') navigatePokemon(-1);
        if (e.key === 'ArrowRight') navigatePokemon(1);
    });
}

// ========== Language Switcher ==========
function toggleLanguage() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    if (currentLangDisplay) currentLangDisplay.textContent = currentLang.toUpperCase();

    updateUILanguage();

    // Refresh current pokemon if any
    if (currentPokemonData) {
        // Fetch specific species data for the new language
        fetchPokemon(currentPokemonData.id);
    }
}

function updateUILanguage() {
    const texts = TRANSLATIONS[currentLang];

    // Update text content for items with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) {
            el.textContent = texts[key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (texts[key]) {
            el.placeholder = texts[key];
        }
    });

    // Update titles (tooltips)
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (texts[key]) {
            el.title = texts[key];
        }
    });

    // Handle Title Tag specifically
    document.title = texts['title'];

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = texts['meta-description'];
}

// ========== Search Handler ==========
async function handleSearch() {
    if (!searchInput) return;
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        showError(currentLang === 'es' ? 'Por favor, introduce un nombre o número de Pokémon.' : 'Please enter a Pokémon name or number.');
        return;
    }
    await fetchPokemon(query);
}

// ========== Random Handler ==========
async function handleRandom() {
    const randomId = Math.floor(Math.random() * MAX_POKEMON) + 1;
    if (searchInput) searchInput.value = randomId;
    await fetchPokemon(randomId);
}

// ========== Navigate (Prev/Next) ==========
async function navigatePokemon(direction) {
    if (!currentPokemonId) return;
    const newId = currentPokemonId + direction;
    if (newId < 1 || newId > MAX_POKEMON) return;
    if (searchInput) searchInput.value = newId;
    await fetchPokemon(newId);
}

// ========== Fetch Pokemon ==========
async function fetchPokemon(query) {
    showLoader();
    hideError();
    hideCard();
    isShiny = false;
    isMega = false;
    currentCryUrl = null;
    megaVarieties = [];
    basePokemonData = null;

    try {
        // Fetch pokemon data
        const pokemonRes = await fetch(API_BASE + encodeURIComponent(query));
        if (!pokemonRes.ok) {
            if (pokemonRes.status === 404) throw new Error('not_found');
            throw new Error('api_error');
        }
        const pokemonData = await pokemonRes.json();
        currentPokemonId = pokemonData.id;
        currentPokemonData = pokemonData;

        // Safely extract cry URL
        if (pokemonData.cries) {
            currentCryUrl = pokemonData.cries.latest || pokemonData.cries.legacy || null;
        }

        // Fetch species for description + legendary status + evolution chain
        let description = '';
        let isLegendary = false;
        let evolutionUrl = null;

        try {
            const speciesRes = await fetch(SPECIES_API + pokemonData.id);
            if (speciesRes.ok) {
                const speciesData = await speciesRes.json();
                isLegendary = speciesData.is_legendary || speciesData.is_mythical;
                evolutionUrl = speciesData.evolution_chain?.url;

                // Detection of Mega Evolutions
                if (speciesData.varieties) {
                    megaVarieties = speciesData.varieties.filter(v => v.pokemon.name.includes('-mega'));
                }

                // Get flavor text based on currentLang
                const entry = speciesData.flavor_text_entries.find(e => e.language.name === currentLang)
                    || speciesData.flavor_text_entries.find(e => e.language.name === 'en')
                    || speciesData.flavor_text_entries[0];

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

        if (evolutionUrl && evolutionSection) {
            fetchEvolutionChain(evolutionUrl);
        } else if (evolutionSection) {
            evolutionSection.style.display = 'none';
        }

        renderPokemon(pokemonData, description, isLegendary);
    } catch (err) {
        if (err.message === 'not_found') {
            const errorMsg = currentLang === 'es'
                ? `No se encontró ningún Pokémon con "${query}". Verifica el nombre o número.`
                : `No Pokémon found with "${query}". Please check the name or number.`;
            showError(errorMsg);
        } else {
            showError(currentLang === 'es'
                ? 'Error al conectar con la API. Comprueba tu conexión a internet.'
                : 'API connection error. Please check your internet connection.');
        }
    } finally {
        hideLoader();
    }
}

// ========== Evolution Chain ==========
async function fetchEvolutionChain(url) {
    if (!evolutionSection) return;
    try {
        const res = await fetch(url);
        const data = await res.json();
        const chain = parseEvolutionChain(data.chain);
        renderEvolutionChain(chain);
    } catch (e) {
        console.error('Error fetching evolution chain:', e);
        evolutionSection.style.display = 'none';
    }
}

function parseEvolutionChain(chain) {
    const evoChain = [];
    let current = chain;

    do {
        // Extract ID from URL (e.g. https://pokeapi.co/api/v2/pokemon-species/1/)
        const parts = current.species.url.split('/');
        const id = parts[parts.length - 2]; // Get the ID

        evoChain.push({
            id: id,
            name: current.species.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        });
        current = current.evolves_to[0];
    } while (current && current.hasOwnProperty('evolves_to'));

    return evoChain;
}

function renderEvolutionChain(chain) {
    if (!evolutionSection || !evolutionChain) return;

    if (chain.length <= 1) {
        evolutionSection.style.display = 'none';
        return;
    }

    evolutionChain.innerHTML = chain.map((poke, index) => {
        const isActive = poke.name.toLowerCase() === currentPokemonData.name.toLowerCase();
        let html = `
            <div class="evolution-item ${isActive ? 'active' : ''}" 
                 onclick="document.getElementById('searchInput').value='${poke.name}'; document.getElementById('searchBtn').click()">
                <div class="evolution-image-container">
                    <img src="${poke.image}" alt="${poke.name}" loading="lazy">
                </div>
                <span class="evolution-name">${poke.name}</span>
            </div>
        `;

        if (index < chain.length - 1) {
            html += '<div class="evolution-arrow">→</div>';
        }

        return html;
    }).join('');

    evolutionSection.style.display = 'block';
}

// ========== Audio Cry ==========
function playCry() {
    if (!currentCryUrl || !cryBtn) return;
    const audio = new Audio(currentCryUrl);
    audio.volume = 0.5;

    cryBtn.classList.add('playing');
    audio.play().catch(e => console.error('Audio play failed:', e));

    audio.onended = () => {
        cryBtn.classList.remove('playing');
    };
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

    // Reset shiny state if toggle exists
    if (shinyToggle) shinyToggle.classList.remove('active');

    // Primary type for theming
    const primaryType = data.types[0].type.name;
    const typeColor = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;

    // Card header gradient
    if (cardHeader) {
        cardHeader.style.background = `linear-gradient(145deg, ${hexToRGBA(typeColor.bg, 0.3)}, ${hexToRGBA(typeColor.bg, 0.08)})`;
    }

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
    if (pokemonGlow) pokemonGlow.style.background = typeColor.glow;

    // Image — official artwork or sprite
    const artwork = data.sprites.other?.['official-artwork']?.front_default;
    const sprite = data.sprites.front_default;
    if (pokemonImage) {
        pokemonImage.src = artwork || sprite || '';
        pokemonImage.alt = data.name;
        pokemonImage.style.imageRendering = artwork ? 'auto' : 'pixelated';
    }

    // Mega Toggle Visibility
    if (megaToggle) {
        if (megaVarieties.length > 0) {
            megaToggle.classList.remove('hidden');
            megaToggle.classList.toggle('active', isMega);
            megaToggle.innerHTML = isMega ? '<span class="mega-icon">🔄</span> Base' : '<span class="mega-icon">🧬</span> Mega';
        } else {
            megaToggle.classList.add('hidden');
        }
    }

    // Name & Number
    if (pokemonName) pokemonName.textContent = data.name;
    if (pokemonNumber) pokemonNumber.textContent = '#' + String(data.id).padStart(3, '0');

    // Types
    if (pokemonTypes) {
        pokemonTypes.innerHTML = data.types.map(t => {
            const color = TYPE_COLORS[t.type.name]?.bg || '#999';
            return `<span class="type-badge" style="background: ${color}">${translateType(t.type.name)}</span>`;
        }).join('');
    }

    // Description
    if (pokemonDesc) {
        pokemonDesc.textContent = description || (currentLang === 'es' ? 'Sin descripción disponible.' : 'No description available.');
    }

    // Stats
    let total = 0;
    if (statsGrid) {
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
                <span class="stat-name">${TRANSLATIONS[currentLang][name] || name}</span>
                <span class="stat-value">${value}</span>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill ${cssClass}" style="width: 0%"></div>
                </div>
            `;
            statsGrid.appendChild(row);

            // Animate bars
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const fill = row.querySelector('.stat-bar-fill');
                    if (fill) fill.style.width = percentage + '%';
                });
            });
        });
    }

    const totalEl = document.getElementById('statsTotal');
    if (totalEl) totalEl.textContent = total;

    // Info
    if (pokemonHeight) pokemonHeight.textContent = (data.height / 10).toFixed(1) + ' m';
    if (pokemonWeight) pokemonWeight.textContent = (data.weight / 10).toFixed(1) + ' kg';
    if (pokemonExp) pokemonExp.textContent = data.base_experience ?? '—';
    if (pokemonAbilities) {
        pokemonAbilities.textContent = data.abilities
            .map(a => a.ability.name.replace(/-/g, ' '))
            .join(', ');
    }

    // Navigation buttons state
    if (prevBtn) prevBtn.disabled = data.id <= 1;
    if (nextBtn) nextBtn.disabled = data.id >= MAX_POKEMON;

    showCard();
}

function toggleShiny() {
    if (!currentPokemonData || !shinyToggle) return;
    isShiny = !isShiny;

    shinyToggle.classList.toggle('active', isShiny);
    const pokemonImage = document.getElementById('pokemonImage');
    const data = currentPokemonData;

    if (pokemonImage) {
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
}

// ========== Mega Evolution Toggle ==========
async function toggleMega() {
    if (!currentPokemonData || megaVarieties.length === 0) return;

    if (!isMega) {
        // Switch to Mega
        try {
            showLoader();
            const megaName = megaVarieties[0].pokemon.name; // Get first mega form
            const res = await fetch(API_BASE + megaName);
            if (!res.ok) throw new Error('Mega evolution data not found');

            const megaData = await res.json();
            basePokemonData = currentPokemonData; // Store base
            currentPokemonData = megaData;
            isMega = true;

            // Re-render with mega data
            // We pass the existing description and legendary status
            const desc = document.getElementById('pokemonDescription').textContent;
            const isLegendary = document.body.classList.contains('legendary');
            renderPokemon(currentPokemonData, desc, isLegendary);
        } catch (e) {
            console.error(e);
            showError('No se pudo cargar la Mega-Evolución.');
        } finally {
            hideLoader();
        }
    } else {
        // Switch back to Base
        if (basePokemonData) {
            currentPokemonData = basePokemonData;
            isMega = false;
            const desc = document.getElementById('pokemonDescription').textContent;
            const isLegendary = document.body.classList.contains('legendary');
            renderPokemon(currentPokemonData, desc, isLegendary);
        }
    }
}

// ========== Play Cry ==========
function playCry() {
    if (!currentCryUrl) return;

    if (cryBtn) cryBtn.classList.add('playing');
    const audio = new Audio(currentCryUrl);

    audio.play().catch(e => console.error('Error playing cry:', e));

    audio.onended = () => {
        if (cryBtn) cryBtn.classList.remove('playing');
    };
}

// ========== Legendary Lightning Bolts ==========
let sparkleTimeout = null;

function createSparkles(color) {
    const container = document.getElementById('particles');
    // Massive initial burst for impact
    for (let i = 0; i < 15; i++) {
        setTimeout(() => spawnLightningBolt(container, color), Math.random() * 500);
    }

    // Chaotic continuous spawning
    const loop = () => {
        spawnLightningBolt(container, color);
        // Random intense interval between 200ms and 800ms (slightly slower to appreciate animation)
        sparkleTimeout = setTimeout(loop, Math.random() * 600 + 200);
    };
    loop();
}

function spawnLightningBolt(container, color) {
    const bolt = document.createElement('div');
    bolt.className = 'lightning-bolt';

    // Random position horizontal
    const x = Math.random() * 90 + 5;

    // Dimensions
    const width = Math.random() * 100 + 50;
    const height = Math.random() * 100 + 200;

    // Generate jagged path vertically
    const segments = 20;
    let points = [];
    let curX = 0;
    let curY = 0;

    for (let i = 0; i <= segments; i++) {
        points.push(`${curX},${curY}`);
        // Advancing down
        curY += (400 / segments);
        // Jitter left/right
        curX += (Math.random() - 0.5) * 30;
    }

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '-100 0 200 400');
    svg.setAttribute('class', 'lightning-svg');
    svg.style.width = width + 'px';
    svg.style.height = height + 'px';

    const polyline = document.createElementNS(svgNS, 'polyline');
    polyline.setAttribute('points', points.join(' '));
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', color);
    polyline.setAttribute('stroke-width', '3');
    polyline.setAttribute('stroke-linecap', 'round');
    polyline.setAttribute('stroke-linejoin', 'round');
    polyline.setAttribute('class', 'lightning-path'); // Triggers CSS animation

    // Glow layer
    const glowLine = polyline.cloneNode();
    glowLine.setAttribute('stroke-width', '8');
    glowLine.setAttribute('opacity', '0.5');
    glowLine.setAttribute('class', 'lightning-path'); // Animate glow too
    // Removing heavy blur filter here as requested, using just opacity/width
    // But CSS filter: drop-shadow on parent container handles the glow better

    svg.appendChild(glowLine);
    svg.appendChild(polyline);
    bolt.appendChild(svg);

    bolt.style.cssText = `
        left: ${x}%;
        top: 0;
        --bolt-color: ${color};
        transform: translateX(-50%);
    `;

    document.getElementById('particles')?.appendChild(bolt);
    bolt.addEventListener('animationend', () => bolt.remove());
    // Auto remove fallback
    setTimeout(() => bolt.remove(), 1000);
}

function clearSparkles() {
    if (sparkleTimeout) {
        clearTimeout(sparkleTimeout);
        sparkleTimeout = null;
    }
    document.querySelectorAll('.lightning-bolt').forEach(s => s.remove());
}

// ========== UI State Helpers ==========
function showLoader() { if (loader) loader.style.display = 'flex'; }
function hideLoader() { if (loader) loader.style.display = 'none'; }
function showError(msg) {
    if (errorMessage) errorMessage.textContent = msg;
    if (errorContainer) errorContainer.style.display = 'block';
}
function hideError() { if (errorContainer) errorContainer.style.display = 'none'; }
function showCard() { if (pokemonCard) pokemonCard.style.display = 'block'; }
function hideCard() { if (pokemonCard) pokemonCard.style.display = 'none'; }

// ========== Static Constants ==========
const STAT_NAMES = {
    'hp': 'PS',
    'attack': 'Ataque',
    'defense': 'Defensa',
    'special-attack': 'At. Esp.',
    'special-defense': 'Def. Esp.',
    'speed': 'Velocidad'
};

const STAT_CLASSES = {
    'hp': 'stat-hp',
    'attack': 'stat-attack',
    'defense': 'stat-defense',
    'special-attack': 'stat-sp-attack',
    'special-defense': 'stat-sp-defense',
    'speed': 'stat-speed'
};

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

// ========== Combat Simulator ==========
let combatants = { 1: null, 2: null };

function switchView(view) {
    if (view === 'pokedex') {
        pokedexView.classList.remove('hidden');
        combatView.classList.add('hidden');
        viewPokedexBtn.classList.add('active');
        viewCombatBtn.classList.remove('active');
    } else {
        pokedexView.classList.add('hidden');
        combatView.classList.remove('hidden');
        viewPokedexBtn.classList.remove('active');
        viewCombatBtn.classList.add('active');
    }
}

async function handleCombatSearch(slot, query) {
    if (!query) return;
    try {
        const data = await fetchCombatData(query);
        combatants[slot] = data;
        updateCombatCard(slot, data);
        checkBattleReady();
    } catch (e) {
        alert(currentLang === 'es' ? 'Pokémon no encontrado' : 'Pokémon not found');
    }
}

async function handleCombatRandom(slot) {
    const id = Math.floor(Math.random() * MAX_POKEMON) + 1;
    await handleCombatSearch(slot, id);
}

async function fetchCombatData(query) {
    const res = await fetch(API_BASE + encodeURIComponent(query));
    if (!res.ok) throw new Error('Not found');
    return await res.json();
}

function updateCombatCard(slot, data) {
    const container = document.getElementById(`combatant${slot}`);
    const card = container.querySelector('.combat-card');
    const img = container.querySelector('.combat-img');
    const name = container.querySelector('h2'); // combat-info h2
    const statsContainer = container.querySelector('.combat-stats-mini');
    const searchInput = document.getElementById(`combatSearch${slot}`);

    card.classList.remove('empty');
    card.querySelector('.empty-state-msg').classList.add('hidden');
    card.querySelector('.combat-content').classList.remove('hidden');

    img.src = data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default;
    name.textContent = data.name;
    searchInput.value = ''; // Clear input

    // Stats
    const stats = {};
    data.stats.forEach(s => stats[s.stat.name] = s.base_stat);

    statsContainer.innerHTML = `
        <div>${TRANSLATIONS[currentLang]['attack']}: ${stats.attack}</div>
        <div>${TRANSLATIONS[currentLang]['defense']}: ${stats.defense}</div>
        <div>${TRANSLATIONS[currentLang]['special-attack']}: ${stats['special-attack']}</div>
        <div>${TRANSLATIONS[currentLang]['special-defense']}: ${stats['special-defense']}</div>
        <div>${TRANSLATIONS[currentLang]['speed']}: ${stats.speed}</div>
        <div>${TRANSLATIONS[currentLang]['hp']}: ${stats.hp}</div>
    `;
}

function checkBattleReady() {
    if (combatants[1] && combatants[2]) {
        startBattleBtn.disabled = false;
    }
}

async function startBattle() {
    const log = document.getElementById('battleLog');
    log.innerHTML = '';
    startBattleBtn.disabled = true;

    const p1 = { ...combatants[1], currentHp: combatants[1].stats.find(s => s.stat.name === 'hp').base_stat * 2, maxHp: combatants[1].stats.find(s => s.stat.name === 'hp').base_stat * 2 };
    const p2 = { ...combatants[2], currentHp: combatants[2].stats.find(s => s.stat.name === 'hp').base_stat * 2, maxHp: combatants[2].stats.find(s => s.stat.name === 'hp').base_stat * 2 };

    // Reset HP Bars
    updateHpBar(1, 100);
    updateHpBar(2, 100);

    addLog('system', `¡Comienza el combate entre ${p1.name} y ${p2.name}!`);
    await wait(1000);

    let turn = 1;
    let winner = null;

    while (p1.currentHp > 0 && p2.currentHp > 0) {
        // Determine order by Speed
        const p1Speed = p1.stats.find(s => s.stat.name === 'speed').base_stat;
        const p2Speed = p2.stats.find(s => s.stat.name === 'speed').base_stat;

        // Speed tie random
        let first = p1Speed >= p2Speed ? p1 : p2;
        let second = first === p1 ? p2 : p1;
        if (p1Speed === p2Speed && Math.random() > 0.5) { first = p2; second = p1; }

        const firstSlot = first === p1 ? 1 : 2;
        const secondSlot = second === p1 ? 1 : 2;

        // First Attack
        await performAttack(first, second, firstSlot);
        if (second.currentHp <= 0) { winner = first; break; }

        // Second Attack
        await performAttack(second, first, secondSlot);
        if (first.currentHp <= 0) { winner = second; break; }

        turn++;
        await wait(500);
    }

    const winMsg = currentLang === 'es'
        ? `¡${winner.name} ha ganado el combate!`
        : `${winner.name} has won the battle!`;
    addLog('win', winMsg);
    startBattleBtn.disabled = false;
}

async function performAttack(attacker, defender, slot) {
    // Simple damage formula: (Attack * Power / Defense) / 5
    // Determine Physical or Special
    const atkStat = attacker.stats.find(s => s.stat.name === 'attack').base_stat;
    const spAtkStat = attacker.stats.find(s => s.stat.name === 'special-attack').base_stat;
    const isSpecial = spAtkStat > atkStat;

    const attackVal = isSpecial ? spAtkStat : atkStat;
    const defStatName = isSpecial ? 'special-defense' : 'defense';
    const defVal = defender.stats.find(s => s.stat.name === defStatName).base_stat;

    // Random power 40-100
    const power = Math.floor(Math.random() * 60) + 40;
    const crit = Math.random() < 0.06 ? 1.5 : 1;

    let damage = Math.floor(((attackVal * power) / defVal) / 5 * crit);
    // Ensure at least 1 dmg
    damage = Math.max(1, damage);

    defender.currentHp -= damage;
    if (defender.currentHp < 0) defender.currentHp = 0;

    // Update UI
    const defenderSlot = slot === 1 ? 2 : 1;
    const hpPercent = (defender.currentHp / defender.maxHp) * 100;
    updateHpBar(defenderSlot, hpPercent);

    // Log
    const critText = crit > 1 ? (currentLang === 'es' ? ' ¡GOLPE CRÍTICO!' : ' CRITICAL HIT!') : '';
    const moveType = isSpecial
        ? (currentLang === 'es' ? 'ataque especial' : 'special attack')
        : (currentLang === 'es' ? 'ataque físico' : 'physical attack');

    const attackMsg = currentLang === 'es'
        ? `${attacker.name} usa ${moveType} y hace ${damage} de daño.${critText}`
        : `${attacker.name} uses ${moveType} and deals ${damage} damage.${critText}`;

    addLog(slot === 1 ? 'p1' : 'p2', attackMsg);

    await wait(800);
}

function updateHpBar(slot, percent) {
    const bar = document.getElementById(`hpBar${slot}`);
    if (bar) {
        bar.style.width = `${percent}%`;
        if (percent < 20) bar.style.background = '#e74c3c';
        else if (percent < 50) bar.style.background = '#f1c40f';
        else bar.style.background = 'linear-gradient(90deg, #2ecc71, #27ae60)';
    }
}

function addLog(type, msg) {
    const log = document.getElementById('battleLog');
    const p = document.createElement('div');
    p.className = `log-entry ${type}`;
    p.textContent = msg;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ========== Utilities ==========
function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function translateType(type) {
    const translations = {
        es: {
            normal: 'Normal', fire: 'Fuego', water: 'Agua', electric: 'Eléctrico',
            grass: 'Planta', ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno',
            ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
            rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro',
            steel: 'Acero', fairy: 'Hada',
        },
        en: {
            normal: 'Normal', fire: 'Fire', water: 'Water', electric: 'Electric',
            grass: 'Grass', ice: 'Ice', fighting: 'Fighting', poison: 'Poison',
            ground: 'Ground', flying: 'Flying', psychic: 'Psychic', bug: 'Bug',
            rock: 'Rock', ghost: 'Ghost', dragon: 'Dragon', dark: 'Dark',
            steel: 'Steel', fairy: 'Fairy',
        }
    };
    return translations[currentLang]?.[type] || translations['en']?.[type] || type;
}

// ========== Autocomplete ==========
async function fetchAllPokemonNames() {
    try {
        // Fetch list of all pokemon for autocomplete
        // Limit 2000 covers all current gen + forms
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
        const data = await res.json();
        allPokemonNames = data.results.map(p => p.name);

        // Setup autocomplete for inputs
        if (searchInput) setupAutocomplete(searchInput, handleSearch);
        if (combatSearch1) setupAutocomplete(combatSearch1, (val) => handleCombatSearch(1, val));
        if (combatSearch2) setupAutocomplete(combatSearch2, (val) => handleCombatSearch(2, val));
    } catch (e) {
        console.warn('Autocomplete fetch failed', e);
    }
}

function setupAutocomplete(input, onSelectCallback) {
    let currentFocus = -1;

    // Execute a function when someone writes in the text field:
    input.addEventListener('input', function (e) {
        let val = this.value;
        closeAllLists();
        if (!val) return false;
        currentFocus = -1;

        // Create a DIV element that will contain the items (values):
        let a = document.createElement('div');
        a.setAttribute('id', this.id + 'autocomplete-list');
        a.setAttribute('class', 'autocomplete-items');

        // Append the DIV element as a child of the autocomplete container:
        this.parentNode.appendChild(a);

        // Filter and Sort Logic
        // 1. Filter names that match query
        // 2. Sort by:
        //    - Starts with query (High priority)
        //    - Percentage of Match (Length similarity)
        const query = val.toLowerCase();

        const matches = allPokemonNames.filter(name => name.includes(query));

        // Sorting Algorithm
        matches.sort((a, b) => {
            const aStarts = a.startsWith(query);
            const bStarts = b.startsWith(query);

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            // If both start or both don't, sort by length (shorter = higher match %)
            return a.length - b.length;
        });

        // Limit to top 8 suggestions
        const topMatches = matches.slice(0, 8);

        for (let i = 0; i < topMatches.length; i++) {
            const name = topMatches[i];
            /*create a DIV element for each matching element:*/
            let b = document.createElement('div');
            b.className = 'autocomplete-item';

            // Highlight the matching part
            // Find index of match
            const index = name.indexOf(query);
            if (index >= 0) {
                b.innerHTML = name.substr(0, index) +
                    "<strong>" + name.substr(index, query.length) + "</strong>" +
                    name.substr(index + query.length);
            } else {
                b.innerHTML = name;
            }

            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener('click', function (e) {
                /*insert the value for the autocomplete text field:*/
                input.value = name;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
                // Trigger action
                if (onSelectCallback) onSelectCallback(name);
            });
            a.appendChild(b);
        }
    });

    // Keyboard Navigation
    input.addEventListener('keydown', function (e) {
        let x = document.getElementById(this.id + 'autocomplete-list');
        if (x) x = x.getElementsByTagName('div');
        if (e.key === 'ArrowDown') {
            currentFocus++;
            addActive(x);
        } else if (e.key === 'ArrowUp') {
            currentFocus--;
            addActive(x);
        } else if (e.key === 'Enter') {
            if (currentFocus > -1) {
                e.preventDefault();
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add('autocomplete-active');
        // Scroll to view
        x[currentFocus].scrollIntoView({ block: 'nearest' });
    }

    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove('autocomplete-active');
        }
    }

    function closeAllLists(elmnt) {
        // Close all autocomplete lists in the document,
        // except the one passed as an argument:
        var x = document.getElementsByClassName('autocomplete-items');
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener('click', function (e) {
        closeAllLists(e.target);
    });
}
