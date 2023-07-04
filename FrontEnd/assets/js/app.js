// ---------- API ----------
const token = localStorage.accessToken;
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
const gallery = document.querySelector("#gallery")


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

    //Modal
    // if (token) {

    // } else {
    //   displayFilterButton();
    // }

    // Display the gallery
    displayGallery();
  } catch (error) {
    console.log(`Error Initialisation:  ${error}`);
  }
}
init()


// ---------- Functions ----------
// Display the gallery depending on the filter
function displayGallery(filter = 0) {
  let filterData = dataWorks;
  console.log(filterData);
  // Check if a filter is selected
  if (filter != 0) {
    filterData = [...dataWorks].filter((work) => work.categoryId == filter); // On utilise la méthode "filter" pour filtrer les travaux en fonction de la catégorie sélectionnée
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

    // Attach project to the gallery
    gallery.appendChild(project);
  }
}


// // ---------- DOM ----------
// // VARIABLES
// 

// const buttonGeneric = document.querySelector("#btn-generic");
// const allProject = document.querySelectorAll("#gallery > div");

// const btn = document.getElementsByClassName("button");

// // PROJECT
// async function project() {
//   const dataProjectAPI = await dataBaseInfo("works");
//   dataProjectAPI.forEach((galleryImg) => {
//     const imgProject = document.createElement("div");
//     const imgSophie = document.createElement("img");
//     const titleSophie = document.createElement("h3");
//     imgSophie.src = `${galleryImg.imageUrl}`;
//     titleSophie.innerText = `${galleryImg.title}`;
//     imgProject.appendChild(imgSophie);
//     imgProject.appendChild(titleSophie);
//     gallery.appendChild(imgProject);
//   });
// }
// project();

// // BUTTON "TOUS"
// const buttonT = document.createElement("button");
// buttonT.setAttribute("categoryId", "0");
// buttonT.innerText = "Tous";
// buttonT.setAttribute("class", "button");
// buttonT.addEventListener("click", () => {
//   allProject.forEach((div) => (div.style.display = "block"));
// });
// buttonGeneric.appendChild(buttonT);

// // BUTTONS FILTER
// async function button() {
//   const dataButton = await dataBaseInfo("categories");
//   console.log(dataButton);
//   dataButton.forEach((btn) => {
//     const btnSite = document.createElement("button");
//     btnSite.innerText = `${btn.name}`;
//     btnSite.setAttribute("class", "button");
//     btnSite.setAttribute("categoryId", `${btn.id}`);
//     buttonGeneric.appendChild(btnSite);
//   });
// }
// button();

// // FILTER
// async function filtreTravaux() {
//   const dataFiltreTravaux = await dataBaseInfo("works");
//   const buttonBis = await dataBaseInfo("categories");
//   for (let i = 0; i < btn.length; i++) {
//     btn[i].addEventListener("click", () => {
//       console.log(btn[i]);
//       let ctgId = btn[i].getAttribute("categoryId");
//       console.log(ctgId);
//       if (ctgId == 0) {
//         gallery.innerHTML = "";
//         project();
//       } else {
//         gallery.innerHTML = "";
//         dataFiltreTravaux.forEach((galleryImg) => {
//           if (galleryImg.categoryId == ctgId) {
//             const imgProjet = document.createElement("div");
//             const imgSophie = document.createElement("img");
//             const titleSophie = document.createElement("h3");
//             imgSophie.src = `${galleryImg.imageUrl}`;
//             titleSophie.innerText = `${galleryImg.title}`;
//             imgProjet.appendChild(imgSophie);
//             imgProjet.appendChild(titleSophie);
//             gallery.appendChild(imgProjet);
//           }
//         });
//       }
//     });
//   }
// }
// filtreTravaux();

// // ---------- MODAL ----------

// // INTERFACE LOGIN/OGOUT
// const banner = document.querySelector(".mode-edition");
// const modifierUn = document.querySelector(".modifier1");
// const modifierDeux = document.querySelector(".minibloch2");
// const logInOut = document.querySelector(".log-in-out");
// const link = document.querySelector("#link");

// function editMode() {
//   if (localStorage.getItem("token")) {
//     banner.style = "display:flex";
//     buttonGeneric.style = "display:none";
//     modifierUn.style = "display:flex";
//     modifierDeux.style = "display:flex";
//     logInOut.innerText = "logout";
//     logInOut.addEventListener("click", () => {
//       localStorage.removeItem("token");
//       link.href = "index.html";
//     });
//     console.log("Check");
//   } else {
//     banner.style = "display:none";
//     buttonGeneric.style = "display:flex";
//     modifierUn.style = "display:none";
//     modifierDeux.style = "display:none";
//     console.log("No check");
//   }
// }
// editMode();