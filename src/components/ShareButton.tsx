import { FunctionComponent } from "react";
import OperationKind from "@/types/OperationKind";
import './ShareButton.scss';

type ShareButtonProps = {
    operation: OperationKind,
    level: number,
    stars: number
}

export const ShareButton:FunctionComponent<ShareButtonProps> = ({
    operation,
    level,
    stars
}) => {

  const handleShareButton = () => {
    const url = window.location.href.replace('score=-1', 'score=0')
    console.log('Try to share', url)
    // Check if navigator.share is supported by the browser
    if (navigator.share) {
      console.log("Congrats! Your browser supports Web Share API");
      navigator
        .share({
          url: url
        })
        .then(() => {
          console.log("Sharing successfull");
        })
        .catch(() => {
          console.log("Sharing failed");
        });
    } else {
      console.log("Sorry! Your browser does not support Web Share API");
    }
  };
  return (
      <button
        onClick={handleShareButton}
        className="share-button"
        type="button"
        title="Share this !"
      >
        <svg
            viewBox="0 0 30 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-share"
          >
            <circle cx="5" cy="15" r="3"/>
            <circle cx="25" cy="5" r="3"/>
            <circle cx="25" cy="25" r="3"/>
            <line x1="5" y1="15" x2="25" y2="5"/>
            <line x1="5" y1="15" x2="25" y2="25"/>
      
        </svg>
      </button>
  );
}
