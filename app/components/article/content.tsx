import React from "react";

interface ImageArticleProps {
  mode: string;
  selected: Date;
  className?: string;
}

const ImageArticle: React.FC<ImageArticleProps> = ({ mode, selected, className }) => {
  return (
    <div className={className}>
      {/* You can use mode and selected as needed */}
    </div>
  );
};

export default ImageArticle;