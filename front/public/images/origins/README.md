# Origin hero images

Served at `/images/origins/*.jpg` (Next.js `public/`).

| File | Origin slug |
|------|-------------|
| `longjing-hero.jpg` | `longjing` |
| `anxi-hero.jpg` | `anxi` |
| `yunnan-hero.jpg` | `yunnan` |
| `fujian-hero.jpg` | `fujian` |
| `origins-index-hero.jpg` | Origins index banner |

To replace via Google Flow (ziniao):

```bash
ziniao google-flow imagen-generate \
  -V prompt="..." -V model_name_type=IMAGEN_3_5 \
  -V aspect_ratio=IMAGE_ASPECT_RATIO_LANDSCAPE \
  --save-images front/public/images/origins/longjing-hero
```

Keep filenames in sync with `front/src/lib/constants/origin-catalog.ts`.
