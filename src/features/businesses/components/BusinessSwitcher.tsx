'use client';

import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { useAppDispatch } from '@/store/hooks';
import { activeBusinessChanged } from '@/store/slices/workspace.slice';

import { useActiveBusiness } from '../hooks/use-active-business';

export function BusinessSwitcher() {
  const dispatch = useAppDispatch();
  const { businessId, businesses } = useActiveBusiness();
  if (!businessId || businesses.length === 0) return null;

  return (
    <TextField
      select
      size="small"
      label="Můj podnik"
      value={businessId}
      onChange={(event) => dispatch(activeBusinessChanged(event.target.value))}
      fullWidth={false}
      sx={{ minWidth: { xs: 150, sm: 220 }, '& .MuiOutlinedInput-root': { borderRadius: 999 } }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <StorefrontOutlined fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    >
      {businesses.map((business) => (
        <MenuItem key={business.id} value={business.id}>
          {business.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
