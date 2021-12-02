<script>
    import {page, session} from '$app/stores';
</script>

<nav class="navbar navbar-light">
    <div class="container">
        <a rel="prefetch" class="navbar-brand" href="/">StackShare</a>
        <ul class="nav navbar-nav pull-xs-right">
            <li class="nav-item">
                <a rel="prefetch" class="nav-link" class:active={$page.path === '/'} href="/">Home</a>
            </li>
        </ul>
    </div>
</nav>
