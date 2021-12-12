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
    <div>
        <p>Loading categories data...</p>
    </div>
{/if}

{#if categories && !error && !loading}
    <p>Total questions: {categories.totalCount}</p>
    <ul>
        {#each categories.data as category}
            <li>
                <p>{category.name}</p>
            </li>
        {/each}
    </ul>
{/if}

{#if (error)}
    <p>Lege lijst tonen of verbergen.</p>
{/if}
