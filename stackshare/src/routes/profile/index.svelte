<script lang="ts">
    import {StoreCookie} from '../../services/core-services/store-cookie';
    import {QuestionsProxyService, UserProxyService} from '../../services/backend-services';
    import type {Questions, User} from '../../models';

    let user: User = {} as User;
    let userQuestions: Questions = {} as Questions;
    let loggedIn = false;
    let loading, loadingQuestions = true;
    let editProfile = false;
    let errorEmail, errorName, errorUsername = null;

    const cookie = new StoreCookie();
    const userProxy = new UserProxyService();
    const questionsProxy = new QuestionsProxyService();

    userProxy.getUserData(cookie.getCookie('stackshare-id')).then(response => response.json()).then((result) => {
        user = result;
        loggedIn = true;
    }).catch(() => {
        loggedIn = false;
    }).finally(() => {
        loading = false;
    });

    questionsProxy.getAllQuestionsForAUserById(cookie.getCookie('stackshare-id'))
        .then(response => response.json()).then((result) => {
        userQuestions = result;
        for (let question of userQuestions.data) {
            let date = new Date(question.created_at);
            question.created_date = date.toDateString() + ' ' + date.getHours() + ':' + ('0' + date.getMinutes()).substr(-2);
        }
    }).catch(() => {
    }).finally(() => {
        loadingQuestions = false;
    });

    function toggleEditView() {
        editProfile = !editProfile;
    }

    const validateEmail = (email) => {
        return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    function saveProfile() {
        editProfile = false;

        if (!validateEmail(user.email)) {
            errorEmail = 'Email field is not in the right format';
        } else {
            errorEmail = null;
        }
        if (user.name === '') {
            errorName = 'Name can\'t be empty';
        } else {
            errorName = null;
        }
        if (user.username === '') {
            errorUsername = 'Username can\'t be empty';
        } else {
            errorUsername = null;
        }

        if (errorEmail === null && errorName === null && errorUsername === null) {
            userProxy.updateUser(user.uuid, {
                name: user.name,
                username: user.username,
                email: user.email
            }).catch((err) => {
                alert("Something went wrong while uploading the profile data.");
            }); //.then(() => window.location.reload())
        }
    }

    function logout() {
        cookie.deleteCookie('stackshare');
        cookie.deleteCookie('stackshare-id');
        location.href = '/';
    }
</script>

<svelte:head>
    <title>StackShare - Your profile</title>
</svelte:head>

<div class="profile">
    <div class="logout-section">
        <button class="button" on:click={logout}>Log out</button>
    </div>
    {#if loading}
        <p>Loading the profile information...</p>
    {/if}
    {#if loggedIn}
        <h3>Profile information</h3>
        {#if !editProfile}
            <div class="profile-info">
                <p>Name: { user.name }</p>
                <p>Username: { user.username }</p>
                <p>Email: { user.email }</p>
                <button class="button" on:click={toggleEditView}>Edit information</button>
            </div>
        {:else}
            <div class="profile-edit">
                <form on:submit|preventDefault="{saveProfile}" class="edit-profile-form">
                    <div class="message">
                        <div class="input-field">
                            <input type="text" bind:value="{user.name}" placeholder="Name">
                        </div>
                        <div class="input-field">
                            <input type="text" bind:value="{user.username}" placeholder="Username">
                        </div>
                        <div class="input-field">
                            <input type="email" bind:value="{user.email}" placeholder="Email">
                        </div>
                    </div>
                    <input type="submit" class="save-button" value="Save"/>
                    <button class="cancel-button" on:click={toggleEditView}>Cancel</button>
                </form>
            </div>
        {/if}

        <div class="posts-overview">
            <h3>My questions</h3>
            {#if loadingQuestions}
                <p>Loading the questions...</p>
            {/if}
            {#if userQuestions.data}
                {#each userQuestions.data.sort((q1, q2) => q1.created_at < q2.created_at) as question}
                    <a href="/questions/{question.uuid}">
                        <div class="question-content">
                            <div class="title-section">
                                <p>{question.title}</p>
                                <div class="written-by">
                                    <p>Written on {question?.created_date}</p>
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
            {:else}
                <div class="no-questions">
                    <p>You have currently no questions on your profile.</p>
                </div>
            {/if}
        </div>
    {:else}
        <div class="not-logged-in">
            <p>You have to be logged in to see your profile.</p>
            <a href="/">Go back to the homepage</a>
        </div>
    {/if}

</div>

<style lang="scss">
  .profile {
    margin-left: 15%;
    margin-right: 15%;

    h3 {
      font-size: 1.45rem;
    }

    .logout-section {
      float: right;

      .button {
        width: 90px;
        background-color: #6151ee;
        border: none;
        outline: none;
        height: 35px;
        border-radius: 49px;
        color: #fff;
        font-weight: 500;
        font-size: 1rem;
        margin: 10px 0;
        cursor: pointer;

        &:hover {
          background-color: #4539c4;
        }
      }
    }

    .profile-info {
      margin-top: 40px;

      .button {
        width: 155px;
        background-color: #6151ee;
        border: none;
        outline: none;
        height: 35px;
        border-radius: 49px;
        color: #fff;
        font-weight: 500;
        font-size: 1rem;
        margin: 10px 0;
        cursor: pointer;

        &:hover {
          background-color: #4539c4;
        }
      }
    }

    .profile-edit {
      .edit-profile-form {

        .input-field {
          background-color: #f0f0f0;
          margin: 10px 0;
          width: 300px;
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

      .save-button, .cancel-button {
        border: none;
        outline: none;
        height: 30px;
        border-radius: 49px;
        color: #fff;
        font-size: .9rem;
        margin: 10px 0;
        cursor: pointer;

        &:hover {
          background-color: #4539c4;
        }
      }

      .save-button {
        width: 85px;
        background-color: #6151ee;

        &:hover {
          background-color: #4539c4;
        }
      }

      .cancel-button {
        width: 85px;
        background-color: #ce2d2d;

        &:hover {
          background-color: #9f1111;
        }
      }
    }

    .posts-overview {

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

    .no-questions {
      font-size: 1.1rem;
    }

    .not-logged-in {
      font-size: 1.1rem;
      text-align: center;

      a {
        color: #5148D5;
        text-decoration: none;
      }
    }
  }
</style>
