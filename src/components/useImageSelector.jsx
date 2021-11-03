import React, { useState } from "react";

function useImageSelector() {
  const [image, setImage] = useState(null);
  function Selector() {
    return (
      <form>
        <input
          id="upload-img"
          type="file"
          onChange={(e) => setImage({ name: "hi", rgb: "hi" })}
          multiple
          disabled={image}
        />
      </form>
    );
  }
  function Display() {
    return (
      <div>
        <p>{image.name}</p>
        <img src={image.rgb} alt="" />
      </div>
    );
  }
  return {
    image,
    ImageSelector: image ? Display : Selector,
  };
}

export default useImageSelector;
