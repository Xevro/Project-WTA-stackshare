# Project Stackshare - Web Topics Advanced 2021-2022

[![Cybernetically enhanced web apps: Svelte](https://sveltejs.github.io/assets/banner.png)](https://svelte.dev)


[![npm version](https://img.shields.io/npm/v/svelte.svg)](https://www.npmjs.com/package/svelte) [![license](https://img.shields.io/npm/l/svelte.svg)](LICENSE.md)


This project is made in SvelteKit, It's a stack overflow based web application with MongoDB, TypeScript and SCSS.

Learn more at the [Svelte website](https://svelte.dev).

## Development SvelteKit project

To install and work on Svelte locally:

```bash
git clone https://gitlab.com/louis.dhont/Project-WTA-stackshare.git
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

### Publish the project on Vercel

The project is hosted on Vercel where it is simple to host a new project online.
First create a new account and type ```vercel``` in the terminal window of the stackshare project, this terminal menu will guide out to publish the build files that ```npm run build``` created.
Make sure to change the variable ```production``` in the ```route-literals.model.ts``` file to change the used API url in the project.
Vercel will create a ```.vercel_build_output``` hidden output folder with config settings and static bundled files.

Visit the published website [here](https://stackshare-3746996ws-xevro.vercel.app).

## Development NodeJS project

To install and work on the NodeJS backend locally:

Open a new terminal/command prompt window and type:

```bash
cd stackshare-backend
npm install
```

To watch for changes and continually rebuild the package (this is useful if you're using [npm link](https://docs.npmjs.com/cli/link.html) to test out changes in a project locally):

```bash
npm run dev
```

### Publish the API on Google Cloud Platform

To publish the API, you have to create an account and type ```gcloud app deploy``` in the local project folder of the API project.
Create a new project on the App Engine and connect the stackshare project to this new project on the Cloud platform. 
More information can be found on [this link](https://cloud.google.com/appengine/docs/standard/nodejs/building-app/deploying-web-service).
There is a file called ```app.yaml``` with configuration settings for this project, the project contains a ```.env``` file with a ```Database & port``` variable that will be used to connect to the MongoDB server.
Normally such a file isn't uploaded to any version control system because it contains passwords or secure information but for this school project it isn't so dangerous to share. 
