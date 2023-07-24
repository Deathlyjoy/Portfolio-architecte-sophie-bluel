// ---------- API ----------
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
const banner = document.querySelector(".edition");
const buttonEdit = document.querySelectorAll(".btn-edit");

const modalContainer = document.querySelector(".modalContainer");
const worksContainer = document.querySelector(`.worksContainer`);
const modal1 = document.querySelector(".modal1");
const modal2 = document.querySelector(".modal2");
const pushModal = document.querySelector(".publish");
const upTitle = document.getElementById(`titre`);
const selectCategory = document.getElementById("categorie");
const submitButton = document.querySelector(".valid");

// ---------- Variables ----------
const dataWorks = new Set();
const dataCategories = new Set();
let file = "";

// ---------- Display the interface modal admin mode ----------
function editMode() {
  banner.style = "display : flex";
  logMode.innerText = "logout";
  for (const button of buttonEdit) {
    button.style = "display : flex";
    modal1.style.display = `flex`;
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


// ---------- Modal ----------
// Permet d'appuyer et d'afficher la modale
pushModal.addEventListener("click", () => {
  modalContainer.style = `display : flex`;
  modal1.style.display = `flex`;
});
// -- Permet de passer de la modal 1 à 2
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

// -- Test modal 2 ----
function closeEvent() {}
if (modal2) {
  // PAssage de la modale 1 à 2 //
  RedirectionModale();
  // --- Flèche retour ---//
  const back = document.querySelector(`.back`);
  // Flèche permetant de sortir de la modale //
  back.addEventListener("click", () => {
    modal1.style.display = `flex`;
    modal2.style.display = `none`;
  });
  closeEvent();
}

// --- Récupération dynamique des catégories pour ajout de projet ---
function getSelectCategory() {
  // Récupère l'élément HTML 'select' avec l'ID 'categorie'
  const selectCategory = document.getElementById("categorie");

  // Parcourt toutes les catégories disponibles
  for (const categorie of dataCategories) {
    // Crée un nouvel élément HTML 'option'
    const option = document.createElement("option");

    // Définit le texte affiché dans l'option comme le nom de la catégorie
    option.textContent = categorie.name;

    // Définit la valeur de l'option comme l'ID de la catégorie
    option.value = categorie.id;

    // Ajoute l'option au select
    selectCategory.appendChild(option);
  }
}

function initAddModale() {
  // Récupère l'élément HTML avec l'ID 'uploadImg'
  const img = document.querySelector("#uploadImg");
  const closeImg = document.querySelector("#closeImg i");
  const labelUpload = document.querySelector("#sendImg label");

  // Ajoute un écouteur d'événements 'change' sur l'élément img
  img.addEventListener("change", (e) => {
    // Récupère le fichier sélectionné
    let tempFile = e.target.files[0];

    // Définit les types de fichiers autorisés
    const fileTypes = ["image/jpg", "image/png"];
    let testFormat = false;

    // Vérifie si le type de fichier sélectionné est autorisé
    for (let i = 0; i < fileTypes.length; i++) {
      if (tempFile.type === fileTypes[i]) {
        testFormat = true;
      }
    }

    // Si le type de fichier est autorisé
    if (testFormat) {
      // Vérifie si la taille du fichier est inférieure ou égale à 4Mo
      if (tempFile.size <= 1024 * 1024 * 1024) {
        // Récupère l'élément HTML avec l'ID 'preview'
        const preview = document.querySelector("#preview");

        // Crée une URL pour l'image sélectionnée
        const imageUrl = URL.createObjectURL(tempFile);

        // Définit l'URL de l'image sélectionnée comme source de l'élément 'preview'
        preview.src = imageUrl;

        // Définit le fichier sélectionné comme letiable globale
        file = tempFile;

        submitButton.style = `background : #1D6154`;
        // Fait apparaitre la croix pour supprimer l'image
        closeImg.style = `display : flex`;
        // Permet de faire disparaitre le label depassant
        labelUpload.style = `display : none`;
        // Reset le formulaire
        closeImg.addEventListener("click", () => {
          labelUpload.style = `display : flex`;
          upTitle.value = "";
          uploadImg.files[0] = "";
          preview.src = "";
          file = "";
        });
      } else {
        // Si la taille du fichier est supérieure à 4Mo, affiche une alerte
        return alert("taille incorrect 4mo max");
      }
    } else {
      // Si le type de fichier n'est pas autorisé, affiche une alerte
      return alert("ce format est incorrect PNJ/JPG attendu");
    }
  });

  // --- Requete POST pour envoyer un nouveau work ---
  submitButton.addEventListener("click", async (e) => {
    //permet d'éviter la page de s'ouvrir
    e.preventDefault();
    // Création d'un objet FormData et ajout des données du formulaire
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", upTitle.value);
    formData.append("category", selectCategory.value);
    // Vérification si l'utilisateur a ajouté une image et un titre
    if (file != "" && upTitle != "") {
      modal2.style.display = `none`;
      modal1.style.display = `flex`;
      alert("Votre projet à bien été rajouté ");
      // Ajout du nouveau travail à la liste de travaux
      const newWork = await AddWork(formData);
      dataWorks.add(newWork);
      // Rappel des fonctions pour les Works
      showWorksInModal();
      displayGallery();
      // Réinitialisation du formulaire
      upTitle.value = "";
      uploadImg.files[0] = "";
      preview.src = "";
      file = "";
      URL.revokeObjectURL(file);
    } else {
      // Création d'un élément contenant un message d'erreur
      const error = document.createElement("p");
      error.innerText = "Titre, Catégorie, Taille < 4Mo requis";
      error.style.textAlign = `center`;
      error.style.color = `red`;
      // Affichage du message d'erreur
      sendImg.appendChild(error);
    }
  });
}

// --- Fermeture de la modale ---
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

// Cette fonction supprime un travail en envoyant une requête DELETE à l'API
async function delWork(id) {
  // Envoie une requête DELETE à l'API pour supprimer le travail avec l'ID spécifié
  const response = await fetch("http://localhost:5678/api/works/" + id, {
    method: "DELETE",
    headers: {
      // Ajoute l'en-tête d'autorisation avec le jeton d'accès
      Authorization: `Bearer ${token}`,
    },
  });
  // Affiche la réponse dans la console
  console.log(response);
  // Renvoie le code d'état de la réponse
  return response.status;
}

// Cette fonction ajoute un travail en envoyant une requête POST à l'API
async function AddWork(formData) {
  // Envoie une requête POST à l'API pour ajouter un travail
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      // Ajoute l'en-tête d'autorisation avec le jeton d'accès
      Authorization: `Bearer ${token}`,
    },
    // Ajoute les données du formulaire à la requête
    body: formData,
  });
  // Si la réponse est OK, renvoie les données JSON de la réponse
  if (response.ok) {
    return response.json();
  }
}
// ** Confirmation pour suppression ** //
async function confirmDelWork(workId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
    const deleteStatus = await delWork(workId);
    return deleteStatus;
  }
}
//

