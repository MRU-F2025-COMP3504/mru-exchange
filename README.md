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
  - ***Chat initiation establishment via express-js not yet implemented.***
- ✅ Favorites/bookmarks system
- ✅ Image upload support
- ✅ Category filtering (Parking, Textbooks, Notes, Tutoring)
- ✅ Search functionality
- ✅ Row Level Security (RLS) for data protection
  - ***Currently disabled indefinitely***.

### Product Categories

- 🅿️ **Parking** - Parking spot rentals/sales
- 📚 **Textbooks** - Course textbooks
- 📝 **Notes** - Study notes and materials
- 👨‍🏫 **Tutoring** - Tutoring services

---

## Instructions

The application offers two environment configurations (i.e., development and production).
We use `npm` scripts for building and running our application.
For more information on our pre-built `npm` scripts, please see the [package.json](https://github.com/MRU-F2025-COMP3504/mru-exchange/blob/main/package.json).

### Clone & Change Directory

```bash
$ git clone https://github.com/MRU-F2025-COMP3504/mru-exchange.git && cd mru-exchange
```

### Install Dependencies

```bash
npm install
```

### Build

To manually build the application:

```bash
$ npm run build
```

This script is automatically executed on deployment via the [CI/CD](https://github.com/MRU-F2025-COMP3504/mru-exchange/blob/main/.github/workflows/cicd.yml) workflow.

### Running

We recommend using [docker](https://www.docker.com/) to ensure consistent dependency behaviours for all environments and deploy to production.
Depending on the running host that the codebase lives on and how docker is installed, running docker may require **root or administrator priviledges**.

#### Production

The application must be dockerized in order to run the Nginx (reverse proxy) docker image to route and encrypt incoming traffic.

We recommend running the system in a clean slate:
```bash
$ DEPLOY_NAME=<container-name> npm run deploy
```

The script above is equivalent to:
```bash
$ DEPLOY_NAME=<container-name> \ 
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

Otherwise, the system can be run on `vite` directly using:

```bash
$ npm run dev
```

### Testing

The system uses [vitest](https://vitest.dev/) for application testing.
The following script runs unit and integration tests:

```bash
$ npm run test
```

To test for code coverage:

```bash
$ npm run test:coverage
```

To test for the user interface:

```bash
$ npm run test:ui
```

To run tests while running the system:

```
$ npm run test:watch
```

### 📖 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)