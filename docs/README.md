# orthanc.sh

Static site for https://orthanc.sh: one page for the Orthanc CLI, with install,
demo, and changelog.

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

- New release: add the entry to the Changelog section and bump the fallback version text. The version badges also refresh from the GitHub Releases API when the page loads.
- Every claim must match the code. Use real component names.
- Installer changes: keep the commands in sync with `README.md` in the distribution repository.
