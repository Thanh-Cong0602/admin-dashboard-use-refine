import { DashboardDealsChartQuery } from "@/graphql/types";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import dayjs from "dayjs";
/**
 * Format and return a readable date range string.
 *
 * @param {string | Date} startDate - The start date in a format compatible with dayjs.
 * @param {string | Date} endDate - The end date in a format compatible with dayjs.
 * @returns {string} Formatted date range string (e.g., "Jun 02, 2025 - 14:00 - Jun 02, 2025 - 16:00").
 */
export const getDate = (
  startDate: string | Date,
  endDate: string | Date,
): string => {
  const start = dayjs(startDate).format("MMM DD, YYYY - HH:mm");
  const end = dayjs(endDate).format("MMM DD, YYYY - HH:mm");

  return `${start} - ${end}`;
};

type DealStage = GetFieldsFromList<DashboardDealsChartQuery>;

type DealAggregate = DealStage["dealsAggregate"][0];

const filterDeal = (deal?: DealAggregate) =>
  deal?.groupBy?.closeDateMonth && deal.groupBy.closeDateYear;

const mapDeals = (
  deals: DealAggregate[] = [],
  state: string,
): MappedDealData[] => {
  return deals.filter(filterDeal).map((deal) => {
    const { closeDateMonth, closeDateYear } = deal.groupBy as NonNullable<
      DealAggregate["groupBy"]
    >;

    const date = dayjs(`${closeDateYear}-${closeDateMonth}-01`);

    return {
      timeUnix: date.unix(),
      timeText: date.format("MMM YYYY"),
      value: deal.sum?.value ?? 0,
      state,
    };
  });
};

interface MappedDealData {
  timeUnix: number;
  timeText: string;
  value: number;
  state: string;
}

export const mapDealsData = (
  dealStages: DealStage[] = [],
): MappedDealData[] => {
  const won = dealStages.find((stage) => stage.title === "WON");

  const wonDeals = mapDeals(won?.dealsAggregate, "Won");

  const lost = dealStages.find((stage) => stage.title === "LOST");

  const lostDeals = mapDeals(lost?.dealsAggregate, "Lost");

  return [...wonDeals, ...lostDeals].sort((a, b) => a.timeUnix - b.timeUnix);
};
