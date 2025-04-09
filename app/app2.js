document.addEventListener('DOMContentLoaded', function() {
    // Sample data for medical visits - updated with today's, yesterday's and some upcoming visits
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format dates for data
    const formatDateForData = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    
    const todayStr = formatDateForData(today);
    const yesterdayStr = formatDateForData(yesterday);
    
    // Fixed random names for visits
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
    
    // Updated sample data with fixed random names and specific images
    const visits = [
        {
            id: 1,
            title: visitNames[0],
            date: todayStr,
            time: '09:30',
            duration: 45,
            images: ['med1.png', 'med2.png', 'med3.png', 'med4.png', 'med5.png'],
            notesCount: 3
        },
        {
            id: 2,
            title: visitNames[1],
            date: todayStr,
            time: '11:00',
            duration: 15,
            images: [],
            notesCount: 1
        },
        {
            id: 3,
            title: visitNames[2],
            date: yesterdayStr,
            time: '14:45',
            duration: 30,
            images: ['med2.png', 'med3.png'],
            notesCount: 2
        },
        {
            id: 4,
            title: visitNames[3],
            date: yesterdayStr,
            time: '08:15',
            duration: 60,
            images: [],
            notesCount: 4
        },
        {
            id: 5,
            title: visitNames[4],
            date: '2023-05-02', 
            time: '13:30',
            duration: 45,
            images: ['med1.png'],
            notesCount: 2
        },
        {
            id: 6,
            title: visitNames[5],
            date: '2023-05-02',
            time: '16:00',
            duration: 10,
            images: ['med1.png', 'med2.png'],
            notesCount: 1
        }
    ];

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
        imagesDetail.innerHTML = `<i class="far fa-images"></i> ${visit.images.length}`;
        detailsDiv.appendChild(imagesDetail);
        
        // Notes detail
        const notesDetail = document.createElement('div');
        notesDetail.className = 'visit-detail';
        notesDetail.innerHTML = `<i class="far fa-sticky-note"></i> ${visit.notesCount}`;
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
        
        // Populate detail view
        detailView.innerHTML = `
            <div class="detail-header">
                <button id="back-btn" class="icon-btn">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h2>${visit.title}</h2>
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
                
                <!-- Medical Report Button -->
                <button class="medical-report-btn">
                    <i class="fas fa-file-medical"></i>
                    Lékařská zpráva
                </button>
                
                <div class="detail-section">
                    <h3>Fotografie (${visit.images.length})</h3>
                    <div class="detail-images">
                        ${visit.images.length > 0 ? 
                            visit.images.map(image => 
                                `<img src="images/${image}" alt="Medical visit image" class="detail-image">`
                            ).join('') : 
                            '<p class="empty-state">Žádné fotografie</p>'
                        }
                    </div>
                </div>
                <div class="detail-section">
                    <h3>Poznámky (${visit.notesCount})</h3>
                    <div class="detail-notes">
                        ${visit.notesCount > 0 ? 
                            Array(visit.notesCount).fill().map((_, i) => 
                                `<div class="note-placeholder">
                                    <h4>Poznámka ${i+1}</h4>
                                    <p>Text poznámky by byl zobrazen zde. Toto je simulace poznámky.</p>
                                </div>`
                            ).join('') : 
                            '<p class="empty-state">Žádné poznámky</p>'
                        }
                    </div>
                </div>
            </div>
        `;
        
        // Show detail view and hide list
        document.getElementById('visits-list').style.display = 'none';
        detailView.style.display = 'block';
        
        // Add Medical Report button functionality
        const reportBtn = detailView.querySelector('.medical-report-btn');
        if (reportBtn) {
            reportBtn.addEventListener('click', function() {
                showMedicalReport(visit);
            });
        }
        
        // Add back button functionality
        document.getElementById('back-btn').addEventListener('click', function() {
            detailView.style.display = 'none';
            document.getElementById('visits-list').style.display = 'flex';
            
            // Show the main header again
            document.querySelector('header').style.display = 'flex';
            
            // Make sure we update browser history (if needed)
            // This is a placeholder for potential future functionality
            console.log('Returning to list view');
        });
        
        // Add kebab menu functionality in the detail view
        const detailKebabMenu = detailView.querySelector('.kebab-menu');
        if (detailKebabMenu) {
            detailKebabMenu.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Use the same context menu but with limited options for the detail view
                const existingMenu = document.querySelector('.context-menu');
                if (existingMenu) {
                    existingMenu.remove();
                }
                
                // Create context menu
                const contextMenu = document.createElement('div');
                contextMenu.className = 'context-menu';
                
                // Add menu items
                const menuItems = [
                    { text: 'Přejmenovat návštěvu', icon: 'fa-edit', action: () => renameVisit(visit) },
                    { text: 'Smazat návštěvu', icon: 'fa-trash-alt', action: () => {
                        deleteVisit(visit);
                        // After deleting, go back to the list view
                        detailView.style.display = 'none';
                        document.getElementById('visits-list').style.display = 'flex';
                        document.querySelector('header').style.display = 'flex';
                    }, isDelete: true }
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
                
                // Calculate position
                const rect = e.target.closest('.kebab-menu').getBoundingClientRect();
                contextMenu.style.top = `${rect.bottom + window.scrollY}px`;
                contextMenu.style.left = `${rect.left - 180}px`; // Position to the left
                
                // Close menu when clicking outside
                const closeMenu = function(e) {
                    if (!contextMenu.contains(e.target) && !e.target.closest('.kebab-menu')) {
                        contextMenu.remove();
                        document.removeEventListener('click', closeMenu);
                    }
                };
                
                setTimeout(() => {
                    document.addEventListener('click', closeMenu);
                }, 10);
            });
        }
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
            { text: 'Otevřít návštěvu', icon: 'fa-external-link-alt', action: () => openVisitDetail(visit) },
            { text: 'Přejmenovat návštěvu', icon: 'fa-edit', action: () => renameVisit(visit) },
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
        // Remove any existing modals
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';

        // Create modal content
        modal.innerHTML = `
            <div class="modal-header">
                <h2>Přejmenovat návštěvu "${visit.title}"</h2>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="modal-input-group">
                    <label for="new-name">Nové jméno</label>
                    <input type="text" id="new-name" class="modal-input" value="${visit.title}">
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-btn modal-btn-primary">Přejmenovat</button>
                <button class="modal-btn modal-btn-secondary">Zrušit</button>
            </div>
        `;

        // Add modal to overlay
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);

        // Handle close button
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modalOverlay.remove());

        // Handle cancel button
        const cancelBtn = modal.querySelector('.modal-btn-secondary');
        cancelBtn.addEventListener('click', () => modalOverlay.remove());

        // Handle rename button
        const renameBtn = modal.querySelector('.modal-btn-primary');
        const input = modal.querySelector('#new-name');
        
        // Focus the input
        input.focus();
        input.select();

        // Handle rename action
        const handleRename = () => {
            const newName = input.value.trim();
            if (newName !== '') {
                visit.title = newName;
                populateVisitsList();
                modalOverlay.remove();
                console.log(`Visit ${visit.id} renamed to "${newName}"`);
            }
        };

        renameBtn.addEventListener('click', handleRename);
        
        // Handle Enter key
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                handleRename();
            } else if (e.key === 'Escape') {
                modalOverlay.remove();
            }
        });

        // Close modal when clicking outside
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
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
                
                // Refresh the list
                populateVisitsList();
                
                console.log(`Visit ${visit.id} deleted`);
            }
        }
    }

    // Initialize search functionality
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    let searchTimeout;

    // Search input handler
    searchInput.addEventListener('input', function(e) {
        const searchText = e.target.value.trim();
        clearSearchBtn.style.display = searchText ? 'flex' : 'none';
        
        // Clear the previous timeout
        clearTimeout(searchTimeout);
        
        // Set a new timeout to prevent too many updates
        searchTimeout = setTimeout(() => {
            filterVisits(searchText);
        }, 300);
    });

    // Clear search button handler
    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        filterVisits('');
    });

    // Function to filter visits
    function filterVisits(searchText) {
        const visitItems = document.querySelectorAll('.visit-item');
        const dateHeadings = document.querySelectorAll('.date-heading');
        const visitGroups = document.querySelectorAll('.visits-group');
        
        if (!searchText) {
            // Show all visits if search is empty
            visitItems.forEach(item => item.style.display = '');
            dateHeadings.forEach(heading => heading.style.display = '');
            visitGroups.forEach(group => group.style.display = '');
            return;
        }

        // Convert search text to lower case for case-insensitive search
        searchText = searchText.toLowerCase();

        // Hide all date headings initially
        dateHeadings.forEach(heading => heading.style.display = 'none');
        visitGroups.forEach(group => group.style.display = 'none');

        // Filter visits
        visitItems.forEach(item => {
            const title = item.querySelector('.visit-title').textContent.toLowerCase();
            const details = item.querySelector('.visit-details').textContent.toLowerCase();
            
            if (title.includes(searchText) || details.includes(searchText)) {
                item.style.display = '';
                // Show parent group and its heading
                const group = item.closest('.visits-group');
                const headingId = group.getAttribute('data-date');
                const heading = document.querySelector(`.date-heading[data-date="${headingId}"]`);
                
                group.style.display = '';
                if (heading) heading.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
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
        const optionsScreen = createAddOptionsScreen();
        
        // Hide main header and list
        document.querySelector('header').style.display = 'none';
        document.getElementById('visits-list').style.display = 'none';
        
        // Hide add button
        document.getElementById('add-visit-btn').style.display = 'none';
        
        // Show options screen
        optionsScreen.style.display = 'block';
    }
    
    // Hide add options screen
    function hideAddOptionsScreen() {
        const optionsScreen = document.getElementById('add-options-screen');
        if (optionsScreen) {
            optionsScreen.style.display = 'none';
        }
        
        // Show main header and list again
        document.querySelector('header').style.display = 'flex';
        document.getElementById('visits-list').style.display = 'flex';
        
        // Show add button again
        document.getElementById('add-visit-btn').style.display = 'flex';
    }

    // Event handlers for buttons
    document.getElementById('add-btn').addEventListener('click', function() {
        console.log('Add button in header clicked');
        showAddOptionsScreen();
    });
    
    // Add event listener for the big add visit button
    document.getElementById('add-visit-btn').addEventListener('click', function() {
        console.log('Add visit button clicked');
        showAddOptionsScreen();
    });

    // Function to show medical report
    function showMedicalReport(visit) {
        // Check if the report overlay already exists
        let reportOverlay = document.querySelector('.medical-report-overlay');
        if (reportOverlay) {
            reportOverlay.remove();
        }
        
        // Create and show the report
        reportOverlay = document.createElement('div');
        reportOverlay.className = 'medical-report-overlay';
        
        // Format date for display
        const date = new Date(visit.date + 'T' + visit.time);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;
        
        // Create section id from title
        function createSectionId(title) {
            return 'section-' + title.toLowerCase().replace(/\s+/g, '-');
        }
        
        // Medical report sections with dummy text
        const reportSections = [
            {
                title: "Anamnéza",
                content: "Pacient přišel s bolestí v oblasti bederní páteře trvající přibližně 2 týdny. Udává, že bolest se zhoršuje při dlouhodobém sezení a v noci. Neguje úraz či nadměrnou fyzickou zátěž. Pacient nemá v anamnéze předchozí problémy s páteří. Rodinná anamnéza bez významnějších onemocnění."
            },
            {
                title: "Objektivní nález",
                content: "Při vyšetření zjištěno omezení pohyblivosti bederní páteře, zejména při předklonu. Palpačně zjištěna zvýšená citlivost paravertebrálních svalů v oblasti L3-L5. Lasègueův příznak negativní bilaterálně. Neurologicky bez lateralizace, DK bez poruchy motorické či senzitivní funkce. Reflexy fyziologické."
            },
            {
                title: "Diagnóza",
                content: "Akutní lumbalgie (M54.5) bez radikulární symptomatiky. Svalový hypertonus v oblasti bederní páteře. Vyloučena hernace meziobratlové ploténky či jiná strukturální patologie páteře na základě klinického vyšetření."
            },
            {
                title: "Navržená vyšetření",
                content: "Doporučeno RTG bederní páteře ve dvou projekcích k vyloučení strukturálních změn. V případě přetrvávání obtíží déle než 3 týdny zvážit MRI bederní páteře. Laboratorní vyšetření: KO, CRP a biochemie pro vyloučení zánětlivého procesu."
            },
            {
                title: "Medikace",
                content: "Předepsán diklofenak 50 mg 2x denně po jídle po dobu 5 dní, následně dle potřeby. Myorelaxans tolperison 150 mg 3x denně po dobu 7 dní. V případě silnější bolesti tramadol 50 mg 1-2 tablety při bolesti (max. 400 mg denně)."
            },
            {
                title: "Doporučení",
                content: "Doporučen klidový režim po dobu 3 dnů, omezení sezení a fyzické zátěže. Aplikace suchého tepla na bolestivou oblast 2x denně po dobu 20 minut. Po odeznění akutních obtíží zahájit rehabilitaci – posílit břišní a zádové svalstvo. Nácvik správného způsobu zvedání břemen a držení těla."
            },
            {
                title: "Prognóza",
                content: "Při dodržení léčebného režimu předpokládáno zlepšení stavu do 2 týdnů s postupným návratem k běžným aktivitám. Riziko recidivy lze snížit pravidelným cvičením a úpravou ergonomie pracovního prostředí."
            },
            {
                title: "Kontrola",
                content: "Kontrolní vyšetření za 10 dní. V případě zhoršení stavu nebo objevení se nových příznaků (brnění končetin, porucha močení, slabost končetin) nutná okamžitá kontrola. Výsledky RTG vyšetření budou k dispozici do 3 pracovních dnů."
            }
        ];
        
        // Create a clipboard object to store copied content
        const clipboard = {
            content: null,
            hasContent: function() {
                return this.content !== null;
            }
        };
        
        // Create status banner for notifications
        const statusBanner = document.createElement('div');
        statusBanner.className = 'status-banner';
        statusBanner.textContent = '';
        document.body.appendChild(statusBanner);
        
        // Function to show status message
        function showStatus(message, icon = 'fa-info-circle') {
            statusBanner.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
            statusBanner.classList.add('active');
            setTimeout(() => {
                statusBanner.classList.remove('active');
            }, 2000);
        }
        
        // Variables to track edit mode
        let globalEditMode = false;
        let pendingChanges = {};
        let originalContents = {};
        
        // Create the medical report as a full page layout
        reportOverlay.innerHTML = `
            <div class="medical-report-modal">
                <div class="report-header">
                    <h2>Lékařská zpráva - ${visit.title}</h2>
                    <div class="report-header-actions">
                        <button class="toggle-edit-mode-btn" title="Editovat celou zprávu">
                            <i class="fas fa-edit"></i> <span>Editovat zprávu</span>
                        </button>
                        <button class="back-to-app-btn" title="Zpět do aplikace">
                            <i class="fas fa-arrow-left"></i> <span>Zpět</span>
                        </button>
                    </div>
                </div>
                
                <div class="global-edit-toolbar" style="display: none;">
                    <div class="format-buttons-container">
                        <button class="format-btn" data-format="bold" title="Bold">
                            <i class="fas fa-bold"></i>
                        </button>
                        <button class="format-btn" data-format="italic" title="Italic">
                            <i class="fas fa-italic"></i>
                        </button>
                        <button class="format-btn" data-format="underline" title="Underline">
                            <i class="fas fa-underline"></i>
                        </button>
                        <div class="toolbar-separator"></div>
                        <button class="format-btn" data-format="list" value="bullet" title="Bullet List">
                            <i class="fas fa-list-ul"></i>
                        </button>
                        <button class="format-btn" data-format="list" value="ordered" title="Numbered List">
                            <i class="fas fa-list-ol"></i>
                        </button>
                        <div class="toolbar-separator"></div>
                        <button class="format-btn copy-btn" title="Copy Selected Text">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="format-btn paste-btn" title="Paste Text" ${clipboard.hasContent() ? '' : 'disabled'}>
                            <i class="fas fa-paste"></i>
                        </button>
                    </div>
                    <div class="toolbar-actions">
                        <button class="cancel-all-btn">
                            <i class="fas fa-times"></i> Zrušit změny
                        </button>
                        <button class="save-all-btn">
                            <i class="fas fa-check"></i> Uložit vše
                        </button>
                    </div>
                </div>
                
                <div class="report-content">
                    <div class="report-section">
                        <p><strong>Datum vyšetření:</strong> ${formattedDate}</p>
                        <p><strong>Čas vyšetření:</strong> ${visit.time}</p>
                        <p><strong>Trvání:</strong> ${visit.duration} minut</p>
                    </div>
                    
                    ${reportSections.map(section => `
                        <div class="report-section" id="${createSectionId(section.title)}">
                            <div class="section-header">
                                <h3 class="report-section-title">${section.title}</h3>
                                <button class="edit-section-btn" data-section="${createSectionId(section.title)}">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                            <div class="report-section-content" data-section="${createSectionId(section.title)}">
                                <p>${section.content}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="report-footer">
                    <button class="report-print-btn">
                        <i class="fas fa-print"></i>
                        Vytisknout zprávu
                    </button>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(reportOverlay);
        
        // Prevent scrolling on the body
        document.body.style.overflow = 'hidden';
        
        // Make the global edit toolbar sticky when scrolling
        const globalToolbar = reportOverlay.querySelector('.global-edit-toolbar');
        const reportContent = reportOverlay.querySelector('.report-content');
        
        reportContent.addEventListener('scroll', function() {
            if (reportContent.scrollTop > 10) {
                globalToolbar.classList.add('sticky');
            } else {
                globalToolbar.classList.remove('sticky');
            }
        });
        
        // Back button functionality (instead of close)
        const backBtn = reportOverlay.querySelector('.back-to-app-btn');
        backBtn.addEventListener('click', () => {
            // Check if there are unsaved changes
            if (Object.keys(pendingChanges).length > 0) {
                if (confirm('Máte neuložené změny. Opravdu chcete zavřít zprávu?')) {
                    reportOverlay.remove();
                    statusBanner.remove();
                    document.body.style.overflow = ''; // Restore scrolling
                }
            } else {
                reportOverlay.remove();
                statusBanner.remove();
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
        
        // Add print button functionality
        const printBtn = reportOverlay.querySelector('.report-print-btn');
        printBtn.addEventListener('click', () => {
            window.print();
        });
        
        // Function to disable all edit buttons except the current one
        function disableOtherEditButtons(currentSectionId) {
            const editButtons = reportOverlay.querySelectorAll('.edit-section-btn');
            editButtons.forEach(btn => {
                if (btn.dataset.section !== currentSectionId) {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                }
            });
        }
        
        // Function to enable all edit buttons
        function enableAllEditButtons() {
            const editButtons = reportOverlay.querySelectorAll('.edit-section-btn');
            editButtons.forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            });
        }
        
        // Add edit button functionality for individual section editing
        reportOverlay.querySelectorAll('.edit-section-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // If we're in global edit mode, don't do individual section editing
                if (globalEditMode) return;
                
                const sectionId = this.dataset.section;
                const section = document.getElementById(sectionId);
                const sectionContent = section.querySelector('.report-section-content');
                
                // Only make editable if not already in edit mode
                if (!section.classList.contains('editing')) {
                    // Disable other edit buttons to enforce single section editing
                    disableOtherEditButtons(sectionId);
                    makeEditable(sectionContent, section);
                }
            });
        });
        
        // Toggle global edit mode button
        const toggleEditModeBtn = reportOverlay.querySelector('.toggle-edit-mode-btn');
        toggleEditModeBtn.addEventListener('click', function() {
            if (globalEditMode) {
                // Exit global edit mode
                exitGlobalEditMode();
            } else {
                // Enter global edit mode
                enterGlobalEditMode();
            }
        });
        
        // Enter global edit mode
        function enterGlobalEditMode() {
            globalEditMode = true;
            
            // Update UI
            toggleEditModeBtn.innerHTML = '<i class="fas fa-times"></i> <span>Zrušit editaci</span>';
            toggleEditModeBtn.classList.add('active');
            
            // Show global toolbar and actions
            reportOverlay.querySelector('.global-edit-toolbar').style.display = 'block';
            reportOverlay.querySelector('.global-edit-actions').style.display = 'flex';
            
            // Hide individual edit buttons
            reportOverlay.querySelectorAll('.edit-section-btn').forEach(btn => {
                btn.style.display = 'none';
            });
            
            // Hide print button during edit mode
            reportOverlay.querySelector('.report-print-btn').style.display = 'none';
            
            // Make all sections editable
            reportOverlay.querySelectorAll('.report-section-content').forEach(sectionContent => {
                const sectionId = sectionContent.dataset.section;
                if (sectionId) { // Skip info section at the top
                    const section = document.getElementById(sectionId);
                    
                    // Store original content
                    originalContents[sectionId] = sectionContent.innerHTML;
                    
                    // Create editor for this section
                    makeEditableGlobal(sectionContent, section);
                }
            });
            
            showStatus('Editační režim aktivován', 'fa-edit');
        }
        
        // Exit global edit mode
        function exitGlobalEditMode() {
            // Ask for confirmation if there are pending changes
            if (Object.keys(pendingChanges).length > 0) {
                if (!confirm('Máte neuložené změny. Opravdu chcete ukončit editační režim?')) {
                    return;
                }
            }
            
            globalEditMode = false;
            
            // Update UI
            toggleEditModeBtn.innerHTML = '<i class="fas fa-edit"></i> <span>Editovat zprávu</span>';
            toggleEditModeBtn.classList.remove('active');
            
            // Hide global toolbar and actions
            reportOverlay.querySelector('.global-edit-toolbar').style.display = 'none';
            reportOverlay.querySelector('.global-edit-actions').style.display = 'none';
            
            // Show individual edit buttons
            reportOverlay.querySelectorAll('.edit-section-btn').forEach(btn => {
                btn.style.display = 'block';
            });
            
            // Show print button again
            reportOverlay.querySelector('.report-print-btn').style.display = 'block';
            
            // Reset all sections to original content
            reportOverlay.querySelectorAll('.report-section-content').forEach(sectionContent => {
                const sectionId = sectionContent.dataset.section;
                if (sectionId && originalContents[sectionId]) {
                    sectionContent.innerHTML = originalContents[sectionId];
                    
                    const section = document.getElementById(sectionId);
                    section.classList.remove('editing');
                }
            });
            
            // Clear pending changes
            pendingChanges = {};
            
            showStatus('Editační režim ukončen', 'fa-times');
        }
        
        // Add save all button functionality
        const saveAllBtn = reportOverlay.querySelector('.save-all-btn');
        saveAllBtn.addEventListener('click', function() {
            // Save all changes
            Object.keys(pendingChanges).forEach(sectionId => {
                const section = document.getElementById(sectionId);
                const sectionContent = section.querySelector('.report-section-content');
                sectionContent.innerHTML = pendingChanges[sectionId];
            });
            
            // Exit global edit mode
            exitGlobalEditMode();
            
            showStatus('Všechny změny byly uloženy', 'fa-check');
        });
        
        // Add cancel all button functionality
        const cancelAllBtn = reportOverlay.querySelector('.cancel-all-btn');
        cancelAllBtn.addEventListener('click', function() {
            // Ask for confirmation if there are pending changes
            if (Object.keys(pendingChanges).length > 0) {
                if (confirm('Opravdu chcete zrušit všechny změny?')) {
                    exitGlobalEditMode();
                }
            } else {
                exitGlobalEditMode();
            }
        });
        
        // Function to make a section editable in global mode
        function makeEditableGlobal(sectionElement, sectionContainer) {
            // Mark section as in editing mode
            sectionContainer.classList.add('editing');
            
            // Initialize Quill editor directly
            const quill = new Quill(sectionElement, {
                modules: {
                    toolbar: false  // We're using the global toolbar
                },
                theme: 'snow'
            });
            
            // Store the Quill instance on the section for later reference
            sectionContainer.quill = quill;
            
            // Set up the global toolbar to control the active Quill editor
            setupGlobalToolbar(quill);
            
            // Listen for changes and store them in pendingChanges
            quill.on('text-change', function() {
                pendingChanges[sectionContainer.id] = quill.root.innerHTML;
            });
        }
        
        // Function to set up the global toolbar
        function setupGlobalToolbar(activeQuill) {
            const toolbar = reportOverlay.querySelector('.global-edit-toolbar .format-buttons-container');
            
            // Handle formatting buttons
            toolbar.querySelectorAll('.format-btn:not(.copy-btn):not(.paste-btn)').forEach(button => {
                button.onclick = function() {
                    const format = this.getAttribute('data-format');
                    const value = this.getAttribute('value') || true;
                    
                    // Find the Quill instance that's currently focused
                    let focusedQuill = activeQuill;
                    reportOverlay.querySelectorAll('.report-section').forEach(section => {
                        if (section.quill && section.quill.hasFocus()) {
                            focusedQuill = section.quill;
                        }
                    });
                    
                    if (focusedQuill) {
                        if (format === 'list') {
                            focusedQuill.format('list', value);
                        } else {
                            focusedQuill.format(format, !focusedQuill.getFormat()[format]);
                        }
                        
                        // Update active state visually
                        if (format !== 'list') {
                            this.classList.toggle('active', focusedQuill.getFormat()[format]);
                        }
                    }
                };
            });
            
            // Handle copy button
            const copyBtn = toolbar.querySelector('.copy-btn');
            copyBtn.onclick = function() {
                let focusedQuill = null;
                reportOverlay.querySelectorAll('.report-section').forEach(section => {
                    if (section.quill && section.quill.hasFocus()) {
                        focusedQuill = section.quill;
                    }
                });
                
                if (focusedQuill && focusedQuill.getSelection()) {
                    const range = focusedQuill.getSelection();
                    if (range.length > 0) {
                        const text = focusedQuill.getText(range.index, range.length);
                        clipboard.content = text;
                        showStatus('Text byl zkopírován do schránky', 'fa-copy');
                        
                        // Enable paste buttons
                        document.querySelectorAll('.paste-btn').forEach(btn => {
                            btn.removeAttribute('disabled');
                        });
                    }
                }
            };
            
            // Handle paste button
            const pasteBtn = toolbar.querySelector('.paste-btn');
            pasteBtn.onclick = function() {
                if (clipboard.hasContent()) {
                    let focusedQuill = null;
                    reportOverlay.querySelectorAll('.report-section').forEach(section => {
                        if (section.quill && section.quill.hasFocus()) {
                            focusedQuill = section.quill;
                        }
                    });
                    
                    if (focusedQuill) {
                        const range = focusedQuill.getSelection() || { index: focusedQuill.getLength(), length: 0 };
                        focusedQuill.insertText(range.index, clipboard.content);
                        showStatus('Text byl vložen ze schránky', 'fa-paste');
                    }
                }
            };
        }
        
        // Function to make an individual section editable
        function makeEditable(sectionElement, sectionContainer) {
            // Mark section as in editing mode
            sectionContainer.classList.add('editing');
            
            // Store original content
            const originalContent = sectionElement.innerHTML;
            
            // Create editor container
            const editorContainer = document.createElement('div');
            editorContainer.className = 'editor-container';
            
            // Create toolbar
            const toolbar = document.createElement('div');
            toolbar.className = 'editor-toolbar';
            toolbar.innerHTML = `
                <div class="format-buttons-container">
                    <button class="format-btn" data-format="bold" title="Bold">
                        <i class="fas fa-bold"></i>
                    </button>
                    <button class="format-btn" data-format="italic" title="Italic">
                        <i class="fas fa-italic"></i>
                    </button>
                    <button class="format-btn" data-format="underline" title="Underline">
                        <i class="fas fa-underline"></i>
                    </button>
                    <div class="toolbar-separator"></div>
                    <button class="format-btn" data-format="list" value="bullet" title="Bullet List">
                        <i class="fas fa-list-ul"></i>
                    </button>
                    <button class="format-btn" data-format="list" value="ordered" title="Numbered List">
                        <i class="fas fa-list-ol"></i>
                    </button>
                    <div class="toolbar-separator"></div>
                    <button class="format-btn copy-btn" title="Copy Section">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="format-btn paste-btn" title="Paste Section" ${clipboard.hasContent() ? '' : 'disabled'}>
                        <i class="fas fa-paste"></i>
                    </button>
                </div>
                <div class="editor-actions">
                    <button class="cancel-btn" title="Cancel">
                        <i class="fas fa-times"></i> Zrušit
                    </button>
                    <button class="save-btn" title="Save">
                        <i class="fas fa-check"></i> Uložit
                    </button>
                </div>
            `;
            
            // Create editor area
            const editorArea = document.createElement('div');
            editorArea.className = 'editor-area';
            
            // Add toolbar and editor to the container
            editorContainer.appendChild(toolbar);
            editorContainer.appendChild(editorArea);
            
            // Replace content with editor
            sectionElement.innerHTML = '';
            sectionElement.appendChild(editorContainer);
            
            // Add toolbar to document body to be fixed
            document.body.appendChild(toolbar);
            
            // Initialize Quill
            const quill = new Quill(editorArea, {
                modules: {
                    toolbar: false  // We're using our custom toolbar
                },
                theme: 'snow'
            });
            
            // Set content in Quill
            quill.clipboard.dangerouslyPasteHTML(originalContent);
            
            // Add scrollIntoView to make sure the editor is visible
            setTimeout(() => {
                sectionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            
            // Update toolbar position for mobile
            function updateToolbarPosition() {
                const headerHeight = document.querySelector('.report-header').offsetHeight;
                toolbar.style.top = `${headerHeight}px`;
            }
            
            // Call initially and on resize
            updateToolbarPosition();
            window.addEventListener('resize', updateToolbarPosition);
            
            // Handle toolbar button clicks
            const buttons = toolbar.querySelectorAll('.format-btn:not(.copy-btn):not(.paste-btn)');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    const format = this.getAttribute('data-format');
                    const value = this.getAttribute('value') || true;
                    
                    if (format === 'list') {
                        quill.format('list', value);
                    } else {
                        quill.format(format, !quill.getFormat()[format]);
                    }
                    
                    // Update active state visually
                    if (format !== 'list') {
                        this.classList.toggle('active', quill.getFormat()[format]);
                    }
                });
            });
            
            // Handle copy button
            const copyBtn = toolbar.querySelector('.copy-btn');
            copyBtn.addEventListener('click', function() {
                clipboard.content = quill.root.innerHTML;
                showStatus('Obsah byl zkopírován do schránky', 'fa-copy');
                
                // Enable all paste buttons
                document.querySelectorAll('.paste-btn').forEach(btn => {
                    btn.removeAttribute('disabled');
                });
            });
            
            // Handle paste button
            const pasteBtn = toolbar.querySelector('.paste-btn');
            pasteBtn.addEventListener('click', function() {
                if (clipboard.hasContent()) {
                    quill.clipboard.dangerouslyPasteHTML(clipboard.content);
                    showStatus('Obsah byl vložen ze schránky', 'fa-paste');
                }
            });
            
            // Handle save button
            const saveBtn = toolbar.querySelector('.save-btn');
            saveBtn.addEventListener('click', function() {
                // Get the HTML content from Quill
                const newContent = quill.root.innerHTML;
                
                // Replace the editor with the updated content
                sectionElement.innerHTML = newContent;
                
                // Mark the section as not editing
                sectionContainer.classList.remove('editing');
                
                // Remove the toolbar
                toolbar.remove();
                
                // Clean up resize listener
                window.removeEventListener('resize', updateToolbarPosition);
                
                // Enable all edit buttons again
                enableAllEditButtons();
                
                showStatus('Změny byly uloženy', 'fa-check');
            });
            
            // Handle cancel button
            const cancelBtn = toolbar.querySelector('.cancel-btn');
            cancelBtn.addEventListener('click', function() {
                // Restore original content
                sectionElement.innerHTML = originalContent;
                
                // Mark the section as not editing
                sectionContainer.classList.remove('editing');
                
                // Remove the toolbar
                toolbar.remove();
                
                // Clean up resize listener
                window.removeEventListener('resize', updateToolbarPosition);
                
                // Enable all edit buttons again
                enableAllEditButtons();
                
                showStatus('Úpravy byly zrušeny', 'fa-times');
            });
            
            // Focus the editor
            quill.focus();
        }
        
        // Handle keydown events for ESC key to close the report
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Check if we're in edit mode
                if (globalEditMode || document.querySelector('.report-section.editing')) {
                    // Ask for confirmation
                    if (confirm('Máte neuložené změny. Opravdu chcete zavřít zprávu?')) {
                        reportOverlay.remove();
                        statusBanner.remove();
                        document.body.style.overflow = ''; // Restore scrolling
                    }
                } else {
                    reportOverlay.remove();
                    statusBanner.remove();
                    document.body.style.overflow = ''; // Restore scrolling
                }
            }
        });
    }
}); 