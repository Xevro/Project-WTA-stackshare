<script lang="ts">
    import {User, UserAuth} from '../../models';
    import {UserProxyService} from '../../services/backend-services/user-proxy.service';
    import {StoreCookie} from '../../services/core-services/store-cookie';

    let user: User = {username: '', password: ''};
    let inProgress = false;
    let error = null;
    const userProxy = new UserProxyService();
    const store = new StoreCookie();

    function submitForm() {
        if (user.passwordConfirm === user.password) {
            inProgress = true;
            userProxy.registerMethod(user).then(response => response.json())
                .then((data: UserAuth) => {
                    inProgress = false;
                    error = data?.message;
                    store.setCookie('stackshare', data.token);
                    user = {username: '', password: ''};
                    // redirect to homepage
                }).catch((err) => {
                error = err.response.data.message;
                inProgress = false;
            });
        } else {
            error = 'Password does not match';
        }
    }
</script>

<svelte:head>
    <title>Register</title>
</svelte:head>

<form class="" on:submit|preventDefault="{submitForm}">
    {#if error}
        <span class="error-message">{error}</span>
    {/if}
    <input class="" bind:value="{user.username}" type="text" placeholder="username" required>
    <input class="" bind:value="{user.password}" type="password" placeholder="password" required>
    <input class="" bind:value="{user.passwordConfirm}" type="password" placeholder="Confirm password" required>
    <button class="login-button primary-button" disabled="{inProgress}">Register
    </button>
</form>
