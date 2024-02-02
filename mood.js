const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function reqListener() {
  data = this.response;
  images = data["value"];
  console.log(images[0]["contentUrl"]);
  processImages(images);
}

function processImages(images) {
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  // Loop through the images and create elements for each image

  var resultsContainer = document.body.querySelector("#resultsImageContainer");

  let count = 0; // Initialize a counter

  images.forEach(function(imageData) {
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

  console.log(board);

  // Create element for each image
  var div = document.createElement("div");
  div.className = 'savedImage'; // Add a class
  var imageElement = document.createElement("img");

  imageElement.setAttribute("src", clickedImage.src);  // aka. "src", "https:...."
  div.appendChild(imageElement);
  board.appendChild(div);
}

function clearResultsPane() {
  resultsPane = document.body.querySelector("#resultsImageContainer");
  resultsPane.innerHTML = '';
}

function runSearch() {

  // TODO: Clear the results pane before you run a new search
  clearResultsPane();

  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.
  const query = document.getElementById('search-input').value;
  console.log(query)

  let request = new XMLHttpRequest();

  // Construct the request URL with the search query
  const url = `${bing_api_endpoint}?q=${encodeURIComponent(query)}`;

  request.open("GET", url, true);

  // Set the response type to JSON
  request.responseType = "json";

  request.addEventListener("load", reqListener);

  // Set the API key in the request headers
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);

  request.send();

  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //
  // request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);

  // TODO: Send the request


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

// This will
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});
