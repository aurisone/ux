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
    
    // Updated sample data with fixed random names
    const visits = [
        {
            id: 1,
            title: visitNames[0],
            date: todayStr,
            time: '09:30',
            duration: 45,
            imageCount: 2,
            notesCount: 3
        },
        {
            id: 2,
            title: visitNames[1],
            date: todayStr,
            time: '11:00',
            duration: 15,
            imageCount: 0,
            notesCount: 1
        },
        {
            id: 3,
            title: visitNames[2],
            date: yesterdayStr,
            time: '14:45',
            duration: 30,
            imageCount: 5,
            notesCount: 2
        },
        {
            id: 4,
            title: visitNames[3],
            date: yesterdayStr,
            time: '08:15',
            duration: 60,
            imageCount: 3,
            notesCount: 4
        },
        {
            id: 5,
            title: visitNames[4],
            date: '2023-05-02', 
            time: '13:30',
            duration: 45,
            imageCount: 1,
            notesCount: 2
        },
        {
            id: 6,
            title: visitNames[5],
            date: '2023-05-02',
            time: '16:00',
            duration: 10,
            imageCount: 0,
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
        imagesDetail.innerHTML = `<i class="far fa-images"></i> ${visit.imageCount}`;
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
                <div class="detail-section">
                    <h3>Fotografie (${visit.imageCount})</h3>
                    <div class="detail-images">
                        ${visit.imageCount > 0 ? 
                            Array(visit.imageCount).fill().map((_, i) => 
                                `<div class="image-placeholder"><i class="far fa-image"></i></div>`
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
                    }}
                ];
                
                menuItems.forEach(item => {
                    const menuItem = document.createElement('div');
                    menuItem.className = 'context-menu-item';
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
            { text: 'Smazat návštěvu', icon: 'fa-trash-alt', action: () => deleteVisit(visit) }
        ];
        
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'context-menu-item';
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
        const newName = prompt('Zadejte nový název návštěvy:', visit.title);
        if (newName && newName.trim() !== '') {
            // Update visit in the data
            visit.title = newName.trim();
            
            // Refresh the list to show the updated name
            populateVisitsList();
            
            console.log(`Visit ${visit.id} renamed to "${newName}"`);
        }
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
    document.getElementById('menu-btn').addEventListener('click', function() {
        console.log('Menu button clicked');
        // Here you would toggle a side navigation
    });

    document.getElementById('add-btn').addEventListener('click', function() {
        console.log('Add button in header clicked');
        showAddOptionsScreen();
    });
    
    // Add event listener for the big add visit button
    document.getElementById('add-visit-btn').addEventListener('click', function() {
        console.log('Add visit button clicked');
        showAddOptionsScreen();
    });
}); 