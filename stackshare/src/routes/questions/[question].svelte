<script lang="ts">
    import {page} from '$app/stores';
    import {Question} from '../../models';
    import {QuestionsProxyService} from '../../services/backend-services';

    let question: Question;
    let loading = true;
    let error = '';
    const questionsProxy = new QuestionsProxyService();

    questionsProxy.getQuestionById($page.params.question).then(response => response.json())
        .then((response: Question) => {
            question = response;
            loading = false;
            let date = new Date(question.created_at);
            let hours = date.getHours();
            let minutes = '0' + date.getMinutes();
            question.created_date = date.toDateString() + ' ' + hours + ':' + minutes.substr(-2);
        }).catch((err) => {
        loading = false;
        error = 'Could not load the questions';
    });
</script>

{#if error}
    <span class="error-message">{error}</span>
{/if}


{#if loading}
    <div class="question-information">
        <p>Loading StackShare data...</p>
    </div>
{/if}

{#if !loading}
    <div class="question-information">
        <p class="title">{question?.title ?? ''}</p>
        <p>{question?.description ?? '' }</p>
        <p>{question?.created_date ?? '--' }</p>
    </div>
{/if}

<style lang="scss">

  .question-information {
    margin-right: 15%;
    margin-left: 15%;
    margin-top: 35px;

    .title {
      font-size: 1.3rem;
    }
  }
</style>
