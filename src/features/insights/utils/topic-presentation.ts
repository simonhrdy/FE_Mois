import AcUnitRounded from '@mui/icons-material/AcUnitRounded';
import CleaningServicesOutlined from '@mui/icons-material/CleaningServicesOutlined';
import DeliveryDiningOutlined from '@mui/icons-material/DeliveryDiningOutlined';
import HourglassBottomRounded from '@mui/icons-material/HourglassBottomRounded';
import LocalPizzaOutlined from '@mui/icons-material/LocalPizzaOutlined';
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined';
import RecordVoiceOverOutlined from '@mui/icons-material/RecordVoiceOverOutlined';
import type SvgIcon from '@mui/material/SvgIcon';
import SupervisorAccountOutlined from '@mui/icons-material/SupervisorAccountOutlined';

import type { ComplaintTopic, ReputationLevel } from '../types/insight.types';

export const TOPIC_PRESENTATION: Record<ComplaintTopic, { label: string; icon: typeof SvgIcon }> = {
  temperature: { label: 'Studené jídlo', icon: AcUnitRounded },
  delivery: { label: 'Doručení', icon: DeliveryDiningOutlined },
  waiting: { label: 'Čekání', icon: HourglassBottomRounded },
  staff: { label: 'Obsluha', icon: RecordVoiceOverOutlined },
  quality: { label: 'Kvalita jídla', icon: LocalPizzaOutlined },
  cleanliness: { label: 'Čistota', icon: CleaningServicesOutlined },
  price: { label: 'Cena', icon: PaymentsOutlined },
  management: { label: 'Nové vedení', icon: SupervisorAccountOutlined },
};

export const LEVEL_PRESENTATION: Record<
  ReputationLevel,
  { label: string; color: 'success' | 'primary' | 'warning' | 'error' }
> = {
  excellent: { label: 'Výborná', color: 'success' },
  good: { label: 'Dobrá', color: 'primary' },
  risk: { label: 'Riziková', color: 'warning' },
  critical: { label: 'Kritická', color: 'error' },
};
