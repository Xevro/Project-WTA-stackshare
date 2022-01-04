<script>
    import Navbar from './_components/Nav.svelte';
    import Footer from '../components/Footer.svelte';
</script>

<Navbar/>

<main>
    <slot/>
</main>

<Footer/>

<style lang="scss">
    main {
      min-height: 50vh;
    }
</style>
