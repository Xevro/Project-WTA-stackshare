<script lang="ts">
    import {User, UserAuth} from '../../models';
    import {UserProxyService} from '../../services/backend-services';
    import {StoreCookie} from '../../services/core-services/store-cookie';

    let user = {username: '', password: ''} as User;
    let inProgress = false;
    let error = null;
    const userProxy = new UserProxyService();
    const store = new StoreCookie();

    function submitForm() {
        inProgress = true;
        userProxy.loginMethod(user).then(response => response.json())
            .then((data: UserAuth) => {
                inProgress = false;
                error = data.message ?? '';
                if (data.token) {
                    store.setCookie('stackshare', data.token);
                    user = {username: '', password: ''} as User;
                    location.href = '/';
                }
            }).catch((err) => {
            error = 'Could not login';
            inProgress = false;
        });
    }
</script>

<svelte:head>
    <title>StackShare - Login</title>
</svelte:head>

<form class="" on:submit|preventDefault="{submitForm}">
    {#if error}
        <span class="error-message">{error}</span>
    {/if}
    <input class="" bind:value="{user.username}" type="text" placeholder="username" required>
    <input class="" bind:value="{user.password}" type="password" placeholder="password"
           required>
    <button class="login-button primary-button" disabled="{inProgress}">login
    </button>
</form>
