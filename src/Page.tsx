import React, { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Condition } from './schema';
import SearchConditionSettingsDialogWithButton from './SearchConditionSettingsDialogWithButton';

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSubmit = useCallback(
    (values: Condition) => {
      const newSearchParams = new URLSearchParams();
      if (values.title) {
        newSearchParams.set('title', values.title);
      }
      if (values.isPublic) {
        newSearchParams.set('is_public', values.isPublic.toString());
      }
      if (values.isPrivate) {
        newSearchParams.set('is_private', values.isPrivate.toString());
      }
      setSearchParams(newSearchParams, { replace: true });
    },
    [setSearchParams]
  );

  const formValues = useMemo<Condition>(() => {
    return {
      title: searchParams.get('title') || '',
      isPublic: searchParams.get('is_public') === 'true',
      isPrivate: searchParams.get('is_private') === 'true',
    };
  }, [searchParams]);

  return (
    <div>
      <SearchConditionSettingsDialogWithButton
        values={formValues}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
