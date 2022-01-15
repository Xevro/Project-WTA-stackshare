<script lang="ts">
    import {StoreCookie} from '../../services/core-services/store-cookie';
    import {UserProxyService} from "../../services/backend-services";
    import type {User} from '../../models';

    let user: User = {} as User;
    let loggedIn = false;
    let loading = true;

    const cookie = new StoreCookie();
    const userProxy = new UserProxyService();

    userProxy.getUserData(cookie.getCookie('stackshare-id')).then(response => response.json()).then((result ) => {
        user = result;
        loggedIn = true;
        loading = false;
    }).catch(() => {
        loggedIn = false;
        loading = false;
    });

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
    {#if loggedIn}
        <button on:click={logout}>Log out</button>
        <p style="color: red">todo: Add information and edit option</p>
        <p>Name: { user.name }</p>
        <p>Username: { user.username }</p>
        <p>Email: { user.email }</p>
        <button>Edit information</button>
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
