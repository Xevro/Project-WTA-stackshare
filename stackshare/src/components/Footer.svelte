<footer>
    <div class="footer-content">
        <h3>StackShare</h3>
        <p>Find the solution to your problem through a big community.</p>
        <div class="footer-menu">
            <ul class="f-menu">
                <li><a href="/">Home</a></li>
                <li><a href="/add/question">Add a question</a></li>
                <li><a href="/authenticate">Login</a></li>
            </ul>
        </div>
    </div>
    <div class="footer-bottom">
        <p>Copyright &copy; <a href="#">StackShare</a></p>
    </div>

</footer>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  footer {
    margin-top: 80px;
    background: #5148D5;
    height: auto;
    width: 100vw;
    padding-top: 40px;
    color: #fff;
  }

  .footer-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 30px;

    h3 {
      font-size: 2.1rem;
      font-weight: 500;
      text-transform: capitalize;
      line-height: 3rem;
    }

    p {
      margin: 10px auto;
      font-size: 1rem;
      color: #e2e3e7;
    }
  }

  .footer-bottom {
    background: #463cc2;
    width: 100%;
    padding: 20px;
    text-align: center;

    p {
      font-size: .9rem;

      a {
        color: #fff;
        font-size: 1rem;
        text-decoration: none;
      }
    }

    span {
      text-transform: uppercase;
      opacity: .4;
      font-weight: 200;
    }
  }

  .footer-menu {
    margin-top: 20px;
    ul {
      text-align: left;

      li {
        padding-right: 10px;
        display: block;

        a {
          color: #cfd2d6;
          text-decoration: none;
        }

        a:hover {
          color: #27bcda;
        }
      }
    }
  }

  @media (max-width: 500px) {
    .footer-menu {
      ul {
        display: flex;
        margin-top: 10px;
        margin-bottom: 20px;
      }
    }
  }
</style>
