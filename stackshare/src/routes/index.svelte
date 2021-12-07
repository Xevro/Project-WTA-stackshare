<script lang="ts">
    import {CategoriesProxyService, QuestionsProxyService} from '../services/backend-services';
    import type {Categories, Questions} from '../models';

    let questions: Questions;
    let categories: Categories;
    let error = '';
    const questionsProxy = new QuestionsProxyService();
    const categoriesProxy = new CategoriesProxyService();

    questionsProxy.getAllQuestions().then(response => response.json())
        .then((response: Questions) => {
            questions = response;
        }).catch((err) => {
        error = 'Could not load the questions';
    });

    categoriesProxy.getAllCategories().then(response => response.json())
        .then((response: Categories) => {
            categories = response;
            console.log(response);
        }).catch((err) => {
        error = 'Could not load the categories';
    });
</script>

<svelte:head>
    <title>StackShare</title>
</svelte:head>

{#if error}
    <span class="error-message">{error}</span>
{/if}

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

{#if questions && !error}
    <p>Total questions: {questions.totalCount}</p>
    <ul>
        {#each questions.data as question}
            <li>
                <p>{question.title}</p>
                <p>{question.categories}</p>
                <p>{question.description}</p>
                <p>Written by {question.user.name} on {question.created_at}</p>
            </li>
        {/each}
    </ul>
{/if}
