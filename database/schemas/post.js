export default {
  title: "Post",
  name: "post",
  type: "document",
  fields: [
    {
      title: "Photo",
      name: "photo",
      type: "image",
    },
    {
      title: "Description",
      name: "description",
      type: "text",
    },
    {
      title: "Created At",
      name: "created_at",
      type: "datetime",
    },
    {
      title: "Author",
      name: "author",
      type: "reference",
      to: [{ type: "user" }],
    },
    {
      title: "Likes",
      name: "likes",
      type: "array",
      of: [{ type: "reference", to: { type: "user" } }],
      validation: (Rule) => Rule.unique(),
    },
    {
      title: "Comments",
      name: "comments",
      type: "array",
      of: [{ type: "reference", to: { type: "user" } }],
      validation: (Rule) => Rule.unique(),
    },
  ],
};
