#!/usr/bin/env bash
set -euo pipefail

# CI uses the official Linux release, pinned by version and archive checksum.
cd "$(dirname "$0")/.."
version=$(cat .zola-version)
archive="zola-v${version}-x86_64-unknown-linux-gnu.tar.gz"
checksum="8f5132b3522412d04e395e0b25f6d68613ad272a873e54a2b3ebf664873024a4"
mkdir -p .tools
curl --fail --location --retry 3 \
  "https://github.com/getzola/zola/releases/download/v${version}/${archive}" \
  --output ".tools/${archive}"
printf '%s  %s\n' "$checksum" ".tools/${archive}" | sha256sum --check
tar -xzf ".tools/${archive}" -C .tools zola
./.tools/zola --version
echo "${PWD}/.tools" >> "$GITHUB_PATH"
