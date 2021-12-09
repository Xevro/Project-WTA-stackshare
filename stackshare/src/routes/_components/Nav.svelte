<script lang="ts">
    import {page} from '$app/stores';
</script>

<nav class="navbar">
    <div class="container">
        <a class="" href="/">StackShare</a>

        <ul class="">
            <li class="">
                <a rel="prefetch" class="" class:active={$page.path === '/'} href="/">Home</a>
            </li>
            <li class="item">
                <a rel="prefetch" class="link" class:active={$page.path === '/login'} href="/login">Login</a>
            </li>
        </ul>
    </div>
</nav>

<style lang="scss">
  .item {
    .link {
      background-color: green;
    }
  }
</style>
