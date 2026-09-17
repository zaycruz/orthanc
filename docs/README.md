# orthanc.sh

Static site for https://orthanc.sh: install, demo, and changelog for the Orthanc CLI.

Plain HTML, CSS, and one small script. No build step and no dependencies.

## Deploy with GitHub Pages

1. Copy this directory to `docs/` in the public `zaycruz/orthanc` repository and commit.
2. In the repository settings, set Pages to "Deploy from a branch", branch `main`, folder `/docs`.
3. `CNAME` already contains `orthanc.sh`. In Cloudflare DNS for `orthanc.sh`, add:
   - `A @ 185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA @ 2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `CNAME www zaycruz.github.io`
   Keep the proxy off (grey cloud) until GitHub has issued the certificate, then enable "Enforce HTTPS" in Pages.

## Preview locally

```sh
python3 -m http.server 8000
```

## Updating

- New release: add an entry at the top of the Changelog list in `index.html` and bump the fallback text in the hero badge. The badge also refreshes itself from the GitHub Releases API when the page loads.
- Installer changes: keep the commands in sync with `README.md` in the distribution repository.
