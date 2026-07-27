// ============================================
// КВЕСТЫ И АКТИВНОСТИ
// ============================================

const quests = [
    
    // ============================================
    // ДОМ
    // ============================================
    
    {
        id: 'rest',
        title: '😴 Отдохнуть',
        shortDesc: 'Восстановить всю энергию',
        energyCost: 0,
        text: `
            <p>Вы проводите остаток дня дома, смотрите сериалы и готовите еду.</p>
            <p>Энергия полностью восстановлена! ⚡</p>
        `,
        choices: [
            { text: 'Отдохнуть и закончить день', action: () => { gameState.energy = gameState.maxEnergy; endDay(); } }
        ]
    },
    
    {
        id: 'self-study',
        title: '📖 Самостоятельное обучение',
        shortDesc: 'Читать статьи и смотреть видео',
        energyCost: 2,
        repeatable: true,
        maxRepeats: 5,
        text: `<p>Вы садитесь за компьютер и изучаете материалы по аналитике данных.</p>`,
        question: 'Что важнее при самообучении?',
        choices: [
            { text: 'Практика и проекты', correct: true },
            { text: 'Только теория', correct: false },
            { text: 'Пассивный просмотр видео', correct: false }
        ],
        feedback: {
            correct: 'Да! Практика закрепляет знания. Теория без практики забывается.',
            wrong: 'Теория важна, но без практики навыки не развиваются. Делай проекты!'
        },
        rewards: {
            skills: { 'SQL': 1 },
            confidence: 1
        }
    },
    
    {
        id: 'online-course',
        title: '💻 Онлайн-курс',
        shortDesc: 'Пройти платный курс (стоит 2000₽)',
        energyCost: 3,
        text: `<p>Вы записываетесь на качественный онлайн-курс по аналитике.</p>`,
        rewards: {
            skills: { 'SQL': 2, 'Python': 1 },
            confidence: 2
        },
        choices: [
            { text: 'Пройти курс', action: () => completeQuest(true) }
        ]
    },
    
    // ============================================
    // SQL-ПАССАЖ
    // ============================================
    
    {
        id: 'sql-basics',
        title: '📚 Основы SQL',
        shortDesc: 'SELECT, WHERE, ORDER BY',
        energyCost: 3,
        repeatable: true,
        maxRepeats: 2,
        description: `
            <p>Вы входите в SQL-Пассаж. Преподаватель показывает базовые команды.</p>
            <p><em>«SQL — это язык общения с данными. Начнём с простого».</em></p>
        `,
        question: 'Какая команда выбирает данные из таблицы?',
        choices: [
            { text: 'SELECT', correct: true },
            { text: 'GET', correct: false },
            { text: 'TAKE', correct: false }
        ],
        feedback: {
            correct: 'Верно! SELECT — базовая команда для выборки данных.',
            wrong: 'В SQL используется SELECT для выборки данных из таблиц.'
        },
        rewards: {
            skills: { 'SQL': 2 },
            confidence: 1,
            portfolio: 'Сертификат: Основы SQL'
        }
    },
    
    {
        id: 'sql-joins',
        title: '🔗 Объединение таблиц (JOIN)',
        shortDesc: 'Связывание данных',
        energyCost: 4,
        repeatable: true,
        maxRepeats: 2,
        requirement: { skill: 'SQL', level: 1 },
        question: 'Какой JOIN вернёт только совпадающие строки из обеих таблиц?',
        choices: [
            { text: 'INNER JOIN', correct: true },
            { text: 'LEFT JOIN', correct: false },
            { text: 'FULL JOIN', correct: false }
        ],
        feedback: {
            correct: 'Точно! INNER JOIN возвращает только пересечение.',
            wrong: 'LEFT JOIN возвращает все строки из левой таблицы + совпадения справа. INNER JOIN — только совпадения.'
        },
        rewards: {
            skills: { 'SQL': 2 },
            confidence: 2
        }
    },
    
    {
        id: 'sql-optimization',
        title: '⚡ Оптимизация запросов',
        shortDesc: 'Ускорение медленных запросов',
        energyCost: 5,
        requirement: { skill: 'SQL', level: 3 },
        question: 'Что поможет ускорить запрос с фильтром по колонке user_id?',
        choices: [
            { text: 'Создать индекс на user_id', correct: true },
            { text: 'Добавить больше WHERE условий', correct: false },
            { text: 'Использовать SELECT *', correct: false }
        ],
        feedback: {
            correct: 'Да! Индексы резко ускоряют поиск по колонкам.',
            wrong: 'Индексы — ключевой инструмент оптимизации. Они работают как оглавление книги.'
        },
        rewards: {
            skills: { 'SQL': 1, 'DE': 1 },
            confidence: 2
        }
    },
    
    {
        id: 'sql-challenge',
        title: '🏆 SQL Челлендж',
        shortDesc: 'Сложная задача на время',
        energyCost: 4,
        requirement: { skill: 'SQL', level: 2 },
        text: `
            <p>Задача: Найти топ-3 категории товаров по выручке за последний месяц.</p>
            <p>У вас есть таблицы: orders, products, categories.</p>
        `,
        question: 'Какие команды нужны в решении?',
        choices: [
            { text: 'JOIN, GROUP BY, ORDER BY, LIMIT', correct: true },
            { text: 'Только SELECT и WHERE', correct: false },
            { text: 'UNION и INTERSECT', correct: false }
        ],
        feedback: {
            correct: 'Отлично! Ты понимаешь структуру сложного запроса.',
            wrong: 'Нужна агрегация (GROUP BY), сортировка (ORDER BY) и ограничение (LIMIT).'
        },
        rewards: {
            skills: { 'SQL': 2 },
            reputation: 1,
            portfolio: 'Кейс: SQL Челлендж'
        }
    },
    
    // ============================================
    // PYTHON-ДОК
    // ============================================
    
    {
        id: 'python-basics',
        title: '🐍 Основы Python',
        shortDesc: 'Переменные, циклы, функции',
        energyCost: 3,
        repeatable: true,
        maxRepeats: 2,
        question: 'Как посчитать среднее значение списка [10, 20, 30]?',
        choices: [
            { text: 'sum(lst) / len(lst)', correct: true },
            { text: 'mean(lst)', correct: false },
            { text: 'lst.average()', correct: false }
        ],
        feedback: {
            correct: 'Верно! sum() и len() — встроенные функции Python.',
            wrong: 'В базовом Python нет функции mean(). Используй sum() и len().'
        },
        rewards: {
            skills: { 'Python': 2 },
            confidence: 1
        }
    },
    
    {
        id: 'pandas-intro',
        title: '🐼 Библиотека Pandas',
        shortDesc: 'Работа с таблицами в Python',
        energyCost: 4,
        repeatable: true,
        maxRepeats: 2,
        requirement: { skill: 'Python', level: 1 },
        question: 'Как выбрать строки, где age > 30 в DataFrame?',
        choices: [
            { text: 'df[df["age"] > 30]', correct: true },
            { text: 'df.filter(age > 30)', correct: false },
            { text: 'df.select(age > 30)', correct: false }
        ],
        feedback: {
            correct: 'Да! Это булева индексация — мощный инструмент pandas.',
            wrong: 'В pandas используется синтаксис df[условие]. Изучи boolean indexing.'
        },
        rewards: {
            skills: { 'Python': 2 },
            confidence: 1
        }
    },
    
    {
        id: 'python-automation',
        title: '🤖 Автоматизация задач',
        shortDesc: 'Скрипты для рутины',
        energyCost: 5,
        requirement: { skill: 'Python', level: 2 },
        text: `
            <p>Вы пишете скрипт, который автоматически собирает данные из 5 источников и формирует отчёт.</p>
            <p>Это экономит 2 часа работы каждый день!</p>
        `,
        choices: [
            { text: 'Отлично! Автоматизация — сила', action: () => completeQuest(true) }
        ],
        rewards: {
            skills: { 'Python': 2, 'DE': 1 },
            confidence: 2,
            portfolio: 'Проект: Скрипт автоматизации'
        }
    },
    
    {
        id: 'python-challenge',
        title: '🏆 Python Челлендж',
        shortDesc: 'Решение алгоритмической задачи',
        energyCost: 4,
        requirement: { skill: 'Python', level: 2 },
        question: 'Какая структура данных лучше для быстрой проверки "есть ли элемент"?',
        choices: [
            { text: 'set (множество)', correct: true },
            { text: 'list (список)', correct: false },
            { text: 'dict.keys()', correct: false }
        ],
        feedback: {
            correct: 'Точно! set использует хеш-таблицу, проверка за O(1).',
            wrong: 'В list проверка за O(n). set оптимален для проверки вхождения.'
        },
        rewards: {
            skills: { 'Python': 2 },
            reputation: 1
        }
    },
    
    // ============================================
    // BI-ГАЛЕРЕЯ
    // ============================================
    
    {
        id: 'bi-basics',
        title: '📊 Основы визуализации',
        shortDesc: 'Выбор правильного графика',
        energyCost: 3,
        repeatable: true,
        maxRepeats: 2,
        question: 'Какой график лучше показывает изменение во времени?',
        choices: [
            { text: 'Линейный график', correct: true },
            { text: 'Круговая диаграмма', correct: false },
            { text: 'Scatter plot', correct: false }
        ],
        feedback: {
            correct: 'Да! Линейный график идеален для временных рядов.',
            wrong: 'Круговая диаграмма показывает доли. Для динамики нужна линия.'
        },
        rewards: {
            skills: { 'BI': 2 },
            confidence: 1
        }
    },
    
    {
        id: 'dashboard-design',
        title: '🎨 Дизайн дашбордов',
        shortDesc: 'UX и восприятие',
        energyCost: 4,
        requirement: { skill: 'BI', level: 1 },
        question: 'Что важнее всего в дашборде для CEO?',
        choices: [
            { text: 'Ключевые метрики на первом экране', correct: true },
            { text: 'Все возможные графики', correct: false },
            { text: 'Яркие цвета и анимации', correct: false }
        ],
        feedback: {
            correct: 'Верно! CEO нужна суть за 10 секунд. Меньше — лучше.',
            wrong: 'Перегруженный дашборд не читают. Фокус на главное.'
        },
        rewards: {
            skills: { 'BI': 2, 'Софт-скиллы': 1 },
            confidence: 1
        }
    },
    
    {
        id: 'bi-project',
        title: '💼 Проект: Дашборд продаж',
        shortDesc: 'Полноценный дашборд для бизнеса',
        energyCost: 6,
        requirement: { skill: 'BI', level: 2 },
        text: `
            <p>Вы создаёте интерактивный дашборд для отдела продаж.</p>
            <p>В нём: динамика продаж, топ товаров, карта регионов, воронка конверсии.</p>
            <p>Менеджеры в восторге!</p>
        `,
        choices: [
            { text: 'Отличный результат!', action: () => completeQuest(true) }
        ],
        rewards: {
            skills: { 'BI': 2, 'SQL': 1 },
            reputation: 2,
            portfolio: 'Проект: Дашборд продаж'
        }
    },
    
    // ============================================
    // ПАРК СТАТИСТИКИ
    // ============================================
    
    {
        id: 'stats-basics',
        title: '📈 Основы статистики',
        shortDesc: 'Среднее, медиана, дисперсия',
        energyCost: 3,
        repeatable: true,
        maxRepeats: 2,
        question: 'Когда медиана лучше среднего?',
        choices: [
            { text: 'Когда есть выбросы', correct: true },
            { text: 'Всегда', correct: false },
            { text: 'Никогда', correct: false }
        ],
        feedback: {
            correct: 'Да! Медиана устойчива к экстремальным значениям.',
            wrong: 'Среднее чувствительно к выбросам. Медиана — робастная метрика.'
        },
        rewards: {
            skills: { 'Статистика': 2 },
            confidence: 1
        }
    },
    
    {
        id: 'distributions',
        title: '🔔 Распределения',
        shortDesc: 'Нормальное, биномиальное, Пуассон',
        energyCost: 4,
        requirement: { skill: 'Статистика', level: 1 },
        question: 'Какое распределение описывает рост людей?',
        choices: [
            { text: 'Нормальное', correct: true },
            { text: 'Равномерное', correct: false },
            { text: 'Экспоненциальное', correct: false }
        ],
        feedback: {
            correct: 'Верно! Большинство природных величин — нормальное распределение.',
            wrong: 'Рост, вес, IQ — всё это примеры нормального распределения.'
        },
        rewards: {
            skills: { 'Статистика': 2 }
        }
    },
    
    {
        id: 'hypothesis-testing',
        title: '🧪 Проверка гипотез',
        shortDesc: 'p-value, доверительные интервалы',
        energyCost: 5,
        requirement: { skill: 'Статистика', level: 2 },
        question: 'p-value = 0.03 при alpha = 0.05. Что делать?',
        choices: [
            { text: 'Отвергнуть H0 (нулевую гипотезу)', correct: true },
            { text: 'Принять H0', correct: false },
            { text: 'Нужно больше данных', correct: false }
        ],
        feedback: {
            correct: 'Да! p < alpha значит результат статистически значим.',
            wrong: 'Если p-value меньше порога значимости, отвергаем H0.'
        },
        rewards: {
            skills: { 'Статистика': 2, 'A/B': 1 },
            confidence: 2
        }
    },
    
    // ============================================
    // A/B-ЛАБОРАТОРИЯ
    // ============================================
    
    {
        id: 'ab-intro',
        title: '🧪 Введение в A/B-тесты',
        shortDesc: 'Контрольная и тестовая группа',
        energyCost: 4,
        question: 'Зачем нужна контрольная группа?',
        choices: [
            { text: 'Чтобы сравнить с ней результат изменений', correct: true },
            { text: 'Это не нужно', correct: false },
            { text: 'Для увеличения выборки', correct: false }
        ],
        feedback: {
            correct: 'Точно! Без контроля мы не поймём, что дал эксперимент.',
            wrong: 'Контрольная группа — baseline. Без неё нельзя оценить эффект.'
        },
        rewards: {
            skills: { 'A/B': 2, 'Статистика': 1 },
            confidence: 1
        }
    },
    
    {
        id: 'ab-design',
        title: '📐 Дизайн эксперимента',
        shortDesc: 'Размер выборки, длительность',
        energyCost: 5,
        requirement: { skill: 'A/B', level: 1 },
        question: 'Что влияет на минимальный размер выборки?',
        choices: [
            { text: 'Ожидаемый эффект и уровень значимости', correct: true },
            { text: 'Только количество пользователей', correct: false },
            { text: 'Цвет кнопки', correct: false }
        ],
        feedback: {
            correct: 'Да! Чем меньше эффект, тем больше нужна выборка.',
            wrong: 'Размер выборки считается через power analysis. Зависит от эффекта и alpha.'
        },
        rewards: {
            skills: { 'A/B': 2, 'Статистика': 1 }
        }
    },
    
    {
        id: 'ab-pitfalls',
        title: '⚠️ Ловушки A/B-тестов',
        shortDesc: 'Peeking, множественное тестирование',
        energyCost: 5,
        requirement: { skill: 'A/B', level: 2 },
        question: 'Почему нельзя останавливать тест, как только p < 0.05?',
        choices: [
            { text: 'Это peeking — увеличивает ошибку I рода', correct: true },
            { text: 'Можно останавливать', correct: false },
            { text: 'Нужно ждать p < 0.01', correct: false }
        ],
        feedback: {
            correct: 'Верно! Непрерывный мониторинг нарушает тест. Нужен фиксированный горизонт.',
            wrong: 'Peeking (подглядывание) приводит к ложноположительным результатам.'
        },
        rewards: {
            skills: { 'A/B': 2, 'Статистика': 1 },
            confidence: 2,
            portfolio: 'Кейс: Правильный A/B-тест'
        }
    },
    
    // ============================================
    // ML-ОРАНЖЕРЕЯ
    // ============================================
    
    {
        id: 'ml-basics',
        title: '🤖 Основы ML',
        shortDesc: 'Классификация, регрессия, кластеризация',
        energyCost: 4,
        repeatable: true,
        maxRepeats: 2,
        question: 'Предсказать цену квартиры — это какая задача?',
        choices: [
            { text: 'Регрессия', correct: true },
            { text: 'Классификация', correct: false },
            { text: 'Кластеризация', correct: false }
        ],
        feedback: {
            correct: 'Да! Предсказание числа = регрессия.',
            wrong: 'Классификация предсказывает категорию, регрессия — число.'
        },
        rewards: {
            skills: { 'ML': 2, 'Python': 1 },
            confidence: 1
        }
    },
    
    {
        id: 'ml-supervised',
        title: '📚 Обучение с учителем',
        shortDesc: 'Деревья, леса, градиентный бустинг',
        energyCost: 5,
        requirement: { skill: 'ML', level: 1 },
        question: 'Что такое overfitting?',
        choices: [
            { text: 'Модель слишком подстроилась под обучающую выборку', correct: true },
            { text: 'Модель недообучена', correct: false },
            { text: 'Нет данных', correct: false }
        ],
        feedback: {
            correct: 'Точно! Overfitting = отличный результат на train, плохой на test.',
            wrong: 'Overfitting — когда модель запомнила шум вместо закономерностей.'
        },
        rewards: {
            skills: { 'ML': 2, 'Статистика': 1 },
            confidence: 2
        }
    },
    
    {
        id: 'ml-project',
        title: '💼 ML-проект: Предсказание оттока',
        shortDesc: 'Полный цикл ML-задачи',
        energyCost: 7,
        requirement: { skill: 'ML', level: 2 },
        text: `
            <p>Вы строите модель предсказания оттока клиентов.</p>
            <p>Этапы: EDA → feature engineering → обучение → валидация → интерпретация.</p>
            <p>Бизнес использует вашу модель для retention-кампаний!</p>
        `,
        choices: [
            { text: 'Отличный результат!', action: () => completeQuest(true) }
        ],
        rewards: {
            skills: { 'ML': 2, 'Python': 1 },
            reputation: 2,
            portfolio: 'Проект: ML-модель предсказания оттока'
        }
    },
    
    // ============================================
    // AIRFLOW-СТАНЦИЯ
    // ============================================
    
    {
        id: 'de-intro',
        title: '⚙️ Введение в Data Engineering',
        shortDesc: 'ETL, пайплайны, оркестрация',
        energyCost: 4,
        question: 'Что такое ETL?',
        choices: [
            { text: 'Extract, Transform, Load', correct: true },
            { text: 'Export, Test, Launch', correct: false },
            { text: 'Evaluate, Train, Learn', correct: false }
        ],
        feedback: {
            correct: 'Да! ETL — процесс извлечения, преобразования и загрузки данных.',
            wrong: 'ETL = Extract (извлечь), Transform (преобразовать), Load (загрузить).'
        },
        rewards: {
            skills: { 'DE': 2, 'Python': 1 },
            confidence: 1
        }
    },
    
    {
        id: 'pipelines',
        title: '🔄 Построение пайплайнов',
        shortDesc: 'Airflow DAG, зависимости, мониторинг',
        energyCost: 6,
        requirement: { skill: 'DE', level: 1 },
        text: `
            <p>Вы создаёте автоматический пайплайн:</p>
            <p>Источник → Валидация → Трансформация → Хранилище → Дашборд</p>
            <p>Теперь данные обновляются каждое утро без ручной работы!</p>
        `,
        choices: [
            { text: 'Пайплайн работает!', action: () => completeQuest(true) }
        ],
        rewards: {
            skills: { 'DE': 2, 'Python': 1 },
            confidence: 2,
            portfolio: 'Проект: ETL Pipeline'
        }
    },
    
    {
        id: 'data-quality',
        title: '✅ Контроль качества данных',
        shortDesc: 'Валидация, дедупликация, алерты',
        energyCost: 5,
        requirement: { skill: 'DE', level: 2 },
        question: 'Что опаснее для аналитики?',
        choices: [
            { text: 'Системные пропуски (все iOS без региона)', correct: true },
            { text: 'Случайные опечатки в именах', correct: false },
            { text: 'Разный формат дат', correct: false }
        ],
        feedback: {
            correct: 'Да! Системное смещение искажает выводы. Случайные ошибки менее опасны.',
            wrong: 'Системные проблемы создают bias. Опечатки можно почистить.'
        },
        rewards: {
            skills: { 'DE': 2, 'SQL': 1 },
            confidence: 2
        }
    },
    
    // ============================================
    // КОВОРКИНГ
    // ============================================
    
    {
        id: 'project-churn',
        title: '📊 Проект: Анализ оттока',
        shortDesc: 'Полноценный аналитический проект',
        energyCost: 7,
        requirement: { skill: 'SQL', level: 2 },
        text: `
            <p>Компания теряет клиентов. Нужно понять почему.</p>
            <p>Вы проводите исследование, сегментируете пользователей, находите паттерны.</p>
            <p>Ваш отчёт помог снизить отток на 15%!</p>
        `,
        choices: [
            { text: 'Отличная работа!', action: () => completeQuest(true) }
        ],
        rewards: {
            skills: { 'SQL': 1, 'Статистика': 1, 'Софт-скиллы': 1 },
            reputation: 2,
            portfolio: 'Проект: Анализ оттока клиентов'
        }
    },
    
    {
        id: 'project-dashboard',
        title: '📈 Проект: Executive Dashboard',
        shortDesc: 'Дашборд для топ-менеджмента',
        energyCost: 6,
        requirement: { skill: 'BI', level: 2 },
        text: `
            <p>Вы создаёте дашборд для CEO.</p>
            <p>5 ключевых метрик, динамика, разбивка по сегментам.</p>
            <p>CEO доволен — теперь видит бизнес в одном экране!</p>
        `,
        choices: [
            { text: 'Миссия выполнена!', action: () => completeQuest(true) }
        ],
        rewards: {
            skills: { 'BI': 2, 'Софт-скиллы': 1 },
            reputation: 2,
            portfolio: 'Проект: Executive Dashboard'
        }
    },
    
    {
        id: 'networking',
        title: '🤝 Нетворкинг',
        shortDesc: 'Знакомства с профессионалами',
        energyCost: 3,
        repeatable: true,
        maxRepeats: 3,
        text: `
            <p>Вы посещаете митап по аналитике данных.</p>
            <p>Знакомитесь с Senior-специалистами, обмениваетесь контактами.</p>
            <p>Связи — это будущие возможности!</p>
        `,
        choices: [
            { text: 'Полезные знакомства!', action: () => completeQuest(true) }
        ],
        rewards: {
            reputation: 1,
            confidence: 1,
            money: 500
        }
    },
    
    // ============================================
    // БИБЛИОТЕКА
    // ============================================
    
    {
        id: 'read-books',
        title: '📚 Читать книги',
        shortDesc: 'Фундаментальные знания',
        energyCost: 2,
        repeatable: true,
        maxRepeats: 5,
        text: `
            <p>Вы читаете профессиональную литературу по аналитике данных.</p>
            <p>Фундаментальные знания важны!</p>
        `,
        choices: [
            { text: 'Продолжить чтение', action: () => completeQuest(true) }
        ],
        rewards: {
            skills: { 'Статистика': 1 },
            confidence: 1
        }
    },
    
    {
        id: 'watch-videos',
        title: '📺 Смотреть видео',
        shortDesc: 'Обучающие ролики и вебинары',
        energyCost: 1,
        repeatable: true,
        maxRepeats: 10,
        text: `
            <p>Вы смотрите обучающие видео по аналитике на YouTube.</p>
        `,
        choices: [
            { text: 'Полезно!', action: () => completeQuest(true) }
        ],
        rewards: {
            confidence: 1
        }
    },
    
    {
        id: 'study-theory',
        title: '🧠 Изучать теорию',
        shortDesc: 'Глубокое погружение',
        energyCost: 3,
        repeatable: true,
        maxRepeats: 5,
        text: `
            <p>Вы изучаете математическую статистику и теорию вероятностей.</p>
        `,
        choices: [
            { text: 'Сложно, но интересно', action: () => completeQuest(true) }
        ],
        rewards: {
            skills: { 'Статистика': 1 }
        }
    },
    
    // ============================================
    // БАР
    // ============================================
    
    {
        id: 'have-beer',
        title: '🍺 Выпить пиво',
        shortDesc: 'Расслабиться и отдохнуть',
        energyCost: 0,
        repeatable: true,
        maxRepeats: 10,
        text: `<p>Вы проводите вечер в баре, отдыхаете от учёбы.</p>`,
        choices: [
            { text: 'Отдохнуть', action: () => { gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + 3); completeQuest(true); } }
        ],
        rewards: {
            confidence: 1
        }
    },
    
    {
        id: 'meet-analyst',
        title: '👤 Познакомиться с аналитиком',
        shortDesc: 'Случайная встреча',
        energyCost: 2,
        text: `
            <p>За соседним столиком сидит аналитик из крупной компании.</p>
            <p>Вы заводите разговор, он делится опытом и советами.</p>
        `,
        choices: [
            { text: 'Полезная беседа!', action: () => completeQuest(true) }
        ],
        rewards: {
            confidence: 2,
            reputation: 1,
            money: 300
        }
    },
    
    {
        id: 'meet-recruiter',
        title: '💼 Познакомиться с рекрутером',
        shortDesc: 'Инсайды про вакансии',
        energyCost: 2,
        requirement: { day: 12 },
        text: `
            <p>Вы знакомитесь с рекрутером из Helios Systems!</p>
            <p>Она рассказывает, на что обращают внимание при найме.</p>
            <p>Это золотая информация!</p>
        `,
        choices: [
            { text: 'Ценные инсайты!', action: () => completeQuest(true) }
        ],
        rewards: {
            confidence: 3,
            reputation: 2
        }
    },
    
    // ============================================
    // ХАКАТОН
    // ============================================
    
    {
        id: 'hackathon-beginner',
        title: '🎪 Хакатон для новичков',
        shortDesc: '24 часа командной работы',
        energyCost: 8,
        requirement: { skill: 'Python', level: 1 },
        text: `
            <p>Вы участвуете в хакатоне. 24 часа, команда из 4 человек.</p>
            <p>Задача: построить прототип рекомендательной системы.</p>
            <p>Вы заняли 3 место! 🥉</p>
        `,
        choices: [
            { text: 'Крутой опыт!', action: () => completeQuest(true) }
        ],
        rewards: {
            skills: { 'Python': 1, 'ML': 1, 'Софт-скиллы': 2 },
            reputation: 2,
            money: 5000,
            portfolio: 'Проект: Хакатон — 3 место'
        }
    },
    
    {
        id: 'hackathon-advanced',
        title: '🏆 Продвинутый хакатон',
        shortDesc: 'Соревнование с призом 30к',
        energyCost: 10,
        requirement: { skill: 'ML', level: 3 },
        text: `
            <p>Топовый хакатон от Яндекса. 200 участников.</p>
            <p>Задача: предсказать спрос на товары в e-commerce.</p>
            <p>Вы победили! 🥇 Приз 30,000₽</p>
        `,
        choices: [
            { text: 'Невероятно!', action: () => completeQuest(true) }
        ],
        rewards: {
            skills: { 'ML': 2, 'Python': 1 },
            reputation: 3,
            money: 30000,
            portfolio: 'Проект: Победа в хакатоне Яндекса'
        }
    },
    
    // ============================================
    // БИРЖА ВАКАНСИЙ
    // ============================================
    
    {
        id: 'create-resume',
        title: '📄 Создать резюме',
        shortDesc: 'Оформить опыт и навыки',
        energyCost: 4,
        text: `
            <p>Вы создаёте резюме с проектами из портфолио.</p>
            <p>Фокус на результатах и метриках!</p>
        `,
        choices: [
            { text: 'Резюме готово!', action: () => completeQuest(true) }
        ],
        rewards: {
            confidence: 2,
            portfolio: 'Документ: Резюме'
        }
    },
    
    {
        id: 'send-applications',
        title: '📧 Разослать отклики',
        shortDesc: 'Отправить 20 заявок',
        energyCost: 5,
        requirement: { quest: 'create-resume' },
        text: `
            <p>Вы отправляете резюме в 20 компаний.</p>
            <p>Через неделю приходит 3 приглашения на интервью!</p>
        `,
        choices: [
            { text: 'Процесс пошёл!', action: () => completeQuest(true) }
        ],
        rewards: {
            confidence: 2,
            reputation: 1
        }
    },
    
    {
        id: 'interview-prep',
        title: '💡 Подготовка к интервью',
        shortDesc: 'Репетиция вопросов',
        energyCost: 4,
        repeatable: true,
        maxRepeats: 3,
        text: `
            <p>Вы готовитесь к техническим интервью:</p>
            <p>SQL-задачи, кейсы по аналитике, поведенческие вопросы.</p>
        `,
        choices: [
            { text: 'Готов!', action: () => completeQuest(true) }
        ],
        rewards: {
            confidence: 3,
            skills: { 'Софт-скиллы': 1 }
        }
    },
    
    {
        id: 'final-interview',
        title: '🎯 Попробовать устроиться',
        shortDesc: 'Начать поиск работы',
        energyCost: 0,
        requirement: { day: 20, portfolio: 1 },
        text: `
            <p>Ты готов попробовать устроиться на работу?</p>
            
            <p>Твоя текущая специализация определится автоматически на основе навыков.</p>
            
            <p><em>Примечание: Чем больше проектов и репутации, тем лучше предложения!</em></p>
            
            <div id="currentStats" style="background: var(--light); padding: 16px; border-radius: 8px; margin: 12px 0;">
                <p><strong>Загрузка статистики...</strong></p>
            </div>
        `,
        choices: [
            {
                text: 'Начать поиск работы →',
                action: () => {
                    showFinal();
                }
            },
            {
                text: 'Ещё поучусь',
                action: () => {
                    closeQuest();
                }
            }
        ]
    },
    
    // ============================================
    // HELIOS SYSTEMS (ФИНАЛ)
    // ============================================
    
    {
        id: 'helios-interview',
        title: '🎯 Собеседование в Helios Systems',
        shortDesc: 'Компания мечты',
        energyCost: 5,
        requirement: { portfolio: 3, reputation: 3 },
        text: `
            <p>Финальное интервью в Helios Systems.</p>
            <p>Вы рассказываете о проектах, решаете технические задачи, обсуждаете кейсы.</p>
            <p>Интервьюеры впечатлены вашим опытом!</p>
        `,
        choices: [
            { text: 'Жду результата...', action: () => { showFinal(); } }
        ]
    }
];
