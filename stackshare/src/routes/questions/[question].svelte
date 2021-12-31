<script lang="ts">
    import {page} from '$app/stores';
    import {Comments, Question} from '../../models';
    import {QuestionsProxyService} from '../../services/backend-services';

    let question: Question;
    let comments: Comments;
    let loading, loadingComments = true;
    let error, errorComments = null;
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

    questionsProxy.getAllComments($page.params.question).then(response => response.json())
        .then((response: Comments) => {
            comments = response;
            loadingComments = false;
        }).catch((err) => {
        loadingComments = false;
        errorComments = 'Could not load the comments';
    });
</script>

<svelte:head>
    <title>StackShare - Question</title>
</svelte:head>

<div class="details-content">
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

    {#if errorComments}
        <span class="error-message">{errorComments}</span>
    {/if}

    {#if !loadingComments}
        {#each comments.data as comment}
            <div class="comment-content">
                <div class="title-section">
                    <p>{comment.message}</p>
                    <div class="written-by">
                        <p>Written by {comment?.user?.name ?? '--'} on {comment?.created_at}</p>
                    </div>
                </div>
            </div>
        {/each}
    {/if}
</div>

<style lang="scss">

  .details-content {
    margin-left: 10%;
    margin-right: 10%;

    .question-information {
      margin-top: 35px;

      .title {
        font-size: 1.3rem;
      }
    }

    .comment-content {
      margin-top: 20px;
      border-radius: 10px;
      background-color: #f3f3f3;
      padding: 4px 20px;

      .title-section {
        p:first-of-type {
          font-size: 1.3rem;
          margin: 2px 0 4px;
        }

        .written-by p {
          font-size: .9rem;
        }
      }

      #description {
        color: #989898;
      }

      .categories {
        display: flex;

        p {
          color: #FFF;
          padding: 4px 10px;
          margin: 4px;
          background-color: #5148D5;
          border-radius: 20px;
        }
      }
    }
  }
</style>
