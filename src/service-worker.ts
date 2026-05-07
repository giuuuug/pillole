/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE = `pillole-cache-${version}`;
const ASSETS = [...build, ...files];

sw.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
	sw.skipWaiting();
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			// Start navigation preloads in parallel with SW startup on next navigations.
			if ('navigationPreload' in sw.registration) {
				await sw.registration.navigationPreload.enable();
			}
			for (const key of await caches.keys()) {
				if (key !== CACHE) await caches.delete(key);
			}
			await sw.clients.claim();
		})()
	);
});

sw.addEventListener('fetch', (event) => {
	const req = event.request;
	if (req.method !== 'GET') return;

	const url = new URL(req.url);
	if (url.origin !== sw.location.origin) return;

	// Never cache auth or API data endpoints.
	if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return;

	// Stale-while-revalidate for HTML page navigations.
	// The browser sets Accept: text/html on top-level navigation requests.
	// SvelteKit's internal __data.json fetches do not, so they pass through.
	const isNavigation =
		req.headers.get('accept')?.includes('text/html') ?? false;

	if (isNavigation) {
		event.respondWith(
			(async () => {
				const cache = await caches.open(CACHE);
				const cached = await cache.match(req);

				if (cached) {
					// Serve stale immediately; refresh cache in background.
					event.waitUntil(
						fetch(req)
							.then((res) => { if (res.ok) cache.put(req, res.clone()); })
							.catch(() => {})
					);
					return cached;
				}

				// No cache hit: use the preload response that the browser started
				// fetching in parallel with SW startup, eliminating the startup delay.
				const preload = await event.preloadResponse;
				if (preload) {
					if (preload.ok) cache.put(req, preload.clone());
					return preload;
				}

				// Fallback to network.
				try {
					const res = await fetch(req);
					if (res.ok) cache.put(req, res.clone());
					return res;
				} catch {
					return new Response('offline', { status: 503 });
				}
			})()
		);
		return;
	}

	// Cache-first for built assets and static files.
	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE);
			const cached = await cache.match(req);
			if (cached) return cached;
			try {
				const res = await fetch(req);
				if (res.ok) cache.put(req, res.clone());
				return res;
			} catch {
				return new Response('offline', { status: 503 });
			}
		})()
	);
});
