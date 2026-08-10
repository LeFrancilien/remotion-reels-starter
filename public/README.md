# public/

Anything in this folder is reachable from a composition with `staticFile()`.

Drop your footage here, then point a reel at it:

```json
"clip": { "file": "avatar.mp4", "width": 1080, "height": 1920, "crop": null }
```

Media files are git-ignored on purpose — the repo ships without assets so a
clean checkout renders straight away using the built-in placeholder.
