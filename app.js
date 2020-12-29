// Setting up the variables for the fetch function
const searchURL = 'https://developer.nps.gov/api/v1/parks'
const apiKey = 'ACeLTeztPgJDzdkTfTJ3imh1DAbdoMLmlYJ3a5PT'

// format the parameters for the query
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
};

// move the results into the ul
function displayResults(responseJson) {
    console.log(responseJson);
    $('#js-results-list').empty();
    $('.results').removeClass('hidden');
    for (let i = 0; i < responseJson.data.length; i++) {
        $('#js-results-list').append(`
      <li>
        <h3><a href='${responseJson.data[i].url}' target="_blank">${responseJson.data[i].fullName}</a></h3>
        <p>${responseJson.data[i].description}</p>
      </li>`)
    };
};

// query the API with the user input
function getParks(query, maxResults) {
    const params = {
        api_key: apiKey,
        q: query,
        limit: maxResults
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
};

// used for setting the max number of results
var maxResults = 0

// pass user input, or pass 10 if blank
function numResults() {
    var thing = $('#numberResults').val();
    if (thing > 0) {
        maxResults = thing;
    } else {
        maxResults = 10;
    };
};

// handle the submit with user data
function handleSubmit() {
    $('.parkSearchForm').submit(function(event) {
        event.preventDefault();
        numResults();
        var area = $('#states').val();
        getParks(area, maxResults);
    });
}

$(function() {
    handleSubmit();
});