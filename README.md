# Pillole

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
