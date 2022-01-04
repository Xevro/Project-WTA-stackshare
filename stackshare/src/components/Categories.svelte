<script lang="ts">
    import {Categories} from '../models';
    import {CategoriesProxyService} from '../services/backend-services';

    let categories: Categories;
    let loading = true;
    let error = '';
    const categoriesProxy = new CategoriesProxyService();

    categoriesProxy.getAllCategories().then(response => response.json())
        .then((response: Categories) => {
            categories = response;
            loading = false;
        }).catch((err) => {
        loading = false;
        error = 'Could not load the categories';
    });
</script>

{#if loading}
    <div class="categories-overview">
        <p>Loading categories data...</p>
    </div>
{/if}

{#if categories && !error && !loading}
    <div class="categories-overview">
        <h3>Populair categories</h3>
        <div class="categories-list">
            {#each categories.data as category}
                <div class="item">
                    <p>{category.name}</p>
                </div>
            {/each}
        </div>
    </div>
{/if}

{#if (error)}
    <div class="categories-overview">
        <p style="color:red;">Lege lijst tonen of verbergen!!!.</p>
    </div>
{/if}

<style lang="scss">

  .categories-overview {
    margin-left: 15%;
    margin-right: 15%;

    .categories-list {

      display: flex;

      .item {
        margin-left: 5px;
        margin-right: 5px;
        background-color: #5148D5;
        border-radius: 10px;
        padding: 5px 8px;
        color: #FFF;

        p {
          margin: 0;
          padding: 0;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .categories-overview {
      margin-left: 20px;
      margin-right: 20px;
    }
  }
</style>
