import FunctionsRounded from '@mui/icons-material/FunctionsRounded';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import type { ToolCall } from '../types/assistant.types';

function formatCall({ name, arguments: args }: ToolCall): string {
  const list = Object.entries(args)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
  return `${name}(${list})`;
}

export function ToolCallList({ calls }: { calls: readonly ToolCall[] }) {
  if (calls.length === 0) return null;
  return (
    <div className="flex flex-col gap-1">
      <Typography variant="caption" color="text.secondary">
        Zavolané funkce IS
      </Typography>
      <ol className="m-0 flex list-none flex-wrap gap-1 p-0">
        {calls.map((call, index) => (
          <li key={`${call.name}-${index}`}>
            <Chip
              size="small"
              variant="outlined"
              icon={<FunctionsRounded />}
              label={formatCall(call)}
              sx={{ fontFamily: 'monospace' }}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
