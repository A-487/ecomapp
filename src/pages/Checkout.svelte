<script>
 import {onMount} from "svelte";
 import {navigate,link} from "svelte-routing";
 import user from "../stores/user";
 import cart,{cartTotal} from "../stores/cart";
 import submitOrder from '../strapi/submitOrder';
 import globalStore from '../stores/globalStore';
 let name='';
 // stripe vars
 let cardElement;
 let cardErrors;
 let card;
 let stripe;
 let elements;
 // is Empty
 $: isEmpty=!name || $globalStore.alert;
 onMount(()=>{
  if(!$user.jwt){ //if user does not exist and /checkout is run in url by pass it yo home page
   navigate("/")
   return;
  }
  // console.log(Stripe);
  if($cartTotal>0){
  stripe=Stripe('pk_test_51JFoebSHfaCEgcUAnJHSOq1F4RKvk3hvqcBHTokp0USEjwlKjlzy8Dvnl8ghHhD4UafwIuUWwOSfB5jQzzyts1p400BiK4ksQc');
  elements=stripe.elements();
  card=elements.create('card');
  card.mount(cardElement);
  card.addEventListener("change",function(event){
   if(event.error){
    cardErrors.textContent=event.error.message;
   }else{
    cardErrors.textContent="";
   }
  })
  }
 })
 async function handleSubmit(){ // we don't send card number directly from frontend that will be insecure so we send a token from frontend and handel rest of the payement from backend
 globalStore.toggleItem("alert",true,"submitting order ...please wait!")
 let response = await stripe.createToken(card).catch(error=>console.log(error)); //it return a promise hence handlesubmit is async
 const {token} = response;
 if(token){
  const {id}=token;
  let order = await submitOrder({
   name,
   total:$cartTotal,
   items:$cart,
   stripeTokenId:id,
   userToken:$user.jwt
  });
  if(order){
   globalStore.toggleItem('alert',true,'your order is complete!');
   cart.set([]);
   localStorage.setItem('cart',JSON.stringify([]));
   navigate('/');
   return;
  }else{
   globalStore.toggleItem('alert',true,"there was an error with your order please try again")
  }
  // token.id
  // submit the order
  console.log(order);
 }
 else{
  // console.log(response);
 }
 }
</script>

{#if $cartTotal>0}
<section class="form">
 <h2 class="section-title">checkout</h2>
 <form class="checkout-form" on:submit|preventDefault={handleSubmit}>
 <h3>order total: ${$cartTotal}</h3>
 <!-- single input -->
 <div class="form-control">
  <label for="name">your name</label>
  <input type="text" id="name" bind:value={name}/>
 </div>
 <!-- end of single input -->
 <!-- stripe stuff -->
 <div class="stripe-input">
  <!-- info -->
  <label for="card-element">Credit or Debit Card</label>
  <p class="stripe-info">
   Test using this credit card:
   <span>4242 4242 4242 4242</span>
   <br/>
   enter any 5 digits for the zip code
   <br/>
   enter 3 digits CVV number 
  </p>
  <!--(bind the whole card element in the next line)--> 
  <div id="card-element" bind:this={cardElement}>
  <!-- stripe -->
  </div>
  <div id="card-errors" bind:this={cardErrors} role="alert"/>  
 </div>
 <!-- end of stripe stuff -->
 <!-- error message -->
 {#if isEmpty}
 <p class="form-empty">please fill name</p>
 {/if}
 <!-- submit button -->
 <button type="submit" class="btn btn-block btn-primary" disabled={isEmpty} class:disabled={isEmpty} >
  submit
 </button>
 </form>
</section>
{:else}
<div class="checkout-empty">
 <h2>your cart is empty</h2>
 <a href="/products" use:link class="btn btn-primary">
 fill it
 </a>
</div>
{/if}