'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Skeleton from '@mui/material/Skeleton';
import { useColorScheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import { PageContainer } from '@/components/ui/PageContainer';
import { PageHeader } from '@/components/ui/PageHeader';
import { env } from '@/lib/config/env';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSidebarCollapsed, toggleSidebarCollapsed } from '@/store/slices/ui.slice';

const COLOR_MODES = [
  { value: 'system', label: 'Podle systému' },
  { value: 'light', label: 'Světlý' },
  { value: 'dark', label: 'Tmavý' },
] as const;

type ColorMode = (typeof COLOR_MODES)[number]['value'];

function isColorMode(value: string): value is ColorMode {
  return COLOR_MODES.some((mode) => mode.value === value);
}

function AppearanceCard() {
  const { mode, setMode } = useColorScheme();
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);

  return (
    <Card>
      <CardHeader title="Vzhled" subheader="Přizpůsobte si vzhled aplikace." />
      <CardContent className="flex flex-col gap-4">
        <FormControl>
          <FormLabel id="color-mode-label">Barevný režim</FormLabel>
          {mode ? (
            <RadioGroup
              row
              aria-labelledby="color-mode-label"
              value={mode}
              onChange={(event) => {
                if (isColorMode(event.target.value)) setMode(event.target.value);
              }}
            >
              {COLOR_MODES.map(({ value, label }) => (
                <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
              ))}
            </RadioGroup>
          ) : (
            <Skeleton variant="text" width={240} height={42} />
          )}
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={sidebarCollapsed}
              onChange={() => dispatch(toggleSidebarCollapsed())}
            />
          }
          label="Kompaktní boční navigace (desktop)"
        />
      </CardContent>
    </Card>
  );
}

function ApiCard() {
  return (
    <Card>
      <CardHeader title="Připojení k backendu" subheader="Nastavuje se proměnnými prostředí." />
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Typography variant="body2" color="text.secondary">
            Zdroj dat:
          </Typography>
          <Chip
            size="small"
            color={env.apiMocking ? 'warning' : 'success'}
            label={env.apiMocking ? 'Ukázková data (mock)' : 'REST API'}
          />
        </div>
        <Typography variant="body2" color="text.secondary" className="break-all">
          URL API: <code>{env.apiUrl ?? 'nenastaveno'}</code>
        </Typography>
      </CardContent>
    </Card>
  );
}

export function SettingsView() {
  return (
    <PageContainer width="narrow">
      <PageHeader title="Nastavení" description="Předvolby a konfigurace aplikace." />
      <AppearanceCard />
      <ApiCard />
    </PageContainer>
  );
}
