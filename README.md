# Project Stackshare

[![Cybernetically enhanced web apps: Svelte](https://sveltejs.github.io/assets/banner.png)](https://svelte.dev)


[![npm version](https://img.shields.io/npm/v/svelte.svg)](https://www.npmjs.com/package/svelte) [![license](https://img.shields.io/npm/l/svelte.svg)](LICENSE.md)


This project is made in Svelte, It's a stack overflow based web application with MongoDB, TypeScript and SCSS.

Learn more at the [Svelte website](https://svelte.dev).

## Development

To install and work on Svelte locally:

```bash
git clone https://github.com/Xevro/Project-WTA-stackshare
cd stackshare
npm install
```

> Do not use Yarn to install the dependencies, as the specific package versions in `package-lock.json` are used to build and test Svelte.

To build the compiler and all the other modules included in the package:

```bash
npm run build
```

To watch for changes and continually rebuild the package (this is useful if you're using [npm link](https://docs.npmjs.com/cli/link.html) to test out changes in a project locally):

```bash
npm run dev
```

The compiler is written in [TypeScript](https://www.typescriptlang.org/), but don't let that put you off — it's basically just JavaScript with type annotations. You'll pick it up in no time. If you're using an editor other than [Visual Studio Code](https://code.visualstudio.com/), you may need to install a plugin in order to get syntax highlighting and code hints, etc.


## svelte.dev

The source code for https://svelte.dev, including all the documentation, lives in the [site](site) directory. The site is built with [SvelteKit](https://kit.svelte.dev).

