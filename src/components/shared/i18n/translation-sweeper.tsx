"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { AUTO_TRANSLATIONS } from "@/i18n/auto-translations";
import { isSupportedLocale } from "@/i18n/locales";

const TRANSLATABLE_ATTRIBUTES = ["placeholder", "aria-label", "title", "alt"] as const;
const SKIP_SELECTOR = "script, style, noscript, svg, canvas, code, pre, [data-no-auto-translate]";

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function replaceTextPreservingOuterWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function shouldSkipTextNode(node: Text) {
  const parent = node.parentElement;
  return !parent || parent.closest(SKIP_SELECTOR) !== null;
}

function translateTextNodes(root: ParentNode, textMap: Record<string, string>) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }

  for (const node of nodes) {
    if (shouldSkipTextNode(node)) continue;
    const original = node.nodeValue ?? "";
    const key = normalize(original);
    if (!key) continue;
    const translated = textMap[key];
    if (translated && translated !== key) {
      node.nodeValue = replaceTextPreservingOuterWhitespace(original, translated);
    }
  }
}

function translateAttributes(root: ParentNode, attributeMap: Record<string, string>) {
  const elements =
    root instanceof Element ? [root, ...Array.from(root.querySelectorAll("*"))] : Array.from(document.querySelectorAll("*"));

  for (const element of elements) {
    if (element.closest(SKIP_SELECTOR)) continue;

    for (const attr of TRANSLATABLE_ATTRIBUTES) {
      const original = element.getAttribute(attr);
      if (!original) continue;
      const key = normalize(original);
      const translated = attributeMap[key];
      if (translated && translated !== key) {
        element.setAttribute(attr, translated);
      }
    }
  }
}

function translateTree(root: ParentNode, textMap: Record<string, string>, attributeMap: Record<string, string>) {
  translateTextNodes(root, textMap);
  translateAttributes(root, attributeMap);
}

export function TranslationSweeper() {
  const locale = useLocale();

  useEffect(() => {
    if (!isSupportedLocale(locale) || locale === "en") return;

    const pack = AUTO_TRANSLATIONS[locale];
    if (!pack) return;

    const run = (root: ParentNode = document.body) => {
      translateTree(root, pack.text, pack.attributes);
    };

    run();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData" && mutation.target instanceof Text) {
          const parent = mutation.target.parentElement;
          if (parent) run(parent);
        }

        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof Element || node instanceof DocumentFragment) {
            run(node);
          } else if (node instanceof Text && node.parentElement) {
            run(node.parentElement);
          }
        }

        if (mutation.type === "attributes" && mutation.target instanceof Element) {
          run(mutation.target);
        }
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
    });

    return () => observer.disconnect();
  }, [locale]);

  return null;
}
