/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
import React, { forwardRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CustomReactQuill = forwardRef((props, ref) => {
  return <ReactQuill ref={ref} {...props} />;
});

export default CustomReactQuill;