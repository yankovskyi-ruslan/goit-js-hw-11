import axios, { AxiosError } from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class NewsApiService {
    
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    async fetchImage() {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '33113304-1503eb1d54d535b5e4ee2a314';
    const params = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';
    const quantityImg = 40;
        
        try {
            const response = await axios.get(`${BASE_URL}?key=${KEY}&q=${this.searchQuery}&${params}&per_page=${quantityImg}&page=${this.page}`);
            // console.log('response', response)
            const data = response.data;
            // console.log(data);
           
            if (data.total === 0) {
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            }

            else if (this.page === 1) {
                Notify.success(`Hooray! We found ${data.totalHits} images.`);
            }
                                      
            this.page += 1;
            // console.log(this.page);
            return data;
            
        } catch (err) {
            console.error(err)
        }
    }
    
    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }
    
    set query(newQuery) {
        this.searchQuery = newQuery;
    }    
}