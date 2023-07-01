# Conexiones a mongodb

Connections and operations to MongoDB Atlas with NodeJS, Rust and other
[supported drivers](https://www.mongodb.com/docs/drivers/).

For the last presentation showcase (NodeJS vs Rust CRUD), See: [Running the frontend CRUD showcase](#running-the-frontend-crud-showcase).

Professors:

```md
- Arredondo Castillo, Gustavo
- Fiestas Grillo, Manuel
```

Team members:

```md
- Alva Saenz, Rodrigo
- Calderón Flores, Ricardo
- Cueto Salazar, Sebastian
- Flores Cóngora, Paolo
```

## Running the frontend CRUD showcase

![CRUD frontend showcase](./rust/screenshot.png)

The frontend, built with Astro + React is located in the
[`frontend/`](./frontend/) folder.

First clone the repo:

Then run the frontend with:

```bash
cd frontend
npm install
npm run dev -- --port 3000
# Running in http://127.0.0.1:3000
```

The NodeJS backend is located in the [`nodejs/`](./nodejs/) folder.

Run the backend (port 8080) with:

```bash
cd nodejs/src
npm install
npm run dev
# Running in http://127.0.0.1:8080
```

The Rust backend, built with Actix is located in the [`rust/`](./rust/) folder.

Run the backend (port 8000) with:

```bash
cd rust
cargo run
# Running in http://127.0.0.1:8000
```

You'll need to have Rust installed. If you don't, install it with
[`rustup`](https://rustup.rs/) 🦀.

Now you can go to <http://127.0.0.1:3000> to start using (or developing) the
CRUD showcase.

## Thanks

To the team members, professors, and awesome people working on the open source.
