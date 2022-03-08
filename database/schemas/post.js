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
      of: [
        {
          title: "Like",
          type: "object",
          fields: [
            {
              title: "Like",
              name: "like",
              type: "string",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.unique(),
    },
    {
      title: "Comments",
      name: "comments",
      type: "array",
      of: [
        {
          title: "Comment",
          type: "object",
          fields: [
            {
              title: "Comment",
              name: "comment",
              type: "string",
            },
          ],
        },
      ],
    },
  ],
};
