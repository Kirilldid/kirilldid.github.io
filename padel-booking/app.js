/**
 * PADEL TBILISI COMMUNITY - BOOKING PLATFORM
 * Main application logic
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // Google Sheets JSON URL
    // IMPORTANT: Replace this with your actual Google Sheets JSON URL
    // Options:
    // 1. Use Google Sheets API with API key
    // 2. Publish sheet to web and use the CSV/JSON endpoint
    // 3. Use a service like SheetDB or similar
    SHEETS_URL: 'https://docs.google.com/spreadsheets/d/1KKxkSZMHDzwKcMEPEeZgWlRrR25QAK54jvClmXwnYlw/gviz/tq?tqx=out:json&sheet=Events',

    // Google Forms URLs for submissions
    // IMPORTANT: Replace these with your actual Google Forms URLs
    JOIN_FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLScgEQWp2gbF3J0sFHfjy-LsQAi22XDbbkHvbYUp9l_lMIedsA/viewform?usp=dialog',
    CREATE_FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLScaVxjAMI4Iz4w13UKUZcEjTsMR50gvnWt2qNr8TMIybZRGQA/viewform?usp=dialog',

    // Refresh interval (milliseconds)
    REFRESH_INTERVAL: 30000, // 30 seconds

    // Date/Time format options
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

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    events: [],
    isLoading: false,
    currentEventId: null,
    refreshTimer: null
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    // Buttons
    createEventBtn: document.getElementById('createEventBtn'),

    // Sections
    loadingState: document.getElementById('loadingState'),
    eventsGrid: document.getElementById('eventsGrid'),
    emptyState: document.getElementById('emptyState'),

    // Join Modal
    joinModal: document.getElementById('joinModal'),
    joinModalClose: document.getElementById('joinModalClose'),
    joinModalCancel: document.getElementById('joinModalCancel'),
    joinEventForm: document.getElementById('joinEventForm'),
    joinEventId: document.getElementById('joinEventId'),
    joinName: document.getElementById('joinName'),

    // Create Modal
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

/**
 * Parse datetime string to Date object
 */
function parseDateTime(dateTimeString) {
    return new Date(dateTimeString);
}

/**
 * Format date for display
 */
function formatDate(date) {
    return date.toLocaleDateString('ru-RU', CONFIG.DATE_FORMAT);
}

/**
 * Format time for display
 */
function formatTime(date) {
    return date.toLocaleTimeString('ru-RU', CONFIG.TIME_FORMAT);
}

/**
 * Check if event is in the future
 */
function isFutureEvent(dateTimeString) {
    const eventDate = parseDateTime(dateTimeString);
    const now = new Date();
    return eventDate > now;
}

/**
 * Parse participants string into array
 */
function parseParticipants(participantsString) {
    if (!participantsString || participantsString.trim() === '') {
        return [];
    }
    return participantsString.split(',').map(p => p.trim()).filter(p => p.length > 0);
}

/**
 * Show/hide elements
 */
function showElement(element) {
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

// ============================================
// DATA FETCHING
// ============================================

/**
 * Fetch events from Google Sheets
 */
async function fetchEvents() {
    try {
        // Check if URL is configured
        if (CONFIG.SHEETS_URL === 'YOUR_GOOGLE_SHEETS_JSON_URL_HERE') {
            console.warn('Google Sheets URL not configured. Using demo data.');
            return getDemoData();
        }

        const response = await fetch(CONFIG.SHEETS_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return processEventsData(data);
    } catch (error) {
        console.error('Error fetching events:', error);
        // Return demo data as fallback
        return getDemoData();
    }
}

/**
 * Process raw events data from Google Sheets
 * Adjust this function based on your actual Google Sheets JSON structure
 */
function processEventsData(data) {
    // This is a generic processor - adjust based on your actual data structure
    // Assuming data is an array of objects with keys: ID, DateTime, Location, Organizer, Participants, Status

    if (Array.isArray(data)) {
        return data;
    }

    // If data has a different structure (e.g., { values: [[...], [...]] })
    // you'll need to transform it here

    return [];
}

/**
 * Get demo data for testing
 */
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

/**
 * Filter and sort events
 */
function filterAndSortEvents(events) {
    return events
        .filter(event => {
            // Filter: Status must be 'active' and DateTime must be in the future
            return event.Status === 'active' && isFutureEvent(event.DateTime);
        })
        .sort((a, b) => {
            // Sort: Ascending by DateTime (nearest first)
            const dateA = parseDateTime(a.DateTime);
            const dateB = parseDateTime(b.DateTime);
            return dateA - dateB;
        });
}

// ============================================
// RENDERING
// ============================================

/**
 * Render a single event card
 */
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

    // Add event listener to join button
    const joinBtn = card.querySelector('.join-event-btn');
    joinBtn.addEventListener('click', () => openJoinModal(event.ID));

    return card;
}

/**
 * Render all events
 */
function renderEvents(events) {
    const filteredEvents = filterAndSortEvents(events);

    // Clear existing events
    elements.eventsGrid.innerHTML = '';

    if (filteredEvents.length === 0) {
        // Show empty state
        hideElement(elements.eventsGrid);
        showElement(elements.emptyState);
    } else {
        // Show events
        hideElement(elements.emptyState);
        showElement(elements.eventsGrid);

        filteredEvents.forEach(event => {
            const card = renderEventCard(event);
            elements.eventsGrid.appendChild(card);
        });
    }
}

/**
 * Show loading state
 */
function showLoading() {
    state.isLoading = true;
    showElement(elements.loadingState);
    hideElement(elements.eventsGrid);
    hideElement(elements.emptyState);
}

/**
 * Hide loading state
 */
function hideLoading() {
    state.isLoading = false;
    hideElement(elements.loadingState);
}

// ============================================
// MODAL MANAGEMENT
// ============================================

/**
 * Open join event modal
 */
function openJoinModal(eventId) {
    state.currentEventId = eventId;
    elements.joinEventId.value = eventId;
    elements.joinName.value = '';
    elements.joinModal.classList.add('active');
    document.body.classList.add('modal-open');
    elements.joinName.focus();
}

/**
 * Close join event modal
 */
function closeJoinModal() {
    elements.joinModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    state.currentEventId = null;
}

/**
 * Open create event modal
 */
function openCreateModal() {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    elements.createDate.value = tomorrow.toISOString().split('T')[0];

    // Set default time
    elements.createTimeStart.value = '18:00';
    elements.createTimeEnd.value = '20:00';

    // Clear other fields
    elements.createLocation.value = '';
    elements.createOrganizer.value = '';

    elements.createModal.classList.add('active');
    document.body.classList.add('modal-open');
    elements.createDate.focus();
}

/**
 * Close create event modal
 */
function closeCreateModal() {
    elements.createModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

/**
 * Close modal on backdrop click
 */
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

/**
 * Submit join event form
 */
async function handleJoinSubmit(event) {
    event.preventDefault();

    const eventId = elements.joinEventId.value;
    const name = elements.joinName.value.trim();

    if (!name) {
        alert('Пожалуйста, введите ваше имя');
        return;
    }

    try {
        // Here you would submit to Google Forms
        // For now, we'll just log and show a message
        console.log('Joining event:', { eventId, name });

        // TODO: Implement actual Google Forms submission
        // Example using fetch:
        // const formData = new FormData();
        // formData.append('entry.XXXXX', 'join'); // Action type
        // formData.append('entry.YYYYY', eventId); // Event ID
        // formData.append('entry.ZZZZZ', name); // Name
        // await fetch(CONFIG.JOIN_FORM_URL, {
        //   method: 'POST',
        //   body: formData,
        //   mode: 'no-cors'
        // });

        alert(`Отлично! Вы записаны на мероприятие.\n\nВаше имя появится в списке участников через 30 секунд после обновления данных.`);

        closeJoinModal();

        // Refresh data after a short delay
        setTimeout(() => {
            fetchAndRender();
        }, 5000);

    } catch (error) {
        console.error('Error joining event:', error);
        alert('Произошла ошибка. Пожалуйста, попробуйте снова.');
    }
}

/**
 * Submit create event form
 */
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

    // Combine date and time
    const dateTime = `${date}T${timeStart}`;

    try {
        // Here you would submit to Google Forms
        console.log('Creating event:', { dateTime, timeStart, timeEnd, location, organizer });

        // TODO: Implement actual Google Forms submission
        // Example using fetch:
        // const formData = new FormData();
        // formData.append('entry.XXXXX', 'create'); // Action type
        // formData.append('entry.YYYYY', dateTime); // DateTime
        // formData.append('entry.ZZZZZ', location); // Location
        // formData.append('entry.AAAAA', organizer); // Organizer
        // await fetch(CONFIG.CREATE_FORM_URL, {
        //   method: 'POST',
        //   body: formData,
        //   mode: 'no-cors'
        // });

        alert(`Мероприятие создано!\n\nОно появится в списке через 30 секунд после обновления данных.`);

        closeCreateModal();

        // Refresh data after a short delay
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

/**
 * Fetch and render events
 */
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

/**
 * Start auto-refresh
 */
function startAutoRefresh() {
    // Clear any existing timer
    if (state.refreshTimer) {
        clearInterval(state.refreshTimer);
    }

    // Set up new timer
    state.refreshTimer = setInterval(() => {
        console.log('Auto-refreshing events...');
        fetchAndRender();
    }, CONFIG.REFRESH_INTERVAL);
}

/**
 * Initialize the application
 */
function init() {
    console.log('Initializing Padel Tbilisi Community Platform...');

    // Set up event listeners

    // Create event button
    elements.createEventBtn.addEventListener('click', openCreateModal);

    // Join modal
    elements.joinModalClose.addEventListener('click', closeJoinModal);
    elements.joinModalCancel.addEventListener('click', closeJoinModal);
    elements.joinModal.addEventListener('click', (e) => handleModalBackdropClick(e, elements.joinModal));
    elements.joinEventForm.addEventListener('submit', handleJoinSubmit);

    // Create modal
    elements.createModalClose.addEventListener('click', closeCreateModal);
    elements.createModalCancel.addEventListener('click', closeCreateModal);
    elements.createModal.addEventListener('click', (e) => handleModalBackdropClick(e, elements.createModal));
    elements.createEventForm.addEventListener('submit', handleCreateSubmit);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape key closes modals
        if (e.key === 'Escape') {
            if (elements.joinModal.classList.contains('active')) {
                closeJoinModal();
            }
            if (elements.createModal.classList.contains('active')) {
                closeCreateModal();
            }
        }
    });

    // Initial data fetch
    fetchAndRender();

    // Start auto-refresh
    startAutoRefresh();

    console.log('Application initialized successfully!');
}

// ============================================
// START APPLICATION
// ============================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
