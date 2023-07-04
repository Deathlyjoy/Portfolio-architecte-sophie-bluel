// API
async function dataWorks() { 
    const response = await fetch("http://localhost:5678/api/works");
    if (response.ok === true) {
        console.log("Connexion dataWork : Successful");
        return response.json();
      } else {
        console.log("Error Connexion API : " + response.error);
      }
}
console.log(dataWorks());

async function dataCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  if (response.ok === true) {
      console.log("Connexion dataCategories : Successful");
      return response.json();
    } else {
      console.log("Error Connexion API : " + response.error);
    }
}
console.log(dataCategories());

// VARIABLES
const gallery = document.querySelector("#gallery")

const buttonGeneric = document.querySelector("#btn-generic");
const allProject = document.querySelectorAll("#gallery > div");

const btn = document.getElementsByClassName("button");

// PROJECT
async function project() {
  const dataProjectAPI = await dataWorks();
  dataProjectAPI.forEach((galleryImg) => {
    const imgProject = document.createElement("div");
    const imgSophie = document.createElement("img");
    const titleSophie = document.createElement("h3");
    imgSophie.src = `${galleryImg.imageUrl}`;
    titleSophie.innerText = `${galleryImg.title}`;
    imgProject.appendChild(imgSophie);
    imgProject.appendChild(titleSophie);
    gallery.appendChild(imgProject);
  });
}
project();

// BUTTON "TOUS"
const buttonT = document.createElement("button");
buttonT.setAttribute("categoryId", "0");
buttonT.innerText = "Tous";
buttonT.setAttribute("class", "button");
buttonT.addEventListener("click", () => {
  allProject.forEach((div) => (div.style.display = "block"));
});
buttonGeneric.appendChild(buttonT);

// BUTTONS FILTER
async function button() {
  const dataButton = await dataCategories();
  console.log(dataButton);
  dataButton.forEach((btn) => {
    const btnSite = document.createElement("button");
    btnSite.innerText = `${btn.name}`;
    btnSite.setAttribute("class", "button");
    btnSite.setAttribute("categoryId", `${btn.id}`);
    buttonGeneric.appendChild(btnSite);
  });
}
button();

// FILTER
async function filtreTravaux() {
  const dataFiltreTravaux = await dataWorks();
  const buttonBis = await dataCategories();
  for (let i = 0; i < btn.length; i++) {
    btn[i].addEventListener("click", () => {
      console.log(btn[i]);
      let ctgId = btn[i].getAttribute("categoryId");
      console.log(ctgId);
      if (ctgId == 0) {
        gallery.innerHTML = "";
        project();
      } else {
        gallery.innerHTML = "";
        dataFiltreTravaux.forEach((galleryImg) => {
          if (galleryImg.categoryId == ctgId) {
            const imgProjet = document.createElement("div");
            const imgSophie = document.createElement("img");
            const titleSophie = document.createElement("h3");
            imgSophie.src = `${galleryImg.imageUrl}`;
            titleSophie.innerText = `${galleryImg.title}`;
            imgProjet.appendChild(imgSophie);
            imgProjet.appendChild(titleSophie);
            gallery.appendChild(imgProjet);
          }
        });
      }
    });
  }
}
filtreTravaux();