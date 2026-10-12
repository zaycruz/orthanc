# Orthanc

Fast, agent-native CLI for Palantir Foundry.

Orthanc is proprietary software distributed as compiled binaries. This repository does not contain or license the Rust source code.

## Install

```bash
curl -fsSLo /tmp/orthanc-install.sh https://github.com/zaycruz/orthanc/releases/latest/download/install.sh
sh /tmp/orthanc-install.sh
export PATH="$HOME/.local/bin:$PATH"
orthanc --version
```

The installer starts the first-run onboarding guide when it has an interactive terminal. If it was skipped, run:

```bash
orthanc onboarding
```

The guide asks for a profile name, creates and activates that profile, and stores the bearer token once: in the Keychain on macOS, and in the Secret Service on Linux, or in a 0600 file (`~/.config/foundry/orthanc-credentials.json`) on a headless host. Switch later with `orthanc configure set-active PROFILE`. The installer supports macOS on Apple Silicon and Intel, plus Linux x86_64. It verifies the downloaded archive with its published SHA-256 checksum.

## Nightly channel

Nightly builds track `main` and are published as a prerelease. Install one beside the stable binary with:

```bash
curl -fsSL https://github.com/zaycruz/orthanc/releases/download/nightly/install.sh | \
  ORTHANC_CHANNEL=nightly ORTHANC_INSTALL_DIR="$HOME/.local/orthanc-nightly/bin" sh
"$HOME/.local/orthanc-nightly/bin/orthanc" --version
```

Nightly builds are for testing and may be less reliable than stable releases.

## License

You may download, install, and use official compiled Orthanc releases. You may not modify, redistribute, sublicense, sell, publish, reverse engineer, decompile, or create derivative works except where applicable law does not allow that restriction. The complete proprietary license is included in each release archive.
