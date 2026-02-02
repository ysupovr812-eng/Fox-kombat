class GameLogic {
    constructor() {
        this.mana = 100;
        this.level = 1;
        this.loadGame();
    }
    
    loadGame() {
        const userId = TelegramApp.getUser().id;
        const saved = localStorage.getItem(`wizard_${userId}`);
        
        if (saved) {
            const data = JSON.parse(saved);
            this.mana = data.mana || 100;
            this.level = data.level || 1;
        }
        
        this.updateUI();
    }
    
    saveGame() {
        const userId = TelegramApp.getUser().id;
        const gameData = {
            mana: this.mana,
            level: this.level,
            saved_at: Date.now()
        };
        
        localStorage.setItem(`wizard_${userId}`, JSON.stringify(gameData));
    }
    
    tap() {
        const earned = CONFIG.GAME.BASE_MANA_PER_TAP;
        this.mana += earned;
        
        // Анимация
        this.createFloatingText(`+${earned}`);
        
        this.updateUI();
        this.saveGame();
        
        return earned;
    }
    
    createFloatingText(text) {
        const floatText = document.createElement('div');
        floatText.className = 'floating-text';
        floatText.textContent = text;
        floatText.style.position = 'fixed';
        floatText.style.left = '50%';
        floatText.style.top = '40%';
        floatText.style.color = '#00bfff';
        floatText.style.fontWeight = 'bold';
        floatText.style.fontSize = '20px';
        floatText.style.pointerEvents = 'none';
        floatText.style.zIndex = '1000';
        floatText.style.animation = 'floatUp 1s ease-out forwards';
        
        document.body.appendChild(floatText);
        
        setTimeout(() => floatText.remove(), 1000);
    }
    
    updateUI() {
        const manaElement = document.getElementById('mana-count');
        if (manaElement) {
            manaElement.textContent = this.mana;
        }
        
        const nameElement = document.getElementById('player-name');
        if (nameElement && TelegramApp.getUser()) {
            nameElement.textContent = TelegramApp.getUser().first_name || "Маг";
        }
    }
    
    useDailyCombo(combo) {
        if (combo.toUpperCase().includes('ALT+MANA')) {
            this.mana += CONFIG.GAME.DAILY_COMBO_REWARD;
            this.updateUI();
            this.saveGame();
            TelegramApp.showAlert(`🎉 +${CONFIG.GAME.DAILY_COMBO_REWARD} маны!`);
            return true;
        }
        TelegramApp.showAlert("Неверное комбо! Попробуй ALT+MANA");
        return false;
    }
}

const Game = new GameLogic();

// В классе GameLogic добавьте:
createFloatingText(text) {
    const floatText = document.createElement('div');
    floatText.className = 'floating-text';
    floatText.textContent = text;
    floatText.style.left = '50%';
    floatText.style.top = '40%';
    
    document.body.appendChild(floatText);
    
    setTimeout(() => {
        if (floatText.parentNode) {
            floatText.parentNode.removeChild(floatText);
        }
    }, 1000);
}

updateUI() {
    const manaElement = document.getElementById('mana-count');
    if (manaElement) {
        manaElement.textContent = this.mana;
    }
    
    const nameElement = document.getElementById('player-name');
    if (nameElement && TelegramApp.getUser()) {
        nameElement.textContent = TelegramApp.getUser().first_name || "Маг";
    }
    
    // Обновляем уровень на странице башни
    const levelElement = document.getElementById('tower-level');
    if (levelElement) {
        levelElement.textContent = this.level;
    }
}

