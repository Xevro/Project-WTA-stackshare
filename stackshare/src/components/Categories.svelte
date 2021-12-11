<script lang="ts">
    import {Categories} from '../models';
    import {CategoriesProxyService} from '../services/backend-services';

    let categories: Categories;
    let error = '';
    const categoriesProxy = new CategoriesProxyService();

    categoriesProxy.getAllCategories().then(response => response.json())
        .then((response: Categories) => {
            categories = response;
        }).catch((err) => {
        error = 'Could not load the categories';
    });
</script>

{#if categories && !error}
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
