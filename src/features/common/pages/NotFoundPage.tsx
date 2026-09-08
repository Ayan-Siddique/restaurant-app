import React from "react";
import NotFound from "../../../components/common/NotFound";

const NotFoundPage: React.FC = () => {
  return (
    <div
      className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center"
      style={{ background: "#f9f5f0" }}
    >
      <NotFound
        title="Nothing found"
        message="Well, this is awkward. The page you requested is playing hide and seek."
        buttonText="Explore Menu"
        actionHref="/menu"
      />
    </div>
  );
};

export default NotFoundPage;
