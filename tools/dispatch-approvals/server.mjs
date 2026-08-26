#!/usr/bin/env node
// Dispatch · Approvals — Level 1 prototype
// Lists open change-request PRs for a client site with preview links and
// working Approve / Decline actions. Runs locally against the operator's
// existing `gh` CLI auth — no tokens stored anywhere.
//
//   node tools/dispatch-approvals/server.mjs   →  http://localhost:4400
//
// Approve = merge the PR (Netlify then ships production automatically) and
// sync the dispatchvault mirror. Decline = close the PR with a comment.

import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
const PORT = 4400;

const SITE = {
  client: "Mercury Partners",
  repo: "Zincsolutions/mercurypartners",
  netlifySite: "mercurypartners",
  productionUrl: "https://mercurypartners.netlify.app",
  productionBranch: "astro/main",
  localCheckout: new URL("../..", import.meta.url).pathname,
  mirrorRemote: "dispatch",
};

async function gh(args) {
  const { stdout } = await exec("gh", args, { timeout: 60000 });
  return stdout;
}

async function listPRs() {
  const out = await gh([
    "pr", "list", "--repo", SITE.repo, "--base", SITE.productionBranch,
    "--json", "number,title,headRefName,url,createdAt,body,statusCheckRollup",
  ]);
  return JSON.parse(out);
}

function rollup(pr) {
  // The authoritative signal is Netlify's deploy-preview status for this
  // site; stale third-party integrations on the repo must not poison it.
  const checks = pr.statusCheckRollup || [];
  const preview = checks.find((c) => (c.context || "").toLowerCase() === `netlify/${SITE.netlifySite}/deploy-preview`);
  if (preview) {
    const s = preview.state || preview.conclusion || "";
    if (s === "SUCCESS") return { label: "Preview ready", tone: "ok" };
    if (["FAILURE", "ERROR"].includes(s)) return { label: "Build failed", tone: "bad" };
    return { label: "Building…", tone: "wait" };
  }
  const relevant = checks.filter((c) => !/vercel/i.test(c.context || c.name || ""));
  if (!relevant.length) return { label: "No checks", tone: "wait" };
  const bad = relevant.find((c) => ["FAILURE", "ERROR"].includes(c.conclusion || c.state));
  if (bad) return { label: "Build failed", tone: "bad" };
  const pending = relevant.find((c) => {
    const s = c.conclusion ?? c.state ?? "";
    return s === "" || s === "PENDING" || c.status === "IN_PROGRESS";
  });
  if (pending) return { label: "Building…", tone: "wait" };
  return { label: "Preview ready", tone: "ok" };
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function page(prs, notice) {
  const rows = prs.map((pr) => {
    const st = rollup(pr);
    const branchUrl = `https://${pr.headRefName.replace(/[^a-zA-Z0-9-]/g, "-")}--${SITE.netlifySite}.netlify.app`;
    const previewUrl = `https://deploy-preview-${pr.number}--${SITE.netlifySite}.netlify.app`;
    return `
    <article class="cr">
      <div class="cr__meta">
        <span class="chip chip--${st.tone}">${st.label}</span>
        <span class="cr__id">CR-${pr.number}</span>
      </div>
      <h2>${esc(pr.title)}</h2>
      <p class="cr__sub">${esc(SITE.client)} · branch <code>${esc(pr.headRefName)}</code> · opened ${new Date(pr.createdAt).toLocaleDateString()}</p>
      <div class="cr__actions">
        <a class="btn btn--preview" href="${previewUrl}" target="_blank" rel="noopener">Preview change ↗</a>
        <a class="btn btn--ghost" href="${SITE.productionUrl}" target="_blank" rel="noopener">Current live site ↗</a>
        <span class="spacer"></span>
        <form method="POST" action="/decline" onsubmit="return confirm('Decline this change? The request will be closed with a note.')">
          <input type="hidden" name="n" value="${pr.number}" />
          <button class="btn btn--decline" type="submit">Decline</button>
        </form>
        <form method="POST" action="/approve" onsubmit="return confirm('Approve and publish to the live site?')">
          <input type="hidden" name="n" value="${pr.number}" />
          <button class="btn btn--approve" type="submit">Approve &amp; publish</button>
        </form>
      </div>
    </article>`;
  }).join("");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dispatch · Approvals</title>
<style>
  :root { --bg:#0e1116; --panel:#161b22; --line:#2b3240; --text:#e8eaed; --dim:#9aa4b2;
          --green:#2ea06a; --green-d:#25865a; --red:#b8524a; --accent:#6baeff; }
  * { box-sizing:border-box; margin:0; }
  body { background:var(--bg); color:var(--text); font:15px/1.6 -apple-system,"Segoe UI",sans-serif; }
  header { display:flex; align-items:center; gap:.75rem; padding:1.1rem 2rem; border-bottom:1px solid var(--line); }
  header .mark { width:14px; height:14px; background:var(--green); border-radius:50%; }
  header b { font-size:1.05rem; }  header span { color:var(--dim); }
  main { max-width:60rem; margin:0 auto; padding:2.5rem 1.5rem; }
  .notice { background:#12281c; border:1px solid var(--green-d); color:#bfe8d2; padding:.8rem 1rem; margin-bottom:1.5rem; border-radius:6px; }
  .notice--err { background:#2a1513; border-color:var(--red); color:#f0c9c5; }
  h1 { font-size:1.3rem; margin-bottom:.25rem; }  .sub { color:var(--dim); margin-bottom:2rem; }
  .cr { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:1.5rem 1.5rem 1.25rem; margin-bottom:1.25rem; }
  .cr__meta { display:flex; gap:.75rem; align-items:center; margin-bottom:.5rem; }
  .cr__id { color:var(--dim); font-size:.8rem; letter-spacing:.05em; }
  .cr h2 { font-size:1.1rem; font-weight:600; }
  .cr__sub { color:var(--dim); font-size:.85rem; margin:.35rem 0 1.1rem; }
  .cr__sub code { color:var(--accent); }
  .chip { font-size:.72rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; padding:.2rem .6rem; border-radius:99px; }
  .chip--ok { background:#12281c; color:#4cc38a; }  .chip--wait { background:#26210f; color:#d3b44a; }
  .chip--bad { background:#2a1513; color:#e5716a; }
  .cr__actions { display:flex; gap:.6rem; align-items:center; flex-wrap:wrap; }
  .spacer { flex:1; }
  .btn { display:inline-block; border:1px solid var(--line); background:#1d232d; color:var(--text);
         padding:.5rem 1rem; border-radius:6px; font-size:.85rem; font-weight:600; text-decoration:none; cursor:pointer; }
  .btn--preview { border-color:var(--accent); color:var(--accent); }
  .btn--approve { background:var(--green); border-color:var(--green); color:#fff; }
  .btn--approve:hover { background:var(--green-d); }
  .btn--decline { color:#e5988f; }
  .empty { color:var(--dim); text-align:center; padding:4rem 0; }
</style></head><body>
<header><div class="mark"></div><b>Dispatch</b><span>· Approvals</span></header>
<main>
  ${notice || ""}
  <h1>Pending change requests — ${esc(SITE.client)}</h1>
  <p class="sub">Preview each change on a live URL, then approve to publish or decline to send it back.</p>
  ${rows || `<div class="empty">No pending change requests. Approved changes are live at <a style="color:var(--accent)" href="${SITE.productionUrl}">${SITE.productionUrl.replace("https://", "")}</a>.</div>`}
</main></body></html>`;
}

async function readBody(req) {
  let data = "";
  for await (const chunk of req) data += chunk;
  return new URLSearchParams(data);
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "POST" && (req.url === "/approve" || req.url === "/decline")) {
      const params = await readBody(req);
      const n = String(parseInt(params.get("n"), 10));
      if (!/^\d+$/.test(n)) throw new Error("bad request number");
      let notice;
      if (req.url === "/approve") {
        await gh(["pr", "merge", n, "--repo", SITE.repo, "--merge"]);
        // keep the dispatchvault mirror in sync with production
        try {
          await exec("git", ["-C", SITE.localCheckout, "fetch", "origin", SITE.productionBranch], { timeout: 60000 });
          await exec("git", ["-C", SITE.localCheckout, "push", SITE.mirrorRemote,
            `refs/remotes/origin/${SITE.productionBranch}:refs/heads/${SITE.productionBranch}`], { timeout: 60000 });
        } catch { /* mirror sync is best-effort */ }
        notice = `<div class="notice">CR-${n} approved. Publishing to the live site now — allow a minute or two for the deploy, then refresh <a style="color:#bfe8d2" href="${SITE.productionUrl}">${SITE.productionUrl.replace("https://", "")}</a>.</div>`;
      } else {
        await gh(["pr", "close", n, "--repo", SITE.repo, "--comment", "Declined via Dispatch Approvals."]);
        notice = `<div class="notice">CR-${n} declined and sent back.</div>`;
      }
      const prs = await listPRs();
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(page(prs, notice));
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url.startsWith("/?"))) {
      const prs = await listPRs();
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(page(prs));
      return;
    }
    res.writeHead(404).end("not found");
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
    res.end(page([], `<div class="notice notice--err">Action failed: ${esc(e.message)}</div>`));
  }
});

server.listen(PORT, () => console.log(`Dispatch Approvals → http://localhost:${PORT}`));
