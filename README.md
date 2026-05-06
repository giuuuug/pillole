<p align="center">
  <a href="#pillole-ita">
    <img src="https://img.shields.io/badge/lang-ITA-green?style=for-the-badge" />
  </a>
  <a href="#pillole-eng">
    <img src="https://img.shields.io/badge/lang-ENG-blue?style=for-the-badge" />
  </a>
</p>

# Pillole
<a id="pillole-ita"></a>

<p align="center">
	<img src="/static/icon.svg" alt="Pillole logo" width="120" height="120" />
</p>

Una enciclopedia personale di concetti brevi: scrivi una pillola in pochi secondi e ritrovala al volo.

## Feature

- Editor di testo che accetta il latex per scrivere pillole in modo fluido
- Categorie con colori per organizzare i concetti
- Fonti e riferimenti per ogni pillola
- Ricerca rapida e navigazione snella
- UI minimale e focalizzata sulla lettura

## Indice

1. Introduzione al progetto
2. Come setappare
3. Come contribuire

## 1. Introduzione al progetto

Pillole nasce dall'esigenza di memorizzare piccoli concetti in "pillole": frammenti sintetici di conoscenza, pensati per una consultazione veloce e ordinata. L'idea e' costruire una enciclopedia personale, dove ogni pillola contiene titolo, contenuto, categoria e fonte.

## 2. Come setappare

### Prerequisiti

- Node.js 20+
- NPM

### Setup locale

```sh
git clone <URL_DELLA_REPO>
cd pillole
npm install
```

### Variabili d'ambiente

Crea un file `.env` nella root del progetto e inserisci le credenziali:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
```

Per `BETTER_AUTH_SECRET`, vai su Better Auth e genera una chiave da 32 caratteri, poi incollala qui.

### Avvio in sviluppo

```sh
npm run dev
```

### Build e deploy

Questo progetto usa SvelteKit con adapter Netlify. Per il deploy puoi usare Netlify oppure qualsiasi altra piattaforma compatibile con il build output di SvelteKit.

Documentazione ufficiale deploy: https://svelte.dev/docs/kit/building-your-app

## 3. Come contribuire

Le contribuzioni sono benvenute. Se vuoi dare una mano:

1. Fai fork del repository.
2. Crea un branch dedicato alla tua modifica.
3. Fai commit chiari e descrittivi (Conventional Commits consigliati).
4. Apri una Pull Request spiegando cosa cambia e perche'.

Linee guida rapide:

- Mantieni il codice leggibile e coerente.
- Aggiungi o aggiorna i test se necessario.
- Evita di inserire credenziali reali nei file `.env`.

### Versioning

La repo usa Semantic Versioning e release automatiche basate sui commit.
Formato consigliato:

- `fix: ...` per patch
- `feat: ...` per minor
- `feat!: ...` o `BREAKING CHANGE:` per major

<br>
<br>
<br>
<br>
<br>


# Pillole
<a id="pillole-eng"></a>

<p align="center">
	<img src="/static/icon.svg" alt="Pillole logo" width="120" height="120" />
</p>

A personal encyclopedia of brief concepts: write a pill in a few seconds and find it instantly.

## Feature

- Text editor that accepts LaTeX to write pills smoothly
- Categories with colors to organize concepts
- Sources and references for each pill
- Fast search and smooth navigation
- Minimal UI focused on reading

## Index

1. Project introduction
2. How to set up
3. How to contribute

## 1. Project introduction

Pillole was born from the need to store small concepts in "pills": concise fragments of knowledge, designed for quick and organized consultation. The idea is to build a personal encyclopedia, where each pill contains title, content, category, and source.

## 2. How to set up

### Prerequisites

- Node.js 20+
- NPM

### Local setup

```sh
git clone <REPO_URL>
cd pillole
npm install
```

### Environment variables

Create a .env file in the root of the project and insert the credentials:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
```

For `BETTER_AUTH_SECRET`, go to Better Auth and generate a 32-character key, then paste it here.

### Run in development
```sh
npm run dev
```

### Build and deploy

This project uses SvelteKit with Netlify adapter. For deployment you can use Netlify or any other platform compatible with the SvelteKit build output.

Official deployment documentation: https://svelte.dev/docs/kit/building-your-app

### 3. How to contribute

Contributions are welcome. If you want to help:

1. Fork the repository.
2. Create a dedicated branch for your change.
3. Make clear and descriptive commits (Conventional Commits recommended).
4. Open a Pull Request explaining what changes and why.

Quick guidelines:

- Keep the code readable and consistent.
- Add or update tests if necessary.
- Avoid inserting real credentials in .env files.

### Versioning

The repo uses Semantic Versioning and automatic releases based on commits.
Recommended format:

- `fix: ...` for patch
- `feat: ...` for minor
- `feat!: ...` or BREAKING CHANGE: for major