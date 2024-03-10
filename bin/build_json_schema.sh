#!/bin/bash
set -e

SCRIPT_DIR=$(dirname "$0")

TYPES="./vite-plugin-project-builder/types"
WEBSITE="$TYPES/website_projects"
EXTENSION="$TYPES/extension_projects"

tsx "$SCRIPT_DIR/build_json_schema.ts" json "$WEBSITE/latest.ts" Project ./projects.schema.json
tsx "$SCRIPT_DIR/build_json_schema.ts" validator "$WEBSITE/union.ts" ProjectUnion "$WEBSITE/validate.js" validate
tsx "$SCRIPT_DIR/build_json_schema.ts" validator "$EXTENSION/union.ts" ProjectUnion "$EXTENSION/validate.js" validate
