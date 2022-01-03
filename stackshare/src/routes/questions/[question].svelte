<script lang="ts">
    import {page} from '$app/stores';
    import {Comment, Comments, Question} from '../../models';
    import {QuestionsProxyService, UserProxyService} from '../../services/backend-services';

    let question: Question;
    let comments: Comments;
    let newComment = {message: ''} as Comment;
    let loading, loadingComments = true;
    let error, errorComments, messageError, errorAddComment = null;
    let inProgress, isLoggedIn = false;
    const questionsProxy = new QuestionsProxyService();
    const userProxy = new UserProxyService();

    const getQuestionData = () => {
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
    }

    userProxy.checkUserStatus().then(response => response.json()).then(() => {
        isLoggedIn = !(newComment.message);
    });

    getQuestionData();

    questionsProxy.getAllComments($page.params.question).then(response => response.json())
        .then((response: Comments) => {
            comments = response;
            loadingComments = false;
            response.data.forEach(function (comment) {
                let date = new Date(comment.created_at);
                let hours = date.getHours();
                let minutes = '0' + date.getMinutes();
                comment.created_date = date.toDateString() + ' ' + hours + ':' + minutes.substr(-2);
            });
        }).catch((err) => {
        loadingComments = false;
        errorComments = 'Could not load the comments';
    });

    function countLikesUp() {
        if (isLoggedIn) {
            questionsProxy.updateLikesCountById(question.uuid, {likes: question.likes + 1}).then(() => {
                getQuestionData();
            });
        } else {
            alert("You have to be logged in to update the count.");
        }
    }

    function countLikesDown() {
        if (isLoggedIn) {
            questionsProxy.updateLikesCountById(question.uuid, {likes: question.likes - 1}).then(() => {
                getQuestionData();
            });
        } else {
            alert("You have to be logged in to update the count.");
        }
    }

    function submitNewComment() {
        userProxy.checkUserStatus().then(response => response.json()).then(() => {
            messageError = !(newComment.message);
            inProgress = true;
            if (!messageError) {
                questionsProxy.addComment(question.uuid, newComment).then(response => response.json())
                    .then((data) => {
                        inProgress = false;
                        if (data.message == 'not found') {
                            errorAddComment = 'Could not add the comment';
                        }
                        if (data) {
                            location.href = '/';
                        }
                    }).catch((err) => {
                    errorAddComment = 'Could not add the comment';
                    inProgress = false;
                });
            }
            inProgress = false;
        }).catch(() => {
            alert("You can't add a comment when you are not logged in.");
        });
    }

    function countCommentLikesUp() {
    }

    function countCommentLikesDown() {
    }

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

    {#if !loading && !error && question}
        <p>Todo: Add delete button if this is create by the logged in user.</p>
        <p>Add edit button that toggles full view when created by user who is logged in</p>
        <div class="questions-content">
            <div class="question-likes">
                <button on:click={countLikesUp}>Up</button>
                <p>{question?.likes}</p>
                <button on:click={countLikesDown}>Down</button>
            </div>
            <div class="question-information">
                <p style="color: red">Todo: Edit and delete function</p>
                <p class="title">{question?.title ?? ''}</p>
                <p>{question?.description ?? '' }</p>
                <p>{question?.categories[0] ?? '' }</p>
                <p>Written by {question?.user?.name ?? '--' } on {question?.created_date ?? '--' }</p>
            </div>
        </div>
    {/if}

    {#if errorComments}
        <span class="error-message">{errorComments}</span>
    {/if}

    {#if !loadingComments}
        {#each comments.data as comment}
            <div class="comment-content">
                <div class="comment-info">
                    <div class="comment-likes">
                        {#if comment.likes !== ''}
                            <button on:click={countCommentLikesUp}>Up</button>
                            <p>{comment?.likes}</p>
                            <button on:click={countCommentLikesDown}>Down</button>
                        {:else}
                            <p>Likes --</p>
                        {/if}
                    </div>
                    <div class="message">
                        <p>{comment?.message ?? '--'}</p>
                        <div class="written-by">
                            <p style="color: red">Todo: delete function when it's the current userId</p>
                            <p>Written by {comment?.user?.name ?? '--'} on {comment?.created_date ?? '--'}</p>
                        </div>
                    </div>
                </div>
            </div>
        {/each}

        <div class="add-comment">
            <form on:submit|preventDefault="{submitNewComment}" class="add-comment-form">
                <p>Add a comment</p>
                {#if errorAddComment}
                    <div class="error">
                        <span class="error-message">{error}</span>
                    </div>
                {/if}
                {#if messageError}
                    <div class="error">
                        <span class="error-message">Message can't be empty</span>
                    </div>
                {/if}
                <div class="textarea-field">
                    <textarea rows="5" bind:value="{newComment.message}" placeholder="Message"></textarea>
                </div>
                <input type="submit" class="button" disabled="{inProgress}"/>
            </form>
        </div>
    {/if}
</div>

<style lang="scss">
  .details-content {
    margin-left: 15%;
    margin-right: 15%;

    .questions-content {
      .question-likes {
        width: 50px;
        margin-top: auto;
        margin-bottom: auto;
        display: flex;
      }

      display: flex;

      .question-information {
        width: auto;
        margin-top: 35px;

        .title {
          font-size: 1.3rem;
        }
      }
    }

    .comment-content {
      margin-top: 20px;
      border-radius: 10px;
      background-color: #f3f3f3;
      padding: 4px 20px;

      .comment-info {
        display: flex;

        .comment-likes {
          width: 40px;
        }

        .message {
          p:first-of-type {
            font-size: 1.05rem;
            margin: 2px 0 4px;
          }

          .written-by {
            p {
              font-size: .9rem;
            }
          }
        }
      }
    }

    .add-comment {
      .add-comment-form {
        display: flex;
        flex-direction: column;

        p {
          font-size: 1.1rem;
          margin-bottom: 0;
        }

        .error {
          width: 390px;
          margin-left: 10px;
          margin-top: 8px;
          font-size: 1rem;

          .error-message {
            color: #de3232;
          }
        }

        .button {
          width: 100px;
          background-color: #6151ee;
          border: none;
          outline: none;
          height: 40px;
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

      .textarea-field {
        background-color: #f0f0f0;
        margin: 10px 0;
        height: 110px;
        border-radius: 15px;
        display: grid;
        grid-template-columns: 100%;
        padding: 10px .7rem;
        position: relative;

        textarea {
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
  }
</style>
