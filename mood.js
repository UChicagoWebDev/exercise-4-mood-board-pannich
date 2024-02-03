// _reference_
// JS for each => : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function reqListener() {
  data = this.response;
  images = data["value"]; // array
  relatedsearches = data["relatedSearches"] //array
  console.log(relatedsearches);
  processImages(images);
  processSuggestions(relatedsearches);
}

function processImages(images) {
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  // Loop through the images and create elements for each image

  var resultsContainer = document.body.querySelector("#resultsImageContainer");

  let count = 0; // Initialize a counter

  images.forEach(imageData => {
    if (count >= 3) {
      return; // Exit the loop if count exceeds 3
    }

    const imageUrl = imageData["contentUrl"];

    // Create a new div element to hold the image
    const newResultImageDiv = document.createElement('div');
    newResultImageDiv.className = 'resultImage'; // Add a class if needed

    // Create an <img> element for each image
    const imageElement = document.createElement("img");
    // Set the 'src' attribute to the image URL
    imageElement.src = imageUrl;

    // Add a click event listener to the image element
    imageElement.addEventListener('click', handleImageClick);

    // Append the img element to the div element
    newResultImageDiv.appendChild(imageElement);

    // Append the image element to the #resultsImageContainer
    resultsContainer.appendChild(newResultImageDiv);

    count++;
  });
}

function handleImageClick(event) {
  // You can access the clicked image using event.target
  // use clickedImage.src to get the image URL
  const clickedImage = event.target;

  // Add your desired behavior here when an image is clicked
  // For example, you can open a modal or do anything you want
  var board = document.body.querySelector("#board");

  // Create element for each image
  var div = document.createElement("div");
  div.className = 'savedImage'; // Add a class
  var imageElement = document.createElement("img");

  imageElement.setAttribute("src", clickedImage.src);  // aka. "src", "https:...."
  div.appendChild(imageElement);
  board.appendChild(div);
}

function processSuggestions(relatedsearches) {
  let count = 0; // Initialize a counter
  var suggestPanel = document.body.querySelector(".suggestions ul");
  suggestPanel.innerHTML = ""; // clear previous result

  relatedsearches.forEach((relatedsearch) => {
    if (count >= 5) {
      return; // Exit the loop if count exceeds 3
    }
    var liElement = document.createElement("li");

    // Create a hidden input field
    var hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.value = relatedsearch["text"]; // Set the hidden value

    liElement.textContent = relatedsearch["displayText"]; // suggest to display
    liElement.addEventListener("click", handleSuggestionClick); // Add a click event listener
    liElement.appendChild(hiddenInput);

    suggestPanel.appendChild(liElement);

    count++;
  });
}

function handleSuggestionClick(event) {
  const clickedLi = event.target;

  // Find the hidden input element within the clicked <li> element
  const hiddenInput = clickedLi.querySelector('input[type="hidden"]');

  // Access the value of the hidden input
  const hiddenValue = hiddenInput.value;

  // Do something with the hidden value (e.g., display it or use it)
  runSearch(hiddenValue);
}

function clearResultsPane() {
  resultsPane = document.body.querySelector("#resultsImageContainer");
  resultsPane.innerHTML = '';
}

function runSearch(clickedText = "") {
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  // When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  // Clear the results pane before you run a new search

  clearResultsPane();

  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  let query= "";
  if (clickedText) {
    query = clickedText
  } else {
    query = document.getElementById('search-input').value;
  }

  let request = new XMLHttpRequest();
  const url = `${bing_api_endpoint}?q=${encodeURIComponent(query)}`; // Construct the request URL with the search query

  request.open("GET", url, true);

  request.responseType = "json";

  request.addEventListener("load", reqListener);

  // Set the API key in the request headers
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);

  request.send();

  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will run JS function
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});
