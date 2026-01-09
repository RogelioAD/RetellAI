import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { extractCreatedAt } from "../../utils/callDataTransformers";
import { formatDateRangeLabel } from "../../utils/dateFormatters";
import Icon from "../common/Icon";
import Card from "../common/Card";
import { colors, spacing, typography, borderRadius } from "../../constants/horizonTheme";

/**
 * Quick stats component with Horizon UI stat card design
 * Clean, modern stat cards with icons and clear hierarchy
 */
export default function QuickStats({ 
  calls, 
  filteredCalls, 
  isAdmin, 
  selectedRange = "all", 
  customDate = null, 
  totalCount = null 
}) {
  const { isMobile } = useResponsive();

  // Calculate stats - always use filteredCalls if available, otherwise use calls
  // This ensures consistency between "all time" and filtered ranges
  // NOTE: Uses full array length - calls array contains ALL paginated calls from backend (not capped at 100)
  const totalCalls = filteredCalls ? filteredCalls.length : calls.length;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCalls = calls.filter((item) => {
    const mapping = item.mapping || {};
    const call = item.call || item;
    const callDate = new Date(extractCreatedAt(call, mapping));
    callDate.setHours(0, 0, 0, 0);
    return callDate.getTime() === today.getTime();
  }).length;

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
  thisWeek.setHours(0, 0, 0, 0);
  const weekCalls = calls.filter((item) => {
    const mapping = item.mapping || {};
    const call = item.call || item;
    const callDate = new Date(extractCreatedAt(call, mapping));
    return callDate >= thisWeek;
  }).length;

  const totalCallsLabel = formatDateRangeLabel(selectedRange, customDate);

  const stats = [
    { 
      label: totalCallsLabel, 
      value: totalCalls, 
      icon: "phone",
      color: colors.brand[500],
      bgColor: `${colors.brand[500]}15`,
    },
    { 
      label: "Today", 
      value: todayCalls, 
      icon: "chart",
      color: '#EC4899',
      bgColor: `#EC489915`,
    },
    { 
      label: "This Week", 
      value: weekCalls, 
      icon: "chart",
      color: '#9333EA',
      bgColor: `#9333EA15`,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        gap: isMobile ? spacing.md : spacing.xl,
        marginBottom: isMobile ? spacing.xl : spacing['2xl'],
      }}
    >
      {stats.map((stat, index) => (
        <Card
          key={index}
          variant="glass"
          padding={isMobile ? spacing.lg : spacing['2xl']}
          style={{ borderRadius: borderRadius.xl }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.secondary,
                  fontWeight: typography.fontWeight.bold,
                  marginBottom: spacing.sm,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: isMobile ? typography.fontSize['2xl'] : typography.fontSize['3xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text.primary,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
            </div>
            <div
              style={{
                width: isMobile ? "64px" : "72px",
                height: isMobile ? "64px" : "72px",
                borderRadius: borderRadius.lg,
                backgroundColor: stat.bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px ${stat.color}25`,
                border: `2px solid ${stat.color}30`,
              }}
            >
              <Icon name={stat.icon} size={isMobile ? 28 : 32} color={stat.color} strokeWidth="2.5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
