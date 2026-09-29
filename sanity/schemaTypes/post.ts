import { defineField, defineType } from "sanity";
import { HighlightIcon } from "@sanity/icons/Highlight";
import { focusOptions } from "@/lib/journal-focus";
import { DEFAULT_HIGHLIGHT, hexToColorValue } from "@/lib/highlight-color";
import { HighlightAnnotation } from "@/sanity/components/HighlightAnnotation";
import { DropCapStyle } from "@/sanity/components/DropCapStyle";

const focusList = focusOptions.map(({ title, value }) => ({ title, value }));

// Customizing decorators replaces Sanity's defaults entirely, so the
// standard ones are listed here. Highlight is an annotation rather than a
// decorator because it has to carry a color, which decorators can't.
const bodyBlock = {
  type: "block",
  // Setting styles replaces Sanity's defaults, so they're listed in full
  // (same set as before) with the drop cap paragraph added at the end.
  styles: [
    { title: "Normal", value: "normal" },
    { title: "Heading 1", value: "h1" },
    { title: "Heading 2", value: "h2" },
    { title: "Heading 3", value: "h3" },
    { title: "Heading 4", value: "h4" },
    { title: "Heading 5", value: "h5" },
    { title: "Heading 6", value: "h6" },
    { title: "Quote", value: "blockquote" },
    { title: "Paragraph with drop cap", value: "dropcap", component: DropCapStyle },
  ],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
      { title: "Underline", value: "underline" },
      { title: "Strike", value: "strike-through" },
      { title: "Code", value: "code" },
    ],
    annotations: [
      {
        name: "link",
        type: "object",
        title: "Link",
        fields: [{ name: "href", type: "url", title: "URL" }],
      },
      {
        name: "highlight",
        type: "object",
        title: "Highlight",
        icon: HighlightIcon,
        components: { annotation: HighlightAnnotation },
        initialValue: { color: hexToColorValue(DEFAULT_HIGHLIGHT) },
        fields: [
          {
            name: "color",
            title: "Highlight color",
            type: "color",
            options: {
              disableAlpha: true,
              colorList: [DEFAULT_HIGHLIGHT, "#9DCDC5", "#D9D9D9", "#131112"],
            },
            initialValue: hexToColorValue(DEFAULT_HIGHLIGHT),
          },
        ],
      },
    ],
  },
};

export default defineType({
  name: "post",
  title: "Journal Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      description: "Shown under the title on the post itself, and as the preview text on the journal list",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      description:
        "Optional. An image or GIF. For a video cover, use the Cover video field below instead. Leave both empty for a text-only post.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "coverVideo",
      title: "Cover video",
      description: "Optional. An mp4 file. If both this and a cover image are set, the video takes priority.",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "coverVideoLoop",
      title: "Loop cover video",
      description: "Checked: the video repeats forever. Unchecked: it plays once and stops on the last frame.",
      type: "boolean",
      options: { layout: "checkbox" },
      initialValue: true,
      hidden: ({ document }) => !document?.coverVideo,
    }),
    defineField({
      name: "coverVideoFocus",
      title: "Cover video crop",
      description:
        "The video is cropped to fit the frame. Choose which part stays in view (e.g. Top keeps the top of the video and trims the bottom).",
      type: "string",
      options: { list: focusList, layout: "dropdown" },
      initialValue: "center",
      hidden: ({ document }) => !document?.coverVideo,
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        bodyBlock,
        {
          type: "image",
          title: "Image / GIF",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt text", type: "string" }],
        },
        {
          type: "file",
          name: "video",
          title: "Video",
          options: { accept: "video/*" },
          fields: [
            {
              name: "loop",
              title: "Loop video",
              description: "Checked: the video repeats. Unchecked: it plays once.",
              type: "boolean",
              options: { layout: "checkbox", isHighlighted: true },
              initialValue: false,
            },
            {
              name: "focus",
              title: "Crop",
              description: "The video is cropped to fit its frame. Choose which part stays in view.",
              type: "string",
              options: { list: focusList, layout: "dropdown", isHighlighted: true },
              initialValue: "center",
            },
          ],
        },
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage", subtitle: "subtitle" },
  },
});
