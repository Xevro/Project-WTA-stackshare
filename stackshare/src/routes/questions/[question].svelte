<script lang="ts">
    import {page} from '$app/stores';
    import {Question} from '../../models';
    import {QuestionsProxyService} from '../../services/backend-services';

    let question: Question;
    let error = '';
    const questionsProxy = new QuestionsProxyService();

    questionsProxy.getQuestionById($page.params.question).then(response => response.json())
        .then((response: Question) => {
            question = response;
            console.log(response);
            let date = new Date(question.created_at * 1000);
            let hours = date.getHours();
            let minutes = '0' + date.getMinutes();
            let seconds = '0' + date.getSeconds();
            question.created_date = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay() + ' ' +
                hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        }).catch((err) => {
        error = 'Could not load the questions';
    });
</script>

{#if error}
    <span class="error-message">{error}</span>
{/if}

<p>{question?.title}</p>
<p>{question?.description}</p>
<p>{question?.created_date}</p>

