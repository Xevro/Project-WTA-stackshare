<script lang="ts">
    import {page} from '$app/stores';
    import {UserProxyService} from '../../services/backend-services';

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
</script>

<nav class="navbar">
    <div class="logo">
        <a href="/">
            <img class="logo-stackshare" src="/static/logo-stackshare.png" alt="StackShare logo">
        </a>
    </div>
    {#if !loading}
        <ul class="nav-links">
            <input type="checkbox" id="checkbox_toggle"/>
            <label for="checkbox_toggle" class="hamburger">&#9776;</label>
            <div class="menu">
                <li><a rel="prefetch" class="link" class:active={$page.path === '/'} href="/">Home</a></li>
                {#if !loggedIn}
                    <li><a rel="prefetch" class="link" class:active={$page.path === '/authenticate'} href="/authenticate">Login / register</a></li>
                {:else}
                    <li><a rel="prefetch" class="link" class:active={$page.path === '/add/question'}
                           href="/add/question">Add question</a>
                    </li>
                    <li><a rel="prefetch" class="link" class:active={$page.path === '/profile'}
                           href="/profile">Profiel</a>
                    </li>
                {/if}
            </div>
        </ul>
    {/if}
</nav>

<style lang="scss">
  li {
    list-style: none;
  }

  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    margin-right: 10%;
    margin-left: 10%;

    .nav-links {
      a {
        font-size: 1.1rem;
        color: #222;
        text-decoration: none;
      }
    }
  }

  .logo {

    .logo-stackshare {
      max-height: 58px;
    }
  }

  .menu {
    display: flex;
    gap: 1em;
    font-size: 18px;

    li {
      padding: 5px 14px;
    }

    li:hover {
      background-color: #EEE;
      border-radius: 5px;
      transition: 0.3s ease;
    }

    .active {
      color: #5344D4 !important;
    }
  }

  input[type=checkbox] {
    display: none;
  }

  .hamburger {
    display: none;
    font-size: 24px;
    user-select: none;
    margin-right: 16px;
  }

  @media (max-width: 768px) {
    .navbar {
      margin: 0;
    }

    .menu {
      margin-top: 23px;
      display: none;
      position: absolute;
      background-color: #EEE;
      right: 0;
      left: 0;
      text-align: center;
      padding: 16px 0;

      li + li {
        margin-top: 12px;
      }

      li:hover {
        display: inline-block;
        background-color: #989898;
        transition: 0.3s ease;
      }
    }

    input[type=checkbox]:checked ~ .menu {
      display: block;
    }
    .hamburger {
      display: block;
    }
  }
</style>
