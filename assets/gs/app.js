document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM загружен");
    
    // Сразу скрываем загрузку
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('main-ui').classList.remove('hidden');
    
    // Инициализация
    initApp();
    
    // Загружаем первую страницу
    loadPage('tower');
    
    // Настраиваем навигацию
    setupNavigation();
});

function initApp() {
    console.log("Игра инициализирована");
    
    // Обновляем имя игрока
    const player = TelegramApp.getUser();
    if (player && player.first_name) {
        document.getElementById('player-name').textContent = player.first_name;
    }
    
    // Обновляем ману
    updateManaDisplay();
}

function loadPage(pageName) {
    console.log("Загружаем страницу:", pageName);
    
    const content = document.getElementById('content');
    
    // Очищаем предыдущий контент
    content.innerHTML = '';
    
    // В зависимости от страницы показываем разный контент
    switch(pageName) {
        case 'tower':
            loadTowerPage(content);
            break;
            
        case 'spells':
            loadSpellsPage(content);
            break;
            
        case 'duel':
            loadDuelPage(content);
            break;
            
        case 'guild':
            loadGuildPage(content);
            break;
            
        default:
            loadTowerPage(content);
    }
}

function loadTowerPage(container) {
    container.innerHTML = `
        <div class="tower-page">
            <h2>🏰 Магическая Башня</h2>
            <p class="level-info">Уровень: <strong id="tower-level">${Game.level}</strong></p>
            
            <div class="tap-area" id="tap-area">
                <div class="wizard-avatar">
                    🧙
                </div>
                <p class="tap-hint">Тапай по магу для сбора маны!</p>
                <p class="tap-reward">+${CONFIG.GAME.BASE_MANA_PER_TAP} маны за тап</p>
            </div>
            
            <div class="stats-box">
                <h3>📊 Быстрая статистика</h3>
                <p>• Тапай быстрее для больше маны</p>
                <p>• Используй ежедневные комбо</p>
                <p>• Улучшай заклинания</p>
            </div>
            
            <div class="daily-section">
                <h3>🎁 Ежедневное комбо</h3>
                <div class="combo-input">
                    <input type="text" 
                           id="combo-input" 
                           placeholder="Введи ALT+MANA"
                           maxlength="20">
                    <button class="btn combo-btn" id="combo-btn">Использовать</button>
                </div>
                <p class="combo-hint">Дает +${CONFIG.GAME.DAILY_COMBO_REWARD} маны раз в день</p>
            </div>
            
            <div class="actions">
                <button class="btn action-btn" id="spells-btn">
                    📖 Учить заклинания
                </button>
                <button class="btn action-btn" id="duel-btn">
                    ⚔️ Начать дуэль
                </button>
            </div>
        </div>
    `;
    
    // Назначаем обработчики для элементов башни
    setupTowerPageEvents();
}

function loadSpellsPage(container) {
    container.innerHTML = `
        <div class="spells-page">
            <h2>📖 Книга Заклинаний</h2>
            
            <div class="spell-list">
                <div class="spell-card">
                    <div class="spell-icon">🔥</div>
                    <h4>Огненный шар</h4>
                    <p>Урон: 15</p>
                    <p class="spell-desc">Базовое огненное заклинание</p>
                    <button class="btn small-btn" disabled>Изучено</button>
                </div>
                
                <div class="spell-card locked">
                    <div class="spell-icon">❄️</div>
                    <h4>Ледяная стрела</h4>
                    <p>Урон: 12</p>
                    <p class="spell-desc">Замораживает врага</p>
                    <button class="btn small-btn">Изучить (500)</button>
                </div>
                
                <div class="spell-card locked">
                    <div class="spell-icon">⚡</div>
                    <h4>Молния</h4>
                    <p>Урон: 20</p>
                    <p class="spell-desc">Мгновенная атака</p>
                    <button class="btn small-btn">Изучить (1000)</button>
                </div>
            </div>
            
            <div class="spell-info">
                <p>Изучено: <strong>1/3</strong></p>
                <p>Для изучения нужна мана</p>
                <button class="btn back-btn" onclick="loadPage('tower')">
                    ← Назад в башню
                </button>
            </div>
        </div>
    `;
}

function loadDuelPage(container) {
    container.innerHTML = `
        <div class="duel-page">
            <h2>⚔️ Дуэльная Арена</h2>
            
            <div class="duel-info">
                <div class="duel-stat">
                    <span>🏆 Побед:</span>
                    <strong>0</strong>
                </div>
                <div class="duel-stat">
                    <span>💀 Поражений:</span>
                    <strong>0</strong>
                </div>
                <div class="duel-stat">
                    <span>🎫 Стоимость:</span>
                    <strong>50 маны</strong>
                </div>
            </div>
            
            <div class="duel-opponent">
                <h3>Противник:</h3>
                <div class="opponent-card">
                    <div class="opponent-avatar">🧙‍♂️</div>
                    <h4>Маг-новичок</h4>
                    <p>Уровень: 1</p>
                    <p>Сила: 100</p>
                </div>
            </div>
            
            <div class="duel-controls">
                <button class="btn duel-btn" id="start-duel">
                    Начать дуэль (50 маны)
                </button>
                <button class="btn secondary-btn" onclick="loadPage('tower')">
                    Тренироваться
                </button>
            </div>
            
            <div class="duel-history">
                <h3>История дуэлей:</h3>
                <p>Пока нет дуэлей</p>
                <p>Победи в дуэли, чтобы получить 100 маны!</p>
            </div>
        </div>
    `;
}

function loadGuildPage(container) {
    container.innerHTML = `
        <div class="guild-page">
            <h2>👥 Гильдия Магов</h2>
            
            <div class="guild-info">
                <div class="guild-stat">
                    <span>🏛️ Название:</span>
                    <strong>Одиночки</strong>
                </div>
                <div class="guild-stat">
                    <span>👥 Участники:</span>
                    <strong>1/30</strong>
                </div>
                <div class="guild-stat">
                    <span>📊 Уровень гильдии:</span>
                    <strong>1</strong>
                </div>
            </div>
            
            <div class="guild-features">
                <h3>Возможности гильдии:</h3>
                <ul>
                    <li>👥 Совместные ритуалы</li>
                    <li>🏆 Гильдейские турниры</li>
                    <li>🎁 Общие награды</li>
                    <li>💬 Чат гильдии</li>
                </ul>
            </div>
            
            <div class="guild-actions">
                <button class="btn guild-btn">
                    Создать гильдию (1000 маны)
                </button>
                <button class="btn secondary-btn">
                    Найти гильдию
                </button>
                <button class="btn back-btn" onclick="loadPage('tower')">
                    ← Позже
                </button>
            </div>
            
            <div class="guild-hint">
                <p>💡 Совет: Пригласи друзей в игру, чтобы создать гильдию!</p>
            </div>
        </div>
    `;
}

function setupNavigation() {
    console.log("Настраиваем навигацию");
    
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log("Нажата кнопка:", this.dataset.page);
            
            // Убираем активный класс у всех кнопок
            navButtons.forEach(b => b.classList.remove('active'));
            
            // Добавляем активный класс нажатой кнопке
            this.classList.add('active');
            
            // Загружаем соответствующую страницу
            const page = this.dataset.page;
            loadPage(page);
        });
    });
}

function setupTowerPageEvents() {
    // Обработчик тапа по магу
    const tapArea = document.getElementById('tap-area');
    if (tapArea) {
        tapArea.addEventListener('click', handleTap);
        tapArea.addEventListener('touchstart', function(e) {
            e.preventDefault();
            handleTap();
        });
    }
    
    // Обработчик комбо-кнопки
    const comboBtn = document.getElementById('combo-btn');
    const comboInput = document.getElementById('combo-input');
    
    if (comboBtn) {
        comboBtn.addEventListener('click', function() {
            if (comboInput && comboInput.value.trim()) {
                Game.useDailyCombo(comboInput.value.trim());
                comboInput.value = '';
            } else {
                TelegramApp.showAlert("Введите комбо!");
            }
        });
    }
    
    // Обработчики кнопок действий
    const spellsBtn = document.getElementById('spells-btn');
    const duelBtn = document.getElementById('duel-btn');
    
    if (spellsBtn) {
        spellsBtn.addEventListener('click', function() {
            loadPage('spells');
            // Обновляем активную кнопку навигации
            updateNavButton('spells');
        });
    }
    
    if (duelBtn) {
        duelBtn.addEventListener('click', function() {
            loadPage('duel');
            updateNavButton('duel');
        });
    }
}

function handleTap() {
    const earned = Game.tap();
    
    // Анимация тапа
    const tapArea = document.getElementById('tap-area');
    if (tapArea) {
        tapArea.style.transform = 'scale(0.98)';
        setTimeout(() => {
            tapArea.style.transform = 'scale(1)';
        }, 100);
    }
    
    console.log("Тап! +" + earned + " маны");
}

function updateNavButton(pageName) {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageName) {
            btn.classList.add('active');
        }
    });
}

function updateManaDisplay() {
    const manaElement = document.getElementById('mana-count');
    if (manaElement) {
        manaElement.textContent = Game.mana;
    }
}

// Делаем функции глобальными для обработчиков onclick
window.loadPage = loadPage;
