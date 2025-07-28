// fetchování produktů z JSON
async function fetchProducts() {
 const fetchedProducts = await fetch('assets/src/products.json', {headers: {"Content-Type": "application/json"}}).then((response) => {return response.json()});
 return fetchedProducts;
}

window.addEventListener("load", (event) => vytvorElements())

/**
 * Změna padding v navbaru při scrollování
 */
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").style.padding = "0.5rem";
    
  } else {
    document.getElementById("navbar").style.padding = "1.7rem";
    }
}

/**
 * Obsluha fetchování produktů z JSONu + tvorba elementů a manipulace DOM
 */

// custom komponenta
class ProduktComponent extends HTMLElement{
  constructor(category, title, availability, price, imgSrc, flags){
    super();
    this.category = category;
    this.title = title;
    this.availability = availability;
    this.price = price;
    this.imgSrc = imgSrc;
    this.flags = flags;
  }

  connectedCallback()
  {
    const shadow = this.attachShadow({mode: "open"});

    const wrapper = document.createElement("div");
    wrapper.classList.add("produkt-wrapper");

    const obrazek = document.createElement("img");
    obrazek.setAttribute("src", this.imgSrc);
    obrazek.classList.add("produkt-img");

    const nazev = document.createElement("h1");
    nazev.insertAdjacentText("afterbegin", this.title);
    nazev.classList.add("produkt-nazev");

    const dostupnost = document.createElement("h2");
    dostupnost.insertAdjacentText("afterbegin", this.availability);
    dostupnost.classList.add("produkt-dostupnost")

    const cena = document.createElement("h1");
    cena.insertAdjacentText("afterbegin", this.price);
    cena.classList.add("produkt-cena")

    const kosikIcon = document.createElement("img");
    kosikIcon.setAttribute("src", "/assets/img/ikony-svg/kosik.svg");
    kosikIcon.classList.add("produkt-ikona-kosik");



    shadow.appendChild(wrapper);
    wrapper.appendChild(obrazek);
    wrapper.appendChild(nazev);
    wrapper.appendChild(dostupnost);
    wrapper.appendChild(cena);
    wrapper.appendChild(kosikIcon);

  }



}

customElements.define("produkt-component", ProduktComponent);



async function vytvorElements(){
  const wrapper = document.getElementById("nabidka-produkty-wrapper");
  const allProducts = await fetchProducts();
  console.log("fungujeu");

  for(let i in allProducts)
  {
    wrapper.appendChild(new ProduktComponent(allProducts[i].category, allProducts[i].title, allProducts[i].availability, allProducts[i].price, allProducts[i].imgSrc, allProducts[i].flags));
    
  }

  
}

function swapPages(id){
  swapActiveButtonClassname(id);

}

// stará se o změnu stylů nadpisů v závislosti na vybrané kategorii produktů
function swapActiveButtonClassname(id){
  const btnNovinky = document.getElementById("novinky");
  const btnNejprodavanejsi = document.getElementById("nejprodavanejsi");
  const btnDoporucene = document.getElementById("doporucene");

  const buttons = [btnNovinky, btnNejprodavanejsi, btnDoporucene]
  
  for(let i in buttons)
  {
    if(buttons[i].classList.contains("selected"))
    {
      buttons[i].classList.remove("selected");
      buttons[i].classList.add("inactive");
    }

    if(buttons[i].id === id)
    {
      buttons[i].classList.remove("inactive");
      buttons[i].classList.add("selected");
    }
  }
  
  
}


function zobrazitVse(){

}

