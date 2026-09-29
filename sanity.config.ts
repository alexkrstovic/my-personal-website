"use client";

import { defineConfig } from "sanity";
import { structureTool, type DefaultDocumentNodeResolver } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";
import { projectId, dataset, apiVersion } from "@/lib/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { PostPreview } from "@/sanity/components/PostPreview";

// Posts get a Preview tab next to the editor; everything else stays as is.
const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) =>
  schemaType === "post"
    ? S.document().views([S.view.form(), S.view.component(PostPreview).title("Preview")])
    : S.document().views([S.view.form()]);

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ defaultDocumentNode }), visionTool({ defaultApiVersion: apiVersion }), colorInput()],
});
