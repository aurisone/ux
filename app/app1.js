document.addEventListener('DOMContentLoaded', function() {
    // Sample data for medical visits - will be used only if no data in localStorage
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format dates for data
    const formatDateForData = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    
    const todayStr = formatDateForData(today);
    const yesterdayStr = formatDateForData(yesterday);
    
    // Fixed random names for sample visits
    const visitNames = [
        'Jan Novák',
        'Marie Svobodová',
        'Petr Novotný',
        'Jana Dvořáková',
        'Josef Černý',
        'Eva Procházková',
        'Pavel Kučera',
        'Hana Veselá',
        'Jaroslav Horák',
        'Anna Němcová'
    ];
    
    // Sample data - used only if no data in localStorage
    const sampleVisits = [
        {
            id: 1,
            title: visitNames[0],
            personalId: "1234567890",
            date: todayStr,
            time: '09:30',
            duration: 45,
            imageCount: 2,
            notesCount: 3,
            notes: [
                { timestamp: '15:30:42', content: 'Pacient přišel s bolestí v pravém rameni.' },
                { timestamp: '15:29:15', content: 'Doporučeno chladové obklady a klid po dobu 3 dnů.' },
                { timestamp: '15:27:30', content: 'Předepsán lék na bolest, 3x denně.' }
            ]
        },
        {
            id: 2,
            title: visitNames[1],
            personalId: "0987654321",
            date: todayStr,
            time: '11:00',
            duration: 15,
            imageCount: 0,
            notesCount: 1,
            notes: [
                { timestamp: '11:15:22', content: 'Kontrola po zákroku, vše v pořádku.' }
            ]
        },
        {
            id: 3,
            title: visitNames[2],
            personalId: "5647382910",
            date: yesterdayStr,
            time: '14:45',
            duration: 30,
            imageCount: 5,
            notesCount: 2,
            notes: [
                { timestamp: '15:05:11', content: 'Pacient si stěžuje na bolest v krku.' },
                { timestamp: '15:01:40', content: 'Předepsáno antibiotikum na 7 dní.' }
            ]
        },
        {
            id: 4,
            title: visitNames[3],
            personalId: "1122334455",
            date: yesterdayStr,
            time: '08:15',
            duration: 60,
            imageCount: 3,
            notesCount: 4,
            notes: [
                { timestamp: '09:10:15', content: 'Vyšetření EKG v normě.' },
                { timestamp: '09:05:31', content: 'Krevní tlak: 130/85.' },
                { timestamp: '09:00:10', content: 'Teplota: 36.8°C.' },
                { timestamp: '08:55:22', content: 'Pacient přichází na pravidelnou kontrolu.' }
            ]
        },
        {
            id: 5,
            title: visitNames[4],
            personalId: "9988776655",
            date: '2023-05-02', 
            time: '13:30',
            duration: 45,
            imageCount: 1,
            notesCount: 2,
            notes: [
                { timestamp: '14:00:33', content: 'Doporučení: více tekutin, méně soli.' },
                { timestamp: '13:45:17', content: 'Kontrola výsledků krevních testů.' }
            ]
        },
        {
            id: 6,
            title: visitNames[5],
            personalId: "6677889900",
            date: '2023-05-02',
            time: '16:00',
            duration: 10,
            imageCount: 0,
            notesCount: 1,
            notes: [
                { timestamp: '16:05:09', content: 'Krátká konzultace ohledně léků.' }
            ]
        }
    ];

    // Load visits from localStorage or use sample data if none exists
    let visits = loadVisitsFromStorage() || sampleVisits;
    
    // Function to save visits to localStorage
    function saveVisitsToStorage() {
        try {
            localStorage.setItem('medicalVisits', JSON.stringify(visits));
            console.log('Visits saved to localStorage:', visits.length);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }
    
    // Function to load visits from localStorage
    function loadVisitsFromStorage() {
        try {
            const storedVisits = localStorage.getItem('medicalVisits');
            if (storedVisits) {
                const parsedVisits = JSON.parse(storedVisits);
                console.log('Visits loaded from localStorage:', parsedVisits.length);
                return parsedVisits;
            }
            return null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }
    
    // Function to find next available ID
    function getNextId() {
        return visits.length > 0 ? Math.max(...visits.map(v => v.id)) + 1 : 1;
    }

    // Function to format date in Czech format
    function formatDate(dateStr, timeStr) {
        const date = new Date(dateStr + 'T' + timeStr);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${hours}:${minutes}`;
    }
    
    // Function to format date for display in headings
    function formatDateHeading(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}.${month}.${year}`;
    }
    
    // Check if a date is today
    function isToday(dateStr) {
        return dateStr === todayStr;
    }
    
    // Check if a date is yesterday
    function isYesterday(dateStr) {
        return dateStr === yesterdayStr;
    }

    // Function to create a visit item
    function createVisitItem(visit) {
        const li = document.createElement('li');
        li.className = 'visit-item';
        li.setAttribute('data-id', visit.id);
        li.setAttribute('data-date', visit.date);
        
        // Make the list item clickable
        li.addEventListener('click', function(e) {
            // Only handle click if it's not on the kebab menu
            if (!e.target.closest('.kebab-menu')) {
                openVisitDetail(visit);
            }
        });
        
        // Create the content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'visit-content';
        
        // Create title
        const titleElem = document.createElement('h3');
        titleElem.className = 'visit-title';
        titleElem.textContent = visit.title;
        contentDiv.appendChild(titleElem);
        
        // Create details container - now contains time and other details in one line
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'visit-details';
        
        // Time detail (now part of the same line as other details)
        const timeDetail = document.createElement('div');
        timeDetail.className = 'visit-detail';
        timeDetail.innerHTML = `${formatDate(visit.date, visit.time)}`;
        detailsDiv.appendChild(timeDetail);
        
        // Add a separator
        const separator = document.createElement('div');
        separator.className = 'detail-separator';
        separator.innerHTML = '•';
        detailsDiv.appendChild(separator);
        
        // Duration detail
        const durationDetail = document.createElement('div');
        durationDetail.className = 'visit-detail';
        durationDetail.innerHTML = `<i class="far fa-clock"></i> ${visit.duration} min`;
        detailsDiv.appendChild(durationDetail);
        
        // Images detail
        const imagesDetail = document.createElement('div');
        imagesDetail.className = 'visit-detail';
        imagesDetail.innerHTML = `<i class="far fa-images"></i> ${visit.imageCount}`;
        detailsDiv.appendChild(imagesDetail);
        
        // Notes detail
        const notesDetail = document.createElement('div');
        notesDetail.className = 'visit-detail';
        notesDetail.innerHTML = `<i class="far fa-sticky-note"></i> ${visit.notes ? visit.notes.length : 0}`;
        detailsDiv.appendChild(notesDetail);
        
        contentDiv.appendChild(detailsDiv);
        li.appendChild(contentDiv);
        
        // Create actions container
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'visit-actions';
        
        // Create kebab menu
        const kebabBtn = document.createElement('button');
        kebabBtn.className = 'kebab-menu';
        kebabBtn.innerHTML = '<i class="fas fa-ellipsis-v"></i>';
        kebabBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent item click
            
            // Create context menu
            showContextMenu(e, visit);
        });
        
        actionsDiv.appendChild(kebabBtn);
        li.appendChild(actionsDiv);
        
        return li;
    }
    
    // Function to create heading for a group of visits
    function createDateHeading(dateStr) {
        const headingElem = document.createElement('li');
        headingElem.className = 'date-heading';
        
        let headingText;
        if (isToday(dateStr)) {
            headingText = 'Dnes';
        } else if (isYesterday(dateStr)) {
            headingText = 'Včera';
        } else {
            headingText = formatDateHeading(dateStr);
        }
        
        headingElem.textContent = headingText;
        return headingElem;
    }

    // Populate visits list grouped by date
    function populateVisitsList() {
        const visitsList = document.getElementById('visits-list');
        visitsList.innerHTML = '';
        
        // Hide detail view if it exists
        const detailView = document.getElementById('visit-detail-view');
        if (detailView) {
            detailView.style.display = 'none';
        }
        
        // Ensure main header is visible
        document.querySelector('header').style.display = 'flex';
        
        // Group visits by date
        const groupedVisits = {};
        
        // Sort visits by date (newest first) and then by time
        visits.sort((a, b) => {
            if (a.date !== b.date) {
                return new Date(b.date) - new Date(a.date);
            }
            return a.time.localeCompare(b.time);
        });
        
        // Group the sorted visits by date
        visits.forEach(visit => {
            if (!groupedVisits[visit.date]) {
                groupedVisits[visit.date] = [];
            }
            groupedVisits[visit.date].push(visit);
        });
        
        // Create elements for each group
        Object.keys(groupedVisits).forEach(date => {
            // Add date heading
            const dateHeading = createDateHeading(date);
            visitsList.appendChild(dateHeading);
            
            // Add visits for this date
            const visitsGroup = document.createElement('div');
            visitsGroup.className = 'visits-group';
            
            groupedVisits[date].forEach(visit => {
                const visitItem = createVisitItem(visit);
                visitsGroup.appendChild(visitItem);
            });
            
            visitsList.appendChild(visitsGroup);
        });
    }
    
    // Function to open visit detail view
    function openVisitDetail(visit) {
        console.log('Opening detail for visit:', visit.id);
        
        // Check if detail view already exists
        let detailView = document.getElementById('visit-detail-view');
        
        // If not, create it
        if (!detailView) {
            detailView = document.createElement('div');
            detailView.id = 'visit-detail-view';
            document.querySelector('main').appendChild(detailView);
        }
        
        // Format date for display
        const date = new Date(visit.date + 'T' + visit.time);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
        
        // Hide the main header
        document.querySelector('header').style.display = 'none';
        
        // Populate detail view with personalId in the header
        detailView.innerHTML = `
            <div class="detail-header">
                <button id="back-btn" class="icon-btn">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="title-container">
                <h2>${visit.title}</h2>
                    ${visit.personalId ? `<div class="personal-id">${visit.personalId}</div>` : ''}
                </div>
                <button class="kebab-menu icon-btn">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
            <div class="detail-content">
                <div class="detail-item">
                    <i class="far fa-calendar-alt"></i>
                    <p>${formattedDate}</p>
                </div>
                <div class="detail-item">
                    <i class="far fa-clock"></i>
                    <p>${visit.duration} minut</p>
                </div>
                <div class="detail-section photos-section">
                    <h3>Fotografie (${visit.imageCount})</h3>
                    <div class="detail-images">
                        ${visit.imageCount > 0 ? 
                            Array(visit.imageCount).fill().map((_, i) => 
                                `<div class="detail-image">
                                    <img src="images/med${(i % 3) + 1}.png" alt="Fotografie z návštěvy">
                                    <div class="detail-image-overlay">Fotografie z návštěvy</div>
                                </div>`
                            ).join('') : 
                            '<p class="empty-state">Žádné fotografie</p>'
                        }
                    </div>
                </div>
                <div class="detail-section notes-section">
                    <h3>Poznámky (${visit.notes ? visit.notes.length : 0})</h3>
                    <div class="detail-notes">
                        ${visit.notes && visit.notes.length > 0 ? 
                            visit.notes.map(note => 
                                `<div class="note-item">
                                    <div class="note-timestamp">${note.timestamp}</div>
                                    <div class="note-content">${note.content}</div>
                                </div>`
                            ).join('') : 
                            '<p class="empty-state">Žádné poznámky</p>'
                        }
                    </div>
                </div>
            </div>
        `;
        
        // Add record menu to the detail view
        createRecordMenu(visit);
        
        // Show detail view and hide list
        document.getElementById('visits-list').style.display = 'none';
        detailView.style.display = 'block';
        
        // Add back button functionality
        document.getElementById('back-btn').addEventListener('click', function() {
            detailView.style.display = 'none';
            
            // Refresh the list to ensure names are up-to-date
            populateVisitsList();
            
            // Show the list and main header
            document.getElementById('visits-list').style.display = 'flex';
            document.querySelector('header').style.display = 'flex';
            
            // Remove record menu
            const recordMenu = document.querySelector('.record-menu-container');
            if (recordMenu) {
                recordMenu.remove();
            }
            
            console.log('Returning to list view');
        });
        
        // Add kebab menu functionality in the detail view
        const detailKebabMenu = detailView.querySelector('.kebab-menu');
        if (detailKebabMenu) {
            detailKebabMenu.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Remove any existing context menu
                const existingMenu = document.querySelector('.context-menu');
                if (existingMenu) {
                    existingMenu.remove();
                }
                
                // Create context menu
                const contextMenu = document.createElement('div');
                contextMenu.className = 'context-menu';
                
                // Store the current visit reference for the menu actions
                const currentVisit = visit;
                
                // Add menu items
                const menuItems = [
                    { 
                        text: 'Podrobnosti', 
                        icon: 'fa-edit', 
                        action: () => {
                            console.log('Rename clicked for visit:', currentVisit);
                            renameVisit(currentVisit);
                        } 
                    },
                    { 
                        text: 'Smazat návštěvu', 
                        icon: 'fa-trash-alt', 
                        action: () => {
                            deleteVisit(currentVisit);
                        // After deleting, go back to the list view
                        detailView.style.display = 'none';
                        document.getElementById('visits-list').style.display = 'flex';
                        document.querySelector('header').style.display = 'flex';
                            
                            // Remove record menu
                            const recordMenu = document.querySelector('.record-menu-container');
                            if (recordMenu) {
                                recordMenu.remove();
                            }
                        }, 
                        isDelete: true 
                    }
                ];
                
                // Create the menu items
                menuItems.forEach(item => {
                    const menuItem = document.createElement('div');
                    menuItem.className = 'context-menu-item';
                    if (item.isDelete) {
                        menuItem.setAttribute('data-action', 'delete');
                    }
                    menuItem.innerHTML = `<i class="fas ${item.icon}"></i> ${item.text}`;
                    menuItem.addEventListener('click', function() {
                        contextMenu.remove();
                        item.action();
                    });
                    contextMenu.appendChild(menuItem);
                });
                
                // Position the menu near the clicked button
                document.body.appendChild(contextMenu);
                
                // Calculate position
                const rect = e.target.closest('.kebab-menu').getBoundingClientRect();
                contextMenu.style.top = `${rect.bottom + window.scrollY}px`;
                contextMenu.style.left = `${rect.left - contextMenu.offsetWidth + 30}px`; // Position to the left of the button
                
                // Close menu when clicking outside
                const closeMenu = function(e) {
                    if (!contextMenu.contains(e.target) && !e.target.closest('.kebab-menu')) {
                        contextMenu.remove();
                        document.removeEventListener('click', closeMenu);
                    }
                };
                
                // Add the event listener after a small delay to prevent it from triggering immediately
                setTimeout(() => {
                    document.addEventListener('click', closeMenu);
                }, 10);
            });
        }
    }

    // Function to create record menu
    function createRecordMenu(visit) {
        // Remove existing record menu if it exists
        const existingMenu = document.querySelector('.record-menu-container');
        if (existingMenu) {
            existingMenu.remove();
        }

        // Create record menu
        const recordMenuContainer = document.createElement('div');
        recordMenuContainer.className = 'record-menu-container';
        
        recordMenuContainer.innerHTML = `
            <div class="record-menu">
                <div class="record-option text">
                    <i class="fas fa-edit"></i>
                </div>
                <div class="record-option audio">
                    <i class="fas fa-microphone"></i>
                </div>
                <div class="record-option photo">
                    <i class="fas fa-camera"></i>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(recordMenuContainer);
        
        // Add click events for record options
        const textOption = recordMenuContainer.querySelector('.record-option.text');
        const audioOption = recordMenuContainer.querySelector('.record-option.audio');
        const photoOption = recordMenuContainer.querySelector('.record-option.photo');
        
        textOption.addEventListener('click', () => {
            // Handle text recording - show note entry form if visit is provided
            if (visit) {
                showNoteEntryForm(visit);
            } else {
                // Show add options screen for new visit
                console.log('Text recording selected');
                alert('Text form would open here');
            }
        });
        
        audioOption.addEventListener('click', () => {
            // Close the record menu when starting recording
            recordMenuContainer.remove();
            
            // Start recording simulation
            startAudioRecording();
        });
        
        photoOption.addEventListener('click', () => {
            // Handle photo taking
            console.log('Photo taking selected');
            // Simulate photo taking
            alert('Camera would open here');
        });
    }

    // Function to show context menu for kebab button
    function showContextMenu(event, visit) {
        // Remove any existing context menus
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        // Create context menu
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        
        // Add menu items
        const menuItems = [
            { text: 'Podrobnosti', icon: 'fa-edit', action: () => openVisitDetail(visit) },
            { text: 'Upravit návštěvu', icon: 'fa-edit', action: () => renameVisit(visit) },
            { text: 'Smazat návštěvu', icon: 'fa-trash-alt', action: () => deleteVisit(visit), isDelete: true }
        ];
        
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'context-menu-item';
            if (item.isDelete) {
                menuItem.setAttribute('data-action', 'delete');
            }
            menuItem.innerHTML = `<i class="fas ${item.icon}"></i> ${item.text}`;
            menuItem.addEventListener('click', function() {
                contextMenu.remove();
                item.action();
            });
            contextMenu.appendChild(menuItem);
        });
        
        // Position the menu near the clicked button
        document.body.appendChild(contextMenu);
        
        // Calculate position - try to avoid overflow
        const rect = event.target.closest('.kebab-menu').getBoundingClientRect();
        const menuWidth = 220; // approximate width of the menu
        
        // If there's not enough space on the right, show on the left
        const left = rect.right + menuWidth > window.innerWidth
            ? rect.left - menuWidth
            : rect.right;
        
        // Default positioning
        contextMenu.style.top = `${rect.bottom + window.scrollY}px`;
        contextMenu.style.left = `${left}px`;
        
        // Close menu when clicking outside
        const closeMenu = function(e) {
            if (!contextMenu.contains(e.target) && !e.target.closest('.kebab-menu')) {
                contextMenu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        
        // Wait a bit before adding the event listener to avoid immediate closing
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }
    
    // Function to rename a visit
    function renameVisit(visit) {
        console.log('Renaming visit (ID):', visit.id);
        
        // Remove any existing modals
        const existingModal = document.querySelector('.add-visit-overlay');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create backdrop overlay
        const backdrop = document.createElement('div');
        backdrop.className = 'backdrop-overlay';
        document.body.appendChild(backdrop);
        
        // Create form overlay
        const formOverlay = document.createElement('div');
        formOverlay.className = 'add-visit-overlay';
        
        // Create form content with pre-filled data
        formOverlay.innerHTML = `
            <div class="add-visit-header">
                <div class="empty-space"></div>
                <h2>Upravit návštěvu</h2>
                <button class="icon-btn form-close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form class="add-visit-form">
                <div class="form-group">
                    <label for="visit-name">Jméno pacienta</label>
                    <input type="text" id="visit-name" class="form-input" value="${visit.title}" required>
                </div>
                <div class="form-group">
                    <label for="personal-id">Osobní číslo</label>
                    <input type="text" id="personal-id" class="form-input" value="${visit.personalId || ''}" required>
                </div>
                <div class="form-group">
                    <label for="visit-date">Datum návštěvy</label>
                    <input type="date" id="visit-date" class="form-input" value="${visit.date}" required>
                </div>
                <div class="form-group">
                    <label for="visit-description">Popis návštěvy</label>
                    <textarea id="visit-description" class="form-textarea">${visit.notes && visit.notes.length > 0 ? visit.notes[0].content : ''}</textarea>
                </div>
                <button type="submit" class="create-visit-btn">Uložit změny</button>
            </form>
        `;
        
        document.body.appendChild(formOverlay);
        
        // Animate in
        setTimeout(() => {
            backdrop.classList.add('active');
            formOverlay.classList.add('active');
        }, 10);
        
        // Focus on first input
        setTimeout(() => {
            formOverlay.querySelector('#visit-name').focus();
        }, 300);
        
        // Close button handler
        const closeBtn = formOverlay.querySelector('.form-close-btn');
        closeBtn.addEventListener('click', () => {
            closeAddVisitForm();
        });
        
        // Backdrop click handler
        backdrop.addEventListener('click', () => {
            closeAddVisitForm();
        });
        
        // Form submit handler
        const form = formOverlay.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('visit-name').value.trim();
            const personalId = document.getElementById('personal-id').value.trim();
            const date = document.getElementById('visit-date').value;
            const description = document.getElementById('visit-description').value.trim();
            
            // Update the visit object
            visit.title = name;
            visit.personalId = personalId;
            visit.date = date;
            
            // Update notes if description exists
            if (description) {
                if (!visit.notes) {
                    visit.notes = [];
                }
                if (visit.notes.length === 0) {
                    visit.notes.push({
                        timestamp: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                        content: description
                    });
                } else {
                    visit.notes[0].content = description;
                }
                visit.notesCount = visit.notes.length;
            }
            
            // Save to localStorage
            saveVisitsToStorage();
            
            // Close the form
            closeAddVisitForm();
            
            // Refresh the list and detail view
            populateVisitsList();
            
            // Open the detail view for the edited visit
            const detailView = document.getElementById('visit-detail-view');
            if (detailView) {
                openVisitDetail(visit);
            }
        });
    }
    
    // Function to delete a visit
    function deleteVisit(visit) {
        const confirmDelete = confirm(`Opravdu chcete smazat návštěvu "${visit.title}"?`);
        if (confirmDelete) {
            // Find the visit index and remove it from the array
            const index = visits.findIndex(v => v.id === visit.id);
            if (index !== -1) {
                visits.splice(index, 1);
                
                // Save to localStorage
                saveVisitsToStorage();
                
                // Refresh the list
                populateVisitsList();
                
                console.log(`Visit ${visit.id} deleted`);
            }
        }
    }

    // Initialize
    populateVisitsList();
    
    // Create options screen for adding a visit
    function createAddOptionsScreen() {
        // Check if the screen already exists
        let optionsScreen = document.getElementById('add-options-screen');
        
        if (!optionsScreen) {
            optionsScreen = document.createElement('div');
            optionsScreen.id = 'add-options-screen';
            document.body.appendChild(optionsScreen);
            
            // Populate options screen
            optionsScreen.innerHTML = `
                <div class="option-header">
                    <button id="options-back-btn" class="icon-btn">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <h2>Přidat návštěvu</h2>
                    <div style="width: 40px;"></div> <!-- Empty space to balance the header -->
                </div>
                <div class="option-content">
                    <button class="option-button" id="option-record">
                        <div class="option-icon">
                            <i class="fas fa-microphone"></i>
                        </div>
                        <div class="option-text">
                            <h3>Nahrát záznam</h3>
                            <p>Vytvořte hlasový záznam z návštěvy</p>
                        </div>
                    </button>
                    
                    <button class="option-button" id="option-photo">
                        <div class="option-icon">
                            <i class="fas fa-camera"></i>
                        </div>
                        <div class="option-text">
                            <h3>Přidat fotografii</h3>
                            <p>Vyfoťte nebo nahrajte fotografii</p>
                        </div>
                    </button>
                    
                    <button class="option-button" id="option-note">
                        <div class="option-icon">
                            <i class="fas fa-sticky-note"></i>
                        </div>
                        <div class="option-text">
                            <h3>Napsat poznámku</h3>
                            <p>Vytvořte textovou poznámku</p>
                        </div>
                    </button>
                </div>
            `;
            
            // Add back button functionality
            optionsScreen.querySelector('#options-back-btn').addEventListener('click', function() {
                hideAddOptionsScreen();
            });
            
            // Add option button functionalities
            optionsScreen.querySelector('#option-record').addEventListener('click', function() {
                console.log('Record option clicked');
                // Here you would implement recording functionality
                alert('Nahrávání záznamu - funkcionalita by byla zde implementována');
            });
            
            optionsScreen.querySelector('#option-photo').addEventListener('click', function() {
                console.log('Photo option clicked');
                // Here you would implement photo functionality
                alert('Přidání fotografie - funkcionalita by byla zde implementována');
            });
            
            optionsScreen.querySelector('#option-note').addEventListener('click', function() {
                console.log('Note option clicked');
                // Here you would implement note functionality
                alert('Přidání poznámky - funkcionalita by byla zde implementována');
            });
        }
        
        return optionsScreen;
    }
    
    // Show add options screen
    function showAddOptionsScreen() {
        // Hide the add visit button
        document.getElementById('add-visit-btn').style.display = 'none';
        
        // Create and show the record menu
        createRecordMenu();
        
        // Close menu when clicking outside
        document.addEventListener('click', function closeMenu(e) {
            if (!document.querySelector('.record-menu-container').contains(e.target) && 
                e.target !== document.getElementById('add-btn') && 
                e.target !== document.getElementById('add-visit-btn') &&
                !e.target.closest('#add-btn') && 
                !e.target.closest('#add-visit-btn')) {
                const recordMenu = document.querySelector('.record-menu-container');
                if (recordMenu) {
                    recordMenu.remove();
                }
                document.getElementById('add-visit-btn').style.display = 'flex';
                document.removeEventListener('click', closeMenu);
            }
        });
    }
    
    // Function to create and show add visit form that slides in from bottom
    function showAddVisitForm() {
        // First, remove any existing record menu
        const existingMenu = document.querySelector('.record-menu-container');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        // Check if form already exists
        let formOverlay = document.querySelector('.add-visit-overlay');
        if (formOverlay) {
            formOverlay.remove();
        }
        
        // Create backdrop overlay
        const backdrop = document.createElement('div');
        backdrop.className = 'backdrop-overlay';
        document.body.appendChild(backdrop);
        
        // Create form overlay
        formOverlay = document.createElement('div');
        formOverlay.className = 'add-visit-overlay';
        
        // Get today's date formatted as YYYY-MM-DD for the date input
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        
        // Create form content
        formOverlay.innerHTML = `
            <div class="add-visit-header">
                <div class="empty-space"></div>
                <h2>Přidat novou návštěvu</h2>
                <button class="icon-btn form-close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form class="add-visit-form">
                <div class="form-group">
                    <label for="visit-name">Jméno pacienta</label>
                    <input type="text" id="visit-name" class="form-input" placeholder="Zadejte jméno pacienta" required>
                </div>
                <div class="form-group">
                    <label for="personal-id">Osobní číslo</label>
                    <input type="text" id="personal-id" class="form-input" placeholder="Zadejte osobní číslo" required>
                </div>
                <div class="form-group">
                    <label for="visit-date">Datum návštěvy</label>
                    <input type="date" id="visit-date" class="form-input" value="${formattedDate}" required>
                </div>
                <div class="form-group">
                    <label for="visit-description">Popis návštěvy</label>
                    <textarea id="visit-description" class="form-textarea" placeholder="Zadejte popis návštěvy"></textarea>
                </div>
                <button type="submit" class="create-visit-btn">Vytvořit návštěvu</button>
                <div class="immediate-link">Vytvořit návštěvu okamžitě</div>
            </form>
        `;
        
        document.body.appendChild(formOverlay);
        
        // Animate in
        setTimeout(() => {
            backdrop.classList.add('active');
            formOverlay.classList.add('active');
        }, 10);
        
        // Focus on first input
        setTimeout(() => {
            formOverlay.querySelector('#visit-name').focus();
        }, 300);
        
        // Close button handler
        const closeBtn = formOverlay.querySelector('.form-close-btn');
        closeBtn.addEventListener('click', () => {
            closeAddVisitForm();
        });
        
        // Backdrop click handler
        backdrop.addEventListener('click', () => {
            closeAddVisitForm();
        });
        
        // Form submit handler
        const form = formOverlay.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('visit-name').value.trim();
            const personalId = document.getElementById('personal-id').value.trim();
            const date = document.getElementById('visit-date').value;
            const description = document.getElementById('visit-description').value.trim();
            
            // Validate required fields
            if (!name || !personalId || !date) {
                alert('Vyplňte prosím všechna povinná pole');
                return;
            }
            
            // Create a new visit
            createNewVisit(name, personalId, date, description);
            
            // Close the form
            closeAddVisitForm();
        });
        
        // Create immediately link handler
        const immediateLink = formOverlay.querySelector('.immediate-link');
        immediateLink.addEventListener('click', () => {
            const name = document.getElementById('visit-name').value.trim() || 'Nová návštěva';
            const personalId = document.getElementById('personal-id').value.trim() || 'N/A';
            const date = document.getElementById('visit-date').value;
            const description = document.getElementById('visit-description').value.trim() || '';
            
            createNewVisit(name, personalId, date, description);
            closeAddVisitForm();
        });
    }
    
    // Function to close the add visit form
    function closeAddVisitForm() {
        const backdrop = document.querySelector('.backdrop-overlay');
        const formOverlay = document.querySelector('.add-visit-overlay');
        
        if (backdrop && formOverlay) {
            // Animate out
            backdrop.classList.remove('active');
            formOverlay.classList.remove('active');
            
            // Remove after animation completes
            setTimeout(() => {
                backdrop.remove();
                formOverlay.remove();
                
                // Show add button again if it was hidden
                const addBtn = document.getElementById('add-visit-btn');
                if (addBtn) {
                    addBtn.style.display = 'flex';
                }
            }, 300);
        }
    }

    // Function to create a new visit with the given data
    function createNewVisit(name, personalId, date, description) {
        console.log('Creating new visit:', { name, personalId, date, description });
        
        // Parse date components
        const dateObj = new Date(date);
        const hours = new Date().getHours().toString().padStart(2, '0');
        const minutes = new Date().getMinutes().toString().padStart(2, '0');
        
        // Create a new visit object
        const newVisit = {
            id: getNextId(),
            title: name,
            personalId: personalId,
            date: date,
            time: `${hours}:${minutes}`,
            duration: 30, // Default duration
            imageCount: 0,
            notesCount: description ? 1 : 0,
            notes: description ? [
                { 
                    timestamp: `${hours}:${minutes}:00`, 
                    content: description 
                }
            ] : []
        };
        
        // Add to visits array
        visits.unshift(newVisit);
        
        // Save to localStorage
        saveVisitsToStorage();
        
        // Refresh the list
        populateVisitsList();
        
        // Open the detail view for the new visit
        openVisitDetail(newVisit);
    }

    // Event handlers for buttons
    document.getElementById('add-btn').addEventListener('click', function() {
        console.log('Add button in header clicked');
        showAddVisitForm();
    });
    
    // Add event listener for the big add visit button
    document.getElementById('add-visit-btn').addEventListener('click', function() {
        console.log('Add visit button clicked');
        showAddVisitForm();
    });

    // Add function to show note entry form
    function showNoteEntryForm(visit) {
        // Check if a form already exists
        let form = document.querySelector('.new-note-form');
        if (form) {
            return; // Form already open
        }
        
        // Create form
        form = document.createElement('div');
        form.className = 'new-note-form';
        form.innerHTML = `
            <textarea class="new-note-input" placeholder="Napište poznámku..."></textarea>
            <div class="new-note-actions">
                <button class="note-btn note-btn-secondary" id="cancel-note">Zrušit</button>
                <button class="note-btn note-btn-primary" id="save-note">Uložit</button>
            </div>
        `;
        
        // Find the notes container and insert the form at the top
        const notesContainer = document.querySelector('.detail-notes');
        if (notesContainer) {
            if (notesContainer.firstChild) {
                notesContainer.insertBefore(form, notesContainer.firstChild);
            } else {
                notesContainer.appendChild(form);
            }
            
            // Remove empty state message if present
            const emptyState = notesContainer.querySelector('.empty-state');
            if (emptyState) {
                emptyState.remove();
            }
            
            // Focus the textarea
            const textarea = form.querySelector('.new-note-input');
            textarea.focus();
            
            // Add event handlers
            const cancelBtn = form.querySelector('#cancel-note');
            const saveBtn = form.querySelector('#save-note');
            
            cancelBtn.addEventListener('click', () => {
                form.remove();
            });
            
            saveBtn.addEventListener('click', () => {
                const noteText = textarea.value.trim();
                if (noteText) {
                    addNoteToVisit(visit, noteText);
                    form.remove();
                    
                    // Refresh the notes display
                    updateNotesDisplay(visit);
                    
                    // Update the visit list to show new note count
                    updateVisitItemNoteCount(visit);
                }
            });
            
            // Handle escape key to cancel
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    form.remove();
                }
            });
        }
    }

    // Function to add a note to a visit
    function addNoteToVisit(visit, noteText) {
        // Get the current time
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const timestamp = `${hours}:${minutes}:${seconds}`;
        
        // Create the note object
        const note = {
            timestamp: timestamp,
            content: noteText
        };
        
        // Initialize notes array if it doesn't exist
        if (!visit.notes) {
            visit.notes = [];
        }
        
        // Add the note to the beginning of the array
        visit.notes.unshift(note);
        
        // Update the notes count
        visit.notesCount = visit.notes.length;
        
        // Save to localStorage
        saveVisitsToStorage();
        
        console.log(`Note added to visit ${visit.id}:`, note);
    }

    // Function to update the notes display after adding a note
    function updateNotesDisplay(visit) {
        const notesContainer = document.querySelector('.detail-notes');
        if (notesContainer && visit.notes && visit.notes.length > 0) {
            // Create HTML for all notes
            const notesHTML = visit.notes.map(note => 
                `<div class="note-item">
                    <div class="note-timestamp">${note.timestamp}</div>
                    <div class="note-content">${note.content}</div>
                </div>`
            ).join('');
            
            // Update the container
            notesContainer.innerHTML = notesHTML;
            
            // Update the heading in the notes section specifically
            const notesHeading = document.querySelector('.notes-section h3');
            if (notesHeading) {
                notesHeading.textContent = `Poznámky (${visit.notes.length})`;
            }
        }
    }

    // Function to update the note count in the visit list
    function updateVisitItemNoteCount(visit) {
        const visitItem = document.querySelector(`.visit-item[data-id="${visit.id}"]`);
        if (visitItem) {
            const noteCountEl = visitItem.querySelector('.visit-detail:nth-child(5)');
            if (noteCountEl) {
                noteCountEl.innerHTML = `<i class="far fa-sticky-note"></i> ${visit.notes.length}`;
            }
        }
    }

    // Function to handle audio recording
    function startAudioRecording() {
        // Create recording status bar if it doesn't exist
        let recordingStatus = document.querySelector('.recording-status');
        if (!recordingStatus) {
            recordingStatus = document.createElement('div');
            recordingStatus.className = 'recording-status';
            recordingStatus.innerHTML = `
                <div class="recording-indicator">
                    <div class="recording-dot"></div>
                    <div class="recording-timer">00:00</div>
                </div>
                <button class="stop-recording-btn">
                    <i class="fas fa-stop"></i> Stop
                </button>
            `;
            document.body.appendChild(recordingStatus);
            
            // Add event listener to stop button
            const stopBtn = recordingStatus.querySelector('.stop-recording-btn');
            stopBtn.addEventListener('click', stopAudioRecording);
        }
        
        // Show recording status bar
        recordingStatus.classList.add('active');
        
        // Add class to body to push content down
        document.body.classList.add('recording-active');
        
        // Initialize timer variables
        let seconds = 0;
        let minutes = 0;
        
        // Start timer
        const timerElement = recordingStatus.querySelector('.recording-timer');
        window.recordingTimer = setInterval(() => {
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
            }
            
            // Format timer display
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');
            timerElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
        }, 1000);
        
        console.log('Audio recording started');
    }

    // Function to stop audio recording
    function stopAudioRecording() {
        // Clear timer interval
        clearInterval(window.recordingTimer);
        
        // Hide recording status bar
        const recordingStatus = document.querySelector('.recording-status');
        if (recordingStatus) {
            recordingStatus.classList.remove('active');
        }
        
        // Remove class from body to return content to normal position
        document.body.classList.remove('recording-active');
        
        // Show confirmation or add the recording to the current visit
        if (confirm('Nahrávání dokončeno. Chcete uložit zvukový záznam?')) {
            // Here we would typically save the audio file
            // For now, just show an alert
            alert('Zvukový záznam byl uložen');
        }
        
        console.log('Audio recording stopped');
    }

    // Add visit button click handler
    addVisitBtn.addEventListener('click', function() {
        // Create a new visit with default values
        const newVisit = {
            id: Date.now().toString(),
            title: 'Nová návštěva',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }),
            duration: 30,
            imageCount: 0,
            notes: [],
            personalId: ''
        };

        // Add the new visit to the visits array
        visits.unshift(newVisit);
        
        // Save to localStorage
        localStorage.setItem('visits', JSON.stringify(visits));
        
        // Refresh the visits list
        renderVisits();
    });
}); 