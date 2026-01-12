// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// # @match        https://atcoder.jp.example.com
// @grant        none
// ==/UserScript==

(() => {
  function findContestTitle(doc) {
    const titleElement = doc.querySelector(".contest-title");
    return titleElement ? titleElement.textContent : null;
  }

  function gatherContents(doc) {
    const elements = doc.querySelectorAll("section");
    const contents = [];
    elements.forEach((elem) => {
      const section = {
        title: null,
        body: null,
      };
      const header = elem.querySelector("h3");
      if (header) {
        section.title = header.textContent;
      }
      // clone elements
      const cloneElem = elem.cloneNode(true);
      // remove header
      const header2 = cloneElem.querySelector("h3");
      if (header2) {
        cloneElem.removeChild(header2);
      }
      section.body = cloneElem.innerHTML;
      contents.push(section);
    });
    return contents;
  }

  function gatherContentInfo() {
    const doc = document;
    const title = findContestTitle(doc);
    const contents = gatherContents(doc.querySelector(".lang-ja"));
    return {
      title,
      contents,
    };
  }

  function dumpHTML(info) {
    let html = "";
    const titleElem = document.createElement("h2");
    titleElem.textContent = info.title || "Untitled";
    html += titleElem.outerHTML;
    html += "\n";

    info.contents.forEach(({ title, body }) => {
      const titleElem = document.createElement("h3");
      titleElem.textContent = title || "No Title";
      html += titleElem.outerHTML;
      html += "\n";
      html += body;
      html += "\n";
    });
    return html;
  }

  function main() {
    console.log(dumpHTML(gatherContentInfo()));
  }

  main();
})();
