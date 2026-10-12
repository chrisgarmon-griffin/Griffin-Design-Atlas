# Griffin Design Atlas

A private interactive bento gallery of the canonical New York v4 shadcn collection:
70 charts, 61 core components, 239 usage examples, and 27 page layouts.

## Develop and build

Use Node.js with the committed npm lockfile. Run `npm ci`, then `npm run build`.
The build writes a self-contained `dist/index.html` with bundled React, CSS, code
snippets, and preview images. Open the HTML in a browser or serve `dist/`.

## Behavior

Search, categories, chart-family filters, pagination, local saved favorites,
expanded previews, viewport size controls, per-file code copying, dependency
commands, and Griffin theme copying are browser-local. The gallery does not
connect to a lending service. Demo forms and authentication screens are not live.

## Provenance

Source: https://github.com/shadcn-ui/ui
Commit: 30a58d4498f270af1c1e981a7d78a15cf5740841
MIT license: public/LICENSE.md (also embedded in standalone HTML).

Copied code adapts imports to project-friendly component paths and replaces
literal blue demo colors with Griffin theme tokens. Original sample data and
framework requirements remain. The gallery renderer additionally uses Next
adapters, embedded sample placeholders, and disabled chart animation. The code
panel retains framework imports so users can integrate them intentionally.

The copied Griffin theme requires shadcn/Tailwind global token mappings. The
setup tab explains initialization, supporting files, dependency versions,
aliases, and framework-specific requirements. Additional Base, Aria, and style
families are available in the complete upstream capture, not duplicated here.

## Verification

Production Vite build succeeded. Server-render validation covers all 397
catalog entries, with no rendering errors or missing listed source files.
Browser visual and interaction QA was unavailable in the execution environment;
no browser-pass claim is made. Validate target-project integration separately.

## GitHub and Vercel

Canonical repository: https://github.com/chrisgarmon-griffin/Griffin-Design-Atlas

Vercel builds the root project using Node 22, `npm ci`, `npm run build`, and the
`dist` output directory. Pushes to `main` update production once the Git
integration is connected; feature branches receive preview deployments.
No environment variables or backend services are required.

Run `npm run dev` locally. Use `npm run validate` for the 397-entry render and
source-file checks. Repository visibility and deployed-site access are separate
settings; making this repository private does not itself protect a deployed URL.
