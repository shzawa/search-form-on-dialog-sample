import { useEffect, useState } from 'react';

export type SearchConditions = { title?: string };
export const useFetchHogeList = (searchConditions: SearchConditions) => {
  const [data, setData] = useState<object & { message: string }>();
  const isSearching = Object.keys(searchConditions).length > 0;

  useEffect(() => {
    if (!isSearching) return;
    let ignore = false;
    fetchSearchApi(searchConditions)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setData(data);
      });
    return () => {
      ignore = true;
    };
  }, [isSearching, searchConditions]);

  return data;
};

function fetchSearchApi(params: object) {
  return new Promise<{
    ok: boolean;
    json: () => Promise<object & { message: string }>;
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        json: () =>
          Promise.resolve({ message: '検索結果を取得しました', ...params }),
      });
    }, 1000);
  });
}
