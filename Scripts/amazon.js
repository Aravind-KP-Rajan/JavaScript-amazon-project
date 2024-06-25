//importing using module
import { products } from '../data/products.js';
import{cart /* as myCart */ , addToCart, calculateCartQuantity} from '../data/cart.js';
import { formatCurrency } from './utils/money.js';


/* Main idea of JavaScript
  (1) save the data
  (2) Generate the HTML
  (3) Make it interactive
*/

//(1) save the data

/* const products = [{
  image: 'images/products/athletic-cotton-socks-6-pairs.jpg',
  name: 'Black and Gray Athletic Cotton Socks - 6 Pairs',
  ratings:{
    stars: 4.5,
    count: 87
  },
  priceCents: 1090 //saving in cents
}, {
  image: 'images/products/intermediate-composite-basketball.jpg',
  name: 'Intermediate Size Basketball',
  ratings: {
    stars: 4,
    count: 127
  },
  priceCents: 2095
}, {
  image: 'images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg',
  name: 'Adults Plain Cotton T-Shirt - 2 Pack',
  ratings: {
    stars: 4.5,
    count: 56
  },
  priceCents: 799
}, {
  image: 'images/products/black-2-slot-toaster.jpg',
  name: '2 Slot Toaster - Black',
  ratings: {
    stars: 5,
    count: 2197
  },
  priceCents: 1899
}] */

//(2) Generate the HTML

//by looping through an array

let productsHTML = ''; //Accumulator pattern
//adding every loop into this variable by saving an empty string first


//below products variable comes from products.js file 
products.forEach((product)=>{
 /* adding every loop */ productsHTML+=` 
        <div class="product-container">
                <div class="product-image-container">
                  <img class="product-image"
                    src="${product.image}">
                </div>

                <div class="product-name limit-text-to-2-lines">
                 ${product.name}
                </div>

                <div class="product-rating-container">
                  <img class="product-rating-stars"
                    src="images/ratings/rating-${product.rating.stars * 10}.png">
                  <div class="product-rating-count link-primary">
                    ${product.rating.count}
                  </div>
                </div>

                <div class="product-price">
                  $${formatCurrency(product.priceCents)/* to show number with 2 decimal values */}
                </div>

                <div class="product-quantity-container">
                  <select class="js-quantity-selector-${product.id}">
                    <option selected value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </div>

                <div class="product-spacer"></div>

                <div class="added-to-cart js-added-to-cart-${product.id}">
                  <img src="images/icons/checkmark.png">
                  Added
                </div>

                <button class="add-to-cart-button button-primary js-add-to-cart"
                data-product-id="${product.id}">
                  Add to Cart
                </button>
              </div>
  `; //temple strings =>`` backtick
//data-produc-id => kebab-case
//productId => camelCase
})

// console.log(productsHTML);

document.querySelector('.js-products-grid').innerHTML = productsHTML

/* This solution uses a feature of JavaScript called a
closure. Each time we run the loop, it will create
a new variable called addedMessageTimeoutId and do
button.addEventListener().

Then, because of closure, the function we give to
button.addEventListener() will get a unique copy
of the addedMessageTimeoutId variable and it will
keep this copy of the variable forever.
(Reminder: closure = if a function has access to a
value/variable, it will always have access to that
value/variable).

This allows us to create many unique copies of the
addedMessageTimeoutId variable (one for every time
we run the loop) so it lets us keep track of many
timeoutIds (one for each product). */

let addedMessageTimeoutId;



function updateCartQuantity(){
  //to calculate the cart quantity
   /* 
    (1) calculate the quantity
    (2) put the quantity on page (using DOM)
   */

  /*   let cartQuantity = 0;

    cart.forEach((cartItem)=>{
     cartQuantity+=cartItem.quantity;
    }); */

    const cartQuantity = calculateCartQuantity();
    
 
     document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  
}
updateCartQuantity();

//(3) Make it interactive

document.querySelectorAll('.js-add-to-cart').forEach((button)=>{
    button.addEventListener('click', ()=>{
    // console.log('Added products')
    const {productId} = button.dataset;
    
    //product-id is converted from kebab-case to camelCase productId
    // console.log(productName); 

    /* to increase the quantity

      (1) check if the product is already in the cart
      (2) if it is in the cart, increase the quantity
      (3) if it's not in the cart add it to the cart
    */

      addToCart(productId);
      updateCartQuantity();

   

   const addedMessage = document.querySelector(
    `.js-added-to-cart-${productId}`
  );
  addedMessage.classList.add('added-to-cart-visible');

   /*  Check if a previous timeoutId exists. If it does, we will stop it. */
      if (addedMessageTimeoutId) {
        clearTimeout(addedMessageTimeoutId);
      }

      const timeoutId = setTimeout(() => {
        addedMessage.classList.remove('added-to-cart-visible');
      }, 2000);

      // Save the timeoutId so we can stop it later.
      addedMessageTimeoutId = timeoutId;

    //  console.log(cart);
  })
})




