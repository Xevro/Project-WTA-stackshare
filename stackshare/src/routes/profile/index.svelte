<script lang="ts">
    import {StoreCookie} from '../../services/core-services/store-cookie';
    import {UserProxyService} from "../../services/backend-services";

    const cookie = new StoreCookie();

    const userProxy = new UserProxyService();
    let loggedIn = false;
    let loading = true;

    userProxy.checkUserStatus().then(response => response.json())
        .then(() => {
            loggedIn = true;
            loading = false;
        }).catch(() => {
        loggedIn = false;
        loading = false;
    });

    /*
        if (loggedIn) {

        }
        */
    function logout() {
        cookie.deleteCookie('stackshare');
        location.href = '/';
    }
</script>

<svelte:head>
    <title>StackShare - Your profile</title>
</svelte:head>

{#if loggedIn}
    <button on:click={logout}>Log out</button>
{:else}
    <div class="not-logged-in">
        <p>You can't add a question when you are not logged in.</p>
        <a href="/">Go back to the homepage</a>
    </div>
{/if}

<style lang="scss">
  .not-logged-in {
    font-size: 1.1rem;
    text-align: center;
    a {
      color: #5148D5;
      text-decoration: none;
    }
  }
</style>
