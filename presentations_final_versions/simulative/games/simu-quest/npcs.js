// ============================================
// NPC ПЕРСОНАЖИ
// ============================================

const npcs = {
    
    sima: {
        name: 'Сима',
        icon: '🤖',
        role: 'Ваш ассистент',
        relationship: 100, // всегда максимум
        description: 'Робот-помощник, который сопровождает вас на протяжении всего пути'
    },
    
    vera: {
        name: 'Вера',
        icon: '👩‍💼',
        role: 'Senior Data Analyst',
        relationship: 0,
        description: 'Опытный аналитик данных. Может дать рекомендацию в Helios Systems',
        location: 'coworking',
        quests: ['meet-vera', 'vera-help', 'vera-recommendation']
    },
    
    anton: {
        name: 'Антон',
        icon: '👨‍💻',
        role: 'ML Engineer',
        relationship: 0,
        description: 'Инженер машинного обучения. Знает всё про модели и алгоритмы',
        location: 'ml-greenhouse',
        quests: ['meet-anton', 'anton-teaches-ml']
    },
    
    liza: {
        name: 'Лиза',
        icon: '👩‍💼',
        role: 'Рекрутер',
        relationship: 0,
        description: 'Рекрутер из крупной компании. Может дать инсайды про найм',
        location: 'bar',
        quests: ['meet-liza', 'liza-insights']
    },
    
    max: {
        name: 'Макс',
        icon: '😠',
        role: 'Токсичный коллега',
        relationship: 0,
        description: 'Всегда недоволен и критикует. Учит стрессоустойчивости',
        location: 'coworking',
        quests: ['deal-with-max']
    },
    
    helios_hr: {
        name: 'Елена',
        icon: '💼',
        role: 'HR Helios Systems',
        relationship: 0,
        description: 'Представитель компании мечты',
        location: 'helios',
        quests: ['helios-screening', 'helios-technical', 'helios-final']
    }
};

// Функции для работы с NPC
function getNPC(npcId) {
    return npcs[npcId];
}

function updateRelationship(npcId, delta) {
    if (npcs[npcId]) {
        npcs[npcId].relationship = Math.max(0, Math.min(100, npcs[npcId].relationship + delta));
    }
}

function getRelationshipLevel(npcId) {
    const rel = npcs[npcId]?.relationship || 0;
    
    if (rel >= 80) return '💚 Близкий друг';
    if (rel >= 60) return '💙 Хороший знакомый';
    if (rel >= 40) return '🤝 Знакомый';
    if (rel >= 20) return '👋 Встречались';
    return '❓ Незнакомец';
}
