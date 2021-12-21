<script lang="ts">
    import {CategoriesProxyService, QuestionsProxyService} from '../../../services/backend-services';
    import type {Categories, Question} from '../../../models';

    let question = {title: '', description: '', categories: []} as Question;
    let inProgress = true;
    let error = null;
    let allCategories: Categories;
    const questionProxy = new QuestionsProxyService();
    const categoriesProxy = new CategoriesProxyService();

    categoriesProxy.getAllCategories().then(response => response.json())
        .then((categories: Categories) => {
            allCategories = categories;
            inProgress = false;
        }).catch((err) => {
        error = 'Could not send the question';
        inProgress = false;
    });

    function submitForm() {
        inProgress = true;
        questionProxy.addQuestion(question).then(response => response.json())
            .then((data) => {
                inProgress = false;
                if (data.message == 'not found') {
                    error = 'Could not send the question';
                }
                if (data) {
                    location.href = '/';
                }
            }).catch((err) => {
            error = 'Could not send the question';
            inProgress = false;
        });
    }

    function getSelectedCategories() {
        question.categories = [];
        for (let option of document.getElementById('categories')) {
            if (option.selected) {
                question.categories.push(option.value);
            }
        }
    }

</script>

<svelte:head>
    <title>StackShare - Add your question</title>
</svelte:head>

<form on:submit|preventDefault="{submitForm}">
    {#if error}
        <span class="error-message">{error}</span>
    {/if}
    <input class="" bind:value="{question.title}" type="text" placeholder="Title" required>
    <input class="" bind:value="{question.description}" type="text" placeholder="description"
           required>

    {#if allCategories}
        <select id="categories" multiple="multiple" on:change={getSelectedCategories}>
            {#each allCategories.data as category}
                <option value="{category.id}">{category.name}</option>
            {/each}
        </select>
    {/if}

    <button class="login-button primary-button" disabled="{inProgress}">Add the question</button>
</form>
