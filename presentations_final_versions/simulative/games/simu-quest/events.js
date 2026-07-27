// ============================================
// СЛУЧАЙНЫЕ СОБЫТИЯ
// ============================================

const randomEvents = [
    
    // ============================================
    // ПОЛОЖИТЕЛЬНЫЕ СОБЫТИЯ
    // ============================================
    
    {
        id: 'mentor-offer',
        title: '🎓 Предложение от ментора',
        condition: () => gameState.day >= 20 && gameState.reputation >= 2,
        text: `
            <p>К вам подходит опытный аналитик данных:</p>
            
            <p><em>«Я заметил твой прогресс. Хочешь, помогу с портфолио и дам советы по карьере?»</em></p>
            
            <p>Это отличная возможность!</p>
        `,
        choices: [
            {
                text: 'Да, буду рад помощи!',
                action: () => {
                    gameState.confidence += 3;
                    gameState.reputation += 1;
                    gameState.flags.hasMentor = true;
                    completeQuest(true);
                }
            },
            {
                text: 'Спасибо, но справлюсь сам',
                action: () => {
                    gameState.confidence += 1;
                    completeQuest(true);
                }
            }
        ]
    },
    
    {
        id: 'freelance-project',
        title: '💰 Фриланс-проект',
        condition: () => gameState.day >= 30 && (gameState.skills.SQL >= 3 || gameState.skills.Python >= 3),
        text: `
            <p>Знакомый предлагает небольшой проект:</p>
            
            <p><em>«Нужно сделать анализ данных для стартапа. Заплатят 15,000₽. Займёт выходные».</em></p>
            
            <p>Принять заказ?</p>
        `,
        choices: [
            {
                text: 'Да! Опыт + деньги',
                action: () => {
                    gameState.energy -= 6;
                    gameState.money += 15000;
                    gameState.portfolio.push('Фриланс: Анализ для стартапа');
                    gameState.confidence += 2;
                    updateHUD();
                    renderPortfolio();
                    completeQuest(true);
                }
            },
            {
                text: 'Нет, лучше поучусь',
                action: () => {
                    completeQuest(true);
                }
            }
        ]
    },
    
    {
        id: 'conference-ticket',
        title: '🎤 Бесплатный билет на конференцию',
        condition: () => gameState.day >= 40 && gameState.reputation >= 2,
        text: `
            <p>Вам достался бесплатный билет на крупную конференцию по Data Science!</p>
            
            <p>3 дня лекций, нетворкинга и воркшопов.</p>
            
            <p>Потратить время на конференцию?</p>
        `,
        choices: [
            {
                text: 'Да! Это ценный опыт',
                action: () => {
                    gameState.energy -= 7;
                    gameState.reputation += 2;
                    gameState.confidence += 3;
                    gameState.skills['Софт-скиллы'] = Math.min(5, gameState.skills['Софт-скиллы'] + 1);
                    updateHUD();
                    renderSkills();
                    completeQuest(true);
                }
            },
            {
                text: 'Нет, займусь проектами',
                action: () => {
                    completeQuest(true);
                }
            }
        ]
    },
    
    {
        id: 'kaggle-competition',
        title: '🏆 Соревнование Kaggle',
        condition: () => gameState.day >= 35 && gameState.skills.ML >= 2,
        text: `
            <p>Новое соревнование на Kaggle по предсказательной аналитике!</p>
            
            <p>Призовой фонд 50,000₽ за топ-3.</p>
            
            <p>Участвовать? (Займёт 10 энергии)</p>
        `,
        choices: [
            {
                text: 'Попробую! Практика важна',
                action: () => {
                    gameState.energy -= 10;
                    
                    // Шанс на победу зависит от навыков
                    const mlSkill = gameState.skills.ML;
                    const pythonSkill = gameState.skills.Python;
                    const totalSkill = mlSkill + pythonSkill;
                    
                    const successChance = totalSkill / 10; // 0.0 - 1.0
                    const roll = Math.random();
                    
                    if (roll < successChance * 0.3) {
                        // Топ-3!
                        gameState.money += 50000;
                        gameState.reputation += 3;
                        gameState.portfolio.push('🏆 Kaggle: Топ-3');
                        showQuest({
                            title: '🎉 Невероятно!',
                            text: '<p>Вы заняли 2 место! Приз 50,000₽</p>',
                            choices: [{ text: 'Ура!', action: () => { updateHUD(); renderPortfolio(); closeQuest(); } }]
                        });
                    } else if (roll < successChance * 0.6) {
                        // Топ-10%
                        gameState.reputation += 1;
                        gameState.portfolio.push('Kaggle: Топ-10%');
                        showQuest({
                            title: '👍 Хороший результат',
                            text: '<p>Вы вошли в топ-10%! Отличная практика</p>',
                            choices: [{ text: 'Продолжаю учиться', action: () => { renderPortfolio(); closeQuest(); } }]
                        });
                    } else {
                        // Не прошли
                        gameState.skills.ML = Math.min(5, gameState.skills.ML + 1);
                        showQuest({
                            title: '💪 Опыт получен',
                            text: '<p>Не победили, но многому научились. +1 ML</p>',
                            choices: [{ text: 'В следующий раз лучше', action: () => { renderSkills(); closeQuest(); } }]
                        });
                    }
                }
            },
            {
                text: 'Нет, слишком сложно',
                action: () => completeQuest(true)
            }
        ]
    },
    
    {
        id: 'opensource-contribution',
        title: '🌟 Open Source проект',
        condition: () => gameState.day >= 25 && gameState.skills.Python >= 2,
        text: `
            <p>Популярная библиотека для аналитики ищет контрибьюторов.</p>
            
            <p>Можно помочь с документацией или исправить баг.</p>
            
            <p>Это добавит вес в резюме!</p>
        `,
        choices: [
            {
                text: 'Поучаствую!',
                action: () => {
                    gameState.energy -= 5;
                    gameState.portfolio.push('Open Source: контрибьюция в pandas');
                    gameState.reputation += 1;
                    gameState.confidence += 2;
                    updateHUD();
                    renderPortfolio();
                    completeQuest(true);
                }
            },
            {
                text: 'Не сейчас',
                action: () => completeQuest(true)
            }
        ]
    },
    
    // ============================================
    // НЕГАТИВНЫЕ/ИСПЫТАНИЯ
    // ============================================
    
    {
        id: 'burnout-warning',
        title: '😰 Чувствуешь выгорание',
        condition: () => gameState.day >= 50 && gameState.energy <= 3,
        text: `
            <p>Ты работаешь на износ уже несколько недель.</p>
            
            <p>Усталость накапливается. Может, пора отдохнуть?</p>
        `,
        choices: [
            {
                text: 'Взять выходной (пропустить день)',
                action: () => {
                    gameState.day += 1;
                    gameState.energy = gameState.maxEnergy;
                    gameState.confidence -= 1;
                    updateHUD();
                    showQuest({
                        title: '😌 Восстановлено',
                        text: '<p>Вы отдохнули. Энергия и голова в порядке!</p>',
                        choices: [{ text: 'Продолжаем', action: () => closeQuest() }]
                    });
                }
            },
            {
                text: 'Нет, продолжу работать',
                action: () => {
                    gameState.confidence -= 2;
                    completeQuest(true);
                }
            }
        ]
    },
    
    {
        id: 'impostor-syndrome',
        title: '🤔 Синдром самозванца',
        condition: () => gameState.day >= 45 && gameState.portfolio.length >= 3,
        text: `
            <p>Вы смотрите на профили опытных аналитиков и думаете:</p>
            
            <p><em>«А достаточно ли я хорош? Может, мне рано искать работу?»</em></p>
            
            <p>Как поступить?</p>
        `,
        choices: [
            {
                text: 'Поговорить с ментором',
                action: () => {
                    if (gameState.flags.hasMentor) {
                        gameState.confidence += 3;
                        showQuest({
                            title: '💚 Поддержка',
                            text: '<p>Ментор убедил тебя: у тебя отличное портфолио! +3 уверенность</p>',
                            choices: [{ text: 'Спасибо!', action: () => { updateHUD(); closeQuest(); } }]
                        });
                    } else {
                        gameState.confidence += 1;
                        showQuest({
                            title: '🤷 Справляешься сам',
                            text: '<p>Ты вспоминаешь свой путь. Прогресс есть! +1 уверенность</p>',
                            choices: [{ text: 'Продолжаю', action: () => { updateHUD(); closeQuest(); } }]
                        });
                    }
                }
            },
            {
                text: 'Сделать ещё один проект',
                action: () => {
                    gameState.confidence += 2;
                    completeQuest(true);
                }
            }
        ]
    },
    
    {
        id: 'failed-interview',
        title: '❌ Провал на собеседовании',
        condition: () => gameState.day >= 60 && gameState.reputation >= 2,
        text: `
            <p>Вы прошли собеседование в одной из компаний... и получили отказ.</p>
            
            <p>Фидбек: «Недостаточно опыта с production-системами».</p>
            
            <p>Как реагируешь?</p>
        `,
        choices: [
            {
                text: 'Принять как урок и двигаться дальше',
                action: () => {
                    gameState.confidence += 1;
                    gameState.skills['Софт-скиллы'] = Math.min(5, gameState.skills['Софт-скиллы'] + 1);
                    showQuest({
                        title: '💪 Рост через неудачи',
                        text: '<p>Каждый отказ — опыт. Ты знаешь, над чем работать. +1 Софт-скиллы</p>',
                        choices: [{ text: 'Продолжаю', action: () => { renderSkills(); closeQuest(); } }]
                    });
                }
            },
            {
                text: 'Расстроиться и взять паузу',
                action: () => {
                    gameState.confidence -= 2;
                    gameState.energy = gameState.maxEnergy;
                    updateHUD();
                    completeQuest(true);
                }
            }
        ]
    },
    
    {
        id: 'technical-debt',
        title: '🐛 Баг в старом проекте',
        condition: () => gameState.day >= 40 && gameState.portfolio.length >= 2,
        text: `
            <p>Вы обнаружили критическую ошибку в одном из прошлых проектов!</p>
            
            <p>Нужно срочно исправить, иначе это скажется на репутации.</p>
        `,
        choices: [
            {
                text: 'Исправить немедленно',
                action: () => {
                    gameState.energy -= 4;
                    gameState.reputation += 1;
                    showQuest({
                        title: '✅ Исправлено',
                        text: '<p>Ты оперативно починил баг. Профессионализм! +1 репутация</p>',
                        choices: [{ text: 'Уф!', action: () => { updateHUD(); closeQuest(); } }]
                    });
                }
            },
            {
                text: 'Проигнорировать',
                action: () => {
                    gameState.reputation -= 2;
                    showQuest({
                        title: '⚠️ Потеря репутации',
                        text: '<p>Проблема всплыла публично. -2 репутация</p>',
                        choices: [{ text: 'Урок усвоен', action: () => { updateHUD(); closeQuest(); } }]
                    });
                }
            }
        ]
    },
    
    // ============================================
    // НЕЙТРАЛЬНЫЕ/ВЫБОРЫ
    // ============================================
    
    {
        id: 'new-tool',
        title: '🛠️ Новый инструмент',
        condition: () => gameState.day >= 20,
        text: `
            <p>Все говорят о новом инструменте для аналитики — dbt.</p>
            
            <p>Стоит ли потратить время на его изучение?</p>
        `,
        choices: [
            {
                text: 'Да, изучить новое',
                action: () => {
                    gameState.energy -= 4;
                    gameState.skills.DE = Math.min(5, gameState.skills.DE + 1);
                    gameState.confidence += 1;
                    renderSkills();
                    completeQuest(true);
                }
            },
            {
                text: 'Нет, углубиться в то, что знаю',
                action: () => {
                    gameState.energy -= 2;
                    // Прокачиваем самый сильный навык
                    const topSkill = Object.keys(gameState.skills).reduce((a, b) => 
                        gameState.skills[a] > gameState.skills[b] ? a : b
                    );
                    gameState.skills[topSkill] = Math.min(5, gameState.skills[topSkill] + 1);
                    renderSkills();
                    completeQuest(true);
                }
            }
        ]
    },
    
    {
        id: 'networking-event',
        title: '🎪 Митап аналитиков',
        condition: () => gameState.day >= 30,
        text: `
            <p>Сегодня вечером — митап сообщества аналитиков данных.</p>
            
            <p>Пойти или потратить время на учёбу?</p>
        `,
        choices: [
            {
                text: 'Пойти на митап',
                action: () => {
                    gameState.energy -= 3;
                    gameState.reputation += 1;
                    gameState.confidence += 2;
                    const bonus = Math.random() < 0.5 ? 1000 : 0;
                    if (bonus > 0) {
                        gameState.money += bonus;
                        showQuest({
                            title: '💼 Неожиданность',
                            text: '<p>Знакомый предложил небольшую подработку! +1000₽</p>',
                            choices: [{ text: 'Классно!', action: () => { updateHUD(); closeQuest(); } }]
                        });
                    } else {
                        updateHUD();
                        completeQuest(true);
                    }
                }
            },
            {
                text: 'Остаться учиться',
                action: () => {
                    gameState.energy -= 2;
                    // Случайный навык +1
                    const skills = Object.keys(gameState.skills).filter(s => gameState.skills[s] < 5);
                    if (skills.length > 0) {
                        const randomSkill = skills[Math.floor(Math.random() * skills.length)];
                        gameState.skills[randomSkill]++;
                        renderSkills();
                    }
                    completeQuest(true);
                }
            }
        ]
    },
    
    {
        id: 'startup-offer',
        title: '🚀 Предложение от стартапа',
        condition: () => gameState.day >= 50 && gameState.portfolio.length >= 2,
        text: `
            <p>Стартап предлагает вам позицию Junior Data Analyst.</p>
            
            <p><strong>Зарплата:</strong> 80,000₽/мес<br>
            <strong>Условия:</strong> Начать через 2 недели</p>
            
            <p>Принять оффер или дождаться Helios Systems?</p>
        `,
        choices: [
            {
                text: 'Принять оффер стартапа',
                action: () => {
                    showQuest({
                        title: '🎉 Поздравляем!',
                        text: `
                            <p>Вы приняли оффер от стартапа!</p>
                            <p>Это не Helios, но отличное начало карьеры.</p>
                            <p><strong>Концовка:</strong> Альтернативный путь 🚀</p>
                        `,
                        choices: [{ text: 'Начать заново', action: () => location.reload() }]
                    });
                }
            },
            {
                text: 'Отказать, ждать Helios',
                action: () => {
                    gameState.confidence += 2;
                    showQuest({
                        title: '🎯 Верность цели',
                        text: '<p>Ты нацелен на Helios. Решимость! +2 уверенность</p>',
                        choices: [{ text: 'Продолжаю', action: () => { updateHUD(); closeQuest(); } }]
                    });
                }
            }
        ]
    }
];
