import React from "react";
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
  return (
    <div>
      <h1>{data.name}</h1>
      <div>{substanceList}</div>
      <div>{predictionTable}</div>
    </div>
  );
}

export default ModelDetail;
