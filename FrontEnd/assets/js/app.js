// ---------- Connexion API ----------
const token = sessionStorage.getItem("accessToken");
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
const modalContainer = document.querySelector(".modalContainer");
const worksContainer = document.querySelector(`.worksContainer`);
const modal1 = document.querySelector(".modal1");
const modal2 = document.querySelector(".modal2");
const pushModal = document.querySelector(".btn-edit");
const upTitle = document.getElementById(`titre`);
const selectCategory = document.getElementById("categorie");
const submitButton = document.querySelector(".valid");

// ---------- Variables ----------
const dataWorks = new Set();
const dataCategories = new Set();
let file = "";


// ---------- Display the interface admin mode ----------
function editMode() {
  const banner = document.querySelector(".edition");
  const buttonEdit = document.querySelectorAll(".btn-edit");
  banner.style = "display : flex";
  logMode.innerText = "logout";
  // Add event for edit button
  for (const button of buttonEdit) {
    button.style = "display : flex";
    button.addEventListener("click", (e) => {
      modal1.style.display = `flex`;
      modalContainer.style = `display : flex`;
    });
  }
}

// ---------- Display the gallery of the modal in edition mode ----------
function showWorksInModal() {
  //Clear the modal
  worksContainer.innerHTML = "";
  // Create the gallery of the modal
  dataWorks.forEach((work) => {
    const figureModal = document.createElement(`figure`);
    const figureImgModal = document.createElement(`img`);
    const editButton = document.createElement(`button`);
    const delButton = document.createElement(`button`);
    // Get the data from the database
    figureModal.dataset.id = work.id;
    figureImgModal.src = work.imageUrl;
    figureImgModal.alt = work.title;
    editButton.innerText = `éditer`;
    editButton.classList.add(`editer`);
    delButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    delButton.classList.add(`delete`);
    // Add event for delete button
    delButton.addEventListener("click", async (e) => {
      const figure = e.target.closest("figure");
      const id = figure.dataset.id;
      const deleteCode = await confirmDelWork(id);
      // Check error
      switch (deleteCode) {
        case 204:
          figure.remove();
          const galleryFigure = document.querySelector("#project-" + id);
          galleryFigure.remove();
          // Clear image on the set
          for (const work of dataWorks) {
            if (work.id == id) {
              dataWorks.delete(work);
              break;
            }
          }
          break;
        case 401:
          alert("accès non autorisé");
          break;
        case 500:
          alert("problème de serveur, veuillez réesayez plus tard");
          break;
        case "abort":
          alert("opération annulé");
          break;
        default:
          alert("cas imprévu :" + deleteCode);
          break;
      }
    });

    worksContainer.appendChild(figureModal);
    figureModal.append(figureImgModal, editButton, delButton);
  });
}


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
      editMode();
      showWorksInModal();
      logOutUser();
      getSelectCategory();
      initAddModale();
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
    filterData = [...dataWorks].filter((work) => work.categoryId == filter);
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


// ---------- Modal ----------
// Display the modal
pushModal.addEventListener("click", () => {
  modalContainer.style = `display : flex`;
  modal1.style.display = `flex`;
});
// Toggle modal v1 to v2
function RedirectionModale() {
  const addWork = document.querySelector(".addWork");
  addWork.addEventListener("click", () => {
    modal1.style.display = `none`;
    modal2.style.display = "flex";
  });
  const closeModal1 = document.querySelector(`.closeModal1`);
  closeModal1.addEventListener("click", () => {
    modal2.style.display = `none`;
    modal1.style.display = `none`;
    modalContainer.style = `display : none`;
  });
  const closeModal2 = document.querySelector(`.closeModal2`);
  closeModal2.addEventListener("click", () => {
    modal2.style.display = `none`;
    modal1.style.display = `none`;
    modalContainer.style = `display : none`;
  });
}
if (modal2) {
  RedirectionModale();
  // Display Back Arrow
  const back = document.querySelector(`.back`);
  back.addEventListener("click", () => {
    modal1.style.display = `flex`;
    modal2.style.display = `none`;
  });
}

// --- Récupération dynamique des catégories pour ajout de projet ---
function getSelectCategory() {
  const selectCategory = document.getElementById("categorie");
  for (const categorie of dataCategories) {
    const option = document.createElement("option");
    option.textContent = categorie.name;
    option.value = categorie.id;
    selectCategory.appendChild(option);
  }
}

function initAddModale() {
  const img = document.querySelector("#uploadImg");
  const closeImg = document.querySelector("#closeImg i");
  const labelUpload = document.querySelector("#sendImg label");
  img.addEventListener("change", (e) => {
    let tempFile = e.target.files[0];
    const fileTypes = ["image/jpg", "image/png"];
    let testFormat = false;
    for (let i = 0; i < fileTypes.length; i++) {
      if (tempFile.type === fileTypes[i]) {
        testFormat = true;
      }
    }
    // Check if the format is authorized
    if (testFormat) {
      // Check if the image-size is authorized
      if (tempFile.size <= 1024 * 1024 * 1024) {
        const preview = document.querySelector("#preview");
        const imageUrl = URL.createObjectURL(tempFile);
        preview.src = imageUrl;
        file = tempFile;
        submitButton.style = `background : #1D6154`;
        closeImg.style = `display : flex`;
        labelUpload.style = `display : none`;
        closeImg.addEventListener("click", () => {
          labelUpload.style = `display : flex`;
          upTitle.value = "";
          uploadImg.files[0] = "";
          preview.src = "";
          file = "";
        });
      } else {
        return alert("taille incorrect 4mo max");
      }
    } else {
      return alert("ce format est incorrect PNJ/JPG attendu");
    }
  });

  // --- Request POST to send a new work ---
  submitButton.addEventListener("click", async (e) => {
    // Prevent the default behavior of the form
    e.preventDefault();
    // Create a new FormData object and add data into the form
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", upTitle.value);
    formData.append("category", selectCategory.value);
    // Check if the user has added an image and a title
    if (file != "" && upTitle.value != "") {
      modal2.style.display = `none`;
      modal1.style.display = `flex`;
      alert("Votre projet à bien été rajouté ");
      //Add new work to the list of Works
      const newWork = await AddWork(formData);
      dataWorks.add(newWork);
      // Call the related functions to Works
      showWorksInModal();
      displayGallery();
      // Reset form
      upTitle.value = "";
      uploadImg.files[0] = "";
      preview.src = "";
      file = "";
      URL.revokeObjectURL(file);
    } else {
      // Create HTML element containing error message
      const error = document.createElement("p");
      error.innerText = "Titre, Catégorie, Taille < 4Mo requis";
      error.style.textAlign = `center`;
      error.style.color = `red`;
      // Display error message
      sendImg.appendChild(error);
    }
  });
}

// --- Close modal ---
window.addEventListener("click", function (e) {
  if (e.target === modalContainer) {
    modalContainer.style.display = "none";
    modal2.style.display = `none`;
  }
});

// ---------- Log Out admin mode ----------
function logOutUser() {
  logMode.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("accessToken");
    window.location.reload();
  });
}

// ---------- Work Request API ----------
// Clear the selected work by sending a request DELETE
async function delWork(id) {
  // Sending request DELETE to the API
  const response = await fetch("http://localhost:5678/api/works/" + id, {
    method: "DELETE",
    headers: {
      // Add authorization header with the access token
      Authorization: `Bearer ${token}`,
    },
  });
  // Display response in the console
  console.log(response);
  // Return the status code of the response
  return response.status;
}

// Add a new work by sending a request POST
async function AddWork(formData) {
  // Sending request POST to the API
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      // Add authorization header with the access token
      Authorization: `Bearer ${token}`,
    },
    // Add form data to the request
    body: formData,
  });
  // Return the JSON data of the response
  if (response.ok) {
    return response.json();
  }
}

// Display a confirmation message before deleting a work
async function confirmDelWork(workId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
    const deleteStatus = await delWork(workId);
    return deleteStatus;
  }
}