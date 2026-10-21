'use client';

import { AnalyticsView } from '@/features/analytics/components/AnalyticsView';
import { AssistantView } from '@/features/assistant/components/AssistantView';
import { withActiveBusiness } from '@/features/businesses/components/with-active-business';
import { CompetitorsView } from '@/features/competitors/components/CompetitorsView';
import { WatchedCompetitorsView } from '@/features/competitors/components/WatchedCompetitorsView';
import { DashboardView } from '@/features/dashboard/components/DashboardView';
import { ReviewsView } from '@/features/reviews/components/ReviewsView';

export const DashboardPage = withActiveBusiness(DashboardView);
export const ReviewsPage = withActiveBusiness(ReviewsView);
export const CompetitorsPage = withActiveBusiness(CompetitorsView);
export const WatchedCompetitorsPage = withActiveBusiness(WatchedCompetitorsView);
export const AnalyticsPage = withActiveBusiness(AnalyticsView);
export const AssistantPage = withActiveBusiness(AssistantView);
