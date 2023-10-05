import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { SearchConditions, useFetchHogeList } from './useFetchHogeList';

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTitleValue, setSearchTitleValue] = useState(
    searchParams.get('title') ?? ''
  );
  const updateSearchParamTitle = useMemo(
    () =>
      debounce((value: string) => {
        setSearchParams(
          (searchParams) => {
            if (value.length) {
              searchParams.set('title', value);
            } else {
              searchParams.delete('title');
            }
            return searchParams;
          },
          { replace: true }
        );
      }, 300),
    [setSearchParams]
  );
  const handleChangeInput = useCallback(
    (value: string) => {
      updateSearchParamTitle(value);
      setSearchTitleValue(value);
    },
    [updateSearchParamTitle]
  );
  const searchConditions = useMemo<SearchConditions>(() => {
    const title = searchParams.get('title');
    return {
      ...(typeof title === 'string' && title.trim().length && { title }),
    };
  }, [searchParams]);
  const hogeList = useFetchHogeList(searchConditions);

  return (
    <div>
      <input
        type="text"
        value={searchTitleValue}
        onChange={(e) => handleChangeInput(e.target.value)}
      />
      {searchTitleValue === '' ? (
        <p>テキストボックスを入力してください！</p>
      ) : (
        <pre>{JSON.stringify(hogeList)}</pre>
      )}
    </div>
  );
}
