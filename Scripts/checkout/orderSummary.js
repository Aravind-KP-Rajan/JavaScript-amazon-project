import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption
} from '../../data/cart.js';
import {products} from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'; //externalLibraries
import{deliveryOptions} from  '../../data/deliveryOptions.js'


const today = dayjs();
const deleiveryDate = today.add(7, 'days');

console.log(deleiveryDate.format('dddd, MMMM D'));


export function renderOrderSummary (){

  let cartSummaryHTML = '';

  cart.forEach((cartItem)=>{

    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product)=>{
      if(product.id === productId){
        matchingProduct = product;
      }
    });
    // console.log(matchingProduct);


    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;

    deliveryOptions.forEach((option) => {
      if(option.id === deliveryOptionId){
        deliveryOption = option;
      }
    })

    const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays, 'days'
      );

      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );

    cartSummaryHTML+=

    `
      <div class="cart-item-container
      js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
            ${matchingProduct.name}
            </div>
            <div class="product-price">$
            ${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link"
                data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-link"
                data-product-id="${matchingProduct.id}">
                Save
              </span>
              <span class="delete-quantity-link js-delete-link link-primary" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
    
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem){

    let html = '';
    
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays, 'days'
      );

      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );

      const priceString = deliveryOption.priceCents 
      === 0
      ? 'FREE' //terinary operators
      :`$${formatCurrency (deliveryOption.priceCents)} - `;

      const isChecked = deliveryOption.id ===
      cartItem.deliveryOptionId;

      html += `
      <div class="delivery-option js-delivery-option"
        data-product-id = "${matchingProduct.id}"
        data-delivery-option-id = "${deliveryOption.id}">
          <input type="radio" ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} - Shipping
            </div>
          </div>
      </div>`
    });

    return html;

  };

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link)=>{
    link.addEventListener('click', ()=>{
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(`.js-cart-item-container-${productId}`
    );

    container.remove();
    updateCartQuantity()

    });

  });

  let cartQuantity = 0;

  function updateCartQuantity(){

  /*  let cartQuantity = 0;

    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    }); */

    const cartQuantity = calculateCartQuantity();
    document.querySelector('.js-return-to-home-link')
    .innerHTML = `${cartQuantity} items`;
  }

    updateCartQuantity();

    document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        // console.log(productId);
        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.add('is-editing-quantity');
      });
    });

    document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

      /*  const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.remove('is-editing-quantity'); */

        /*  Here's an example of a feature we can add: validation.
        Note: we need to move the quantity-related code up
        because if the new quantity is not valid, we should
        return early and NOT run the rest of the code. This
        technique is called an "early return". */

        const quantityInput = document.querySelector(
          `.js-quantity-input-${productId}`
        );
        const newQuantity = Number(quantityInput.value);
        if (newQuantity < 0 || newQuantity >= 1000) {
          alert('Quantity must be at least 0 and less than 1000');
          return;
        }
        updateQuantity(productId, newQuantity);

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.remove('is-editing-quantity');

        
        const quantityLabel = document.querySelector(
          `.js-quantity-label-${productId}`
        );
        quantityLabel.innerHTML = newQuantity;

        updateCartQuantity();

      });
    });

  document.querySelectorAll('.js-delivery-option')
  .forEach((element)=>{
    element.addEventListener('click' , () => {

      const {productId, deliveryOptionId} = element.dataset; //shorthandProperty
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary(); //re-run all the code above - regenerating all the code
    });
  });
}

