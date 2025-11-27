/**
 * PADEL TBILISI COMMUNITY - BOOKING PLATFORM
 * Main application logic - FIXED VERSION WITH DATE PARSING
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // Google Sheets JSON URL
    SHEETS_URL: 'https://docs.google.com/spreadsheets/d/1KKxkSZMHDzwKcMEPEeZgWlRrR25QAK54jvClmXwnYlw/gviz/tq?tqx=out:json&sheet=Events',

    // Google Forms URLs for submissions (formResponse endpoints)
    JOIN_FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLScgEQWp2gbF3J0sFHfjy-LsQAi22XDbbkHvbYUp9l_lMIedsA/formResponse',
    CREATE_FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLScaVxjAMI4Iz4w13UKUZcEjTsMR50gvnWt2qNr8TMIybZRGQA/formResponse',

    // Google Forms entry IDs (find these by inspecting your form HTML)
    JOIN_ENTRY_EVENT_ID: 'entry.484082052',
    JOIN_ENTRY_NAME: 'entry.945470645',

    // Date field is split into 3 parts in Google Forms!
    CREATE_ENTRY_DATE_YEAR: 'entry.87044447_year',
    CREATE_ENTRY_DATE_MONTH: 'entry-19.129556_month',
    CREATE_ENTRY_DATE_DAY: 'entry.87044447_day',
    CREATE_ENTRY_TIME_START: 'entry.412748059',
    CREATE_ENTRY_TIME_END: 'entry.2002611577',
    CREATE_ENTRY_LOCATION: 'entry.1202378861',
    CREATE_ENTRY_ORGANIZER: 'entry.1029082665',

    REFRESH_INTERVAL: 30000,

    DATE_FORMAT: {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    },
    TIME_FORMAT: {
        hour: '2-digit',
        minute: '2-digit'
    }
};

const state = {
    events: [],
    isLoading: false,
    currentEventId: null,
    refreshTimer: null
};

const elements = {
    createEventBtn: document.getElementById('createEventBtn'),
    loadingState: document.getElementById('loadingState'),
    eventsGrid: document.getElementById('eventsGrid'),
    emptyState: document.getElementById('emptyState'),
    joinModal: document.getElementById('joinModal'),
    joinModalClose: document.getElementById('joinModalClose'),
    joinModalCancel: document.getElementById('joinModalCancel'),
    joinEventForm: document.getElementById('joinEventForm'),
    joinEventId: document.getElementById('joinEventId'),
    joinName: document.getElementById('joinName'),
    createModal: document.getElementById('createModal'),
    createModalClose: document.getElementById('createModalClose'),
    createModalCancel: document.getElementById('createModalCancel'),
    createEventForm: document.getElementById('createEventForm'),
    createDate: document.getElementById('createDate'),
    createTimeStart: document.getElementById('createTimeStart'),
    createTimeEnd: document.getElementById('createTimeEnd'),
    createLocation: document.getElementById('createLocation'),
    createOrganizer: document.getElementById('createOrganizer')
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function parseDateTime(dateTimeString) {
    return new Date(dateTimeString);
}

function formatDate(date) {
    return date.toLocaleDateString('ru-RU', CONFIG.DATE_FORMAT);
}

function formatTime(date) {
    return date.toLocaleTimeString('ru-RU', CONFIG.TIME_FORMAT);
}

function isFutureEvent(dateTimeString) {
    const eventDate = parseDateTime(dateTimeString);
    const now = new Date();
    return eventDate > now;
}

function parseParticipants(participantsString) {
    if (!participantsString || participantsString.trim() === '') {
        return [];
    }
    return participantsString.split(',').map(p => p.trim()).filter(p => p.length > 0);
}

function showElement(element) {
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

// ============================================
// DATA FETCHING
// ============================================

async function fetchEvents() {
    try {
        console.log('Fetching events from:', CONFIG.SHEETS_URL);
        const response = await fetch(CONFIG.SHEETS_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        return processEventsData(data);
    } catch (error) {
        console.error('Error fetching events:', error);
        return getDemoData();
    }
}

function processEventsData(data) {
    try {
        let jsonData = data;

        if (typeof data === 'string') {
            const jsonString = data
                .replace(/^\/\*O_o\*\/\s*/, '')
                .replace(/google\.visualization\.Query\.setResponse\(/, '')
                .replace(/\);?\s*$/, '');

            jsonData = JSON.parse(jsonString);
        }

        if (!jsonData.table || !jsonData.table.rows) {
            console.error('Unexpected data structure:', jsonData);
            return [];
        }

        const rows = jsonData.table.rows;
        const cols = jsonData.table.cols;

        const colMap = {};
        cols.forEach((col, index) => {
            colMap[col.label] = index;
        });

        const events = rows.map(row => {
            const cells = row.c;

            // Get DateTime - может быть в формате Date(2025,10,29,18,0,0)
            let dateTimeValue = cells[colMap['DateTime']]?.v || cells[1]?.v;

            // Преобразовать Date(year, month, day, hour, min, sec) в ISO формат
            if (typeof dateTimeValue === 'string' && dateTimeValue.startsWith('Date(')) {
                const match = dateTimeValue.match(/Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/);
                if (match) {
                    const [, year, month, day, hour, min] = match;
                    // Месяц в JavaScript Date с 0, поэтому +1
                    const monthNum = parseInt(month) + 1;
                    dateTimeValue = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
                }
            }

            return {
                ID: cells[colMap['ID']]?.v || cells[0]?.v,
                DateTime: dateTimeValue,
                Location: cells[colMap['Location']]?.v || cells[2]?.v,
                Organizer: cells[colMap['Organizer']]?.v || cells[3]?.v,
                Participants: cells[colMap['Participants']]?.v || cells[4]?.v || '',
                Status: cells[colMap['Status']]?.v || cells[5]?.v || 'active'
            };
        });

        console.log('Processed events:', events);
        return events;

    } catch (error) {
        console.error('Error processing events data:', error);
        return [];
    }
}

function getDemoData() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);

    const dayAfter = new Date(now);
    dayAfter.setDate(dayAfter.getDate() + 2);
    dayAfter.setHours(10, 0, 0, 0);

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(15, 0, 0, 0);

    return [
        {
            ID: 1,
            DateTime: tomorrow.toISOString().slice(0, 16),
            Location: 'Теннисный клуб "Динамо"',
            Organizer: 'Георгий',
            Participants: 'Георгий, Лева, Марина',
            Status: 'active'
        },
        {
            ID: 2,
            DateTime: dayAfter.toISOString().slice(0, 16),
            Location: 'Спорткомплекс "Олимпия"',
            Organizer: 'Ника',
            Participants: 'Ника, Александр',
            Status: 'active'
        },
        {
            ID: 3,
            DateTime: nextWeek.toISOString().slice(0, 16),
            Location: 'Парк Метехи - открытые корты',
            Organizer: 'Марина',
            Participants: 'Марина',
            Status: 'active'
        }
    ];
}

function filterAndSortEvents(events) {
    return events
        .filter(event => {
            return event.Status === 'active' && isFutureEvent(event.DateTime);
        })
        .sort((a, b) => {
            const dateA = parseDateTime(a.DateTime);
            const dateB = parseDateTime(b.DateTime);
            return dateA - dateB;
        });
}

// ============================================
// RENDERING
// ============================================

function renderEventCard(event) {
    const eventDate = parseDateTime(event.DateTime);
    const participants = parseParticipants(event.Participants);

    const card = document.createElement('div');
    card.className = 'event-card';
    card.dataset.eventId = event.ID;

    card.innerHTML = `
    <div class="event-card__header">
      <div class="event-card__datetime">
        <span class="event-card__date">${formatDate(eventDate)}</span>
        <span class="event-card__time">${formatTime(eventDate)}</span>
      </div>
      <div class="event-card__location">
        <span>📍</span>
        <span>${event.Location}</span>
      </div>
    </div>
    
    <div class="event-card__body">
      <div class="event-card__organizer">
        Организатор: <strong>${event.Organizer}</strong>
      </div>
      
      <div class="event-card__participants">
        <div class="event-card__participants-label">
          Участники (${participants.length}):
        </div>
        <div class="event-card__participants-list">
          ${participants.length > 0
            ? participants.map(p => `<span class="participant-badge">${p}</span>`).join('')
            : '<span class="participant-badge">Пока никого</span>'}
        </div>
      </div>
    </div>
    
    <div class="event-card__footer">
      <button class="btn btn-primary btn-block join-event-btn" data-event-id="${event.ID}">
        Присоединиться
      </button>
    </div>
  `;

    const joinBtn = card.querySelector('.join-event-btn');
    joinBtn.addEventListener('click', () => openJoinModal(event.ID));

    return card;
}

function renderEvents(events) {
    const filteredEvents = filterAndSortEvents(events);
    elements.eventsGrid.innerHTML = '';

    if (filteredEvents.length === 0) {
        hideElement(elements.eventsGrid);
        showElement(elements.emptyState);
    } else {
        hideElement(elements.emptyState);
        showElement(elements.eventsGrid);

        filteredEvents.forEach(event => {
            const card = renderEventCard(event);
            elements.eventsGrid.appendChild(card);
        });
    }
}

function showLoading() {
    state.isLoading = true;
    showElement(elements.loadingState);
    hideElement(elements.eventsGrid);
    hideElement(elements.emptyState);
}

function hideLoading() {
    state.isLoading = false;
    hideElement(elements.loadingState);
}

// ============================================
// MODAL MANAGEMENT
// ============================================

function openJoinModal(eventId) {
    state.currentEventId = eventId;
    elements.joinEventId.value = eventId;
    elements.joinName.value = '';
    elements.joinModal.classList.add('active');
    document.body.classList.add('modal-open');
    elements.joinName.focus();
}

function closeJoinModal() {
    elements.joinModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    state.currentEventId = null;
}

function openCreateModal() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    elements.createDate.value = tomorrow.toISOString().split('T')[0];

    elements.createTimeStart.value = '18:00';
    elements.createTimeEnd.value = '20:00';

    elements.createLocation.value = '';
    elements.createOrganizer.value = '';

    elements.createModal.classList.add('active');
    document.body.classList.add('modal-open');
    elements.createDate.focus();
}

function closeCreateModal() {
    elements.createModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

function handleModalBackdropClick(event, modal) {
    if (event.target === modal) {
        if (modal === elements.joinModal) {
            closeJoinModal();
        } else if (modal === elements.createModal) {
            closeCreateModal();
        }
    }
}

// ============================================
// FORM SUBMISSION
// ============================================

async function handleJoinSubmit(event) {
    event.preventDefault();

    const eventId = elements.joinEventId.value;
    const name = elements.joinName.value.trim();

    if (!name) {
        alert('Пожалуйста, введите ваше имя');
        return;
    }

    try {
        console.log('Joining event:', { eventId, name });

        if (CONFIG.JOIN_ENTRY_EVENT_ID.includes('YOUR_') || CONFIG.JOIN_ENTRY_NAME.includes('YOUR_')) {
            alert('⚠️ Формы еще не настроены!\n\nНужно указать entry IDs в app.js.');
            return;
        }

        const formData = new FormData();
        formData.append(CONFIG.JOIN_ENTRY_EVENT_ID, eventId);
        formData.append(CONFIG.JOIN_ENTRY_NAME, name);

        await fetch(CONFIG.JOIN_FORM_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });

        alert(`Отлично! Вы записаны на мероприятие.\n\nВаше имя появится в списке участников через 30-60 секунд.`);

        closeJoinModal();

        setTimeout(() => {
            fetchAndRender();
        }, 5000);

    } catch (error) {
        console.error('Error joining event:', error);
        alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
    }
}

async function handleCreateSubmit(event) {
    event.preventDefault();

    const date = elements.createDate.value;
    const timeStart = elements.createTimeStart.value;
    const timeEnd = elements.createTimeEnd.value;
    const location = elements.createLocation.value.trim();
    const organizer = elements.createOrganizer.value.trim();

    if (!date || !timeStart || !timeEnd || !location || !organizer) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    try {
        console.log('Creating event:', { date, timeStart, timeEnd, location, organizer });

        if (CONFIG.CREATE_ENTRY_DATE_YEAR.includes('YOUR_')) {
            alert('⚠️ Формы еще не настроены!\n\nВНИМАНИЕ: Поле Date разбито на 3 entry (year, month, day)!');
            return;
        }

        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();

        const formData = new FormData();
        formData.append(CONFIG.CREATE_ENTRY_DATE_YEAR, year);
        formData.append(CONFIG.CREATE_ENTRY_DATE_MONTH, month);
        formData.append(CONFIG.CREATE_ENTRY_DATE_DAY, day);
        formData.append(CONFIG.CREATE_ENTRY_TIME_START, timeStart);
        formData.append(CONFIG.CREATE_ENTRY_TIME_END, timeEnd);
        formData.append(CONFIG.CREATE_ENTRY_LOCATION, location);
        formData.append(CONFIG.CREATE_ENTRY_ORGANIZER, organizer);

        console.log('Sending date as:', { year, month, day });

        await fetch(CONFIG.CREATE_FORM_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });

        alert(`Мероприятие создано!\n\nОно появится в списке через 30-60 секунд.`);

        closeCreateModal();

        setTimeout(() => {
            fetchAndRender();
        }, 5000);

    } catch (error) {
        console.error('Error creating event:', error);
        alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
    }
}

// ============================================
// MAIN FUNCTIONS
// ============================================

async function fetchAndRender() {
    showLoading();

    try {
        const events = await fetchEvents();
        state.events = events;
        renderEvents(events);
    } catch (error) {
        console.error('Error in fetchAndRender:', error);
    } finally {
        hideLoading();
    }
}

function startAutoRefresh() {
    if (state.refreshTimer) {
        clearInterval(state.refreshTimer);
    }

    state.refreshTimer = setInterval(() => {
        console.log('Auto-refreshing events...');
        fetchAndRender();
    }, CONFIG.REFRESH_INTERVAL);
}

function init() {
    console.log('Initializing Padel Tbilisi Community Platform...');

    elements.createEventBtn.addEventListener('click', openCreateModal);

    elements.joinModalClose.addEventListener('click', closeJoinModal);
    elements.joinModalCancel.addEventListener('click', closeJoinModal);
    elements.joinModal.addEventListener('click', (e) => handleModalBackdropClick(e, elements.joinModal));
    elements.joinEventForm.addEventListener('submit', handleJoinSubmit);

    elements.createModalClose.addEventListener('click', closeCreateModal);
    elements.createModalCancel.addEventListener('click', closeCreateModal);
    elements.createModal.addEventListener('click', (e) => handleModalBackdropClick(e, elements.createModal));
    elements.createEventForm.addEventListener('submit', handleCreateSubmit);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (elements.joinModal.classList.contains('active')) {
                closeJoinModal();
            }
            if (elements.createModal.classList.contains('active')) {
                closeCreateModal();
            }
        }
    });

    fetchAndRender();
    startAutoRefresh();

    console.log('Application initialized successfully!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

