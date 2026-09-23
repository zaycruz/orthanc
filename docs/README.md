# orthanc.sh

Static site for https://orthanc.sh: install docs and changelogs for the whole stack.

- `/` the stack overview (Orthanc, pi-palantir, Mirdain)
- `/orthanc/` Orthanc CLI: install, demo, changelog
- `/pi-palantir/` the Pi harness
- `/mirdain/` the experimental Mac app
- `/changelog/` every release of all three

Plain HTML, CSS, and one small script. No build step and no dependencies.

## Hosting

Served by GitHub Pages from the `docs/` folder on `main` of `zaycruz/orthanc`.
Pushing to `main` publishes within a minute or two.

DNS for `orthanc.sh` lives in Cloudflare (DNS-only, not proxied, so GitHub can
manage the certificate): apex `A`/`AAAA` records point at the GitHub Pages
addresses and `www` is a `CNAME` to `zaycruz.github.io`.

## Preview locally

```sh
python3 -m http.server 8000
```

## Updating

- New release: add the entry to the Changelog lists (the tool's own page, `/changelog/`, and the Latest section on `/`) and bump the fallback version text. Orthanc's version badges also refresh from the GitHub Releases API when a page loads.
- Every claim must match the code. Use real component names.
- Installer changes: keep the commands in sync with `README.md` in the distribution repository.
