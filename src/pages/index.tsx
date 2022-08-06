import React, { useEffect, useState } from "react";
import PageBar from "../components/pagination/bar";
import PlayerCard, { PlayerCardSkelton } from "../components/player";
import { useQuery } from "@tanstack/react-query";
import {
  PlayerData,
  httpResponse,
  paginationResponse,
  paginationQuery,
} from "../interfaces";
import axios from "axios";

export default function Main() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [pageData, setpageData] = useState<paginationQuery>({
    limit: 6,
    page: page,
  });

  const [datas, setdatas] = useState<any>();

  let { data, isFetched, isLoading, error } = useQuery<
    httpResponse<paginationResponse<PlayerData[]>>
  >(["players"], () =>
    axios
      .get("http://localhost:8888/api/players", {
        params: pageData,
      })
      .then((res) => {
        setPagination(
          res?.data?.data.pagination.total,
          res?.data?.data.pagination.limit
        );
        return res.data;
      })
  );

  useEffect(() => {
    setdatas(data);
  }, [data]);

  const setPagination = (
    total: number | undefined,
    limit: number | undefined
  ) => {
    const size = total && limit ? Math.floor(total / limit) : 0;
    setPageSize(size + 1);
  };

  const onchoosePage = async (page: number) => {
    setPage(page);
    setpageData({ ...pageData, page });

    console.log(pageData);
    data = await axios
      .get("http://localhost:8888/api/players", {
        params: { ...pageData, page },
      })
      .then((res) => {
        return res.data;
      });
    setPagination(data?.data.pagination.total, data?.data.pagination.limit);
    setdatas(data);
  };

  return (
    <div className="flex flex-col content-center">
      {isLoading && (
        <div className="gap-6 p-6 self-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[0, 0, 0, 0, 0, 0].map((_, index: number) => (
            <PlayerCardSkelton key={index} />
          ))}
        </div>
      )}
      {!isLoading && (
        <div className="gap-6 p-6 self-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {datas?.data?.data?.map((player: PlayerData, index: number) => (
            <PlayerCard player={player} key={index} />
          ))}
        </div>
      )}
      <div className="self-center">
        <PageBar
          currentPage={page}
          pagesNumber={pageSize}
          onPageChange={onchoosePage}
        />
      </div>
    </div>
  );
}
