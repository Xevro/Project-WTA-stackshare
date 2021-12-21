<script lang="ts">
    import {CategoriesProxyService, QuestionsProxyService} from '../../../services/backend-services';
    import type {Categories, Category, Question} from '../../../models';
    import MultiSelect from 'svelte-multiselect';

    let question = {title: '', description: '', categories: []} as Question;
    let inProgress = true;
    let error = null;
    let allCategories: Category[];
    const questionProxy = new QuestionsProxyService();
    const categoriesProxy = new CategoriesProxyService();
    let showCategories: String[] = [];
    let selected;

    categoriesProxy.getAllCategories().then(response => response.json())
        .then((categories: Categories) => {
            allCategories = categories.data;
            inProgress = false;
            for (let category of allCategories) {
                showCategories.push(category.name);
            }
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
        if (allCategories && selected) {
            for (let category of selected) {
                for (let cat of allCategories) {
                    if (category === cat.name) {
                        question.categories.push({_id: cat._id});
                    }
                }
            }
        }
    }
</script>

<svelte:head>
    <title>StackShare - Add your question</title>
</svelte:head>

<div class="add-question">
    <form on:submit|preventDefault="{submitForm}" class="add-question-form">
        <h2 class="title">Add a question</h2>
        {#if error}
            <div class="error">
                <span class="error-message">{error}</span>
            </div>
        {/if}
        <div class="input-field">
            <input type="text" bind:value="{question.title}" placeholder="Title"/>
        </div>
        <div class="input-field">
            <input type="text" bind:value="{question.description}" placeholder="Description"/>
        </div>

        {#if showCategories}
            <MultiSelect bind:selected on:change={getSelectedCategories} options={showCategories}/>
        {/if}
        <input type="submit" class="button" disabled="{inProgress}"/>
    </form>
</div>

<style lang="scss">
  .add-question {
    position: absolute;
    top: 40%;
    transform: translate(-50%, -50%);
    left: 50%;
    width: 50%;
    transition: 1s .7s ease-in-out;
    z-index: 5;
  }

  form {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0 5rem;
    transition: all 0.2s 0.7s;
    overflow: hidden;

    &.add-question-form {
      z-index: 2;
      height: 500px;
    }

    .error {
      width: 390px;
      font-size: 1rem;

      .error-message {
        color: #de3232;
      }
    }
  }

  .title {
    font-size: 2.2rem;
    color: #444;
    margin-bottom: 10px;
  }

  .input-field {
    max-width: 380px;
    width: 100%;
    background-color: #f0f0f0;
    margin: 10px 0;
    height: 55px;
    border-radius: 55px;
    display: grid;
    grid-template-columns: 100%;
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

  .button {
    width: 150px;
    background-color: #6151ee;
    border: none;
    outline: none;
    height: 49px;
    border-radius: 49px;
    color: #fff;
    font-weight: 500;
    font-size: 1rem;
    margin: 10px 0;
    cursor: pointer;
    transition: 0.5s;

    &:hover {
      background-color: #4539c4;
    }
  }

  .button.transparent {
    margin: 0;
    background: none;
    border: 2px solid #fff;
    width: 130px;
    height: 41px;
    font-weight: 500;
    font-size: .9rem;
  }

  .container.sign-up-mode {
    &:before {
      transform: translate(100%, -50%);
      right: 52%;
    }

    .add-question {
      left: 25%;
    }

    form {
      &.add-question-form {
        opacity: 0;
        z-index: 1;
      }
    }
  }

  @media (max-width: 870px) {
    .container {
      min-height: 700px;
      height: 100%;
    }

    .add-question {
      width: 100%;
      top: 55%;
      transform: translate(-50%, -100%);
      transition: 1s .8s ease-in-out;
      left: 50%;
    }

    .container .add-question {
      left: 50%;
    }
  }

  .button.transparent {
    width: 110px;
    height: 35px;
    font-size: .7rem;
  }

  .container.sign-up-mode .add-question {
    top: 5%;
    transform: translate(-50%, 0);
  }

  @media (max-width: 570px) {
    form {
      padding: 0 1.5rem;
    }

    .container {
      padding: 1.5rem;

      &:before {
        bottom: 72%;
        left: 50%;
      }

      &.sign-up-mode:before {
        bottom: 28%;
        left: 50%;
      }
    }
  }
</style>

