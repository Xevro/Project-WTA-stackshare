<script lang="ts">
    import {Questions} from '../models';
    import {QuestionsProxyService} from '../services/backend-services';

    let questions: Questions;
    let error = '';
    const questionsProxy = new QuestionsProxyService();

    questionsProxy.getAllQuestions().then(response => response.json())
        .then((response: Questions) => {
            questions = response;
            for (let question of questions.data) {
                let date = new Date(question.created_at * 1000);
                let hours = date.getHours();
                let minutes = '0' + date.getMinutes();
                let seconds = '0' + date.getSeconds();
                question.created_date = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay() + ' ' +
                    hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            }
        }).catch((err) => {
        error = 'Could not load the questions';
    });
</script>

{#if error}
    <span class="error-message">{error}</span>
{/if}

{#if questions && !error}
    <div class="questions">
        {#each questions.data as question}
            <a href="/questions/{question.uuid}">
                <div class="question-content">
                    <div class="title-section">
                        <p>{question.title}</p>
                        <div class="written-by">
                            <p>Written by {question?.user?.name ?? '--'} on {question?.created_date}</p>
                        </div>
                    </div>
                    <p id="description">
                        { question?.description?.length > 250 ? question?.description.substring(0, 250 - 3) + '...' : question?.description }
                    </p>
                    {#if question.categories}
                        <div class="categories">
                            {#each question?.categories as category}
                                <p>{category}</p>
                            {/each}
                        </div>
                    {/if}
                </div>
            </a>
        {/each}
    </div>
{/if}

<style lang="scss">
  .questions {
    margin-left: 10%;
    margin-right: 10%;

    a {
      color: inherit;
      text-decoration: none;
    }

    .question-content {
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

  @media (max-width: 768px) {
    .questions {
      margin-left: 20px;
      margin-right: 20px;
    }
  }
</style>
