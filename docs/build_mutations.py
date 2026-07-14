#!/usr/bin/env python3
"""Build themeFilesUpsert GraphQL mutations for batches of theme files.

Outputs, per batch:
  - batch<N>_mutation.graphql : full mutation with content embedded as GraphQL string literals
  - batch<N>_variables.json   : {"files": [...]} for use with a $files variable
"""
import json, os, sys

ROOT = "/home/user/nordic-athlete-theme"
OUT = "/tmp/claude-0/-home-user/b1539ce8-7ccb-580a-8548-b035ada9638b/scratchpad"
THEME_ID = "gid://shopify/OnlineStoreTheme/193309901133"

BATCHES = [
    ["sections/na-pdp-skin.liquid", "snippets/na-pdp-extras.liquid", "sections/na-pdp-technology.liquid"],
    ["sections/na-pdp-size-guide.liquid", "sections/na-pdp-reviews.liquid", "sections/na-pdp-bundle.liquid"],
    ["templates/product.gamepatch-2026.json"],
    ["sections/na-ambassador-hero.liquid", "sections/na-ambassador-setup.liquid", "sections/na-ambassador-story.liquid", "templates/page.ambassador.json"],
]

for i, batch in enumerate(BATCHES, 1):
    file_inputs_embedded = []
    file_inputs_vars = []
    for fn in batch:
        with open(os.path.join(ROOT, fn), "r", encoding="utf-8") as f:
            content = f.read()
        # json.dumps produces a valid GraphQL string literal (escapes \, ", \n etc.)
        lit = json.dumps(content, ensure_ascii=False)
        file_inputs_embedded.append(
            '{ filename: %s, body: { type: TEXT, value: %s } }' % (json.dumps(fn), lit)
        )
        file_inputs_vars.append({"filename": fn, "body": {"type": "TEXT", "value": content}})

    mutation = (
        'mutation {\n  themeFilesUpsert(\n    themeId: "%s",\n    files: [\n      %s\n    ]\n  ) {\n'
        '    upsertedThemeFiles { filename }\n    userErrors { field message }\n  }\n}\n'
        % (THEME_ID, ",\n      ".join(file_inputs_embedded))
    )
    with open(os.path.join(OUT, "batch%d_mutation.graphql" % i), "w", encoding="utf-8") as f:
        f.write(mutation)
    with open(os.path.join(OUT, "batch%d_variables.json" % i), "w", encoding="utf-8") as f:
        json.dump({"files": file_inputs_vars}, f, ensure_ascii=False)
    print("batch%d: %d files, mutation %d bytes" % (i, len(batch), len(mutation.encode("utf-8"))))
