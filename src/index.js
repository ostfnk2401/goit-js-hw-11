import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from "notiflix";
import axios from "axios";

const searchForm = document.getElementById('search-form');
const searchQuery = document.querySelector('[name="searchQuery"]');
const resultsContainer = document.getElementById('results-container');

const lightbox = new SimpleLightbox('.card a', {});

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const apiKey = '34743678-8f2fe0b7f9199ad98c83caeae';
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery.value}&image_type=photo&orientation=horizontal&safesearch=true`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  if (data.hits.length === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  let html = '';

  data.hits.forEach((image) => {
    const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;

    html += `
      <div class="card">
        <a href="${largeImageURL}" data-lity>
          <img src="${webformatURL}" alt="${tags}" width="450" height="270" />
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
  
  resultsContainer.innerHTML = '';
  resultsContainer.insertAdjacentHTML('beforeend', html);

  lightbox.refresh();

  Notify.success(`Found ${data.hits.length} images for "${searchQuery.value}"`);
});
const loadMore = async () => {
    if (fetchingData) return;
    fetchingData = true;
    page++;
}