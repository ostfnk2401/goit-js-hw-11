import { Notify } from 'notiflix';

const searchForm = document.getElementById('search-form');
const searchInput = searchForm.elements['searchQuery'];

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (query === '') {
    Notify.failure('Please enter a search query.');
    return;
  }
//   const apiUrl = ;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.hits.length === 0) {
      Notify.warning('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    const images = data.hits;

    const html = images.map((image) => `
      <div class="card">
        <img src="${image.webformatURL}" alt="${image.tags}" />
        <div class="details">
          <span class="likes">${image.likes} likes</span>
          <span class="views">${image.views} views</span>
          <span class="downloads">${image.downloads} downloads</span>
        </div>
      </div>
    `).join('');

    const resultsContainer = document.getElementById('results-container');
    resultsContainer.insertAdjacentHTML('beforeend', html)
  } catch (error) {
    console.error(error);
    Notify.failure('Failed to fetch search results. Please try again later.');
  }
});
