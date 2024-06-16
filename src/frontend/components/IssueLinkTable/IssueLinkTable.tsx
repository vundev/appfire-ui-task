import { invoke } from "@forge/bridge";
import { Button, DynamicTable, Text, useProductContext } from "@forge/react";
import React, { useEffect, useState } from "react";
import { LinkedBug } from "../../../model/LinkedBug";

export function IssueLinkTable() {
    const [linkedBugs, setLinkedBugs] = useState<LinkedBug[] | null>(null)

    const context = useProductContext();

    const issueKey = context?.extension.issue.key

    const linkedBugsTableHead = {
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
                content: 'Unlink'
            }
        ]
    }

    const linkedBugsTableRows = (linkedBugs || []).map((linkedBug, index) => ({
        key: `row-${index}`,
        cells: [
            {
                key: linkedBug.key,
                content: linkedBug.key,
            },
            {
                key: linkedBug.summary,
                content: linkedBug.summary,
            },
            {
                key: linkedBug.status,
                content: linkedBug.status,
            },
            {
                key: linkedBug.priority,
                content: linkedBug.priority,
            },
            {
                key: linkedBug.created,
                content: new Date(linkedBug.created).toLocaleString(),
            },
            {
                key: linkedBug.assignee,
                content: linkedBug.assignee,
            },
            {
                content: <Button appearance="subtle"
                    onClick={
                        () => invoke('unlinkIssue', { issueLinkId: linkedBug.linkId }).then()
                    }
                    iconBefore="editor-close"> </Button>
            }
        ],
    }));

    useEffect(() => {
        if (!context) {
            return
        }
        invoke<LinkedBug[]>('getLinkedBugsByIssueId', {
            issueKey
        }).then(setLinkedBugs)
    }, [context])

    return <>
        <DynamicTable isLoading={!linkedBugs}
            head={linkedBugsTableHead}
            rows={linkedBugsTableRows}
            emptyView={<Text>No linked bugs</Text>}></DynamicTable>
    </>;
}