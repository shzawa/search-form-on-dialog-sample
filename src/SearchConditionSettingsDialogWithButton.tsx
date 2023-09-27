import React, { useEffect, useMemo } from 'react';
import { Button, DialogTitle, FormLabel, Stack } from '@mui/material';
import { useState } from 'react';
import { condition, Condition } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { objectKeys } from 'ts-extras';
import { Controller, useForm } from 'react-hook-form';
import Dialog from '@mui/material/Dialog/Dialog';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import TextField from '@mui/material/TextField/TextField';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import DialogActions from '@mui/material/DialogActions/DialogActions';

export default function SearchConditionSettingsDialogWithButton({
  onSubmit,
  values,
}: {
  onSubmit: (values: Condition) => void;
  values: Condition;
}) {
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
}

const SearchConditionSettingsDialog = ({
  open,
  onClose,
  onSubmit,
  values,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Condition) => void;
  values: Condition;
}) => {
  const {
    reset,
    control,
    handleSubmit: _handleSubmit,
    watch,
    formState: { isValid, isDirty },
  } = useForm<Condition>({
    mode: 'onChange',
    resolver: zodResolver(condition),
  });

  // NOTE: ダイアログが開かれる度、クエリパラメータに基づいた初期値に戻す
  useEffect(() => {
    reset(values);
  }, [reset, values, open]);

  const handleSubmit = useMemo(
    () =>
      _handleSubmit(async (values) => {
        onSubmit(values);
        onClose();
      }),
    [_handleSubmit, onClose, onSubmit]
  );

  const isDirtyValues = objectKeys(condition.shape).some(
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
                name="title"
                control={control}
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
                  name="isPublic"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      {...field}
                      label="公開"
                      control={<Checkbox checked={field.value} />}
                    />
                  )}
                />
                <Controller
                  name="isPrivate"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      {...field}
                      label="非公開"
                      control={<Checkbox checked={field.value} />}
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
