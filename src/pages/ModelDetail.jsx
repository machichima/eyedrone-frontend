import React, {useState} from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import axios from "../components/axios";
import Table from "react-bootstrap/Table";

async function getModelDetail(id) {
  const res = await axios.get(`/api/models/${id}/`);
  return res.data;
}

function ModelDetail() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery(
    ["model-detail", id],
    () => getModelDetail(id)
  );
  const [isShowStream, changeIsShowStream] = useState(false);

  if (isLoading) {
    return <p>正在載入模型...</p>;
  }
  if (isError) {
    console.log(error);
    return <p>發生錯誤</p>;
  }
  console.log(data);
  const substanceList = data.substances.map(({ name, formula, r2 }) => (
    <div key={name}>
      <h3>{name}</h3>
      <p>公式：{formula}</p>
      <p>R2：{r2}</p>
    </div>
  ));

  const predictionTable = (
    <div>
      <Table
          striped
          bordered
          hover
          style={{ tableLayout: "fixed", width: "70%" }}
      >
        <thead>
          <tr>
            <th>座標\資料</th>
            <th>do</th>
            <th>bod</th>
            <th>ss</th>
            <th>nh3n</th>
            <th>average</th>
            {/* {data.predictions.map(({x, y}) => (<th>{x}, {y}</th>))} */}
          </tr>
        </thead>
        <tbody>
          {data.predictions.map(({"do":do_val, bod, ss, nh3n, x, y}, index) => {
            let err_do = (data.points[index].do - do_val)/data.points[index].do;
            let err_bod = (data.points[index].bod - bod)/data.points[index].bod;
            let err_ss = (data.points[index].ss - ss)/data.points[index].ss;
            let err_nh3n = (data.points[index].nh3n - nh3n)/data.points[index].nh3n;

            return(
                <tr>
                  <td>{x}, {y}</td>
                  <td>{data.points[index].do}/{do_val}</td>
                  <td>{data.points[index].bod}/{bod}</td>
                  <td>{data.points[index].ss}/{ss}</td>
                  <td>{data.points[index].nh3n}/{nh3n}</td>
                  <td>{(err_do+err_bod+err_ss+err_nh3n)/4}</td>
                </tr>
          )})}
          </tbody>
      </Table>
    </div>
  );

  const predictions_btn = (
    <button onClick={post_prdictions}>predictions</button>
  )
  
  async function post_prdictions(){
    console.log(id);
    const res = await axios.post("/api/models/"+id+"/predictions/", {},{timeout: 60000});
    window.location.reload();
  }

  const build_model_btn = (
    <button onClick={build_model}>build</button>
  )

  async function build_model() {
    fetch(`http://127.0.0.1:8000/api/models/${id}/build/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.body)
      .then((rs) => {
        const reader = rs.getReader();
        return new ReadableStream({
          async start(controller) {
            changeIsShowStream(true);
            let streamTotalStr = [];
            while (true) {
              const { done, value } = await reader.read();

              // When no more data needs to be consumed, break the reading
              if (done) {
                changeIsShowStream(false);
                window.location.reload();
                break;
              }
              var enc = new TextDecoder("utf-8");
              const stringTxt = enc.decode(value).replace("<br>", "");
              console.log(stringTxt);
              document.getElementById("streaming").innerHTML +=
                "<p>" + stringTxt + "</p>";
              //streamTotalStr.push(stringTxt);
              // console.log(streamTotalStr);
              // changeStreamTxt(streamTotalStr);

              // Enqueue the next data chunk into our target stream
              controller.enqueue(value);
            }

            // Close the stream
            //history.push({ pathname: '/', state: res.data.id });
            controller.close();
            reader.releaseLock();
          },
        });
      });
  }

      


  return (
    <div>
      <h1>{data.name}</h1>
      <div>{substanceList}</div>
      <div>{predictionTable}</div>
      <div>{predictions_btn}</div>
      <div>{build_model_btn}</div>
      <div id="streaming" style={{'display': isShowStream ? 'block' : 'none'}}></div>
    </div>
  );
}

export default ModelDetail;
