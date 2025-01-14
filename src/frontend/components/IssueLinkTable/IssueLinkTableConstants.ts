import { useMemo } from "react";

export function useIssueLinkTableConstants() {
  const linkedBugsTableHead = useMemo(() => {
    return {
      cells: [
        {
          key: "key",
          content: "Issue key",
          isSortable: true,
        },
        {
          key: "summary",
          content: "Summary",
          isSortable: true,
        },
        {
          key: "status",
          content: "Status",
          isSortable: true,
        },
        {
          key: "priority",
          content: "Priority",
          isSortable: true,
        },
        {
          key: "created",
          content: "Created",
          isSortable: true,
        },
        {
          key: "assignee",
          content: "Assignee",
          isSortable: true,
        },
        {
          content: "Unlink",
        },
      ],
    };
  }, []);

  return {
    linkedBugsTableHead,
  };
}
