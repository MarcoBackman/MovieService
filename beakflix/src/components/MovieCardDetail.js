import '../stylesheet/MovieDetailPanel.css';

function setRatingArray(actualRate) {
    let starArray = [];
    let intRateOutOfFive = parseInt(actualRate / 2);

    for (let i = 0; i < 5; i++) {
        if (intRateOutOfFive > 0) {
            starArray.push(<i className="fas fa-star star checked"></i>);
        } else {
            starArray.push(<i className="fas fa-star star"></i>);
        }
        intRateOutOfFive--;
    }
    return starArray;
}

function MovieCardDetail(props) {
    let setDetailsShown = props.setDetailsShown;
    let fontSize = "36px";

    function closeDetailWindow() {
        setDetailsShown(false);
    }

    if (props.data.title.length > 55) {
        fontSize = "12px";
    } else if (props.data.title.length > 40) {
        fontSize = "18px";
    } else if (props.data.title.length > 25) {
        fontSize = "25px";
    } else if (props.data.title.length > 17) {
        fontSize = "32px";
    }

    return (
        <div className="movie-detail-panel">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"/>
            <button type="button" className="close_button" name="close_detail"
                    onClick={closeDetailWindow}>
            </button>
            <img className="movie_img_detail"
                 src={props.data.image_url.replace("http", "https")}
                 onError={(e) => {
                     e.target.onerror = null;
                     e.target.src = './movie.jpg'
                 }} alt={""}>
            </img>
            <div className="detail_description_section">
                <div className="movie_title_detail" style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    <p style={{
                        flexWrap: 'wrap',
                        'word-wrap': 'break-word',
                        'font-size': fontSize
                    }}>{props.data.title}</p>
                </div>
                <p className="rating-detail">{setRatingArray(props.data.rating)}</p>
                <p>Demo - this is description template.</p>
            </div>
        </div>
    );
}

export default MovieCardDetail;