import api, { route } from "@forge/api";
import Resolver from "@forge/resolver";
import { LinkedBug } from "../model/LinkedBug";

const resolver = new Resolver();

const issueLinkedBugsFilter = (issueLink: any) =>
  (issueLink.outwardIssue &&
    issueLink.outwardIssue.fields.issuetype.name === "Bug") ||
  (issueLink.inwardIssue &&
    issueLink.inwardIssue.fields.issuetype.name === "Bug");

const linkedBugFactory = (issueLink: any) => {
  const linkedIssue = issueLink.outwardIssue || issueLink.inwardIssue;
  return <LinkedBug>{
    key: linkedIssue.key,
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

resolver.define("getText", (req) => {
  console.log(req);
  return "Hello world";
});

resolver.define("getText2", (req) => {
  console.log(req);
  return "Hello world";
});

resolver.define("getComments", async (req) => {
  console.log(req);
  const issueIdOrKey = "SDP-1";
  const res = await api
    .asApp()
    .requestJira(route`/rest/api/3/issue/${issueIdOrKey}/comment`);
  const data: any = await res.json();
  return data.comments;
});

resolver.define("getLinkedBugsByIssueId", async (request) => {
  const issueKey = request.payload.issueKey;

  const endpoint = route`/rest/api/2/issue/${issueKey}?fields=issuelinks`;
  const response = await api.asApp().requestJira(endpoint);
  const data = await response.json();

  const issueLinks = data.fields?.issuelinks || [];

  const issueLinksCreationDates = await Promise.all(
    issueLinks
      .map(linkedIssueKeyFactory)
      .map((issueKey: string) => getIssueCreationDate(issueKey))
  );

  console.log(issueLinksCreationDates);

  return issueLinks
    .filter(issueLinkedBugsFilter)
    .map(linkedBugFactory)
    .map((linkedBug: LinkedBug, index: number) => {
      return <LinkedBug>{
        ...linkedBug,
        created: issueLinksCreationDates[index],
      };
    });
});

function getIssueCreationDate(issueKey: string): Promise<string> {
  const endpoint = route`/rest/api/2/issue/${issueKey}?fields=created`;
  return api
    .asApp()
    .requestJira(endpoint)
    .then((data) => data.json())
    .then((json) => {
        console.log(json)
      return Promise.resolve(json.fields.created);
    });
}

export const handler = resolver.getDefinitions();
