// Song detail page JavaScript
console.log('External song-detail.js loaded!');

// Initialize when DOM is ready
(function() {
  function initializePage() {
    console.log('initializePage called');
    
    // Check if we're on a song detail page by looking for required elements
    const loadingContainer = document.getElementById('loading-container');
    const errorContainer = document.getElementById('error-container');
    const songContainer = document.getElementById('song-container');
    const errorMessage = document.getElementById('error-message');

    // If the required elements don't exist, this isn't a song detail page - exit early
    if (!loadingContainer || !errorContainer || !songContainer || !errorMessage) {
      console.log('Not a song detail page, skipping initialization');
      return;
    }

    console.log('DOM elements found:', {
      loadingContainer: !!loadingContainer,
      errorContainer: !!errorContainer,
      songContainer: !!songContainer,
      errorMessage: !!errorMessage
    });

    // Get song ID from URL path
    const pathParts = window.location.pathname.split('/');
    const songId = pathParts[pathParts.length - 1];
    
    console.log('Song ID from URL:', songId);
    console.log('Current URL:', window.location.pathname);

    function loadSongDetails() {
      console.log('loadSongDetails called with songId:', songId);
      const apiUrl = `/api/song/${songId}`;
      console.log('Fetching from URL:', apiUrl);
      
      fetch(apiUrl)
        .then(response => {
          console.log('API Response status:', response.status);
          console.log('API Response ok:', response.ok);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(song => {
          console.log('Song data received:', song);
          
          if (song.error) {
            throw new Error(song.error);
          }
          
          populateSongDetails(song);
          
          // Hide loading, show content
          loadingContainer.classList.add('d-none');
          songContainer.classList.remove('d-none');
        })
        .catch(error => {
          console.error('Error loading song:', error);
          showError(error.message || 'Failed to load song details');
        });
    }

    function populateSongDetails(song) {
      console.log('populateSongDetails called with:', song);
      
      // Check if all required elements exist before proceeding
      const requiredElements = [
        'rank-number', 'song-title', 'channel-name', 'song-views', 
        'song-duration', 'song-followers', 'views-large', 'duration-large', 
        'followers-large', 'song-full-title', 'category-badge'
      ];
      
      const missingElements = requiredElements.filter(id => !document.getElementById(id));
      if (missingElements.length > 0) {
        console.error('Missing required DOM elements:', missingElements);
        showError('Page structure is incomplete. Missing elements: ' + missingElements.join(', '));
        return;
      }
      
      // Basic information
      console.log('Setting basic info...');
      document.getElementById('rank-number').textContent = song.rank || 'N/A';
      document.getElementById('song-title').textContent = song.title || 'Unknown Title';
      document.getElementById('channel-name').textContent = song.channel || 'Unknown Channel';
      document.getElementById('song-views').textContent = song.views || 'N/A';
      document.getElementById('song-duration').textContent = song.duration || 'N/A';
      document.getElementById('song-followers').textContent = song.followers || 'N/A';
      
      // Large stats
      console.log('Setting large stats...');
      document.getElementById('views-large').textContent = song.views || 'N/A';
      document.getElementById('duration-large').textContent = song.duration || 'N/A';
      document.getElementById('followers-large').textContent = song.followers || 'N/A';

      // Detailed information
      console.log('Setting detailed info...');
      document.getElementById('song-full-title').textContent = song.title || 'Unknown Title';
      document.getElementById('category-badge').textContent = song.category || 'Music';

      // Channel link
      if (song.channelUrl) {
        document.getElementById('channel-link').href = song.channelUrl;
        document.getElementById('channel-url-container').classList.remove('d-none');
      } else {
        document.getElementById('channel-url-container').classList.add('d-none');
      }

      // Description
      renderDescription(song.description);

      // Tags
      renderTags(song.tags);

      // Navigation
      setupNavigation(parseInt(song.rank) || 1);

      // Update page title
      document.title = `${song.title || 'Unknown'} - ${song.channel || 'Unknown'} | Song Details`;
    }

    function renderDescription(description) {
      const descContainer = document.getElementById('song-description');
      const toggleBtn = document.getElementById('toggle-description');
      const descCard = document.getElementById('description-card');
      
      // Check if required elements exist
      if (!descContainer || !descCard) {
        console.log('Description elements not found, skipping description rendering');
        return;
      }
      
      if (!description) {
        descCard.classList.add('d-none');
        return;
      }

      const formattedDesc = formatDescription(description);
      
      if (formattedDesc.length > 500) {
        const shortDesc = formattedDesc.substring(0, 500) + '...';
        descContainer.innerHTML = shortDesc;
        toggleBtn.classList.remove('d-none');
        
        let isExpanded = false;
        toggleBtn.onclick = function() {
          if (isExpanded) {
            descContainer.innerHTML = shortDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-down me-1"></i>Show More';
          } else {
            descContainer.innerHTML = formattedDesc;
            toggleBtn.innerHTML = '<i class="bi bi-chevron-up me-1"></i>Show Less';
          }
          isExpanded = !isExpanded;
        };
      } else {
        descContainer.innerHTML = formattedDesc;
      }
    }

    function formatDescription(description) {
      // Escape HTML to prevent XSS
      const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };
      
      const escaped = escapeHtml(description);
      
      // Convert URLs to clickable links (after escaping)
      return escaped.replace(/https?:\/\/[^\s\n]+/g, function(url) {
        // Re-escape the URL for the href attribute
        const safeUrl = url.replace(/"/g, '&quot;');
        return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="text-primary text-decoration-none">${escapeHtml(url)} <i class="bi bi-box-arrow-up-right small"></i></a>`;
      }).replace(/\n/g, '<br>');
    }

    function renderTags(tags) {
      const tagsContainer = document.getElementById('song-tags');
      const tagsCard = document.getElementById('tags-card');
      
      // Check if required elements exist
      if (!tagsContainer || !tagsCard) {
        console.log('Tags elements not found, skipping tags rendering');
        return;
      }
      
      if (!tags) {
        tagsCard.classList.add('d-none');
        return;
      }

      const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      if (tagList.length === 0) {
        tagsCard.classList.add('d-none');
        return;
      }

      // Escape HTML in tags to prevent XSS
      const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };

      tagsContainer.innerHTML = tagList.map(tag => 
        `<span class="badge bg-light text-dark border">${escapeHtml(tag)}</span>`
      ).join('');
    }

    function setupNavigation(currentRank) {
      const prevBtn = document.getElementById('prev-song');
      const nextBtn = document.getElementById('next-song');

      // Check if navigation elements exist
      if (!prevBtn || !nextBtn) {
        console.log('Navigation elements not found, skipping navigation setup');
        return;
      }

      // Previous song
      if (currentRank > 1) {
        prevBtn.onclick = () => window.location.href = `/song/${currentRank - 1}`;
      } else {
        prevBtn.disabled = true;
      }

      // Next song (assuming max 100 songs)
      if (currentRank < 100) {
        nextBtn.onclick = () => window.location.href = `/song/${currentRank + 1}`;
      } else {
        nextBtn.disabled = true;
      }
    }

    function showError(message) {
      console.log('showError called with:', message);
      
      // Check if error elements exist
      const loadingContainer = document.getElementById('loading-container');
      const errorContainer = document.getElementById('error-container');
      const errorMessage = document.getElementById('error-message');
      
      if (!loadingContainer || !errorContainer || !errorMessage) {
        console.error('Error display elements not found, logging error only:', message);
        return;
      }
      
      loadingContainer.classList.add('d-none');
      errorMessage.textContent = message;
      errorContainer.classList.remove('d-none');
    }

    // Initialize
    loadSongDetails();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
  } else {
    initializePage();
  }
})();