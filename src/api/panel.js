import axios from "../components/axios";

export async function getPanelList() {
  try {
    const res = await axios.get("/api/panels/");
    return res.data;
  } catch (e) {
    throw e;
  }
}
