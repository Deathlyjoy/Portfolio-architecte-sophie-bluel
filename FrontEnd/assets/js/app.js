// ---------- API ----------
const token = sessionStorage.accessToken;
// Function to get all the data from the database
async function dataBaseInfo(type) {
  const response = await fetch("http://localhost:5678/api/" + type);
  if (response.ok === true) {
    console.log("Connexion database : Successful");
    return response.json();
  } else {
    console.log("Error Connexion API : " + response.error);
  }
}
console.log(dataBaseInfo("works"));
console.log(dataBaseInfo("categories"));

// ---------- DOM Elements ----------
const gallery = document.getElementById("gallery");
const filters = document.getElementById("filters");
const logMode = document.getElementById("login");
const banner = document.querySelector(".edition");



// ---------- Variables ----------
const dataWorks = new Set();
const dataCategories = new Set();

// ---------- Initialisation ----------
async function init() {
  try {
    // Get all the data from the database and store it in a Set
    const works = await dataBaseInfo("works");
    const categories = await dataBaseInfo("categories");
    for (const work of works) {
      dataWorks.add(work);
    }
    for (const categorie of categories) {
      dataCategories.add(categorie);
    }

    // Display elements depending on the mode (login/logout)
    if (token) { // Admin Mode
      userInterface();


      // logOutUser(); // Allow the user to logout
    } else { // Visitor Mode
      displayFilterButton();
    }

    // Display the gallery
    displayGallery();
  } catch (error) {
    console.log(`Error Initialisation:  ${error}`);
  }
}
init()

// ---------- Display the gallery depending on the filter ----------
function displayGallery(filter = 0) {
  let filterData = dataWorks;
  console.log(filterData);

  // Check if a filter is selected
  if (filter != 0) {
    filterData = [...dataWorks].filter(work => work.categoryId == filter);
  }
  console.log(filter);

  // Clear the gallery
  gallery.innerHTML = "";

  // Generate the new filtered gallery
  for (const filterWork of filterData) {
    // Create Generic HTML Element project
    const work = filterWork;
    const project = document.createElement("figure"); 
    project.id = "project-" + work.id;

    // Add image to the project
    const imgProject = document.createElement("img");
    imgProject.src = work.imageUrl;
    imgProject.alt = work.title;
    project.appendChild(imgProject);

    // Add legend to the project
    const titleProject = document.createElement("figcaption");
    titleProject.textContent = work.title;
    project.appendChild(titleProject);

    // Attach project to the HTML element gallery
    gallery.appendChild(project);
  }
}

// ---------- Display the filter buttons ----------
function displayFilterButton() {
  const filterBar = document.createDocumentFragment(); // Create a fragment to add the buttons and to avoid reflow

  // Create button filter with the categorie "All"
  const filterAll = document.createElement("div");
  filterAll.classList.add("active");
  filterAll.classList.add("filter");
  filterAll.dataset.id = 0;
  filterAll.textContent = "Tous";
  filterBar.appendChild(filterAll);

  // Create button filter for each category in the database
  for (const categorie of dataCategories) {
    const filterButton = document.createElement("div");
    filterButton.classList.add("filter");
    filterButton.dataset.id = categorie.id;
    filterButton.textContent = categorie.name;
    filterBar.appendChild(filterButton);
  }

  // Attach filterBar to the HTML element filters
  filters.appendChild(filterBar);

  // Add event listener to filter works by category
  const buttonFilter = document.querySelectorAll(".filter");
  for (const button of buttonFilter) {
    button.addEventListener("click", (e) => {
      const clickedButton = e.target;
      const categoryId = parseInt(clickedButton.dataset.id);

      // Generate works depending on the selected filter
      displayGallery(categoryId);

      // Delete class "active" on the previous button selected
      document.querySelector(".active").classList.remove("active");

      // Add class "active" on the new button selected
      clickedButton.classList.add("active");
    });
  }
}

// ---------- Display the interface of the modal in edition mode ----------
function userInterface() {
  banner.style = "display : flex";
  logMode.textContent = "logout";
}