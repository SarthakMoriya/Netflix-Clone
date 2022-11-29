//Const
const apikey = "aa3dfc441aa4f971ae2c863886cbad47"
const apiEndpoint = "https://api.themoviedb.org/3"
const imgPath = "https://image.tmdb.org/t/p/original"
const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMovieList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}`,
    searchYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyCJPbPDk8N3YofOTCAaJ7mumT6iF4RE65g`

}
//Boots up the app


function init() {
    fetchTrendingMovies()
    fetchAndBuildAllSections()
}

function fetchTrendingMovies() {
    fetchAndBuildMovieSection(apiPaths.fetchTrending, 'Trending Now')
        .then(list => {
            const index = parseInt(Math.random() * list.length)
            buildBannerSection(list[index]);
        }).catch(err => console.log(err))

}

function buildBannerSection(movie) {
    const bannerCont = document.getElementById('banner-section')
    bannerCont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`

    const div = document.createElement('div');

    div.innerHTML = `
    <h2 class="banner-tittle">${movie.title}</h2>
    <p class="banner-info">Trending in movies | Released :${movie.release_date}</p>
    <p class="banner-overview">${movie.overview.length > 200 ? movie.overview.slice(0, 200).trim() + "..." : movie.overview}</p>
    <div class="action-buttons-cont">
        <button class="action-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg>&nbsp;
    Play
        </button>
        <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> &nbsp; More Info</button>

</div>`
    div.className = 'banner-content container';
    bannerCont.append(div);
}


function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories)
        .then(res => res.json())
        .then(res => {
            const category = res.genres

            if (Array.isArray(category) && category.length) {
                category.forEach(category =>
                    fetchAndBuildMovieSection(apiPaths.fetchMovieList(category.id), category.name,category))
            }
        }).catch(err => console.log(err))



}

function fetchAndBuildMovieSection(fetchUrl, categoryName,category) {
    // console.log(fetchUrl,category);

    return fetch(fetchUrl)
        .then(res => res.json())
        .then(res => {
            // console.log(res.results);

            const movies = res.results

            if (Array.isArray(movies) && movies.length) {
                buildMoviesSection(movies, categoryName,category)
            }
            // console.log(movies);
            // console.log(category.name);
            return movies
        })
        .catch(err => console.log(err))
}

function buildMoviesSection(list, categoryName,category) {
    // console.log(list);
    // console.log(category);
    const moviesCont = document.getElementById('movies-cont')

    const moviesListHTML = list.map((item) => {
        // console.log(item.genre_ids);
        const random=Math.floor(Math.random() * (13 - 18 + 1) + 16)
        const random1=Math.floor(Math.random() * (90 - 100 + 1) + 88)

        return `
        <div class="movie-item-box">
          <img class="movie-item movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" onclick="searchMovieTrailer('${item.title}')">
          <div class="movie-item-details">
            <div class="button-cont">
              <img src="./images/play.png" alt="" class="button-cont-img">
              <img src="./images/tick.png" alt="" class="button-cont-img">
              <img src="./images/like.png" alt="" class="button-cont-img">
            </div>
            <span class="ratings">${random1}% Match</span>
            <span>| Movie type</span>
            <div class="genre-cont">
              <div>${categoryName}</div>
              <div>${random}+</div>
            </div>
         </div>
        </div>
        
        `
        
    }).join('')
    // console.log(moviesListHTML);

    const moviesSectionHTML = `

       <h2 class="movies-section-heading">${categoryName}<span class="explore-nude">Explore Now>></span> </h2>
       <div class="movies-row">
        ${moviesListHTML}

</div>
    `
    const div = document.createElement('div');
    div.className = "movies-section";
    div.innerHTML = moviesSectionHTML;

    //Appending to movies container
    moviesCont.append(div);
    // console.log(div);
}

function searchMovieTrailer(movieName) {
    if (!movieName) return;

    fetch(apiPaths.searchYoutube(movieName))
        .then(res => res.json())
        .then(res => {
            const bestResult=res.items[0];
            const youtubeUrl=`https://www.youtube.com/watch?v=${bestResult.id.videoId}`
            // console.log(res);
        })
        .catch(err => console.log(err))
}

window.addEventListener('load', function () {
    init();
    // this.window.addEventListener('scroll', function () {
    //     const header = document.getElementById('header')
    //     if (window.scrollY > 5) header.classList.add('black-bg')
    //     else header.classList.remove('black-bg')
    // })
})
// init()