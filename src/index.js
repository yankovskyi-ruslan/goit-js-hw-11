import './css/style.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import NewsApiService from './api_service';

const form = document.querySelector('#search-form');
const btnLoadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

const newsApiService = new NewsApiService();

btnLoadMore.classList.add("is-hidden");
form.addEventListener('submit', onSearch);
btnLoadMore.addEventListener('click', onMoreImg);
const limit = 40;
let showImage = 1;
async function onSearch(evt) {
  evt.preventDefault();
  clearGalleryMarkup();
  
  newsApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
  showImage = 1;

  if (newsApiService.query === '') {
    return Notify.info('Please enter the query parameters.')  
  }
  btnLoadMore.classList.add("is-hidden");  
  
  newsApiService.resetPage();
  try {
    await newsApiService.fetchImage().then(data => {
      
      creatMarkup(data);
      
      if (data.hits.length === limit) {
      btnLoadMore.classList.remove("is-hidden");   
      }           
    })
  }
    catch (err) {
            console.error(err)
        }
}

async function onMoreImg() {  
  try { 
    await newsApiService.fetchImage().then(data => {
      creatMarkup(data);
     
      showImage += 1;  
      // console.log(showImage);
      let quantityShow = Math.floor(data.totalHits / limit);
      // console.log(quantityShow);
      if (showImage === quantityShow) {
        btnLoadMore.classList.add("is-hidden");
        Notify.warning("We're sorry, but you've reached the end of search results.");
        return;
      } 
    })

  }
  catch (err) {
            console.error(err)
        }
}
function clearGalleryMarkup() {
gallery.innerHTML = "";
}

function creatMarkup({ hits }) {
  const markup = hits.map(({
    largeImageURL,
    webformatURL,
    tags,
    likes,
    views,
    comments,
    downloads
  }) => {
    return `<div class="photo-card">
      <div><a href=${largeImageURL} class="gallery__link">
        <img src=${webformatURL} alt=${tags} class="gallery__image" loading="lazy"/></a>
    </div>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
}).join('');
  gallery.insertAdjacentHTML('beforeend', markup);


let galleryImg = new SimpleLightbox('.photo-card a', {
  captionDelay: 150,
  captionsData: 'alt'
});
galleryImg.refresh();
}