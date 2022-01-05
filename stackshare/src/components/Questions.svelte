<script lang="ts">
    import {Questions} from '../models';
    import {QuestionsProxyService} from '../services/backend-services';

    let questions: Questions;
    let loading = true;
    let error = '';
    let searchValue = null;
    let filteredQuestions: Questions;
    const questionsProxy = new QuestionsProxyService();

    const getQuestions = () => {
        questionsProxy.getAllQuestions().then(response => response.json())
            .then((response: Questions) => {
                filteredQuestions = questions = response;
                loading = false;
                for (let question of questions.data) {
                    let date = new Date(question.created_at);
                    question.created_date = date.toDateString() + ' ' + date.getHours() + ':' + ('0' + date.getMinutes()).substr(-2);
                }
            }).catch((err) => {
            loading = false;
            error = 'Could not load the questions';
        });
    }

    getQuestions();

    function filterQuestions() {
        if (searchValue === '') {
            getQuestions();
        } else {
            filteredQuestions.data = questions.data.filter(function (e) {
                return e.title.toLowerCase().includes(searchValue.toLowerCase())
                    || e.description.toLowerCase().includes(searchValue.toLowerCase());
            });
        }
    }
</script>

{#if error}
    <div class="questions">
        <span class="error-message">{error}</span>
    </div>
{/if}

{#if loading}
    <div class="questions">
        <p>Loading questions data...</p>
    </div>
{/if}

{#if questions && !error && !loading}
    <div class="questions">
        <h3>Most recent questions</h3>
        <div class="search-bar">
            <div class="input-field">
                <input type="text" placeholder="Search for a question..." bind:value={searchValue}
                       on:change={filterQuestions}>
            </div>
        </div>
        {#if filteredQuestions.data.length === 0}
            <div class="question-content">
                <p>Could not find something for {searchValue}</p>
            </div>
        {:else}
            {#each filteredQuestions.data.sort((q1, q2) => q1.created_at < q2.created_at) as question}
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
                                    <p>{category.name}</p>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </a>
            {/each}
        {/if}
    </div>
{/if}

<style lang="scss">
  .questions {
    margin-left: 15%;
    margin-right: 15%;

    .search-bar {
      .input-field {
        background-color: #f0f0f0;
        margin: 10px 0;
        height: 40px;
        border-radius: 55px;
        display: grid;
        padding: 0 1rem;
        position: relative;

        input {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 500;
          font-size: 1rem;
          color: #333;

          &::placeholder {
            color: #aaa;
            font-weight: 500;
          }
        }
      }
    }

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
