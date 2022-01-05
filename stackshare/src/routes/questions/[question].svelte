<script lang="ts">
    import {page} from '$app/stores';
    import {Category, Comment, Comments, Question} from '../../models';
    import {
        CategoriesProxyService,
        QuestionsProxyService,
        StoreCookie,
        UserProxyService
    } from '../../services/backend-services';

    let question: Question;
    let comments: Comments;
    let editQuestion: Question;
    let categories: Category[] = [];
    let newComment = {message: ''} as Comment;
    let loading, loadingComments = true;
    let editButtonText = 'Edit question';
    let error, errorComments, messageError, errorAddComment = null;
    let inProgress, isLoggedIn, didCountUp, didCountDown, editView, editTitleError, editDescriptionError = false;

    const questionsProxy = new QuestionsProxyService();
    const categoriesProxy = new CategoriesProxyService();
    const userProxy = new UserProxyService();
    const storeService = new StoreCookie();

    const getQuestionData = async () => {
        await questionsProxy.getQuestionById($page.params.question).then(response => response.json())
            .then(async (response: Question) => {
                question = response;
                loading = false;
                let date = new Date(question.created_at);
                question.created_date = date.toDateString() + ' ' + date.getHours() + ':' + ('0' + date.getMinutes()).substr(-2);
            }).then(async () => {
                await categoriesProxy.getAllCategories().then(response => response.json()).then((results) => {
                    categories = question.categories;
                    results.data.forEach(cat => {
                        question.categories.forEach(category => {
                            if (cat._id === category) {
                                categories.push(cat);
                            }
                        });
                    });
                });
            }).catch((err) => {
                loading = false;
                error = 'Could not load the question, something went wrong!';
            });
    }

    const getAllComments = () => {
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
    }

    userProxy.checkUserStatus().then(response => response.json()).then(() => {
        isLoggedIn = !(newComment.message);
    }).catch((err) => {
        isLoggedIn = false;
    });

    getQuestionData();
    getAllComments();

    function countLikesUp() {
        if (isLoggedIn) {
            if (!didCountUp) {
                questionsProxy.updateLikesCountById(question.uuid, {likes: question.likes + 1}).then(() => {
                    didCountUp = true;
                    getQuestionData();
                });
            } else {
                alert("You can only count ones");
            }
        } else {
            alert("You have to be logged in to update the count.");
        }
    }

    function countLikesDown() {
        if (isLoggedIn) {
            if (!didCountDown) {
                questionsProxy.updateLikesCountById(question.uuid, {likes: question.likes - 1}).then(() => {
                    didCountDown = true;
                    getQuestionData();
                });
            } else {
                alert("You can only count ones");
            }
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
                        if (data.message == 'not found') {
                            errorAddComment = 'Could not add the comment';
                        }
                        if (data) {
                            location.reload();
                        }
                    }).catch((err) => {
                    errorAddComment = 'Could not add the comment';
                });
            }
            inProgress = false;
        }).catch(() => {
            alert("You can't add a comment when you are not logged in.");
        });
    }

    function countCommentLikesUp(comment) {
        if (isLoggedIn) {
            questionsProxy.updateCommentLikeCountById(question.uuid, comment.id, {likes: comment?.likes + 1}).then(() => {
                getAllComments();
            });
        } else {
            alert("You have to be logged in to update the count.");
        }
    }

    function countCommentLikesDown(comment) {
        if (isLoggedIn) {
            questionsProxy.updateCommentLikeCountById(question.uuid, comment.id, {likes: comment?.likes - 1}).then(() => {
                getAllComments();
            });
        } else {
            alert("You have to be logged in to update the count.");
        }
    }

    function deleteQuestion() {
        if (confirm("Are you sure you want to delete this question?")) {
            if (storeService.getCookie('stackshare-id')) {
                questionsProxy.deleteQuestion(question.uuid, {
                    user: {_id: storeService.getCookie('stackshare-id')}
                }).then((result) => {
                    if (result.status === 401) {
                        alert("You can't delete this question");
                    } else {
                        location.href = '/';
                    }
                }).catch((err) => {
                    alert("You can't delete this question");
                });
            } else {
                alert("You can't delete a question that does not belong to you or you have to login");
            }
        }
    }

    function deleteComment(comment) {
        if (confirm("Are you sure you want to delete this comment?")) {
            if (storeService.getCookie('stackshare-id')) {
                questionsProxy.deleteComment(question.uuid, comment.uuid, {
                    user: {_id: storeService.getCookie('stackshare-id')}
                }).then((result) => {
                    if (result.status === 401) {
                        alert("You can't delete this comment");
                    } else {
                        location.reload();
                    }
                }).catch((err) => {
                    alert("You can't delete a comment that does not belong to you");
                });
            } else {
                alert("You can't delete a comment that does not belong to you or you have to login");
            }
        }
    }

    function toggleEditView() {
        editView = !editView;
        if (editView) {
            editButtonText = 'Cancel edit';
        } else {
            editButtonText = 'Edit question';
        }
    }

    function submitEditForm() {
        editTitleError = question.title === '';
        editDescriptionError = question.description === '';
        if (question.user._id !== storeService.getCookie('stackshare-id')) {
            alert("You can't edit a question that is not yours");
        } else {
            if (!editTitleError && !editDescriptionError) {
                questionsProxy.updateQuestion(question.uuid, {
                    title: question.title,
                    description: question.description,
                    user: question.user,
                    _id: storeService.getCookie('stackshare-id')
                }).then(response => response.json()).then((results) => {
                    if (results.message) {
                        alert(results.message);
                    }
                    editView = false;
                }).catch((err) => {
                    alert("You can't edit a question that is not yours");
                });
            }
        }
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
        <div class="buttons-group">
            {#if isLoggedIn}
                <button on:click={toggleEditView} class="button-edit">{editButtonText}</button>
                <button on:click={deleteQuestion} class="button-delete">Delete</button>
            {/if}
        </div>

        {#if !editView}
            <div class="questions-content">
                <div class="question-likes">
                    {#if isLoggedIn}
                        <button on:click={countLikesUp}>Up</button>
                        <p>{question?.likes}</p>
                        <button on:click={countLikesDown}>Down</button>
                    {/if}
                </div>
                <div class="question-information">
                    <p class="title">{question?.title ?? ''}</p>
                    <p>{question?.description ?? '' }</p>
                    <div class="categories-list">
                        {#each categories as category}
                            {#if category.name}
                                <p>{category.name}</p>
                            {/if}
                        {/each}
                    </div>
                    <p>Written by {question?.user?.name ?? '--' } on {question?.created_date ?? '--' }</p>
                </div>
            </div>
        {:else}
            <div class="edit-question">
                <form on:submit|preventDefault="{submitEditForm}" class="edit-question-form">
                    <p>Update the question</p>
                    <label>Title</label>
                    {#if editTitleError}
                        <div class="error">
                            <span class="error-message">The description can't be empty</span>
                        </div>
                    {/if}
                    <div class="input-field">
                        <input type="text" bind:value="{question.title}" placeholder="Title">
                    </div>
                    <label>Description</label>
                    {#if editDescriptionError}
                        <div class="error">
                            <span class="error-message">The description can't be empty</span>
                        </div>
                    {/if}
                    <div class="textarea-field">
                        <textarea rows="5" bind:value="{question.description}" placeholder="Message"></textarea>
                    </div>
                    <input type="submit" class="button" disabled="{inProgress}" value="Update"/>
                </form>
            </div>
        {/if}
    {/if}

    {#if errorComments}
        <div class="error-comments">
            <span class="error-message">{errorComments}</span>
        </div>
    {/if}

    {#if !loadingComments && comments.data && question}
        {#each comments.data as comment}
            <div class="comment-content">
                <div class="buttons-group">
                    {#if isLoggedIn}
                        <button>Edit</button>
                        <button on:click={deleteComment(comment)}>Delete</button>
                    {/if}
                </div>
                <div class="comment-info">
                    <div class="comment-likes">
                        {#if isLoggedIn}
                            {#if comment.likes !== ''}
                                <button on:click={countCommentLikesUp(comment)}>Up</button>
                                <p>{comment?.likes}</p>
                                <button on:click={countCommentLikesDown(comment)}>Down</button>
                            {:else}
                                <p>Likes --</p>
                            {/if}
                        {/if}
                    </div>
                    <div class="message">
                        <p>{comment?.message ?? '--'}</p>
                        <div class="written-by">
                            <p>Written by {comment?.user?.name ?? '--'} on {comment?.created_date ?? '--'}</p>
                        </div>
                    </div>
                </div>
            </div>
        {/each}

        {#if isLoggedIn}
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
    {/if}
</div>

<style lang="scss">
  .details-content {
    margin-top: 25px;
    margin-left: 15%;
    margin-right: 15%;

    .buttons-group {
      float: right;

      .button-edit, .button-delete {
        border: none;
        outline: none;
        height: 30px;
        border-radius: 49px;
        color: #fff;
        font-size: .9rem;
        margin: 10px 0;
        cursor: pointer;
      }

      .button-edit {
        width: 110px;
        background-color: #6151ee;

        &:hover {
          background-color: #4539c4;
        }
      }

      .button-delete {
        width: 85px;
        background-color: #ce2d2d;

        &:hover {
          background-color: #4539c4;
        }
      }
    }

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

        .categories-list {
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

    .add-comment, .edit-question {
      .add-comment-form, .edit-question-form {

        label {
          margin-top: 10px;
        }

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
