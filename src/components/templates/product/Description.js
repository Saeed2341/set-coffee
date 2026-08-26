"use client";

import sanitize from "sanitize-html";
import styles from "./description.module.css";

const Description = ({ description }) => {
  const cleanHtml = sanitize(description, {
    allowedTags: [
      "p",
      "br",
      "b",
      "i",
      "u",
      "strong",
      "em",
      "strike",
      "code",
      "sub",
      "sup",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "span",
      "div",
      "blockquote",
      "pre",
      "hr",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      "*": ["style", "class", "id"],
    },
    allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
  });

  return (
    <div className={styles.productDescription}>
      <div
        className={styles.descriptionContent}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </div>
  );
};

export default Description;
