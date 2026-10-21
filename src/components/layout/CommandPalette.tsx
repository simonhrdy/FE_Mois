'use client';

import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import SearchRounded from '@mui/icons-material/SearchRounded';
import SentimentDissatisfiedOutlined from '@mui/icons-material/SentimentDissatisfiedOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import Dialog from '@mui/material/Dialog';
import InputBase from '@mui/material/InputBase';
import { useColorScheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';

import { allNavItems } from '@/components/navigation/nav-items';
import { useActiveBusiness } from '@/features/businesses/hooks/use-active-business';
import { normalizePrompt } from '@/features/assistant/services/assistant-planner';
import { routes } from '@/lib/config/routes';
import { cn } from '@/lib/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { commandPaletteToggled, selectCommandPaletteOpen } from '@/store/slices/ui.slice';
import { activeBusinessChanged } from '@/store/slices/workspace.slice';

interface Command {
  id: string;
  label: string;
  hint: string;
  icon: ReactNode;
  run: () => void;
}

const SHORTCUT_KEY = 'k';

export function CommandPalette() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectCommandPaletteOpen);
  const router = useRouter();
  const { mode, systemMode, setMode } = useColorScheme();
  const { businesses, businessId } = useActiveBusiness();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === SHORTCUT_KEY) {
        event.preventDefault();
        dispatch(commandPaletteToggled());
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch]);

  const close = () => {
    dispatch(commandPaletteToggled(false));
    setQuery('');
    setActiveIndex(0);
  };

  const resolvedMode = mode === 'system' ? systemMode : mode;

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href);
    const base: Command[] = [
      ...allNavItems.map((item) => ({
        id: item.href,
        label: item.label,
        hint: item.description,
        icon: <item.icon fontSize="small" />,
        run: go(item.href),
      })),
      {
        id: 'negative',
        label: 'Negativní recenze',
        hint: 'Recenze s 1–2 hvězdičkami',
        icon: <SentimentDissatisfiedOutlined fontSize="small" />,
        run: go(`${routes.reviews}?maxStars=2`),
      },
      {
        id: 'theme',
        label: resolvedMode === 'dark' ? 'Světlý režim' : 'Tmavý režim',
        hint: 'Přepnout barevný režim',
        icon: <DarkModeOutlined fontSize="small" />,
        run: () => setMode(resolvedMode === 'dark' ? 'light' : 'dark'),
      },
      ...businesses
        .filter((business) => business.id !== businessId)
        .map((business) => ({
          id: `business-${business.id}`,
          label: `Přepnout na ${business.name}`,
          hint: business.city,
          icon: <StorefrontOutlined fontSize="small" />,
          run: () => dispatch(activeBusinessChanged(business.id)),
        })),
    ];
    const term = normalizePrompt(query.trim());
    const matches = term
      ? base.filter((command) => normalizePrompt(`${command.label} ${command.hint}`).includes(term))
      : base;
    if (!query.trim()) return matches;
    return [
      ...matches,
      {
        id: 'ask-ai',
        label: `Zeptat se AI: „${query.trim()}“`,
        hint: 'AI asistent zavolá funkce systému',
        icon: <ChatBubbleOutlineRounded fontSize="small" />,
        run: go(routes.assistantWithPrompt(query.trim())),
      },
    ];
  }, [businessId, businesses, dispatch, query, resolvedMode, router, setMode]);

  const execute = (command: Command | undefined) => {
    if (!command) return;
    close();
    command.run();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, commands.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      execute(commands[activeIndex]);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="sm"
      aria-label="Paleta příkazů"
      slotProps={{ paper: { sx: { alignSelf: 'flex-start', mt: { xs: 2, sm: '12vh' } } } }}
    >
      <div className="flex items-center gap-3 border-b border-divider px-5 py-4">
        <SearchRounded color="action" aria-hidden />
        <InputBase
          autoFocus
          fullWidth
          placeholder="Najít stránku nebo napsat dotaz…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          inputProps={{
            role: 'combobox',
            'aria-expanded': true,
            'aria-controls': listId,
            'aria-activedescendant': commands[activeIndex] ? `${listId}-${activeIndex}` : undefined,
            'aria-label': 'Hledat příkaz',
          }}
        />
        <kbd className="rounded-md border border-divider px-1.5 text-xs text-muted">Esc</kbd>
      </div>
      <ul id={listId} role="listbox" className="m-0 max-h-[50vh] list-none overflow-y-auto p-2">
        {commands.map((command, index) => (
          <li
            key={command.id}
            id={`${listId}-${index}`}
            role="option"
            aria-selected={index === activeIndex}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => execute(command)}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5',
              index === activeIndex && 'bg-primary/10',
            )}
          >
            <span
              className={cn(
                'flex size-9 items-center justify-center rounded-lg',
                command.id === 'ask-ai' ? 'bg-primary/10 text-primary' : 'bg-container text-muted',
              )}
              aria-hidden
            >
              {command.icon}
            </span>
            <span className="flex min-w-0 flex-col">
              <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                {command.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {command.hint}
              </Typography>
            </span>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
