# Paperdash UI

The UI is a SvelteKit/Svelte 5 application that renders Paperdash's responsive
dashboard. The backend launches Chromium against this page and captures it as a
1304 x 984 screenshot for the e-paper display.

## Requirements

- Node.js 24 (matches the Docker build image).
- npm.

## Install and Run

```sh
npm ci
npm run dev
```

The development server listens on `0.0.0.0` so it can be reached from the
backend or other devices on the network. To choose a port:

```sh
npm run dev -- --port 8080
```

The dashboard is available at `/`. To render a specific widget configuration,
pass a URL-encoded JSON array as the `widgets` query parameter. Example:

```text
/?widgets=%5B%7B%22id%22%3A%22text%22%2C%22options%22%3A%5B%7B%22id%22%3A%22text%22%2C%22value%22%3A%22%23%20Hello%22%7D%5D%7D%5D
```

The JSON shape accepted by the page is:

```json
[
  {
    "id": "text",
    "options": [{ "id": "text", "value": "# Hello\nDashboard text" }]
  }
]
```

Unknown widget IDs are ignored. If the query is missing, invalid, or produces
no supported widgets, the page displays its built-in default set.

## Widgets

Widget types are declared in `src/lib/components/widget/widget-types.ts`:

| ID | Options | Behavior |
| --- | --- | --- |
| `text` | `text` | Renders Markdown after sanitizing the generated HTML with DOMPurify. |
| `weather` | `cityid`, `apikey` | Loads the OpenWeatherMap widget script. Supply values required by that service. |
| `srs` | `location` | Loads restaurant/menu data from `api.srs.l5w.de`; location is the restaurant ID. |
| `joke` | None | Loads a programming joke from JokeAPI. |
| `calendar` | `url` | Loads one or more comma-separated iCalendar URLs and shows up to five non-past events. |
| `garbage` | None | Reserved in the type list; no widget component is currently registered. |

The backend reads widget IDs and options from `paperdash-backend/config.json`.
Its `{ "id": "*", ... }` device entry is the fallback configuration for
device MAC addresses without a matching entry. Option values in backend JSON
are strings; widgets that expect numbers convert them as defined by their
component.

The weather widget's `apikey` is passed to the browser-side OpenWeatherMap
script, so it is visible to users who can load the dashboard; use a key with
appropriate restrictions rather than treating it as a server-side secret. The
SRS, joke, calendar, and weather widgets fetch third-party resources directly
from the browser. Calendar hosts must permit cross-origin reads (CORS), and all
of these widgets require the browser/container to have working network access.
The backend's screenshot Chromium is launched with web security disabled, so
successful backend captures do not guarantee the same cross-origin behavior in
a normal interactive browser.

## Layout and Screenshot Behavior

The dashboard is designed to fill a 1304 x 984 viewport. Desktop uses a
two-column, two-row grid; small browser widths switch to a single column for
normal interactive viewing. The backend sets an explicit Chromium device
viewport and validates the screenshot dimensions before encoding panel data.
Keep display layout changes responsive but verify them at the panel's exact
capture dimensions.

Header date/time uses the browser's local timezone. Widget content can depend
on third-party network services, their availability, CORS policy, and API
credentials.

## Quality Checks and Production Build

```sh
npm run check
npm run lint
npm run build
npm run preview
```

The production build uses `@sveltejs/adapter-node` and is served with Node.
The Dockerfile builds in a Node 24 image, prunes development dependencies, and
starts `node build` on port 80.

Build and run the production image on the shared `paperdash` network used by
the backend:

```sh
docker build -t paperdash-ui .
docker run -d --name paperdash-ui --network paperdash -p 8080:80 paperdash-ui
```

The published image is built by GitHub Actions on pushes to `main` and is
available from `ghcr.io/<owner>/<repository>` for this repository. Publishing
the image does not deploy or start a container automatically.

## Source Map

- `src/routes/+page.svelte`: query parsing, default widgets, dashboard layout.
- `src/lib/components/widget/widget-types.ts`: supported widget IDs and types.
- `src/lib/components/widget/widget.svelte`: widget-to-component mapping.
- `src/lib/components/widget/widgets/`: widget implementations.
- `src/styles/app.scss`: global typography, colors, and page sizing.
- `src/app.html`: HTML shell and external widget bootstrap script.
