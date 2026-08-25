import Comment from "@/components/modules/comment/Comment";
import styles from "./comments.module.css";
import CommentForm from "./CommentForm";
import Pagination from "@/components/modules/pagination/Pagination";

const Comments = ({ productID, comments }) => {
  // const acceptedComments = comments.filter((comment) => comment.isAccept);

  const mainComments = comments.filter((comment) => !comment.mainComment);

  const replayComments = comments.filter((comment) => comment.mainComment);

  const getReplies = (commentID) => {
    const replayComment = replayComments.filter(
      (comment) => comment.mainComment == commentID,
    );
    return replayComment;
  };
  return (
    <div>
      <p>نظرات ({comments.length}) :</p>
      <hr />

      <main className={styles.comments}>
        <div className={styles.user_comments}>
          {mainComments.length > 0 ? (
            <>
              <div>
                {mainComments.map((comment) => {
                  const replies = getReplies(comment._id);
                  return (
                    <div key={comment._id} className={styles.commentGroup}>
                      {/* نمایش کامنت اصلی */}
                      <Comment {...comment} />
                      {/* نمایش پاسخ‌ها (اگر وجود داشته باشند) */}
                      {replies.length > 0 && (
                        <div className={styles.repliesContainer}>
                          {replies.map((reply) => (
                            <Comment
                              key={reply._id}
                              {...reply}
                              isAnswer={true}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className={styles.empty}>
              هیچ نظری برای این محصول ثبت نشده است.
            </p>
          )}
        </div>
        <div className={styles.form_bg}>
          <CommentForm productID={productID} />
        </div>
      </main>
    </div>
  );
};

export default Comments;
