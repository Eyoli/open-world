#

for f in *; do mv -- "$f" "$(uuidgen).png"; done