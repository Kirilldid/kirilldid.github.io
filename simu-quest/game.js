// ============================================
// CITY OF SIGNALS - GAME ENGINE V2
// ============================================

// === СОСТОЯНИЕ ИГРЫ ===
const gameState = {
    // Персонаж
    heroName: '',
    day: 1,
    maxDays: 30,  // ← БЫЛО 90
    
    // Ресурсы
    energy: 10,
    maxEnergy: 10,
    money: 0,
    reputation: 0,
    confidence: 5,
    
    // Навыки (0-5)
    skills: {
        'SQL': 0,
        'Python': 0,
        'Статистика': 0,
        'ML': 0,
        'BI': 0,
        'A/B': 0,
        'DE': 0,
        'Софт-скиллы': 0
    },
    
    // Прогресс
    portfolio: [],
    visitedLocations: [],
    completedQuests: [],
    questAttempts: {},  // ← НОВОЕ: сколько раз прошёл квест
    
    // NPC отношения
    npcs: {},
    
    // Специализация (определяется динамически)
    specialization: null,
    
    // Текущая локация
    currentLocation: null,
    
    // Флаги
    flags: {},
    
    // История
    history: []
};


// === ИНИЦИАЛИЗАЦИЯ ===
// === ИНИЦИАЛИЗАЦИЯ ===
function initGame() {
    // ПРОВЕРКА ДАННЫХ
    console.log('=== GAME INIT ===');
    console.log('Locations loaded:', locations?.length || 0);
    console.log('Quests loaded:', quests?.length || 0);
    console.log('Events loaded:', randomEvents?.length || 0);
    
    if (!locations || locations.length === 0) {
        alert('⚠️ Ошибка: locations.js не загрузился!');
        return;
    }
    
    if (!quests || quests.length === 0) {
        alert('⚠️ Ошибка: quests.js не загрузился!');
        return;
    }
    
    loadGameState();
    renderSkills();
    renderPortfolio();
    updateHUD();
    
    console.log('Game initialized. Day:', gameState.day);
}

// === СТАРТ ИГРЫ ===
function setName(name) {
    document.getElementById('heroName').value = name;
}

function startGame() {
    const nameInput = document.getElementById('heroName').value.trim();
    
    if (!nameInput) {
        alert('Введите имя героя!');
        return;
    }
    
    gameState.heroName = nameInput;
    document.getElementById('profileName').textContent = nameInput;
    
    // Переключаем экраны
    document.getElementById('startScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    
    // Показываем карту
    showMap();
    updateHUD();
    
    // Приветственное событие
    setTimeout(() => {
        showIntroEvent();
    }, 500);
}

// === ПРИВЕТСТВЕННОЕ СОБЫТИЕ ===
function showIntroEvent() {
    showQuest({
        title: '🏙️ Добро пожаловать в Люменополис',
        text: `
            <p>Привет, <strong>${gameState.heroName}</strong>!</p>
            
            <p>Я <strong>Сима</strong> — твой ассистент и гид по городу.</p>
            
            <p>У тебя есть <strong>90 дней</strong>, чтобы подготовиться к собеседованию 
            в <strong>Helios Systems</strong> — лучшую компанию для аналитиков данных.</p>
            
            <p>Каждый день ты можешь посещать разные локации и выполнять задания. 
            Каждая активность тратит <strong>энергию</strong>.</p>
            
            <p>Прокачивай навыки, собирай портфолио, заводи связи. Твой путь — в твоих руках.</p>
        `,
        choices: [
            {
                text: 'Понятно! С чего начать?',
                action: () => {
                    showQuest({
                        title: '📍 Ориентируемся в городе',
                        text: `
                            <p>Вот основные районы:</p>
                            
                            <ul style="line-height: 1.8; margin: 15px 0;">
                                <li><strong>🏢 SQL-Пассаж</strong> — учись работать с базами данных</li>
                                <li><strong>🐍 Python-Док</strong> — программирование и автоматизация</li>
                                <li><strong>📊 BI-Галерея</strong> — визуализация и дашборды</li>
                                <li><strong>🧪 A/B-Лаборатория</strong> — эксперименты и статистика</li>
                                <li><strong>🤖 ML-Оранжерея</strong> — машинное обучение</li>
                                <li><strong>💼 Коворкинг</strong> — проекты и нетворкинг</li>
                            </ul>
                            
                            <p>Начни с <strong>SQL-Пассажа</strong> или <strong>Python-Дока</strong> — 
                            это базовые навыки для любого аналитика.</p>
                        `,
                        choices: [
                            {
                                text: 'Понял! Вперёд к приключениям! →',
                                action: () => {
                                    closeQuest();
                                    showMap();
                                }
                            }
                        ]
                    });
                }
            }
        ]
    });
}

// === ОТОБРАЖЕНИЕ КАРТЫ ===
function showMap() {
    document.getElementById('cityMap').style.display = 'block';
    document.getElementById('locationView').style.display = 'none';
    document.getElementById('questView').style.display = 'none';
    document.getElementById('locationName').textContent = 'Карта города';
    
    gameState.currentLocation = null;
    
    renderMap();
}

function renderMap() {
    const mapGrid = document.querySelector('.map-grid');
    mapGrid.innerHTML = '';
    
    locations.forEach(location => {
        const card = document.createElement('div');
        card.className = 'location-card';
        
        // Проверка доступности
        const isLocked = location.requirement && !checkRequirement(location.requirement);
        if (isLocked) {
            card.classList.add('locked');
        }
        
        card.innerHTML = `
            <span class="location-icon">${location.icon}</span>
            <div class="location-name">${location.name}</div>
            <div class="location-desc">${location.description}</div>
            ${!isLocked ? `<span class="location-cost">⚡ ${location.energyCost || 0}</span>` : '<span class="location-cost">🔒 Закрыто</span>'}
        `;
        
        if (!isLocked) {
            card.onclick = () => enterLocation(location);
        }
        
        mapGrid.appendChild(card);
    });
}

// === ВХОД В ЛОКАЦИЮ ===
function enterLocation(location) {
    gameState.currentLocation = location.id;
    
    if (!gameState.visitedLocations.includes(location.id)) {
        gameState.visitedLocations.push(location.id);
    }
    
    document.getElementById('cityMap').style.display = 'none';
    document.getElementById('locationView').style.display = 'block';
    document.getElementById('locationName').textContent = location.name;
    document.getElementById('currentLocationName').textContent = location.name;
    
    renderActivities(location);
}

// === ОТОБРАЖЕНИЕ АКТИВНОСТЕЙ ===
function renderActivities(location) {
    const activitiesList = document.getElementById('activitiesList');
    activitiesList.innerHTML = '';
    
    location.activities.forEach(activityId => {
        const activity = quests.find(q => q.id === activityId);
        if (!activity) return;
        
        const card = document.createElement('div');
        card.className = 'activity-card';
        
        // Подсчёт повторений
        const completionCount = gameState.questAttempts[activityId] || 0;
        const maxRepeats = activity.maxRepeats || 1;
        const isFullyCompleted = gameState.completedQuests.includes(activityId);
        
        const hasEnergy = gameState.energy >= (activity.energyCost || 0);
        const meetsReqs = checkActivityRequirement(activity);
        const canDo = hasEnergy && meetsReqs && !isFullyCompleted;
        
        if (!canDo) {
            card.classList.add('disabled');
        }
        
        card.innerHTML = `
            <div class="activity-title">${activity.title}</div>
            <div class="activity-desc">${activity.shortDesc || activity.description || ''}</div>
            <div class="activity-meta">
                <span class="meta-tag">⚡ ${activity.energyCost || 0} энергии</span>
                ${activity.rewards?.skills ? `<span class="meta-tag">📈 +навыки</span>` : ''}
                ${activity.rewards?.portfolio ? `<span class="meta-tag">🎒 +артефакт</span>` : ''}
                ${activity.repeatable ? `<span class="meta-tag">🔄 ${completionCount}/${maxRepeats}</span>` : ''}
                ${isFullyCompleted ? `<span class="meta-tag" style="background: #4caf50; color: white;">✓ Выполнено</span>` : ''}
                ${!meetsReqs ? `<span class="meta-tag" style="background: #f44336; color: white;">🔒 Требования</span>` : ''}
            </div>
        `;
        
        if (canDo) {
            card.onclick = () => startQuest(activity);
        }
        
        activitiesList.appendChild(card);
    });
}

// === ЗАПУСК КВЕСТА ===
function startQuest(quest) {
    // Траты энергии
    if (quest.energyCost) {
        gameState.energy -= quest.energyCost;
        updateHUD();
    }
    
    // Показываем квест
    showQuest(quest);
}

// === ОТОБРАЖЕНИЕ КВЕСТА ===
function showQuest(quest) {
    document.getElementById('cityMap').style.display = 'none';
    document.getElementById('locationView').style.display = 'none';
    document.getElementById('questView').style.display = 'block';
    
    const questContent = document.getElementById('questContent');
    
    let html = `
        <h1 class="quest-title">${quest.title}</h1>
        <div class="quest-text">${quest.text || quest.description}</div>
    `;
    
    // Если есть вопрос (квиз)
    if (quest.question) {
        html += `
            <div class="quest-question">
                <p style="font-weight: 600; margin-bottom: 16px;">${quest.question}</p>
                <div class="choices" id="questChoices">
        `;
        
        quest.choices.forEach((choice, index) => {
            html += `
                <button class="choice-btn" onclick="handleQuizAnswer(${index}, ${choice.correct})">
                    ${choice.text}
                </button>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        // Сохраняем квест для обработки ответа
        window.currentQuest = quest;
    }
    // Если просто выборы действий
    else if (quest.choices) {
        html += `<div class="choices">`;
        
        quest.choices.forEach((choice, index) => {
            html += `
                <button class="choice-btn" onclick="handleChoice(${index})">
                    ${choice.text}
                </button>
            `;
        });
        
        html += `</div>`;
        
        window.currentQuest = quest;
    }
    
    questContent.innerHTML = html;
}

// === ОБРАБОТКА ОТВЕТА НА КВИЗ ===
function handleQuizAnswer(choiceIndex, isCorrect) {
    const quest = window.currentQuest;
    const choice = quest.choices[choiceIndex];
    
    // Блокируем кнопки
    document.querySelectorAll('#questChoices .choice-btn').forEach(btn => {
        btn.disabled = true;
    });
    
    // Показываем фидбек
    const feedbackClass = isCorrect ? 'feedback' : 'feedback error';
    const feedbackText = isCorrect ? quest.feedback.correct : quest.feedback.wrong;
    
    const questContent = document.getElementById('questContent');
    questContent.innerHTML += `
        <div class="${feedbackClass}">
            ${feedbackText}
        </div>
        <div class="choices" style="margin-top: 20px;">
            <button class="choice-btn" onclick="completeQuest(${isCorrect})">
                Продолжить →
            </button>
        </div>
    `;
}

// === ОБРАБОТКА ВЫБОРА ===
function handleChoice(choiceIndex) {
    const quest = window.currentQuest;
    const choice = quest.choices[choiceIndex];
    
    if (choice.action) {
        choice.action();
    } else {
        completeQuest(true);
    }
}

// === ЗАВЕРШЕНИЕ КВЕСТА ===
function completeQuest(success = true) {
    const quest = window.currentQuest;
    
    if (!quest) {
        backToLocation();
        return;
    }
    
    // Подсчёт попыток
    if (!gameState.questAttempts[quest.id]) {
        gameState.questAttempts[quest.id] = 0;
    }
    
    // НОВАЯ ЛОГИКА: Квест засчитывается только при успехе
    if (success) {
        gameState.questAttempts[quest.id]++;
        
        // Если это НЕ повторяемый квест, добавляем в completedQuests
        if (!quest.repeatable && !gameState.completedQuests.includes(quest.id)) {
            gameState.completedQuests.push(quest.id);
        }
        
        // Для повторяемых квестов проверяем лимит
        if (quest.repeatable && quest.maxRepeats) {
            if (gameState.questAttempts[quest.id] >= quest.maxRepeats) {
                gameState.completedQuests.push(quest.id); // Больше нельзя
            }
        }
    } else {
        // При ошибке — штрафы
        gameState.energy = Math.max(0, gameState.energy - 1);
        gameState.confidence = Math.max(0, gameState.confidence - 1);
    }
    
    // Награды
    if (quest.rewards) {
        applyRewards(quest.rewards, success);
    }
    
    // Сохраняем
    saveGameState();
    
    // Возвращаемся
    backToLocation();
}

// === ПРИМЕНЕНИЕ НАГРАД ===
function applyRewards(rewards, success = true) {
    // Навыки
    if (rewards.skills) {
        for (let skill in rewards.skills) {
            if (success) {
                // Полная награда
                const amount = rewards.skills[skill];
                gameState.skills[skill] = Math.min(5, gameState.skills[skill] + amount);
            } else {
                // Половина награды при ошибке
                const amount = Math.max(0.5, Math.floor(rewards.skills[skill] / 2));
                gameState.skills[skill] = Math.min(5, gameState.skills[skill] + amount);
            }
        }
        renderSkills();
    }
    
    // Деньги — только при успехе
    if (rewards.money && success) {
        gameState.money += rewards.money;
    }
    
    // Репутация
    if (rewards.reputation) {
        const change = success ? rewards.reputation : Math.floor(rewards.reputation / 2);
        gameState.reputation = Math.min(5, Math.max(0, gameState.reputation + change));
    }
    
    // Уверенность
    if (rewards.confidence) {
        const change = success ? rewards.confidence : -1; // При ошибке минус
        gameState.confidence = Math.max(0, gameState.confidence + change);
    }
    
    // Энергия
    if (rewards.energy && success) {
        gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + rewards.energy);
    }
    
    // Портфолио — ТОЛЬКО при успехе
    if (rewards.portfolio && success && !gameState.portfolio.includes(rewards.portfolio)) {
        gameState.portfolio.push(rewards.portfolio);
        renderPortfolio();
    }
    
    updateHUD();
}

// === ЗАКРЫТЬ КВЕСТ (БЕЗ ЗАВЕРШЕНИЯ) ===
function closeQuest() {
    document.getElementById('questView').style.display = 'none';
}

// === НАЗАД К ЛОКАЦИИ ===
function backToLocation() {
    if (gameState.currentLocation) {
        const location = locations.find(l => l.id === gameState.currentLocation);
        if (location) {
            document.getElementById('questView').style.display = 'none';
            document.getElementById('locationView').style.display = 'block';
            renderActivities(location);
        } else {
            showMap();
        }
    } else {
        showMap();
    }
}

// === ОБНОВЛЕНИЕ HUD ===
function updateHUD() {
    document.getElementById('dayNumber').textContent = gameState.day;
    document.getElementById('energyDisplay').textContent = `${gameState.energy}/${gameState.maxEnergy}`;
    document.getElementById('moneyDisplay').textContent = `${gameState.money} ₽`;
    
    // Репутация (звёзды)
    const stars = '★'.repeat(gameState.reputation) + '☆'.repeat(5 - gameState.reputation);
    document.getElementById('reputationStars').textContent = stars;
}

// === РЕНДЕР НАВЫКОВ (КОМПАКТНАЯ ВЕРСИЯ - ТОЛЬКО ТОП-3) ===
function renderSkills() {
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    
    // Сортируем навыки по уровню и берём топ-3
    const sortedSkills = Object.entries(gameState.skills)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    sortedSkills.forEach(([skill, level]) => {
        const percentage = (level / 5) * 100;
        
        const row = document.createElement('div');
        row.className = 'skill-row';
        row.innerHTML = `
            <span class="skill-name">${skill}</span>
            <div class="skill-bar-mini">
                <div class="skill-fill-mini" style="width: ${percentage}%"></div>
            </div>
            <span class="skill-value">${level}/5</span>
        `;
        
        skillsList.appendChild(row);
    });
}

// === РЕНДЕР ПОРТФОЛИО ===
function renderPortfolio() {
    const portfolioList = document.getElementById('portfolioList');
    
    if (gameState.portfolio.length === 0) {
        portfolioList.innerHTML = '<p class="empty-state">Пока пусто</p>';
        return;
    }
    
    portfolioList.innerHTML = '';
    gameState.portfolio.forEach(item => {
        const div = document.createElement('div');
        div.className = 'portfolio-item';
        div.textContent = item;
        portfolioList.appendChild(div);
    });
}

// === ПРОВЕРКА ТРЕБОВАНИЙ (СТАРАЯ - для локаций) ===
function checkRequirement(req) {
    if (req.skill) {
        return gameState.skills[req.skill] >= req.level;
    }
    if (req.quest) {
        return gameState.completedQuests.includes(req.quest);
    }
    if (req.day) {
        return gameState.day >= req.day;
    }
    return true;
}

// === ПРОВЕРКА ТРЕБОВАНИЙ АКТИВНОСТИ (НОВАЯ - для квестов) ===
function checkActivityRequirement(activity) {
    if (!activity.requirement) return true;
    
    const req = activity.requirement;
    
    // Проверка навыка
    if (req.skill && req.level) {
        if (gameState.skills[req.skill] < req.level) {
            return false;
        }
    }
    
    // Проверка дня
    if (req.day !== undefined) {
        if (gameState.day < req.day) {
            return false;
        }
    }
    
    // Проверка квеста
    if (req.quest) {
        if (!gameState.completedQuests.includes(req.quest)) {
            return false;
        }
    }
    
    // Проверка денег
    if (req.money !== undefined) {
        if (gameState.money < req.money) {
            return false;
        }
    }
    
    // Проверка портфолио
    if (req.portfolio !== undefined) {
        if (gameState.portfolio.length < req.portfolio) {
            return false;
        }
    }
    
    // Проверка репутации
    if (req.reputation !== undefined) {
        if (gameState.reputation < req.reputation) {
            return false;
        }
    }
    
    return true;
}


// === КОНЕЦ ДНЯ ===
function endDay() {
    if (gameState.energy === gameState.maxEnergy) {
        if (!confirm('Вы не потратили энергию. Точно хотите закончить день?')) {
            return;
        }
    }
    
    gameState.day++;
    gameState.energy = gameState.maxEnergy;
    
    updateHUD();
    saveGameState();
    
    // Проверка конца игры
    if (gameState.day > gameState.maxDays) {
        showFinal();
        return;
    }
    
    // Случайное событие (30% шанс)
    if (Math.random() < 0.3) {
        triggerRandomEvent();
    }
    
    showMap();
}

// === СЛУЧАЙНОЕ СОБЫТИЕ ===
function triggerRandomEvent() {
    if (randomEvents.length === 0) return;
    
    const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    
    // Проверка условий
    if (event.condition && !event.condition()) return;
    
    setTimeout(() => {
        showQuest(event);
    }, 300);
}

// === ОПРЕДЕЛЕНИЕ СПЕЦИАЛИЗАЦИИ ===
function getCurrentSpecialization() {
    const skills = gameState.skills;
    
    const profiles = {
        'Data Analyst': skills.SQL + skills['Статистика'] + skills.BI,
        'Product Analyst': skills.SQL + skills['A/B'] + skills['Статистика'],
        'Data Scientist': skills.Python + skills.ML + skills['Статистика'],
        'ML Engineer': skills.ML + skills.Python + skills.DE,
        'Analytics Engineer': skills.SQL + skills.Python + skills.DE,
        'BI Developer': skills.BI + skills.SQL + skills.Python
    };
    
    let maxScore = 0;
    let specialization = 'Junior Analyst';
    
    for (let profile in profiles) {
        if (profiles[profile] > maxScore) {
            maxScore = profiles[profile];
            specialization = profile;
        }
    }
    
    if (maxScore < 6) {
        specialization = 'Junior Analyst';
    }
    
    return specialization;
}

// Alias для обратной совместимости
const getSpecializationName = getCurrentSpecialization;

// === ОПИСАНИЕ СПЕЦИАЛИЗАЦИИ ===
function getSpecializationDescription(spec) {
    const descriptions = {
        'Data Analyst': 'Ты работаешь с SQL, строишь дашборды и отчёты. Помогаешь бизнесу принимать решения на основе данных.',
        'Product Analyst': 'Ты проводишь A/B-тесты, анализируешь поведение пользователей и помогаешь продукту расти.',
        'Data Scientist': 'Ты строишь ML-модели, делаешь предсказания и находишь сложные закономерности в данных.',
        'ML Engineer': 'Ты внедряешь ML-модели в продакшен, строишь пайплайны и занимаешься инфраструктурой для ML.',
        'Analytics Engineer': 'Ты строишь ETL-пайплайны, готовишь данные для аналитиков и автоматизируешь процессы.',
        'BI Developer': 'Ты создаёшь сложные дашборды и визуализации, которые помогают бизнесу видеть картину целиком.',
        'Junior Analyst': 'Ты начинающий аналитик. Работаешь с SQL и учишься делать базовые отчёты.'
    };
    
    return descriptions[spec] || descriptions['Junior Analyst'];
}



// === ПОКАЗАТЬ ПОЛНУЮ СТАТИСТИКУ ===
function showFullStats() {
    const spec = getCurrentSpecialization();
    
    let html = `
        <div style="background: var(--light); padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📊 Твоя статистика</h3>
            
            <p><strong>🎯 Специализация:</strong> ${spec}</p>
            
            <p><strong>💼 Портфолио:</strong> ${gameState.portfolio.length} проектов</p>
            <ul style="line-height: 1.8;">
                ${gameState.portfolio.map(p => `<li>${p}</li>`).join('')}
            </ul>
            
            <p><strong>⭐ Навыки:</strong></p>
            <ul style="line-height: 1.8;">
                <li>SQL: ${gameState.skills.SQL}/5 ${'⭐'.repeat(gameState.skills.SQL)}</li>
                <li>Python: ${gameState.skills.Python}/5 ${'⭐'.repeat(gameState.skills.Python)}</li>
                <li>BI: ${gameState.skills.BI}/5 ${'⭐'.repeat(gameState.skills.BI)}</li>
                <li>Статистика: ${gameState.skills['Статистика']}/5 ${'⭐'.repeat(gameState.skills['Статистика'])}</li>
                <li>ML: ${gameState.skills.ML}/5 ${'⭐'.repeat(gameState.skills.ML)}</li>
                <li>A/B-тесты: ${gameState.skills['A/B']}/5 ${'⭐'.repeat(gameState.skills['A/B'])}</li>
                <li>Data Engineering: ${gameState.skills.DE}/5 ${'⭐'.repeat(gameState.skills.DE)}</li>
            </ul>
            
            <p><strong>🌟 Репутация:</strong> ${gameState.reputation}/5 ${'★'.repeat(gameState.reputation)}${'☆'.repeat(5-gameState.reputation)}</p>
            <p><strong>💪 Уверенность:</strong> ${gameState.confidence}/10</p>
            <p><strong>💰 Деньги:</strong> ${gameState.money}₽</p>
        </div>
    `;
    
    alert('Статистика открыта в консоли');
    console.log('=== ПОЛНАЯ СТАТИСТИКА ===');
    console.log(html);
    
    return html;
}


// === ФИНАЛ ===
function showFinal() {
    const totalSkills = Object.values(gameState.skills).reduce((a, b) => a + b, 0);
    const portfolio = gameState.portfolio.length;
    const reputation = gameState.reputation;
    
    // Определяем специализацию ДИНАМИЧЕСКИ по навыкам
    const specialization = getCurrentSpecialization();
    gameState.specialization = specialization;
    
    const finalContent = document.getElementById('finalContent');
    finalContent.innerHTML = `
        <h1 class="quest-title">🎉 Финал: День ${gameState.day}</h1>
        <div class="quest-text" style="text-align: left;">
            <p>Привет, <strong>${gameState.heroName}</strong>!</p>
            
            <p>Ты прошёл путь длиной в <strong>${gameState.day} дней</strong>.</p>
            
            <hr style="margin: 20px 0; border: 1px solid var(--light);">
            
            <h3>📊 Твой профиль</h3>
            <div style="background: var(--light); padding: 16px; border-radius: 8px; margin: 12px 0;">
                <p style="font-size: 1.2em; margin-bottom: 8px;">
                    <strong>${getSpecializationName(specialization)}</strong>
                </p>
                <p style="color: var(--gray); font-size: 0.95em;">
                    ${getSpecializationDescription(specialization)}
                </p>
            </div>
            
            <h3>💪 Твои навыки</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 12px 0;">
                <div><strong>SQL:</strong> ${gameState.skills.SQL}/5 ${'⭐'.repeat(gameState.skills.SQL)}</div>
                <div><strong>Python:</strong> ${gameState.skills.Python}/5 ${'⭐'.repeat(gameState.skills.Python)}</div>
                <div><strong>Статистика:</strong> ${gameState.skills['Статистика']}/5 ${'⭐'.repeat(gameState.skills['Статистика'])}</div>
                <div><strong>ML:</strong> ${gameState.skills.ML}/5 ${'⭐'.repeat(gameState.skills.ML)}</div>
                <div><strong>BI:</strong> ${gameState.skills.BI}/5 ${'⭐'.repeat(gameState.skills.BI)}</div>
                <div><strong>A/B:</strong> ${gameState.skills['A/B']}/5 ${'⭐'.repeat(gameState.skills['A/B'])}</div>
                <div><strong>DE:</strong> ${gameState.skills.DE}/5 ${'⭐'.repeat(gameState.skills.DE)}</div>
                <div><strong>Софт-скиллы:</strong> ${gameState.skills['Софт-скиллы']}/5 ${'⭐'.repeat(gameState.skills['Софт-скиллы'])}</div>
            </div>
            
            <p><strong>Портфолио:</strong> ${portfolio} проектов</p>
            <p><strong>Репутация:</strong> ${'★'.repeat(reputation)}${'☆'.repeat(5-reputation)}</p>
            
            <hr style="margin: 20px 0; border: 1px solid var(--light);">
            
            <h3>💼 Результат поиска работы</h3>
            ${getFinalMessage(specialization, portfolio, reputation)}
            
            <div style="margin-top: 30px; text-align: center;">
                <button class="btn-primary" onclick="location.reload()">🔄 Начать заново</button>
            </div>
        </div>
    `;
    
    document.getElementById('finalScreen').style.display = 'flex';
}

function getFinalMessage(spec, portfolio, reputation) {
    // Разные концовки в зависимости от специализации и достижений
    
    const outcomes = {
        // Топовые концовки (5+ проектов, 4+ репутации)
        top: {
            'DA': {
                title: '🎉 Helios Systems — Senior Data Analyst',
                company: 'Helios Systems',
                salary: '280,000₽',
                description: 'Ты стал экспертом по аналитике данных. Helios впечатлены твоими исследованиями и A/B-тестами!'
            },
            'BI': {
                title: '🎉 Helios Systems — Lead BI Analyst',
                company: 'Helios Systems',
                salary: '260,000₽',
                description: 'Твои дашборды — произведения искусства. Helios хотят, чтобы ты возглавил BI-команду!'
            },
            'DE': {
                title: '🎉 Helios Systems — Senior Data Engineer',
                company: 'Helios Systems',
                salary: '300,000₽',
                description: 'Твои пайплайны работают как часы. Helios нужны такие инженеры!'
            },
            'ML': {
                title: '🎉 Helios Systems — ML Engineer',
                company: 'Helios Systems',
                salary: '320,000₽',
                description: 'Твои модели впечатлили всех. Helios запускает ML-отдел и хотят тебя!'
            },
            'FULLSTACK': {
                title: '🎉 Helios Systems — Lead Analytics Engineer',
                company: 'Helios Systems',
                salary: '290,000₽',
                description: 'Универсал — редкость на рынке. Helios нужен человек, который видит всю картину!'
            }
        },
        
        // Хорошие концовки (3-4 проекта, 3+ репутации)
        good: {
            'DA': { title: '👍 Крупная компания — Data Analyst', salary: '180,000₽' },
            'BI': { title: '👍 Крупная компания — BI Analyst', salary: '170,000₽' },
            'DE': { title: '👍 Крупная компания — Junior Data Engineer', salary: '190,000₽' },
            'ML': { title: '👍 Стартап — ML Engineer', salary: '200,000₽' },
            'FULLSTACK': { title: '👍 Крупная компания — Analytics Engineer', salary: '185,000₽' }
        },
        
        // Средние концовки (1-2 проекта)
        medium: {
            'DA': { title: '🚀 Стартап — Junior Analyst', salary: '120,000₽' },
            'BI': { title: '🚀 Стартап — Junior BI Analyst', salary: '110,000₽' },
            'DE': { title: '🚀 Стартап — Junior DE', salary: '130,000₽' },
            'ML': { title: '🚀 Стартап — Junior ML', salary: '140,000₽' },
            'FULLSTACK': { title: '🚀 Стартап — Junior Analyst', salary: '125,000₽' }
        }
    };
    
    let outcome;
    let bgColor, borderColor;
    
    if (portfolio >= 5 && reputation >= 4) {
        outcome = outcomes.top[spec] || outcomes.top['DA'];
        bgColor = '#e8f5e9';
        borderColor = '#4caf50';
    } else if (portfolio >= 3 && reputation >= 3) {
        outcome = outcomes.good[spec] || outcomes.good['DA'];
        bgColor = '#e3f2fd';
        borderColor = '#2196f3';
    } else if (portfolio >= 1) {
        outcome = outcomes.medium[spec] || outcomes.medium['DA'];
        bgColor = '#fff3e0';
        borderColor = '#ff9800';
    } else {
        return `
            <div style="background: #ffebee; padding: 16px; border-radius: 8px; border-left: 4px solid #f44336;">
                <p><strong>😔 Пока не хватило опыта</strong></p>
                <p>Тебе нужно больше проектов в портфолио. Попробуй ещё раз!</p>
            </div>
        `;
    }
    
    return `
        <div style="background: ${bgColor}; padding: 20px; border-radius: 12px; border-left: 4px solid ${borderColor};">
            <h4 style="margin-bottom: 12px;">${outcome.title}</h4>
            ${outcome.description ? `<p style="margin-bottom: 12px;">${outcome.description}</p>` : ''}
            <p><strong>💰 Зарплата:</strong> ${outcome.salary}/мес</p>
            ${outcome.company ? `<p><strong>🏢 Компания:</strong> ${outcome.company}</p>` : ''}
        </div>
    `;
}

// === СОХРАНЕНИЕ/ЗАГРУЗКА ===
function saveGameState() {
    localStorage.setItem('cityOfSignals_v3', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('cityOfSignals_v3');
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(gameState, loaded);
    }
}

// === СБРОС ИГРЫ ===
function resetGame() {
    if (confirm('⚠️ Удалить весь прогресс и начать заново?')) {
        localStorage.removeItem('cityOfSignals_v2');
        localStorage.removeItem('cityOfSignals_v3');
        location.reload();
    }
}


// === ПЕРЕКЛЮЧЕНИЕ СТАТИСТИКИ ===
function toggleStats() {
    alert('Детальная статистика будет добавлена позже!');
}

function toggleMap() {
    showMap();
}

// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ===
document.addEventListener('DOMContentLoaded', () => {
    initGame();

// === ПОКАЗАТЬ ПОЛНУЮ СТАТИСТИКУ ===
function showFullStats() {
    const modal = document.getElementById('statsModal');
    modal.style.display = 'flex';
    
    // Все навыки
    const allSkillsList = document.getElementById('allSkillsList');
    allSkillsList.innerHTML = '';
    
    for (let skill in gameState.skills) {
        const level = gameState.skills[skill];
        const percentage = (level / 5) * 100;
        
        const div = document.createElement('div');
        div.innerHTML = `
            <div style="margin-bottom: 6px; font-weight: 600; font-size: 0.9em;">${skill}</div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="flex: 1; height: 8px; background: var(--light); border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; background: var(--orange); width: ${percentage}%"></div>
                </div>
                <span style="font-size: 0.85em; color: var(--gray);">${level}/5</span>
            </div>
        `;
        allSkillsList.appendChild(div);
    }
    
    // Все проекты
    const allPortfolioList = document.getElementById('allPortfolioList');
    if (gameState.portfolio.length === 0) {
        allPortfolioList.innerHTML = '<p class="empty-state">Портфолио пока пусто</p>';
    } else {
        allPortfolioList.innerHTML = '';
        gameState.portfolio.forEach(item => {
            const div = document.createElement('div');
            div.className = 'portfolio-item';
            div.textContent = item;
            allPortfolioList.appendChild(div);
        });
    }
}

// === ОТОБРАЖЕНИЕ АКТИВНОСТЕЙ ===
function renderActivities(location) {
    const activitiesList = document.getElementById('activitiesList');
    activitiesList.innerHTML = '';
    
    location.activities.forEach(activityId => {
        const activity = quests.find(q => q.id === activityId);
        if (!activity) return;
        
        const card = document.createElement('div');
        card.className = 'activity-card';
        
        // Подсчёт повторений
        const completionCount = gameState.questAttempts[activityId] || 0;
        const maxRepeats = activity.maxRepeats || 1;
        const isFullyCompleted = gameState.completedQuests.includes(activityId);
        
        const hasEnergy = gameState.energy >= (activity.energyCost || 0);
        const meetsReqs = checkActivityRequirement(activity);
        const canDo = hasEnergy && meetsReqs && !isFullyCompleted;
        
        if (!canDo) {
            card.classList.add('disabled');
        }
        
        card.innerHTML = `
            <div class="activity-title">${activity.title}</div>
            <div class="activity-desc">${activity.shortDesc || activity.description || ''}</div>
            <div class="activity-meta">
                <span class="meta-tag">⚡ ${activity.energyCost || 0} энергии</span>
                ${activity.rewards?.skills ? `<span class="meta-tag">📈 +навыки</span>` : ''}
                ${activity.rewards?.portfolio ? `<span class="meta-tag">🎒 +артефакт</span>` : ''}
                ${activity.repeatable ? `<span class="meta-tag">🔄 ${completionCount}/${maxRepeats}</span>` : ''}
                ${isFullyCompleted ? `<span class="meta-tag" style="background: #4caf50; color: white;">✓ Выполнено</span>` : ''}
                ${!meetsReqs ? `<span class="meta-tag" style="background: #f44336; color: white;">🔒 Требования</span>` : ''}
            </div>
        `;
        
        if (canDo) {
            card.onclick = () => startQuest(activity);
        }
        
        activitiesList.appendChild(card);
    });
}

// === СБРОС ИГРЫ ===
function resetGame() {
    if (confirm('⚠️ Удалить весь прогресс и начать заново?')) {
        localStorage.removeItem('cityOfSignals_v3');
        location.reload();
    }
}

function renderActivities(location) {
    const activitiesList = document.getElementById('activitiesList');
    activitiesList.innerHTML = '';
    
    console.log('=== RENDER ACTIVITIES ===');
    console.log('Location:', location);
    console.log('Activities IDs:', location.activities);
    
    location.activities.forEach(activityId => {
        const activity = quests.find(q => q.id === activityId);
        
        console.log('Looking for quest:', activityId, 'Found:', !!activity);
        
        if (!activity) {
            console.warn('Quest not found:', activityId);
            return;
        }
        
        // ... остальной код
    });
}

// === ОТОБРАЖЕНИЕ КВЕСТА ===
function showQuest(quest) {
    document.getElementById('cityMap').style.display = 'none';
    document.getElementById('locationView').style.display = 'none';
    document.getElementById('questView').style.display = 'block';
    
    const questContent = document.getElementById('questContent');
    
    let html = `
        <h1 class="quest-title">${quest.title}</h1>
        <div class="quest-text">${quest.text || quest.description}</div>
    `;
    
    // Если есть вопрос (квиз)
    if (quest.question) {
        html += `
            <div class="quest-question">
                <p style="font-weight: 600; margin-bottom: 16px;">${quest.question}</p>
                <div class="choices" id="questChoices">
        `;
        
        quest.choices.forEach((choice, index) => {
            html += `
                <button class="choice-btn" onclick="handleQuizAnswer(${index}, ${choice.correct})">
                    ${choice.text}
                </button>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        window.currentQuest = quest;
    }
    // Если просто выборы действий
    else if (quest.choices) {
        html += `<div class="choices">`;
        
        quest.choices.forEach((choice, index) => {
            html += `
                <button class="choice-btn" onclick="handleChoice(${index})">
                    ${choice.text}
                </button>
            `;
        });
        
        html += `</div>`;
        
        window.currentQuest = quest;
    }
    
    questContent.innerHTML = html;
    
    // ← ДОБАВИТЬ ЭТО: Обновляем статистику для квеста final-interview
    if (quest.id === 'final-interview') {
        setTimeout(() => {
            const statsDiv = document.getElementById('currentStats');
            if (statsDiv) {
                statsDiv.innerHTML = `
                    <p><strong>Текущие навыки:</strong></p>
                    <ul style="line-height: 1.6; margin: 8px 0;">
                        <li>SQL: ${gameState.skills.SQL}/5 ${'⭐'.repeat(gameState.skills.SQL)}</li>
                        <li>Python: ${gameState.skills.Python}/5 ${'⭐'.repeat(gameState.skills.Python)}</li>
                        <li>BI: ${gameState.skills.BI}/5 ${'⭐'.repeat(gameState.skills.BI)}</li>
                        <li>ML: ${gameState.skills.ML}/5 ${'⭐'.repeat(gameState.skills.ML)}</li>
                        <li>DE: ${gameState.skills.DE}/5 ${'⭐'.repeat(gameState.skills.DE)}</li>
                    </ul>
                    <p><strong>Портфолио:</strong> ${gameState.portfolio.length} проектов</p>
                    <p><strong>Репутация:</strong> ${gameState.reputation}/5 ${'★'.repeat(gameState.reputation)}${'☆'.repeat(5-gameState.reputation)}</p>
                `;
            }
        }, 100);
    }
}


function closeStatsModal() {
    document.getElementById('statsModal').style.display = 'none';
}

// Обновите функцию toggleStats
function toggleStats() {
    showFullStats();
}

});
