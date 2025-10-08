// eslint-disable-next-line no-unused-vars
import React from "react";
import cn from "classnames";
const Container = ({ children, className }) => {
  return (
    <div className={cn("max-w-screen-xl mx-auto px-4 py-10", className)}>
      {children}
    </div>
  );
};

export default Container;