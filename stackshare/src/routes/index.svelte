<script lang="ts">
    import {QuestionsProxyService} from '../services/backend-services/questions-proxy.service';

    let inProgress = false;
    let questions = [];
    let error = '';
    const questionsProxy = new QuestionsProxyService();
    inProgress = true;

    questionsProxy.getAllQuestions().then(response => response.json())
        .then((response) => {
            questions = response.data;
            console.log(response.data);
            inProgress = false;
        }).catch((err) => {
        console.log(err);
        error = 'Could not load the questions';
        inProgress = false;
    });
</script>

<svelte:head>
    <title>StackShare</title>
</svelte:head>

{#if error}
    <span class="error-message">{error}</span>
{/if}

<ul>
    {#each questions as question}
        <li>
            <p>{question.title}</p>
        </li>
    {/each}
</ul>
