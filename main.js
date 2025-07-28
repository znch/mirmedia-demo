// fetchování produktů z JSON
async function fetchProducts() {
 const fetchedProducts = await fetch('assets/src/products.json', {headers: {"Content-Type": "application/json"}}).then((response) => {return response.json()});
 return fetchedProducts;
}

window.addEventListener("load", (event) => vytvorElements(activeCategory, zobrazVse))

/**
 * Změna padding v navbaru při scrollování
 */
window.onscroll = () => {
  if(window.innerWidth > 992){
  scrollFunction()
  }
  else{
    document.getElementById("navbar").style.removeProperty("padding");
  }
}

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

let activeCategory = "Novinky";
let zobrazVse = false;

function setActiveCategory(newCategory){
  activeCategory = newCategory;
}

function setZobrazitVse(newValue){
 zobrazVse = newValue;
}

function getActiveCategory(){
  return activeCategory;
}

function getZobrazVse(){
  return zobrazVse;  
}



// custom komponenta produktu
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

    const nazev = document.createElement("a");
    nazev.setAttribute("href", "#nabidka-produkty")
    nazev.insertAdjacentText("afterbegin", this.title);
    nazev.classList.add("produkt-nazev");

    const dostupnost = document.createElement("h2");
    dostupnost.insertAdjacentText("afterbegin", this.availability);
    dostupnost.classList.add("produkt-dostupnost");
    if(this.availability == "Na objednávku"){
      dostupnost.classList.add("text-gray");
    };
    if(this.availability == "Skladem"){
      dostupnost.classList.add("text-green");
    };
    if(this.availability == "Momentálně nedostupné"){
      dostupnost.classList.add("text-red");
    };


    const cena = document.createElement("h1");
    cena.insertAdjacentText("afterbegin", this.price + " CZK");
    cena.classList.add("produkt-cena")

    const kosikWrapper = document.createElement("button");
    kosikWrapper.classList.add("kosik-wrapper");

    const kosikIcon = document.createElement("img");
    kosikIcon.setAttribute("src", "/assets/img/ikony-svg/kosik.svg");
    kosikIcon.classList.add("produkt-ikona-kosik");

    const flagWrapper = document.createElement("div");
    flagWrapper.classList.add("flag-wrapper")

    const style = document.createElement("style");
    style.textContent = shadowStyle;


    
    // append částí komponenty + stylu
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(obrazek);
    wrapper.appendChild(nazev);
    wrapper.appendChild(dostupnost);
    wrapper.appendChild(cena);
    wrapper.appendChild(kosikWrapper);
    wrapper.appendChild(flagWrapper);
    kosikWrapper.appendChild(kosikIcon);

    // appendování Flagů
    const flagsContainer = new Array();

    if(this.flags.length > 0){
      
      for(let i in this.flags){
        flagsContainer[i] = document.createElement("div");
        flagsContainer[i].insertAdjacentText("afterbegin", this.flags[i])
        
        if(this.flags[i] == "Tip"){
          flagsContainer[i].classList.add("flag", "flag-tip");
        }
        if(this.flags[i] == "Novinka"){
          flagsContainer[i].classList.add("flag", "flag-novinka");
        }
        if(this.flags[i] == "Výprodej"){
          flagsContainer[i].classList.add("flag", "flag-vyprodej");
        }

        flagWrapper.appendChild(flagsContainer[i]);
      }
    }

    

  }



}
customElements.define("produkt-component", ProduktComponent);



// vytvoří komponenty na základě vybrané kategorie a jestli je odkliknuté tlačítko zobrazit vše
async function vytvorElements(category, zobrazVse){
  const wrapper = document.getElementById("nabidka-produkty-wrapper");
  const selectedProducts = await fetchProducts(); 
  let selectedCategory = category;
  wrapper.replaceChildren();

  console.log(category);
  

  const allProducts = zobrazVse? selectedProducts.filter((cat) => cat.category === selectedCategory) : selectedProducts.filter((cat) => cat.category === selectedCategory).slice(0, 4);
  for(let i in allProducts)
  {
    wrapper.appendChild(new ProduktComponent(allProducts[i].category, allProducts[i].title, allProducts[i].availability, allProducts[i].price, allProducts[i].imgSrc, allProducts[i].flags));
    
  }
  console.log(allProducts);

  
}


// metoda pro přepínání mezi kategoriemi, změní styl podle výběru + vytvoří 
function swapPages(id, value){
  swapActiveButtonClassname(id);
  setActiveCategory(value);
  vytvorElements(getActiveCategory(), getZobrazVse());

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

// funkce tlačítka pro zobrazení všech produktů
function zobrazitVse(){
  const btnZobrazitVse = document.getElementById("btnZobrazitVseProd");
  btnZobrazitVse.innerText = zobrazVse ? "Zobrazit více produktů" : "Zobrazit méně produktů"; 

  setZobrazitVse(!zobrazVse);
  vytvorElements(getActiveCategory(), getZobrazVse());

}

// CSS stylování pro shadow DOM
var shadowStyle = `

  button{
    cursor: pointer;
    border: none;
  }

  h1, h2 {
    margin: none
  }


  .produkt-wrapper{
  
    display: flex;
    flex-direction: column;
    width: 20rem; 
    height: 32rem;
    align-content: space-between;
    margin: 2rem;
    
  
  }

  .produkt-wrapper:hover{
    outline: 1px solid #C4C4C4;
    outline-offset: 1rem;
  }

  .produkt-img{
    max-height: 384px;
    min-height: 384px;
    
    object-fit: cover;
  
  }

  .produkt-nazev{
    font-size: 18px;
    font-weight: 500;
    height: 44px;
    text-decoration:none;
    color: #000;
  
  }

  .produkt-dostupnost{
    font-size: 14px;
    font-weight: 500;
  }

  .text-gray{
    color: #979797;
  }

  .text-green{
    color: #63DA46;
  }

  .text-red{
    color: #F24D4D;  
  }

  .produkt-cena{
    font-size:18px;
    font-weight: 500;
  }

  .kosik-wrapper{
    max-height: 60px;
    max-width: 60px;
    min-height: 60px;
    min-width: 60px;
    background-color: #000;
    display: flex;

    translate: 16rem -4rem;
  }

  .produkt-ikona-kosik{
    height: 24px;
    width: 24px;
    margin: auto;

    }

  .flag-wrapper{
    translate: 12rem -36rem;

  }
  
  .flag{
    color: #fff;
    width: 122px;
    height: 30px;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.5rem;
  }

  .flag-tip{
    background-color: #ECB235;
  }

  .flag-novinka{
    background-color: #63DA46;
  }

  .flag-vyprodej{
    background-color: #F24D4D;
  }

  @media only screen and (max-width: 600px) {
  button{
    cursor: pointer;
    border: none;
  }

  h1, h2 {
    margin-top: 0.4rem;
    margin-bottom: 0.4rem;

  }


  .produkt-wrapper{
  
    display: flex;
    flex-direction: column;
    width: 160px; 
    height: 275px;
    margin: 0;
    margin-top: 2rem;
    margin-bottom: 2rem;
    outline: 1px solid #C4C4C4;
    outline-offset: 0.1rem;
    
    
  
  }

  .produkt-wrapper: hover{
    outline-offset: 0.1rem;
  
  }


  .produkt-img{
    max-height: 168px;
    min-height: 168px;
    

    object-fit: cover;
    margin-bottom: 1rem;
  
  }

  .produkt-nazev{
    font-size: 12px;
    font-weight: 500;
    height: 30px;
    width: 151px;
    padding-left: 0.5rem;

    flex-shrink: 0;
    display: inline-block;
    text-decoration:none;
    color: #000;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  
  }

  .produkt-dostupnost{
    font-size: 12px;
    font-weight: 500;
    width: 151px;
    padding-left: 0.5rem;

    flex-shrink: 0;
    display: inline-block;
    text-decoration:none;
    color: #000;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .text-gray{
    color: #979797;
  }

  .text-green{
    color: #63DA46;
  }

  .text-red{
    color: #F24D4D;  
  }

  .produkt-cena{
    font-size:12px;
    font-weight: 500;
    padding-left: 0.5rem;

  }

  .kosik-wrapper{
    max-height: 34px;
    max-width: 34px;
    min-height: 34px;
    min-width: 34px;
    background-color: #000;
    display: flex;

    translate: 7.5rem -2rem;
  }

  .produkt-ikona-kosik{
    height: 14px;
    width: 14px;
    margin: auto;

    }

  .flag-wrapper{
    translate: 4.9rem -19rem;
    width: fit-content;

  }

  .flag{
    color: #fff;
    width: 75px;
    height: 19px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.5rem;
  }

  .flag-tip{
    background-color: #ECB235;
   
  }

  .flag-novinka{
    background-color: #63DA46;
  }

  .flag-vyprodej{
    background-color: #F24D4D;
  }
}
`;