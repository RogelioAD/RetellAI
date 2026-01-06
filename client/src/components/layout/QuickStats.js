import React from "react";
import { useResponsive } from "../../hooks/useResponsive";
import { extractCreatedAt } from "../../utils/callDataTransformers";
import { formatDateRangeLabel } from "../../utils/dateFormatters";

/**
 * Quick stats component showing overview metrics
 */
export default function QuickStats({ calls, filteredCalls, isAdmin, selectedRange = "all", customDate = null }) {
  const { isMobile } = useResponsive();

  // Calculate stats - use filteredCalls for total count, but all calls for Today/This Week
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

  // Get dynamic label for total calls card
  const totalCallsLabel = formatDateRangeLabel(selectedRange, customDate);

  const stats = [
    { label: totalCallsLabel, value: totalCalls, icon: "📞" },
    { label: "Today", value: todayCalls, icon: "📅" },
    { label: "This Week", value: weekCalls, icon: "📆" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        gap: isMobile ? "12px" : "16px",
        marginBottom: isMobile ? "20px" : "24px",
      }}
    >
      {stats.map((stat, index) => (
        <div
          key={stat.icon}
          style={{
            padding: isMobile ? "16px" : "20px",
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "24px" }}>{stat.icon}</span>
            <div
              style={{
                fontSize: isMobile ? "28px" : "32px",
                fontWeight: 600,
                color: "#f4f4f5",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
          </div>
          <div
            style={{
              fontSize: isMobile ? "13px" : "14px",
              color: "#a1a1aa",
              fontWeight: 400,
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

