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

The installer supports macOS on Apple Silicon and Intel, plus Linux x86_64. It verifies the downloaded archive with its published SHA-256 checksum.

## License

You may download, install, and use official compiled Orthanc releases. You may not modify, redistribute, sublicense, sell, publish, reverse engineer, decompile, or create derivative works except where applicable law does not allow that restriction. The complete proprietary license is included in each release archive.
