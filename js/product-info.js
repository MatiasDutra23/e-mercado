const prodID = localStorage.getItem("prodID");

const prodInfoURL =
  "https://japceibal.github.io/emercado-api/products/" + prodID + ".json";
const prodCommURL =
  "https://japceibal.github.io/emercado-api/products_comments/" +
  prodID +
  ".json";

const containerComm = document.querySelector(".containerComm");
const containerProductCategory = document.querySelector(".productCategory");
const containerInfo = document.querySelector(".containerInfo");
const containerMainImage = document.querySelector(".containerMainImage");
const containerSecondaryImages = document.querySelector(
  ".containerSecondaryImages"
);
const containerRelatedProducts = document.querySelector(
  "#container-related-products"
);

// Cargar y mostrar datos iniciales (PRODUCTO)
fetch(prodInfoURL)
  .then((response) => response.json())
  .then((infoCard) => {
    showProduct(infoCard);
    showRelatedProducts(infoCard);
  });

// Mostrar todos los detalles del producto
function showProduct(infoCard) {
  containerProductCategory.innerHTML += `
    <p class="st-products-category">Categoría: <span>${infoCard.category}</span></p>
  `;
  containerInfo.innerHTML += `
    <div class="productInfo"> 
      <h1>${infoCard.name}</h1>
      <p class="totalSold">| ${infoCard.soldCount} vendidos</p>
      <p class="average">4.5 (estrellas) (10)</p>
      <p class="cost"><span class="currency">${infoCard.currency}</span> ${infoCard.cost}</p>
      <button class="addToCart" onclick="addToCartClicked()">Añadir al carrito</button>
      <input type="number" id="qty" value="1" min="1">
      <hr>
      <h3 class="st-products">Detalles del producto:</h3>
      <p>${infoCard.description}</p>
    </div>
  `;

  containerMainImage.innerHTML += `
    <img class="mainImage" src="${infoCard.images[0]}" alt="imagen principal">
  `;
  changeMainImage(infoCard.images[0]);
  for (let i = 0; i < infoCard.images.length; i++) {
    const img = infoCard.images[i];

    containerSecondaryImages.innerHTML += `
      <img onclick="changeMainImage('${img}')" class="unitImages" src="${img}" alt="">
    `;
  }
}
function changeMainImage(src) {
  const mainImage = document.querySelector(".mainImage");
  mainImage.src = src;
}

// Cargar y mostrar datos iniciales (COMENTARIOS)
fetch(prodCommURL)
  .then((response) => response.json())
  .then(showProdCommInfo);

function showProdCommInfo(commCard) {
  const formattedDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(date).toLocaleDateString("es-ES", options);
  };

  containerComm.innerHTML = `
    <h3 class="titleOpinions">Opiniones del producto</h3>
    ${
      commCard.length === 0
        ? `<p class="not-comment">Aún no hay comentarios ¡puedes ser el primero!</p>`
        : ""
    }
    ${commCard
      .map(
        (item) => `
      <div class="commentCard">
        <p class="stars">${scoreToStars(item.score)}</p>
        <p class="commentDescription">${item.description}</p>
        <p class="userNameComment">${item.user}</p>
        <p class="dataComment">${formattedDate(item.dateTime)} hs</p>
        <hr>
      </div>
    `
      )
      .join("")} 
  `; // JOIN combina todos los comentarios generados por MAP en una sola cadena de texto.
}

document.getElementById("submitComment").addEventListener("click", (event) => {
  event.preventDefault();
  showComment();
});

function showComment() {
  const form = document.getElementById("commentForm");
  const formData = new FormData(form);
  const opinion = formData.get("opinion");
  const rate = formData.get("rate");
  const formattedDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  if (!opinion) {
    alert("Por favor, escribe algo.");
    return;
  }

  const userName = localStorage.getItem("email").split("@")[0];
  const commentCard = `
    <div class="commentCard">
      <p class="stars">${scoreToStars(rate)}</p>
      <p class="commentDescription">${opinion}</p>
      <p class="userNameComment">${userName}</p>
      <p class="dataComment">${formattedDate} hs</p>
      <hr>
    </div>
  `;

  containerComm.insertAdjacentHTML("beforeend", commentCard);
  form.reset();
}

function scoreToStars(score) {
  return "★".repeat(score) + "☆".repeat(5 - score);
}

function showRelatedProducts(infoCard) {
  infoCard.relatedProducts.forEach((relatedProduct) => {
    const productHTML = `
    <div class="productRelatedInfo" onclick="setProdID(${relatedProduct.id})"> 
      <h4 class="nameRelProd">${relatedProduct.name}</h4>
      <hr>
      <img class="imgRelProd" src="${relatedProduct.image}" alt="imagen del producto relacionado">
    </div>
  `;
    containerRelatedProducts.innerHTML += productHTML;
  });
}
function setProdID(id) {
  localStorage.setItem("prodID", id);
  window.location = "product-info.html";
}
function addToCartClicked() {
  const productoIdAlmacenado = localStorage.getItem("prodID");
  const inputCantidad = document.getElementById("qty").value;

  if (inputCantidad >= 1) {
    const carritoItem = {
      prodID: productoIdAlmacenado,
      cantidad: inputCantidad,
    };

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito.push(carritoItem);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    console.log(
      "Se ha añadido un producto al carrito con ID:",
      productoIdAlmacenado,
      "y cantidad:",
      inputCantidad
    );
  } else {
    alert("La cantidad debe ser un número válido y al menos 1");
  }
}
