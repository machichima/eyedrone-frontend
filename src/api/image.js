import axios from "../components/axios";

export async function uploadPanelOrImage(url, files) {
  console.log("selected files");
  if (files.length !== 5) {
    alert("請上傳 5 張圖片");
    return;
  }
  const name = files[0].name.split("_")[1];
  console.log(name);
  const payload = new FormData();
  payload.append("name", name);
  payload.append("blue", files[0]);
  payload.append("green", files[1]);
  payload.append("red", files[2]);
  payload.append("nir", files[3]);
  payload.append("red_edge", files[4]);

  try {
    const res = await axios.post(url, payload, {
      timeout: 60000,
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
}
