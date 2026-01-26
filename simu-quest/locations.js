// ============================================
// ЛОКАЦИИ ГОРОДА
// ============================================

const locations = [
    {
        id: 'home',
        name: '🏠 Дом',
        icon: '🏠',
        description: 'Восстановить энергию',
        energyCost: 0,
        activities: ['rest', 'self-study', 'online-course']
    },
    
    {
        id: 'sql-passage',
        name: '🏢 SQL-Пассаж',
        icon: '🏢',
        description: 'Учись работать с базами данных',
        energyCost: 0,
        activities: ['sql-basics', 'sql-joins', 'sql-optimization', 'sql-challenge']
    },
    
    {
        id: 'python-dock',
        name: '🐍 Python-Док',
        icon: '🐍',
        description: 'Программирование и автоматизация',
        energyCost: 0,
        activities: ['python-basics', 'pandas-intro', 'python-automation', 'python-challenge']
    },
    
    {
        id: 'bi-gallery',
        name: '📊 BI-Галерея',
        icon: '📊',
        description: 'Визуализация и дашборды',
        energyCost: 0,
        requirement: { skill: 'SQL', level: 1 },
        activities: ['bi-basics', 'dashboard-design', 'bi-project']
    },
    
    {
        id: 'stats-park',
        name: '📈 Парк Статистики',
        icon: '📈',
        description: 'Математика и теория вероятностей',
        energyCost: 0,
        activities: ['stats-basics', 'distributions', 'hypothesis-testing']
    },
    
    {
        id: 'ab-lab',
        name: '🧪 A/B-Лаборатория',
        icon: '🧪',
        description: 'Эксперименты и тесты',
        energyCost: 0,
        requirement: { skill: 'Статистика', level: 2 },
        activities: ['ab-intro', 'ab-design', 'ab-pitfalls']
    },
    
    {
        id: 'ml-greenhouse',
        name: '🤖 ML-Оранжерея',
        icon: '🤖',
        description: 'Машинное обучение',
        energyCost: 0,
        requirement: { skill: 'Python', level: 2 },
        activities: ['ml-basics', 'ml-supervised', 'ml-project']
    },
    
    {
        id: 'de-station',
        name: '⚙️ Airflow-Станция',
        icon: '⚙️',
        description: 'Data Engineering и пайплайны',
        energyCost: 0,
        requirement: { skill: 'Python', level: 2 },
        activities: ['de-intro', 'pipelines', 'data-quality']
    },
    
    {
        id: 'coworking',
        name: '💼 Коворкинг',
        icon: '💼',
        description: 'Проекты и нетворкинг',
        energyCost: 0,
        requirement: { skill: 'SQL', level: 2 },
        activities: ['project-churn', 'project-dashboard', 'networking']
    },
    
    {
        id: 'library',
        name: '📚 Библиотека',
        icon: '📚',
        description: 'Теория и самообучение',
        energyCost: 0,
        activities: ['read-books', 'watch-videos', 'study-theory']
    },
    
    {
        id: 'bar',
        name: '🍺 Бар "Данные"',
        icon: '🍺',
        description: 'Отдых и знакомства',
        energyCost: 0,
        activities: ['have-beer', 'meet-analyst', 'meet-recruiter']
    },
    
    {
        id: 'hackathon',
        name: '🎪 Хакатон-Арена',
        icon: '🎪',
        description: 'Соревнования и практика',
        energyCost: 0,
        requirement: { day: 8 },
        activities: ['hackathon-beginner', 'hackathon-advanced']
    },
    
    {
        id: 'job-board',
        name: '💼 Биржа Вакансий',
        icon: '💼',
        description: 'Резюме, отклики, собеседования',
        energyCost: 0,
        requirement: { day: 15 },
        activities: ['create-resume', 'send-applications', 'interview-prep', 'final-interview']
    },
    
    {
        id: 'helios',
        name: '🏢 Helios Systems',
        icon: '🎯',
        description: 'Компания мечты (требует 3+ проектов)',
        energyCost: 0,
        requirement: { day: 25, portfolio: 3, reputation: 3 },
        activities: ['helios-interview']
    }
];
