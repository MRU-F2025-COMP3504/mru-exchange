# MRU Exchange Developer Guide

- [1. Deployment](#deployment)
  - [1.1. Clone Repository](#clone-repository)
- [2. Directory Structure](#directory-sturcture)
  - [2.1. Definitions](#definitions)
- [3. Build Releases](#build-releases)
- [4. Daily Operation & Development](#daily-operation-development)
  - [4.1. Clone Repository](#clone-repository)
  - [4.2. Update](#update)
  - [4.3. Install Dependencies](#install-dependencies)
  - [4.4. Running](#running)
    - [4.4.1. Production](#production)
    - [4.4.2. Development](#development)
- [5. Testing](#testing)

## Deployment

The commands below prepares the production server for deployment.

The following assumes that the server has **permissions** to access (read) this private repository.
The server must have [Git](https://git-scm.com/) and [SSH](https://en.wikipedia.org/wiki/Secure_Shell) installed, configured, and linked with a GitHub account.
Alternatively, a personal access token (PAT) in place of SSH may be used instead.

- See [below](#daily-operation--development) for installation instructions.

The codebase is already configured with the [CI/CD](https://github.com/MRU-F2025-COMP3504/mru-exchange/blob/main/.github/workflows/cicd.yml) workflow using GitHub Actions.
Any pushed changes to this repository in the `main` branch automatically runs the workflow.
In addition, the workflow does not clone the repositoy.

The production server _must_ clone the repository to automate deployment.
In addition, the build process (i.e., `npm, run build`) must be successful in order to deploy the application.

### Clone Repository

The following command uses Git and SSH to clone the repository on the server and changes the working directory into the repository:

```bash
$ git clone git@github.com:MRU-F2025-COMP3504/mru-exchange.git && cd mru-exchange
```

Finally, to deploy the application, the following command is as follows:

```bash
$ DEPLOY_NAME=production npm run deploy
```

See the [script usage](#production) below for more information.

> [!NOTE]
> The website is accessed using the following URL:
>
> ```
> mruexchange.app
> ```
>
> See the [nginx.conf](https://github.com/MRU-F2025-COMP3504/mru-exchange/blob/main/nginx.conf) to configure the reverse proxy for the production server.

## Directory Structure

Our directory tree structure is as follows:

```
.
├── database
│   └── images
├── public
│   └── vite.svg
└── src
    ├── assets
    │   └── react.svg
    ├── features
    │   ├── bookmarking
    │   │   ├── api.test.ts
    │   │   ├── api.ts
    │   │   ├── components.ts
    │   │   ├── hooks.ts
    │   │   ├── index.ts
    │   │   └── types.ts
    │   ├── catalogue
    │   │   ├── api.test.ts
    │   │   ├── api.ts
    │   │   ├── components.ts
    │   │   ├── hooks.ts
    │   │   ├── index.ts
    │   │   └── types.ts
    │   ├── interact
    │   │   ├── api.test.ts
    │   │   ├── api.ts
    │   │   ├── components.ts
    │   │   ├── hooks.ts
    │   │   ├── index.ts
    │   │   └── types.ts
    │   ├── listing
    │   │   ├── api.test.ts
    │   │   ├── api.ts
    │   │   ├── components.ts
    │   │   ├── hooks.ts
    │   │   ├── index.ts
    │   │   └── types.ts
    │   ├── messaging
    │   │   ├── api.test.ts
    │   │   ├── api.ts
    │   │   ├── components.ts
    │   │   ├── hooks.ts
    │   │   ├── index.ts
    │   │   └── types.ts
    │   ├── reporting
    │   │   ├── api.test.ts
    │   │   ├── api.ts
    │   │   ├── components.ts
    │   │   ├── hooks.ts
    │   │   ├── index.ts
    │   │   └── types.ts
    │   └── review
    │       ├── api.test.ts
    │       ├── api.ts
    │       ├── components.ts
    │       ├── hooks.ts
    │       ├── index.ts
    │       └── types.ts
    ├── pages
    │   └── index.ts
    ├── shared
    │   ├── api
    │   │   ├── auth.test.ts
    │   │   ├── auth.ts
    │   │   ├── database.ts
    │   │   └── index.ts
    │   ├── components
    │   │   └── index.ts
    │   ├── contexts
    │   │   ├── auth
    │   │   │   ├── index.ts
    │   │   │   └── useAuth.ts
    │   │   └── index.ts
    │   ├── tests
    │   │   ├── database.ts
    │   │   └── index.ts
    │   ├── types
    │   │   ├── auth.ts
    │   │   ├── index.ts
    │   │   ├── math.ts
    │   │   ├── product.ts
    │   │   ├── property.ts
    │   │   ├── result.ts
    │   │   ├── schema.ts
    │   │   └── table.ts
    │   └── utils
    │       ├── database.ts
    │       ├── form.ts
    │       ├── hooks.ts
    │       ├── index.ts
    │       ├── product.ts
    │       ├── regex.ts
    │       └── result.ts
    └── test
        └── setup.ts
```

### Definitions

- `database`
  - Database schema source code
  - Row-Level Security (RLS) policies and associated functions
  - Initial test user–data generation scripts
  - Additional functions, triggers, views, and indexes
- `public`
  - Site-wide assets such as logos
- `src`
  - Contains the main application source code.
  - `assets`
    - Static assets, including the React logo
  - `features`
    - Organizes APIs and related modules by functional area.
    - Contains backend code for implementing various features across the site. Each feature has test.ts, and .ts files.
    - Each feature folder typically includes the following file types:
      - `index.ts`
      - `components.ts`
      - `hooks.ts`
      - `types.ts`
    - Each file type variants may have a test file version (i.e., `*.test.ts`).
    - The following feature categories are:
      - `bookmarking`
        - Logic for retrieving and modifying bookmarked products
      - `catalogue`
        - Logic for retrieving, linking, and modifying product categories
      - `interact`
        - Logic for retrieving and modifying user interactions (e.g., muting, blocking)
      - `listing`
        - Logic for posting product listings
      - `messaging`
        - Logic for retrieving and modifying messages
      - `reporting`
        - Reporting-related functionality
      - `review`
        - Review-related functionality
  - `pages`
    - All front end React pages in .tsx format. Also has a **test** folder for any frontend tests the page needs to run.
  - `shared`
    - Shared utilities, components, hooks, and configuration
  - `test`
    - Project-wide testing utilities and configuration
    - Holds integration tests

## Build Releases

- Use the [main](https://github.com/MRU-F2025-COMP3504/mru-exchange/tree/main) branch for bleeding-edge updates.
- Otherwise, use the [stable](https://github.com/MRU-F2025-COMP3504/i-exchange/tree/stable) branch.

> [!IMPORTANT]
> **DO NOT PUSH DIRECTLY INTO STABLE BRANCH!**

## Daily Operation & Development

We use the `npm` [(node package manager)](https://www.npmjs.com/) and [docker](https://www.docker.com/) for dependency management and running the application.

- See the [attached installation instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for how to install `npm`.
- See the [attached installation instructions](https://docs.docker.com/engine/install/) for how to install `docker`.
  - If the host is using the Windows operating system, the host must install and use [Docker Desktop](https://www.docker.com/products/docker-desktop/) to run the application.
  - If using docker is not an option, the application can be run using `vite`. See [below](#development) for more information.

We use [Git](https://git-scm.com/) for version control and manage code changes.
For the host to read (e.g., `git clone`) or make changes to this repository, the host must have Git installed.
If you are working in a development environment, cloning the repository via HTTPS can be used.
Using [SSH](https://en.wikipedia.org/wiki/Secure_Shell) to access the repository is optional.
See [below](#clone-repository-1) for more information.

- The SSH client should be pre-installed on Windows, macOS, and Linux operating systems.
- See the [attached installation instructions](https://git-scm.com/install/windows) for how to install `git`.

Git must be configured and linked with a GitHub account.
If the host is using SSH to access the repository, Git must be configured using a public and private key linked with the account.

- See the [attached instructions](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/about-ssh) for how to configure SSH with a GitHub account.

The application offers two environment configurations (i.e., development and production).
We use `npm` scripts for building and running the application.
See the [package.json](https://github.com/MRU-F2025-COMP3504/mru-exchange/blob/main/package.json) for more information on the pre-built `npm` scripts.

### Clone Repository

We recommend using the same approach for [deployment](#clone-repository--change-directory), which uses SSH for read-write access:

```bash
$ git clone git@github.com:MRU-F2025-COMP3504/mru-exchange.git && cd mru-exchange
```

Alternatively, the host can clone the repository via HTTPS, where you will be prompted for GitHub credentials:

```bash
$ git clone https://github.com/MRU-F2025-COMP3504/mru-exchange.git && cd mru-exchange
```

### Update

To update the local repository to the latest upstream changes:

```bash
$ git pull
```

### Install Dependencies

To install all dependencies configured for the application:

```bash
$ npm install
```

> [!TIP]
> If the running host is experiencing a dependency issue, deleting the `node_modules` folder and re-running the script above may resolve the issue.
> Alternatively, if you are using docker to run the application, the running host may combine the previous command with `npm run docker:prune` or `npm run docker:build` or both.
>
> See the [package.json](https://github.com/MRU-F2025-COMP3504/mru-exchange/blob/main/package.json) for more information on the list of dependencies that the application uses.

### Build

To manually build the application:

```bash
$ npm run build
```

This script is automatically executed on deployment via the [CI/CD](https://github.com/MRU-F2025-COMP3504/mru-exchange/blob/main/.github/workflows/cicd.yml) workflow.
The build process must be successful in order to deploy the application.
When the build fails, the workflow would be cancelled.

### Running

We recommend using [docker](https://www.docker.com/) for application behaviour consistency that runs in a reproducable environment and deploying to production.

> [!IMPORTANT]
> Depending on the host and how docker is configured, running docker may require **root or administrator priviledges**.
>
> - See the documentation for [Windows](https://docs.docker.com/desktop/setup/install/windows-permission-requirements/) about permission requirements for more information.
> - See the documentation for [Linux](https://docs.docker.com/engine/install/linux-postinstall/) about root priviledges for more information.

#### Production

The application must be dockerized in order to run the Nginx (reverse proxy) docker image to route and encrypt traffic.
Our Nginx configuration uses [LetsEncrypt](https://letsencrypt.org/) for HTTPS traffic.

> [!TIP]
> We recommend using [certbot](https://certbot.eff.org/) to install and automate SSL certificate renewal.

We recommend running the system in a clean slate:

```bash
$ DEPLOY_NAME=production npm run deploy
```

The script above is equivalent to:

```bash
$ DEPLOY_NAME=production \
    git pull \
    docker stop $DEPLOY_NAME \
    docker system prune -f \
    docker compose up -d --build
```

> [!NOTE]
> This script is automatically executed on deployment via the [CI/CD](https://github.com/MRU-F2025-COMP3504/mru-exchange/blob/main/.github/workflows/cicd.yml) workflow.

#### Development

We recommend using docker to closely imitate the production environment.
To run the application:

```bash
$ npm run docker
```

The script above is equivalent to:

```bash
$ docker compose -f compose.dev.yml up
```

Alternatively, we can rebuild the docker image and run the application:

```bash
$ npm run docker:build
```

> [!NOTE]
> The script above is equivalent to passing the `--build` flag on the previouosly mentioned `docker compose` command.

The running host may prune existing data that the dockerized application has cached.
The following script prunes the cache by force:

```bash
$ npm run docker:prune
```

The script above is equivalent to:

```bash
$ docker system prune -f
```

For more information, see docker's [command usage](https://docs.docker.com/reference/cli/docker/system/prune/).

Otherwise, the system can be run on `vite` directly using:

```bash
$ npm run dev
```

## Testing

### Testing Site

If you would like to view the site without creating an account, you can use the following credentials:

```
Email: publicUser@mtroyal.ca
Password: publicPassword
```

> [!WARNING]
> We use Supabase to manage our database.
> As Supabase is not meant to be an email service provider, fake (testing) email accounts has **higher risks of being bounced**.
> Using fake email accounts may lead you to becoming heavily rate-limited.
> Learn more [here](https://en.wikipedia.org/wiki/Bounce_message) and [here](https://supabase.com/docs/guides/troubleshooting/not-receiving-auth-emails-from-the-supabase-project-OFSNzw).

### Running Tests

The system uses [vitest](https://vitest.dev/) for application testing.
The following script runs unit and integration tests:

```bash
$ npm run test
```

To test for code coverage:

```bash
$ npm run test:coverage
```

To test using the web user interface:

```bash
$ npm run test:ui
```

To run tests while running the system:

```
$ npm run test:watch
```

### Adding Tests

1. Create a test file in the **tests** directory next to your component (e.g., `ComponentName.test.tsx`)
2. Import testing utilities (e.g., `vi`, `mock`)
3. Commit your test. Our automated continuous integration workflow will automatically run tests on every pull request.
