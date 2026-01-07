import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { extractCreatedAt } from "../../utils/callDataTransformers";
import { formatDateRangeLabel } from "../../utils/dateFormatters";
import Icon from "../common/Icon";
import { colors, spacing, typography, statCardStyles, shadows } from "../../constants/horizonTheme";

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

  // Calculate stats
  const totalCalls = selectedRange === "all" && totalCount !== null 
    ? totalCount 
    : (filteredCalls ? filteredCalls.length : calls.length);
  
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
      color: colors.success,
      bgColor: `${colors.success}15`,
    },
    { 
      label: "This Week", 
      value: weekCalls, 
      icon: "chart",
      color: colors.warning,
      bgColor: `${colors.warning}15`,
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
        <div
          key={index}
          style={{
            ...statCardStyles.base,
            padding: isMobile ? spacing.lg : spacing['2xl'],
          }}
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
                  fontWeight: typography.fontWeight.medium,
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
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                backgroundColor: stat.bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={stat.icon} size={24} color={stat.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
