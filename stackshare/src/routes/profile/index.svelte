<script lang="ts">
    import {StoreCookie} from '../../services/core-services/store-cookie';

    const cookie = new StoreCookie();

    function logout() {
        cookie.deleteCookie('stackshare');
        location.href = '/';
    }
</script>


<button on:click={logout}>Log out</button>
