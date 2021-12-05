<script lang="ts">
    import {User, UserAuth} from '../../models';
    import {UserProxyService} from '../../services/backend-services/user-proxy.service';

    let user: User = {username: '', password: ''};
    let inProgress = false;
    let error = null;
    const userProxy = new UserProxyService();

    function submitForm() {
        try {
            if (user.passwordConfirm === user.password) {
                inProgress = true;
                userProxy.registerMethod(user)
                    .then(response => response.json())
                    .then((data: UserAuth) => {
                        inProgress = false;
                        error = data?.message;
                        // save token info in cookie
                        user = {username: '', password: ''};
                        // redirect to homepage
                    });
            } else {
                error = 'Password does not match';
            }
        } catch (err) {
            error = err.response.data.message;
            inProgress = false;
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
