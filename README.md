# Abstract

> MRU Exchange is a campus-exclusive marketplace where students can buy, sell, and trade resources
> directly tied to MRU life---Parking, Textbooks, Notes, and Tutoring to start.
> This idea is similar to systems like Facebook Marketplace or Kijiji, but unlike these public platforms,
> MRU Exchange is student-only (verified `@mtroyal` email) and emphasizes saftey/trust/convenience.
> The aim is a single, reliable hub for student needs---simpler, safer, cheaper.

--- Proposed by Sahil Grewal & Sebastian Samaco ([Proposal Document](https://drive.google.com/file/d/1FB7ih2Xl4OU3PR1JkczAumkkc5G4f7C8/view?usp=drive_link)).

---

### Team Members

- Kyle Chen ([@Existenial](https://github.com/Existenial))
- Ramos Jacosalem ([@cjaco906](https://github.com/cjaco906))
- Andrew Krawiec ([@AndrewTries](https://github.com/AndrewTries))
- Mitchell Johnson ([@Mjohn572](https://github.com/Mjohn572))
- Sahil Grewal ([@SahilGrewalx](https://github.com/SahilGrewalx))

---

### Status (Project Tab)

The latest project status (issues, pull requests, etc.) can be found [here](https://github.com/orgs/MRU-F2025-COMP3504/projects/4).

### Communication Channel

We use [Discord](https://discord.gg/nRq2tNgDhp) to discuss our project.

### Shared Google Folder

Our shared folder ([link here](https://drive.google.com/drive/folders/1Yfgw8HaCEl7aFqRQXRUGOCotDveUUP4-?usp=drive_link)) contains the following artifacts for each:

- Project milestones
- Weekly status reports
- Weekly team and project meeetings

---

## 🎯 Features

### Implemented Backend (Supabase)

- ✅ User authentication (@mtroyal.ca only)
- ✅ User profiles
- ✅ Listings CRUD (Create, Read, Update, Delete)
- ✅ Real-time messaging (database query only)
  - **_Chat initiation establishment via express-js not yet implemented._**
- ✅ Favorites/bookmarks system
- ✅ Image upload support
- ✅ Category filtering (Parking, Textbooks, Notes, Tutoring)
- ✅ Search functionality
- ✅ Row Level Security (RLS) for data protection
  - **_Currently disabled indefinitely_**.

### Product Categories

- 🅿️ **Parking** - Parking spot rentals/sales
- 📚 **Textbooks** - Course textbooks
- 📝 **Notes** - Study notes and materials
- 👨‍🏫 **Tutoring** - Tutoring services

**_Tests are not completely implemented._**

---

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

### Website Access

The website is accessed using the following URL:

```
mruexchange.app
```

See the [nginx.conf](https://github.com/MRU-F2025-COMP3504/mru-exchange/blob/main/nginx.conf) to configure the reverse proxy for the production server.

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

If the running host is experiencing a dependency issue, deleting the `node_modules` folder and re-running the script above may resolve the issue.
Alternatively, if you are using docker to run the application, the running host may combine the previous command with `npm run docker:prune` or `npm run docker:build` or both.

See the [package.json](https://github.com/MRU-F2025-COMP3504/mru-exchange/blob/main/package.json) for more information on the list of dependencies that the application uses.

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
Depending on the host and how docker is configured, running docker may require **root or administrator priviledges**.

- See the documentation for [Windows](https://docs.docker.com/desktop/setup/install/windows-permission-requirements/) about permission requirements for more information.
- See the documentation for [Linux](https://docs.docker.com/engine/install/linux-postinstall/) about root priviledges for more information.

#### Production

The application must be dockerized in order to run the Nginx (reverse proxy) docker image to route and encrypt traffic.
Our Nginx configuration uses [LetsEncrypt](https://letsencrypt.org/) for HTTPS traffic.

- We recommend using [certbot](https://certbot.eff.org/) to install and automate SSL certificate renewal.

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

This script is automatically executed on deployment via the [CI/CD](https://github.com/MRU-F2025-COMP3504/mru-exchange/blob/main/.github/workflows/cicd.yml) workflow.

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

The script above is equivalent to passing the `--build` flag on the previouosly mentioned `docker compose` command.

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

## Directory Sturcure 

### 1. database
- Database schema source code  
- Row-Level Security (RLS) policies and associated functions  
- Initial test user–data generation scripts  
- Additional functions, triggers, views, and indexes  

### 2. public
Site-wide assets such as logos  

### 3. src
Contains the main application source code.

#### 3.1 assets
Static assets, including the React logo  

#### 3.2 features
Organizes APIs and related modules by functional area.
Contains backend code for implementing various features across the site. Each feature has test.ts, and .ts files.

Each feature folder typically includes:
- api.test.ts
- components.ts
- hooks.ts
- index.ts
- types.ts

Feature categories:
- **bookmarking**
  - Logic for retrieving and modifying bookmarked products  
- **catalogue**
  - Logic for retrieving, linking, and modifying product categories  
- **interact**
  - Logic for retrieving and modifying user interactions (e.g., muting, blocking)  
- **listing**
  - Logic for posting product listings  
- **messaging**
  - Logic for retrieving and modifying messages  
- **reporting**
  - Reporting-related functionality  
- **review**
  - Review-related functionality  

#### 3.3 pages
All front end React pages in .tsx format. Also has a __test__ folder for any frontend tests the page needs to run.

#### 3.4 shared
- Shared utilities, components, hooks, and configuration  

#### 3.5 test
- Project-wide testing utilities and configuration 

### Build Releases

For updating the repository to include new changes to the files, use the [main](https://github.com/MRU-F2025-COMP3504/mru-exchange/tree/main)

Every time a feature is rolled out and confirmed to be working, merge the branch from [Stable](https://github.com/MRU-F2025-COMP3504/mru-exchange/tree/Stable) 

**DO NOT PUSH DIRECTLY INTO STABLE BRANCH**

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

- How to add a new Test

1. Create a test file in the __tests__ directory next to your component: ComponentName.test.tsx

2. Import testing utilities

3. Write test cases using describe and it blocks

4. Run tests locally

5. Commit your test, CI will automatically run tests on every PR

### Adding Bugs 

- Go into Issues and click the 'New issue' button

- Click on'Bug report'

- Follow the starred (**) guidelines within the input box

- Include a link to the repository version with this syntax:
  `[example bug](https://github.com/example-bug)`


### Current Bugs

- [Product not posting](https://github.com/MRU-F2025-COMP3504/mru-exchange/issues/113)

### 📖 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

### Beta release with guide
- Tag: v0.1.0-beta.2