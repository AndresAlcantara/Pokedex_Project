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
        'info-gender': "Género",
        'info-catch': "Ratio Captura",
        'info-happiness': "Felicidad Base",
        'info-habitat': "Hábitat",
        'info-growth': "Crecimiento",
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
        'hp': 'PS', 'attack': 'Ataque', 'defense': 'Defensa',
        'special-attack': 'At. Esp.', 'special-defense': 'Def. Esp.', 'speed': 'Velocidad',
        'battle-start': "¡Comienza el combate entre {p1} y {p2}!",
        'battle-win': "¡{winner} ha ganado el combate!",
        'battle-crit': " ¡GOLPE CRÍTICO!",
        'battle-special': "ataque especial",
        'battle-physical': "ataque físico",
        'battle-attack-msg': "{attacker} usa {type} y hace {damage} de daño.{crit}",
        'no-description': "Sin descripción disponible.",
        'lang-toggle-title': "Cambiar idioma"
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
        'info-gender': "Gender",
        'info-catch': "Catch Rate",
        'info-happiness': "Base Happiness",
        'info-habitat': "Habitat",
        'info-growth': "Growth Rate",
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
        'hp': 'HP', 'attack': 'Attack', 'defense': 'Defense',
        'special-attack': 'Sp. Atk', 'special-defense': 'Sp. Def', 'speed': 'Speed',
        'battle-start': "The battle between {p1} and {p2} begins!",
        'battle-win': "{winner} has won the battle!",
        'battle-crit': " CRITICAL HIT!",
        'battle-special': "special attack",
        'battle-physical': "physical attack",
        'battle-attack-msg': "{attacker} uses {type} and deals {damage} damage.{crit}",
        'no-description': "No description available.",
        'lang-toggle-title': "Change language"
    },
    ja: {
        'meta-description': "ポケデックス — 名前か番号でポケモンの基本ステータスを検索",
        'title': "ポケデックス — 基本ステータス",
        'logo-title': "ホームに戻る",
        'subtitle': "基本ステータス",
        'nav-search': "検索",
        'nav-battle': "バトル",
        'nav-pokedex': "ポケデックス",
        'nav-combat': "対戦シミュレーター",
        'search-placeholder': "ポケモンの名前または番号...",
        'search-btn': "検索",
        'search-example': "例",
        'random-btn': "おまかせ",
        'loader-text': "ポケモンを検索中...",
        'error-not-found': "ポケモンが見つかりません",
        'shiny-toggle': "色違いを表示",
        'shiny-label': "色違い",
        'mega-toggle': "メガシンカ",
        'mega-label': "メガシンカ",
        'cry-toggle': "なきごえ",
        'stats-title': "基本ステータス",
        'stats-total': "合計",
        'info-height': "たかさ",
        'info-weight': "おもさ",
        'info-exp': "基礎経験値",
        'info-abilities': "特性",
        'evo-title': "進化の流れ",
        'info-gender': "性別",
        'info-catch': "捕捉率",
        'info-happiness': "なつき度",
        'info-habitat': "生息地",
        'info-growth': "成長速度",
        'nav-prev': "前へ",
        'nav-next': "次へ",
        'combat-p1-title': "あなたのポケモン",
        'combat-p2-title': "相手",
        'combat-search-placeholder': "検索...",
        'combat-p1-empty': "ポケモンを選択",
        'combat-p2-empty': "相手を選択",
        'combat-start-btn': "対戦開始！",
        'combat-log-title': "対戦ログ",
        'combat-log-empty': "2匹 de ポケモンを選択してシミュレーションを開始してください。",
        'footer-data': "データ提供：",
        'footer-project': "ポケデックス・プロジェクト",
        'hp': 'HP', 'attack': 'こうげき', 'defense': 'ぼうぎょ',
        'special-attack': 'とくこう', 'special-defense': 'とくぼう', 'speed': 'すばやさ',
        'battle-start': "{p1} と {p2} のバトルが始まった！",
        'battle-win': "{winner} の勝ち！",
        'battle-crit': " きゅうしょに あたった！",
        'battle-special': "とくしゅこうげき",
        'battle-physical': "ぶつりこうげき",
        'battle-attack-msg': "{attacker} は {type} をくりだし、 {damage} ダメージ をあたえた！{crit}",
        'no-description': "説明はありません。",
        'lang-toggle-title': "言語を切り替える"
    },
    de: {
        'meta-description': "Pokédex — Suche Basiswerte for jedes Pokémon nach Name oder Nummer",
        'title': "Pokédex — Basiswerte",
        'logo-title': "Startseite",
        'subtitle': "Basiswerte",
        'nav-search': "Suche",
        'nav-battle': "Kampf",
        'nav-pokedex': "Pokédex",
        'nav-combat': "Kampfsimulator",
        'search-placeholder': "Pokémon Name oder Nummer...",
        'search-btn': "Suche",
        'search-example': "Beispiel",
        'random-btn': "Zufall",
        'loader-text': "Suche Pokémon...",
        'error-not-found': "Pokémon nicht gefunden",
        'shiny-toggle': "Shiny-Version anzeigen",
        'shiny-label': "Shiny",
        'mega-toggle': "Mega-Entwicklung",
        'mega-label': "Mega",
        'cry-toggle': "Ruf abspielen",
        'stats-title': "Basiswerte",
        'stats-total': "Gesamt",
        'info-height': "Größe",
        'info-weight': "Gewicht",
        'info-exp': "Basis-EP",
        'info-abilities': "Fähigkeiten",
        'evo-title': "Entwicklungskette",
        'info-gender': "Geschlecht",
        'info-catch': "Fangrate",
        'info-happiness': "Basis-Zutraulichkeit",
        'info-habitat': "Habitat",
        'info-growth': "Wachstumsrate",
        'nav-prev': "Zurück",
        'nav-next': "Weiter",
        'combat-p1-title': "Dein Pokémon",
        'combat-p2-title': "Gegner",
        'combat-search-placeholder': "Suche...",
        'combat-p1-empty': "Wähle ein Pokémon",
        'combat-p2-empty': "Wähle einen Gegner",
        'combat-start-btn': "KAMPF STARTEN!",
        'combat-log-title': "Kampfprotokoll",
        'combat-log-empty': "Wähle zwei Pokémon, um die Simulation zu starten.",
        'footer-data': "Daten von",
        'footer-project': "Pokédex-Projekt",
        'hp': 'KP', 'attack': 'Angriff', 'defense': 'Verteidigung',
        'special-attack': 'Sp.-Ang.', 'special-defense': 'Sp.-Vert.', 'speed': 'Initiative',
        'battle-start': "Der Kampf zwischen {p1} und {p2} beginnt!",
        'battle-win': "{winner} hat den Kampf gewonnen!",
        'battle-crit': " VOLLTREFFER!",
        'battle-special': "Spezial-Angriff",
        'battle-physical': "Physischer Angriff",
        'battle-attack-msg': "{attacker} nutzt {type} und fügt {damage} Schaden zu.{crit}",
        'no-description': "Keine Beschreibung verfügbar.",
        'lang-toggle-title': "Sprache ändern"
    },
    fr: {
        'meta-description': "Pokédex — Recherchez les statistiques de base de n'importe quel Pokémon par nom ou numéro",
        'title': "Pokédex — Stats de Base",
        'logo-title': "Retour à l'accueil",
        'subtitle': "Stats de Base",
        'nav-search': "Chercher",
        'nav-battle': "Combat",
        'nav-pokedex': "Pokédex",
        'nav-combat': "Simulateur de Combat",
        'search-placeholder': "Nom ou numéro du Pokémon...",
        'search-btn': "Chercher",
        'search-example': "Exemple",
        'random-btn': "Aléatoire",
        'loader-text': "Recherche du Pokémon...",
        'error-not-found': "Pokémon non trouvé",
        'shiny-toggle': "Voir la version shiny",
        'shiny-label': "Shiny",
        'mega-toggle': "Méga-Évolution",
        'mega-label': "Méga",
        'cry-toggle': "Jouer le cri",
        'stats-title': "Stats de Base",
        'stats-total': "Total",
        'info-height': "Taille",
        'info-weight': "Poids",
        'info-exp': "Expér. de Base",
        'info-abilities': "Talents",
        'evo-title': "Chaîne d'Évolution",
        'info-gender': "Sexe",
        'info-catch': "Taux de Capture",
        'info-happiness': "Bonheur de Base",
        'info-habitat': "Habitat",
        'info-growth': "Taux de Croissance",
        'nav-prev': "Précédent",
        'nav-next': "Suivant",
        'combat-p1-title': "Ton Pokémon",
        'combat-p2-title': "Adversaire",
        'combat-search-placeholder': "Chercher...",
        'combat-p1-empty': "Sélectionne un Pokémon",
        'combat-p2-empty': "Sélectionne un Adversaire",
        'combat-start-btn': "COMMENCER LE COMBAT !",
        'combat-log-title': "Journal de Combat",
        'combat-log-empty': "Sélectionne deux Pokémon pour commencer la simulation.",
        'footer-data': "Données par",
        'footer-project': "Projet Pokédex",
        'hp': 'PV', 'attack': 'Attaque', 'defense': 'Défense',
        'special-attack': 'Att. Spé.', 'special-defense': 'Déf. Spé.', 'speed': 'Vitesse',
        'battle-start': "Le combat entre {p1} et {p2} commence !",
        'battle-win': "{winner} a gagné le combat !",
        'battle-crit': " UN COUP CRITIQUE !",
        'battle-special': "attaque spéciale",
        'battle-physical': "attaque physique",
        'battle-attack-msg': "{attacker} utilise {type} et inflige {damage} dégâts.{crit}",
        'no-description': "Aucune description disponible.",
        'lang-toggle-title': "Changer de langue"
    },
    it: {
        'meta-description': "Pokédex — Cerca le statistiche di base di qualsiasi Pokémon per nome o numero",
        'title': "Pokédex — Statistiche di Base",
        'logo-title': "Torna alla home",
        'subtitle': "Statistiche di Base",
        'nav-search': "Cerca",
        'nav-battle': "Lotta",
        'nav-pokedex': "Pokédex",
        'nav-combat': "Simulatore di Lotta",
        'search-placeholder': "Nome o numero del Pokémon...",
        'search-btn': "Cerca",
        'search-example': "Esempio",
        'random-btn': "Casuale",
        'loader-text': "Ricerca Pokémon...",
        'error-not-found': "Pokémon non trovato",
        'shiny-toggle': "Visualizza versione shiny",
        'shiny-label': "Shiny",
        'mega-toggle': "Megaevoluzione",
        'mega-label': "Mega",
        'cry-toggle': "Riproduci verso",
        'stats-title': "Statistiche di Base",
        'stats-total': "Totale",
        'info-height': "Altezza",
        'info-weight': "Peso",
        'info-exp': "Esp. di Base",
        'info-abilities': "Abilità",
        'evo-title': "Catena Evolutiva",
        'info-gender': "Genere",
        'info-catch': "Tasso di Cattura",
        'info-happiness': "Felicità di Base",
        'info-habitat': "Habitat",
        'info-growth': "Tasso di Crescita",
        'nav-prev': "Precedente",
        'nav-next': "Successivo",
        'combat-p1-title': "Il tuo Pokémon",
        'combat-p2-title': "Avversario",
        'combat-search-placeholder': "Cerca...",
        'combat-p1-empty': "Seleziona un Pokémon",
        'combat-p2-empty': "Seleziona un Avversario",
        'combat-start-btn': "INIZIA LA LOTTA!",
        'combat-log-title': "Registro di Lotta",
        'combat-log-empty': "Seleziona due Pokémon per iniziare la simulazione.",
        'footer-data': "Dati forniti da",
        'footer-project': "Progetto Pokédex",
        'hp': 'PS', 'attack': 'Attacco', 'defense': 'Difesa',
        'special-attack': 'Att. Sp.', 'special-defense': 'Dif. Sp.', 'speed': 'Velocità',
        'battle-start': "La lotta tra {p1} e {p2} ha inizio!",
        'battle-win': "{winner} ha vinto la lotta!",
        'battle-crit': " UN BRUTTO COLPO!",
        'battle-special': "attacco speciale",
        'battle-physical': "attacco fisico",
        'battle-attack-msg': "{attacker} usa {type} e infligge {damage} danni.{crit}",
        'no-description': "Nessuna descrizione disponibile.",
        'lang-toggle-title': "Cambia lingua"
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
    const languages = ['es', 'en', 'ja', 'de', 'fr', 'it'];
    const currentIndex = languages.indexOf(currentLang);
    currentLang = languages[(currentIndex + 1) % languages.length];

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
        let extraInfo = {
            genderRate: -1,
            captureRate: 0,
            happiness: 0,
            habitat: '—',
            growthRate: '—'
        };

        try {
            const speciesRes = await fetch(SPECIES_API + pokemonData.id);
            if (speciesRes.ok) {
                const speciesData = await speciesRes.json();
                isLegendary = speciesData.is_legendary || speciesData.is_mythical;
                evolutionUrl = speciesData.evolution_chain?.url;

                // Extra Info
                extraInfo.genderRate = speciesData.gender_rate;
                extraInfo.captureRate = speciesData.capture_rate;
                extraInfo.happiness = speciesData.base_happiness;
                extraInfo.habitat = speciesData.habitat?.name || '—';
                extraInfo.growthRate = speciesData.growth_rate?.name || '—';

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

        renderPokemon(pokemonData, description, isLegendary, extraInfo);
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
function renderPokemon(data, description, isLegendary = false, extraInfo = null) {
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

    // New Fields
    const pokemonGender = document.getElementById('pokemonGender');
    const pokemonCapture = document.getElementById('pokemonCapture');
    const pokemonHappiness = document.getElementById('pokemonHappiness');
    const pokemonHabitat = document.getElementById('pokemonHabitat');
    const pokemonGrowth = document.getElementById('pokemonGrowth');

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
        pokemonDesc.textContent = description || TRANSLATIONS[currentLang]['no-description'];
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

    // Extra Info Rendering
    if (extraInfo) {
        if (pokemonGender) {
            if (extraInfo.genderRate === -1) {
                pokemonGender.textContent = 'Genderless';
            } else {
                const female = (extraInfo.genderRate / 8) * 100;
                const male = 100 - female;
                pokemonGender.innerHTML = `<span style="color: #4a90e2">♂ ${male}%</span> <span style="color: #e24a8d">♀ ${female}%</span>`;
            }
        }
        if (pokemonCapture) pokemonCapture.textContent = extraInfo.captureRate;
        if (pokemonHappiness) pokemonHappiness.textContent = extraInfo.happiness;
        if (pokemonHabitat) pokemonHabitat.textContent = extraInfo.habitat.charAt(0).toUpperCase() + extraInfo.habitat.slice(1);
        if (pokemonGrowth) pokemonGrowth.textContent = extraInfo.growthRate.replace(/-/g, ' ').charAt(0).toUpperCase() + extraInfo.growthRate.replace(/-/g, ' ').slice(1);
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
        alert(TRANSLATIONS[currentLang]['error-not-found']);
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

    const startMsg = TRANSLATIONS[currentLang]['battle-start']
        .replace('{p1}', p1.name)
        .replace('{p2}', p2.name);
    addLog('system', startMsg);
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

    const winMsg = TRANSLATIONS[currentLang]['battle-win'].replace('{winner}', winner.name);
    addLog('win', winMsg);
    startBattleBtn.disabled = false;
}

async function performAttack(attacker, defender, slot) {
    const defenderSlot = slot === 1 ? 2 : 1;

    // Simple damage formula: (Attack * Power / Defense) / 5
    // Determine Physical or Special
    const atkStat = attacker.stats.find(s => s.stat.name === 'attack').base_stat;
    const spAtkStat = attacker.stats.find(s => s.stat.name === 'special-attack').base_stat;
    const isSpecial = spAtkStat > atkStat;

    const attackVal = isSpecial ? spAtkStat : atkStat;
    const defStatName = isSpecial ? 'special-defense' : 'defense';
    const defVal = defender.stats.find(s => s.stat.name === defStatName).base_stat;

    // Trigger visual effect based on primary type
    const primaryType = attacker.types[0].type.name;
    triggerVisualEffect(slot, defenderSlot, primaryType);

    // Random power 40-100
    const power = Math.floor(Math.random() * 60) + 40;
    const crit = Math.random() < 0.06 ? 1.5 : 1;

    let damage = Math.floor(((attackVal * power) / defVal) / 5 * crit);
    // Ensure at least 1 dmg
    damage = Math.max(1, damage);

    defender.currentHp -= damage;
    if (defender.currentHp < 0) defender.currentHp = 0;

    // Shake and flash defender
    const defenderCard = document.querySelector(`#combatant${defenderSlot} .combat-card`);
    if (defenderCard) {
        defenderCard.classList.add('shake', 'flash');
        setTimeout(() => defenderCard.classList.remove('shake', 'flash'), 500);
    }

    // Update UI
    const hpPercent = (defender.currentHp / defender.maxHp) * 100;
    updateHpBar(defenderSlot, hpPercent);

    // Log
    const critText = crit > 1 ? TRANSLATIONS[currentLang]['battle-crit'] : '';
    const moveType = isSpecial
        ? TRANSLATIONS[currentLang]['battle-special']
        : TRANSLATIONS[currentLang]['battle-physical'];

    const attackMsg = TRANSLATIONS[currentLang]['battle-attack-msg']
        .replace('{attacker}', attacker.name)
        .replace('{type}', moveType)
        .replace('{damage}', damage)
        .replace('{crit}', critText);

    addLog(slot === 1 ? 'p1' : 'p2', attackMsg);

    await wait(800);
}

function triggerVisualEffect(attackerSlot, targetSlot, type) {
    const combatView = document.getElementById('combat-view');
    const attackerImg = document.getElementById(`combatImg${attackerSlot}`);
    const targetImg = document.getElementById(`combatImg${targetSlot}`);
    if (!attackerImg || !targetImg) return;

    const rectA = attackerImg.getBoundingClientRect();
    const rectT = targetImg.getBoundingClientRect();

    const centerA = { x: rectA.left + rectA.width / 2, y: rectA.top + rectA.height / 2 };
    const centerT = { x: rectT.left + rectT.width / 2, y: rectT.top + rectT.height / 2 };

    const dx = centerT.x - centerA.x;
    const dy = centerT.y - centerA.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    const container = document.createElement('div');
    container.className = 'epic-ray-container';
    const mainColor = TYPE_COLORS[type]?.bg || '#fff';
    container.style.color = mainColor;
    container.style.left = `${centerA.x}px`;
    container.style.top = `${centerA.y}px`;
    container.style.width = `${distance}px`;
    container.style.transform = `translate(0, -50%) rotate(${angle}deg)`;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 1000 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.className = "epic-ray-svg";

    // Create multiple paths for the bloom/aura effect
    const pathData = getEpicRayPath(type);
    const pathLayers = ['glow', 'aura', 'core'];
    pathLayers.forEach(layer => {
        const p = document.createElementNS(svgNS, "path");
        p.setAttribute("d", pathData);
        p.className = `ray-path ray-path-${layer}`;
        svg.appendChild(p);
    });

    const head = document.createElement('div');
    head.className = "ray-head";

    container.appendChild(svg);
    container.appendChild(head);
    document.body.appendChild(container);

    // Continuous Trail Particles during travel
    let trailInterval = setInterval(() => {
        const headPos = head.getBoundingClientRect();
        if (headPos.width > 0) {
            spawnTrailParticle(headPos.left + headPos.width / 2, headPos.top + headPos.height / 2, mainColor);
        }
    }, 20);

    setTimeout(() => {
        clearInterval(trailInterval);
        combatView.classList.add('combat-view-shake');
        setTimeout(() => combatView.classList.remove('combat-view-shake'), 500);

        const targetCard = document.querySelector(`#combatant${targetSlot} .combat-card`);
        const ring = document.createElement('div');
        ring.className = 'impact-ring-epic';
        targetCard.appendChild(ring);

        spawnParticles(targetCard, type);

        setTimeout(() => {
            ring.remove();
            container.remove();
        }, 600);
    }, 450);
}

function spawnTrailParticle(x, y, color) {
    const p = document.createElement('div');
    p.className = 'trail-particle';
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.color = color;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 400);
}

function getEpicRayPath(type) {
    switch (type) {
        case 'electric': return "M 0 50 L 100 20 L 200 80 L 300 10 L 400 90 L 500 30 L 600 70 L 700 20 L 800 80 L 900 40 L 1000 50";
        case 'fire': return "M 0 50 Q 125 0, 250 50 T 500 50 T 750 50 T 1000 50";
        case 'water': return "M 0 50 C 250 150, 250 -50, 500 50 C 750 150, 750 -50, 1000 50";
        case 'grass': return "M 0 50 L 100 40 A 50 50 0 0 1 200 50 L 300 60 A 50 50 0 0 0 400 50 L 1000 50";
        default: return "M 0 50 L 900 50 L 950 40 L 1000 50 L 950 60 L 900 50";
    }
}

function spawnParticles(container, type) {
    const burst = document.createElement('div');
    burst.className = 'particle-burst';
    container.appendChild(burst);

    const particleCount = 35; // Increased density
    const color = TYPE_COLORS[type]?.bg || '#fff';

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'fx-particle';

        const angle = Math.random() * Math.PI * 2;
        const velocity = 100 + Math.random() * 250;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        const size = 4 + Math.random() * 14;
        const rotation = Math.random() * 360;
        const radius = Math.random() > 0.5 ? '50%' : '2px'; // Varied shapes

        p.style.setProperty('--tx', `${tx}px`);
        p.style.setProperty('--ty', `${ty}px`);
        p.style.setProperty('--sz', `${size}px`);
        p.style.setProperty('--rot', `${rotation}deg`);
        p.style.setProperty('--rd', radius);
        p.style.color = color;

        p.style.animationDelay = `${Math.random() * 0.1}s`;
        burst.appendChild(p);
    }
    setTimeout(() => burst.remove(), 1200);
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
        },
        ja: {
            normal: 'ノーマル', fire: 'ほのお', water: 'みず', electric: 'でんき',
            grass: 'くさ', ice: 'こおり', fighting: 'かくとう', poison: 'どく',
            ground: 'じめん', flying: 'ひこう', psychic: 'エスパー', bug: 'むし',
            rock: 'いわ', ghost: 'ゴースト', dragon: 'ドラゴン', dark: 'あく',
            steel: 'はがね', fairy: 'フェアリー',
        },
        de: {
            normal: 'Normal', fire: 'Feuer', water: 'Wasser', electric: 'Elektro',
            grass: 'Pflanze', ice: 'Eis', fighting: 'Kampf', poison: 'Gift',
            ground: 'Boden', flying: 'Flug', psychic: 'Psycho', bug: 'Käfer',
            rock: 'Gestein', ghost: 'Geist', dragon: 'Drache', dark: 'Unlicht',
            steel: 'Stahl', fairy: 'Fee',
        },
        fr: {
            normal: 'Normal', fire: 'Feu', water: 'Eau', electric: 'Électrik',
            grass: 'Plante', ice: 'Glace', fighting: 'Combat', poison: 'Poison',
            ground: 'Sol', flying: 'Vol', psychic: 'Psy', bug: 'Insecte',
            rock: 'Roche', ghost: 'Spectre', dragon: 'Dragon', dark: 'Ténèbres',
            steel: 'Acier', fairy: 'Fée',
        },
        it: {
            normal: 'Normale', fire: 'Fuoco', water: 'Acqua', electric: 'Elettro',
            grass: 'Erba', ice: 'Ghiaccio', fighting: 'Lotta', poison: 'Veleno',
            ground: 'Terra', flying: 'Volante', psychic: 'Psico', bug: 'Coleottero',
            rock: 'Roccia', ghost: 'Spettro', dragon: 'Drago', dark: 'Buio',
            steel: 'Acciaio', fairy: 'Folletto',
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
