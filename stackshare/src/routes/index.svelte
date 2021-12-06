<script lang="ts">
    import {QuestionsProxyService} from '../services/backend-services/questions-proxy.service';
    import type {Questions} from '../models';

    let questions: Questions;
    let error = '';
    const questionsProxy = new QuestionsProxyService();

    questionsProxy.getAllQuestions().then(response => response.json())
        .then((response: Questions) => {
            questions = response;
        }).catch((err) => {
        error = 'Could not load the questions';
    });
</script>

<svelte:head>
    <title>StackShare</title>
</svelte:head>

{#if error}
    <span class="error-message">{error}</span>
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
