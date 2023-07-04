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