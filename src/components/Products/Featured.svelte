<script>
 export let title="";
 // import {onMount,onDestroy} from "svelte";
 import products,{featuredStore} from "../../stores/products"
 import Product from './Product.svelte';
 import Loading from '../Loading.svelte';
 // $:featured = $products.filter(item => item.featured===true); //if without derived class


 // console.log(products);
 // console.log($products);
 // let localProducts=$products;
 // let unsubscribe;
 // onMount(()=>{
 //  unsubscribe=products.subscribe(value => {
 //   console.log(value);
 //   localProducts=value;
 //  });
 // });
 // onDestroy(()=>{
 //  unsubscribe();
 // })
</script>

{#if $featuredStore.length===0}
<Loading/>
{:else}
<section class="section">
 <h2 class="section-title">{title}</h2>
 <div class="products-center">
{#each $featuredStore as product (product.id)}
 <Product {product}/>
{/each}
</div>
</section>
{/if}