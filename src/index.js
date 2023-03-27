import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from "notiflix";
import axios from "axios";

const searchForm = document.getElementById('search-form');
const searchQuery = document.querySelector('[name="searchQuery"]');
const resultsContainer = document.getElementById('results-container');
const loadMoreButton = document.querySelector('.load-more');

const apiKey = '34743678-8f2fe0b7f9199ad98c83caeae';
let page = 1;
const perPage = 40;
let currentQuery = '';
let totalHits = 0;
let fetchingData = false;
loadMoreButton.style.display = 'none';

const lightbox = new SimpleLightbox('.card a', {});

const fetchImages = async () => {
  fetchingData = true;
  loadMoreButton.disabled = true;

  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${currentQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  
  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    
    if (data.hits.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    totalHits = data.totalHits;

    let html = '';
    

    data.hits.forEach((image) => {
      const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;
        
      html += `
        <div class="card">
          <a href="${largeImageURL}" data-lity>
            <img src="${webformatURL}" alt="${tags}" width="100%" height="250"/>
          </a>
          <div class="card-info">
            <ul class="card-list">
              <li class="card-item"><span class="card-text">Likes</span> ${likes}</li>
              <li class="card-item"><span class="card-text">Views</span> ${views}</li>
              <li class="card-item"><span class="card-text">Comments</span> ${comments}</li>
              <li class="card-item"><span class="card-text">Downloads</span> ${downloads}</li>
            </ul>
          </div>
        </div>
      `;
    });
    
    resultsContainer.insertAdjacentHTML('beforeend', html);

    lightbox.refresh();

    Notify.success(`Found ${data.hits.length} images for "${currentQuery}"`);
    
    // Show/hide the "Load more" button
    if (data.hits.length < perPage || (page * perPage) >= totalHits) {
      loadMoreButton.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreButton.style.display = 'block';
    }

  } catch (error) {
    Notify.failure('Sorry, there was a problem fetching data. Please try again later.');
  }

  fetchingData = false;
  loadMoreButton.disabled = false;
};

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  currentQuery = searchQuery.value.trim();
  page = 1;
  resultsContainer.innerHTML = '';
  loadMoreButton.style.display = 'none'; 
  fetchImages();
});

loadMoreButton.addEventListener('click', () => {
  if (!fetchingData) {
    page += 1;
    fetchImages();
  }
});
