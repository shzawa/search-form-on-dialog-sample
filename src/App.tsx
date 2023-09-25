import React, { useCallback, useEffect, useState, useMemo } from 'react';
import './style.css';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Button, Dialog, DialogTitle, FormLabel } from '@mui/material';
import { useSearchParams, Route, Routes } from 'react-router-dom';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import TextField from '@mui/material/TextField/TextField';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import { objectKeys } from 'ts-extras';

const formSchema = z.object({
  title: z.string().trim(),
  isPublic: z.boolean().default(false),
  isPrivate: z.boolean().default(false),
});

type FormSchema = z.infer<typeof formSchema>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PageA />} />
    </Routes>
  );
}

const PageA = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSubmit = useCallback(
    (values: FormSchema) => {
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

  const formValues = useMemo<FormSchema>(() => {
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
};

const SearchConditionSettingsDialogWithButton = ({
  onSubmit,
  values,
}: {
  onSubmit: (values: FormSchema) => void;
  values: FormSchema;
}) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <Button variant="text" onClick={() => setIsOpened(true)}>
        検索ダイアログを開く
      </Button>
      <SearchConditionSettingsDialog
        open={isOpened}
        onClose={() => setIsOpened(false)}
        onSubmit={onSubmit}
        values={values}
      />
    </>
  );
};

const SearchConditionSettingsDialog = ({
  open,
  onClose,
  onSubmit,
  values,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormSchema) => void;
  values: FormSchema;
}) => {
  const {
    reset,
    control,
    handleSubmit: _handleSubmit,
    watch,
    formState: { isValid, isDirty },
  } = useForm<FormSchema>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
  });

  useEffect(() => {
    reset(values);
  }, [values]);

  const handleSubmit = useMemo(
    () =>
      _handleSubmit(async (values) => {
        onSubmit(values);
        onClose();
      }),
    [_handleSubmit, onClose, onSubmit]
  );

  const isDirtyValues = objectKeys(formSchema.shape).some(
    (paramName) => watch(paramName) !== values[paramName]
  );

  // NOTE: 検索ボタンが非活性になる条件
  //  入力欄がすべて未入力の場合
  //    or 検索結果を表示していて既存の検索条件を変更していない場合
  //    or 検索結果を表示していて検索条件のタイトル欄を変更したが、変更後の値がクエリパラメータに設定されている値と同じ場合
  const disabledSubmitButton = !isValid || !isDirty || !isDirtyValues;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>検索条件</DialogTitle>
        <DialogContent>
          <Stack rowGap={2}>
            <Stack>
              <FormLabel htmlFor="input-search-title-text-field">
                タイトル
              </FormLabel>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <TextField {...field} placeholder="タイトルを入力" />
                )}
              />
            </Stack>
            <Stack>
              <FormLabel htmlFor="multiple-select-search-status-field">
                ステータス
              </FormLabel>
              <Stack direction="row">
                <Controller
                  control={control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormControlLabel
                      {...field}
                      control={<Checkbox checked={field.value} />}
                      label="公開"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormControlLabel
                      {...field}
                      control={<Checkbox checked={field.value} />}
                      label="非公開"
                    />
                  )}
                />
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            キャンセル
          </Button>
          <Button
            variant="contained"
            disabled={disabledSubmitButton}
            type="submit"
          >
            検索する
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
