let showSearchInput = document.querySelector(".searchOpen");
let hideSearchInput = document.querySelector("#searchClose");
let searchInput = document.querySelector("#search");
let showMore = document.querySelector('.showMore');
let lessMore = document.querySelector('.notRead');
let pageUrl = window.location.search;
let parameters = new URLSearchParams(pageUrl);
let movieDetailId = parameters.get('id');
let fav = JSON.parse(localStorage.getItem('favorites')) || {
    Search: []
}
let movieRank = JSON.parse(localStorage.getItem('movieRank')) || [];
const apiKey = 'd5b08408';

showSearchInput && showSearchInput.addEventListener("click", function () {
    searchInput.style.display = "block";
    hideSearchInput.style.display = "block";
});

hideSearchInput && hideSearchInput.addEventListener("click", function () {
    searchInput.style.display = "none";
    hideSearchInput.style.display = "none";
});

searchInput && searchInput.addEventListener('keydown', (e) => {
    let searchInputValue = searchInput.value
    let apiUrl = "http://www.omdbapi.com/?apikey=" + apiKey;
    if (e.keyCode == 13) {
        fetch(apiUrl + "&s=" + searchInputValue).then(function (response) {
            return response.json();
        }).then(function (data) {
            createMovie(data);
        }).catch(function () {
            document.querySelector('#movieListContainer').innerHTML += `<h3 class="errorResTitle">Movie not found!</h3>`;
            document.querySelector(".movieLengthTitle").style.display = "none";
        })
    }
});

showMore && showMore.addEventListener("click", function () {
    document.querySelector(".movieSummary").style.height = "100%";
    this.style.display = "none";
    lessMore.style.display = "block";
});

lessMore && lessMore.addEventListener("click", function () {
    document.querySelector(".movieSummary").style.height = "55px";
    this.style.display = "none";
    showMore.style.display = "block";
});

function createMovie(movieData) {
    document.querySelector('#movieListContainer').innerHTML = '';
    let movieLength = document.querySelector(".movieLength");
    let movieLengthTitle = document.querySelector(".movieLengthTitle");
    movieLengthTitle.style.display = "block";
    movieLength.innerHTML = movieData.Search.length;
    for (let i = 0; i < movieData.Search.length; i++) {
        let movieResponse = `
       <a href="detail.html?id=${movieData.Search[i].imdbID}" class="movieItem posRelative">
       <img src="${movieData.Search[i].Poster}"
           id="movieResultImage" alt="">
       <div class="movieDetails">
           <h2 class="movieTitle">${movieData.Search[i].Title}</h2>
       </div>
       <div class="mask">
           <span class="mask-text">${movieData.Search[i].Year}</span>
           </div>
       </div>
     </a>
       `
        document.querySelector('#movieListContainer').innerHTML += movieResponse;
    }
}

if (!pageUrl) {
    createMovie(fav);
}

function getDetails(movieId) {
    fetch('http://www.omdbapi.com/?i=' + movieId + '&apikey=' + apiKey).then(function (data) {
        return data.json();
    }).then(function (data) {
        favItem = {
            Title: data.Title,
            Poster: data.Poster,
            imdbID: data.imdbID,
            rank: data.rank
        }
        createDetails(data);
    });
}

function favorites(data) {
    fav.Search.push(data);
    localStorage.setItem('favorites', JSON.stringify(fav));
}


function createDetails(movieData) {
    let detailBanner = document.querySelector(".detailBanner")
    let detailVerticalBanner = document.querySelector(".detailVerticalBanner")
    let movieSummary = document.querySelector(".movieSummary")

    detailBanner && detailBanner.setAttribute("src", movieData.Poster);
    detailVerticalBanner && detailVerticalBanner.setAttribute("src", movieData.Poster);
    movieSummary && (movieSummary.innerText += movieData.Plot);

    let blogItem = document.querySelectorAll('.blogItem');
    blogItem.forEach(function (item) {
        item.querySelector(".blogImage").setAttribute("src", movieData.Poster);
        item.querySelector(".blogBigTitle").innerText = movieData.Title;
    })

    let detailMovieSliderItem = document.querySelectorAll(".SliderItem");
    detailMovieSliderItem.forEach(function (item) {
        item.setAttribute("src", movieData.Poster);
    })

}

let allstars = document.querySelectorAll('.fa-star');
allstars.forEach(star => {
    star.onclick = () => {
        let starlevel = star.getAttribute('data-num')
        let filteredFav = fav.Search.filter(function (item) {
            if (item.imdbID != movieDetailId) {
                return item
            }
        })
        movieRanksId = {
            imdbID: favItem.imdbID,
            rank: starlevel
        }
        fav.Search = filteredFav;
        favItem.rank = starlevel;
        movieRank.push(movieRanksId);
        localStorage.setItem('movieRank', JSON.stringify(movieRank));
        favorites(favItem);
        allstars.forEach(el => {
            if (starlevel < el.getAttribute('data-num')) {
                el.classList.remove('fas')
                el.classList.add('far')
            } else {
                el.classList.remove('far')
                el.classList.add('fas')
            }
        })
        getRank(movieRank);
    }
});

function getRank(data) {
    let filteredFav = movieRank.filter(function (item) {
        if (item.imdbID != movieDetailId) {
            return item
        }
    });
    movieRank = filteredFav;
    let star = document.querySelectorAll(".star");
    data.forEach(element => {
        if (element.imdbID == movieDetailId) {
            star.forEach(el => {
                if (element.rank < el.getAttribute('data-num')) {
                    el.classList.remove('fas')
                    el.classList.add('far')
                } else {
                    el.classList.remove('far')
                    el.classList.add('fas')
                }
            });
        }
    });
}

const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    slidesPerView: 3,
    loop: true,
  
  
    pagination: {
      el: '.swiper-pagination',
    },
  
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

getRank(movieRank);
getDetails(movieDetailId);