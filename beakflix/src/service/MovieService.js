import axios from "axios";

export const getGenreTypes = function() {
    return axios.get('/movie/getGenreTypes');
}

export const getMoviesByGenre = async function(genreType) {
    const form = {
        genre: genreType,
    };
    return await axios.get('/movie/getMoviesByGenre', { params : form});
}