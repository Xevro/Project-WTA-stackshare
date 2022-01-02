<script lang="ts">
    import {User, UserAuth} from '../../models';
    import {UserProxyService} from '../../services/backend-services';
    import {StoreCookie} from '../../services/core-services/store-cookie';

    let user = {username: '', password: ''} as User;
    let inProgress = false;
    let error, errorEmail, errorUsername, errorPassword, errorPasswordConfirm = null;
    let showRegister = false;
    const userProxy = new UserProxyService();
    const store = new StoreCookie();

    userProxy.checkUserStatus().then(response => response.json())
        .then((result) => {
            location.href = '/';
        });

    function submitLoginForm() {
        inProgress = true;
        userProxy.loginMethod(user).then(response => response.json())
            .then((data: UserAuth) => {
                inProgress = false;
                error = data.message ?? '';
                user.password = '';
                if (data.token) {
                    store.setCookie('stackshare', data.token);
                    user = {username: '', password: ''} as User;
                    location.href = '/';
                }
            }).catch((err) => {
            error = 'Could not login due to an error';
            inProgress = false;
        });
    }

    const validateEmail = (email) => {
        return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    const validatePassword = (password) => {
        return String(password).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/);
    };

    function submitRegisterForm() {
        if (!validateEmail(user.email)) {
            errorEmail = 'Email field is not in the right format';
        } else {
            errorEmail = null;
        }
        if (user.username === '') {
            errorUsername = 'Username can\'t be empty';
        } else {
            errorUsername = null;
        }

        if (!validatePassword(user.password)) {
            errorPassword = 'Password does not meet the requirements';
        } else {
            errorPassword = false;
        }

        if (user.passwordConfirm === user.password && errorPassword === null && errorEmail === null && errorUsername === null) {
            errorPasswordConfirm = null;
            inProgress = true;
            userProxy.registerMethod(user).then(response => response.json())
                .then((data: UserAuth) => {
                    inProgress = false;
                    error = data.message ?? '';
                    store.setCookie('stackshare', data.token);
                    user = {username: '', password: ''} as User;
                    location.href = '/';
                }).catch((err) => {
                error = 'Could not register a new account due to an error';
                inProgress = false;
            });
        } else {
            errorPasswordConfirm = 'Passwords does not match';
        }
    }

    function toggleView() {
        showRegister = !showRegister;
    }
</script>

<svelte:head>
    <title>StackShare - Authentication</title>
</svelte:head>

<div class="container" class:sign-up-mode={showRegister}>
    <div class="forms-container">
        <div class="sign-in-signup">
            <form on:submit|preventDefault="{submitLoginForm}" class="sign-in-form">
                <h2 class="title">Sign in</h2>
                {#if error}
                    <div class="error">
                        <span class="error-message">{error}</span>
                    </div>
                {/if}
                <div class="input-field">
                    <input type="text" bind:value="{user.username}" placeholder="Username"/>
                </div>
                <div class="input-field">
                    <input type="password" bind:value="{user.password}" placeholder="Password"/>
                </div>
                <input type="submit" class="button" value="Login" disabled="{inProgress}"/>
            </form>

            <form on:submit|preventDefault="{submitRegisterForm}" class="sign-up-form">
                <h2 class="title">Sign up</h2>
                {#if errorUsername}
                    <div class="error">
                        <span class="error-message">{errorUsername}</span>
                    </div>
                {/if}
                <div class="input-field">
                    <input type="text" bind:value="{user.username}" placeholder="Username"/>
                </div>
                {#if errorEmail}
                    <div class="error">
                        <span class="error-message">{errorEmail}</span>
                    </div>
                {/if}
                <div class="input-field">
                    <input type="email" bind:value="{user.email}" placeholder="Email"/>
                </div>
                {#if errorPassword}
                    <div class="error">
                        <span class="error-message">{errorPassword}</span>
                        <span class="error-message">
                            <div class="password-requirements">
                                <p>The string must contain at least 1 lowercase alphabetical character</p>
                                <p>The string must contain at least 1 uppercase alphabetical character</p>
                                <p>The string must contain at least 1 numeric character</p>
                                <p>The string must contain at least one special character</p>
                                <p>The string must be 8 characters or longer</p>
                            </div>
                        </span>
                    </div>
                {/if}
                <div class="input-field">
                    <input type="password" bind:value="{user.password}" placeholder="Password"/>
                </div>
                {#if errorPasswordConfirm}
                    <div class="error">
                        <span class="error-message">{errorPasswordConfirm}</span>
                    </div>
                {/if}
                <div class="input-field">
                    <input type="password" bind:value="{user.passwordConfirm}" placeholder="Password confirm"/>
                </div>
                {#if error}
                    <div class="error">
                        <span class="error-message">{error}</span>
                    </div>
                {/if}
                <input type="submit" class="button" value="Sign up" disabled="{inProgress}"/>
            </form>
        </div>
    </div>

    <div class="panels-container">
        <div class="panel left-panel">
            <div class="content">
                <h3>New here?</h3>
                <p>Create an account and start posting your own questions.</p>
                <button class="button transparent" on:click={toggleView}>Sign up</button>
            </div>
            <img src="static/logo.svg" class="image" alt="Login background"/>
        </div>
        <div class="panel right-panel">
            <div class="content">
                <h3>One of us?</h3>
                <p>Login and start with asking and answering questions.</p>
                <button class="button transparent" on:click={toggleView}>Sign in</button>
            </div>
            <img src="static/register.svg" class="image" alt="Registration background"/>
        </div>
    </div>
</div>

<style lang="scss">
  .container {
    position: relative;
    width: auto;
    min-height: 100vh;
    overflow: hidden;
  }

  .forms-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .sign-in-signup {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    left: 75%;
    width: 50%;
    transition: 1s 0.7s ease-in-out;
    display: grid;
    grid-template-columns: 1fr;
    z-index: 5;
  }

  form {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 5rem;
    transition: all 0.2s 0.7s;
    overflow: hidden;
    grid-column: 1 / 2;
    grid-row: 1 / 2;

    &.sign-up-form {
      opacity: 0;
      z-index: 1;
    }

    &.sign-in-form {
      z-index: 2;
    }

    .error {
      width: 390px;
      font-size: 1rem;

      .error-message {
        color: #de3232;
      }

      .password-requirements {
        p {
          font-size: .85rem;
          margin: 0;
          padding: 0;
        }
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

  .panels-container {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .container:before {
    content: "";
    position: absolute;
    height: 2000px;
    width: 2000px;
    top: -10%;
    right: 48%;
    transform: translateY(-50%);
    background-image: linear-gradient(-40deg, #5542D3 0%, #4676f6 100%);
    transition: 1.8s ease-in-out;
    border-radius: 50%;
    z-index: 6;
  }

  .image {
    width: 100%;
    transition: transform 1.1s ease-in-out;
    transition-delay: 0.4s;
  }

  .panel {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
    text-align: center;
    z-index: 6;
  }

  .left-panel {
    pointer-events: all;
    padding: 3rem 17% 2rem 12%;
  }

  .right-panel {
    pointer-events: none;
    padding: 3rem 12% 2rem 17%;
  }

  .panel {
    .content {
      color: #fff;
      transition: transform 0.9s ease-in-out;
      transition-delay: 0.6s;
    }

    h3 {
      font-weight: 600;
      line-height: 1;
      font-size: 1.5rem;
    }

    p {
      font-size: 0.95rem;
      padding: 0.7rem 0;
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

  .right-panel {
    .image, .content {
      transform: translateX(800px);
    }
  }

  /* ANIMATION */

  .container.sign-up-mode {
    &:before {
      transform: translate(100%, -50%);
      right: 52%;
    }

    .left-panel {
      .image, .content {
        transform: translateX(-800px);
      }
    }

    .sign-in-signup {
      left: 25%;
    }

    form {
      &.sign-up-form {
        opacity: 1;
        z-index: 2;
      }

      &.sign-in-form {
        opacity: 0;
        z-index: 1;
      }
    }

    .right-panel {
      .image, .content {
        transform: translateX(0%);
      }
    }

    .left-panel {
      pointer-events: none;
    }

    .right-panel {
      pointer-events: all;
    }
  }

  @media (max-width: 870px) {
    .container {
      min-height: 1130px;
      height: 100%;
    }

    .sign-in-signup {
      width: 100%;
      top: 85%;
      transform: translate(-50%, -100%);
      transition: 1s .8s ease-in-out;
      left: 50%;
    }

    .container.sign-up-mode .sign-in-signup {
      left: 50%;
    }

    .panels-container {
      margin-top: 30px;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 2fr 1fr;
    }

    .panel {
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      padding: 2.5rem 8%;
      grid-column: 1 / 2;
    }

    .right-panel {
      grid-row: 3 / 4;
    }

    .left-panel {
      grid-row: 1 / 2;
    }

    .image {
      width: 200px;
      transition: transform .9s ease-in-out;
      transition-delay: .6s;
    }

    .panel {
      .content {
        padding-right: 15%;
        transition: transform .9s ease-in-out;
        transition-delay: .8s;
      }

      h3 {
        font-size: 1.2rem;
      }

      p {
        font-size: .7rem;
        padding: .5rem 0;
      }
    }

    .button.transparent {
      width: 110px;
      height: 35px;
      font-size: .7rem;
    }

    .container {
      &:before {
        width: 1500px;
        height: 1500px;
        transform: translateX(-50%);
        left: 30%;
        bottom: 68%;
        right: initial;
        top: initial;
        transition: 2s ease-in-out;
      }

      &.sign-up-mode {
        &:before {
          transform: translate(-50%, 100%);
          bottom: 32%;
          right: initial;
        }

        .left-panel {
          .image, .content {
            transform: translateY(-300px);
          }
        }

        .right-panel {
          .image, .content {
            transform: translateY(0px);
          }
        }
      }
    }

    .right-panel {
      .image, .content {
        transform: translateY(300px);
      }
    }

    .container.sign-up-mode .sign-in-signup {
      top: 5%;
      transform: translate(-50%, 0);
    }
  }

  @media (max-width: 570px) {
    form {
      padding: 0 1.5rem;
    }

    .image {
      display: none;
    }

    .panel .content {
      padding: .5rem 1rem;
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
