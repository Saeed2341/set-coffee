import dynamic from "next/dynamic";
import styles from "./Editor.module.css";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => "در حال بارگزاری...",
});

const EditorWrapper = (props) => {
  return (
    <div className={styles.editorWrapper}>
      <Editor {...props} />
    </div>
  );
};

export default EditorWrapper;
