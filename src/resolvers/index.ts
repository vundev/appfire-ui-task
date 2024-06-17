import api, { route } from "@forge/api";
import Resolver from "@forge/resolver";
import { LinkedBug } from "../model/LinkedBug";
import { LinkedBugSortOrder } from "../model/LinkedBugSortOrder";

const resolver = new Resolver();

/**
 * @returns Return an array of LinkedBug objects. If the issueKey is an empty
 * string or undefined return an empty array.
 */
resolver.define("getLinkedBugsByIssueKey", async (request) => {
  const issueKey = request.payload.issueKey;

  const endpoint = route`/rest/api/2/issue/${issueKey}?fields=issuelinks`;
  const response = await api.asApp().requestJira(endpoint);
  const data = await response.json();

  const issueLinks = data.fields?.issuelinks || [];

  const issueLinksFields = await Promise.all(
    issueLinks
      .map(linkedIssueKeyFactory)
      .map((issueKey: string) => getLinkedIssueFields(issueKey))
  );

  return issueLinks
    .filter(issueLinkedBugsFilter)
    .map(linkedBugFactory)
    .map((linkedBug: LinkedBug, index: number) => {
      return <LinkedBug>{
        ...linkedBug,
        ...issueLinksFields[index],
      };
    });
});

resolver.define("getLinkedBugSortOrder", async () => {
  const [priorityOrder, statusOrder] = await Promise.all([
    api
      .asApp()
      .requestJira(route`/rest/api/2/priority`)
      .then(toJSON)
      .then(linkedIssueOrderFactory),
    api
      .asApp()
      .requestJira(route`/rest/api/2/status`)
      .then(toJSON)
      .then(linkedIssueOrderFactory),
  ]);

  return <LinkedBugSortOrder>{
    priorityOrder,
    statusOrder,
  };
});

resolver.define("unlinkIssue", async (request) => {
  const issueLinkId = request.payload.issueLinkId;

  const endpoint = route`/rest/api/2/issueLink/${issueLinkId}`;

  await api.asApp().requestJira(endpoint, {
    method: "DELETE",
  });
});

// --- Private helpers ---

function getLinkedIssueFields(issueKey: string): Promise<{
  created: string;
  assignee: string;
}> {
  const endpoint = route`/rest/api/2/issue/${issueKey}?fields=created,assignee`;
  return api
    .asApp()
    .requestJira(endpoint)
    .then(toJSON)
    .then((json) =>
      Promise.resolve({
        created: json.fields.created,
        assignee: json.fields.assignee?.displayName || "",
      })
    );
}

// --- Factories and Filters ---

const issueLinkedBugsFilter = (issueLink: any) =>
  (issueLink.outwardIssue &&
    issueLink.outwardIssue.fields.issuetype.name === "Bug") ||
  (issueLink.inwardIssue &&
    issueLink.inwardIssue.fields.issuetype.name === "Bug");

const linkedBugFactory = (issueLink: any) => {
  const linkedIssue = issueLink.outwardIssue || issueLink.inwardIssue;
  return <LinkedBug>{
    key: linkedIssue.key,
    linkId: issueLink.id,
    summary: linkedIssue.fields.summary,
    status: linkedIssue.fields.status.name,
    priority: linkedIssue.fields.priority.name,
    created: "",
  };
};

const linkedIssueKeyFactory = (issueLink: any): string => {
  const linkedIssue = issueLink.outwardIssue || issueLink.inwardIssue;
  return linkedIssue.key;
};

const linkedIssueOrderFactory = (order: any[]): string[] =>
  order.map((orderItem) => orderItem.name);

const toJSON = (data: any) => data.json();

export const handler = resolver.getDefinitions();
