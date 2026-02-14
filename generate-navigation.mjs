#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

/* ===================== Base configuration ===================== */

const MARKDOWN_EXTS = new Set([".md", ".mdx"]);
const IGNORE_DIR_NAMES = new Set([
  ".git",
  ".github",
  "node_modules",
  "__MACOSX",
]);
const IGNORE_FILE_NAMES = new Set([".ds_store"]);

const DEFAULT_GROUP_NAME_BY_LANGUAGE = {
  en: "Default",
  "zh-Hans": "默认",
};

/**
 * ⭐ Page title mapping (used to update the title in English MDX files)
 * key = Chinese title
 * value = English title
 */
const PAGE_TITLE_MAPPING = {
  // Agent Middleware
  "智能体中间件": "Agent Middleware",
  "内置中间件": "Built-in Middleware",
  "自定义中间件": "Custom Middleware",
  
  // Digital Expert
  "对话日志": "Conversation Logs",
  "开发接口": "Development API",
  "数字专家": "Digital Expert",
  "嵌入网页": "Embed Webpage",
  "增强功能": "Enhanced Features",
  "环境变量": "Environment Variables",
  "专家配置": "Expert Configuration",
  "人机协同": "Human-AI Collaboration",
  "长期记忆": "Long-term Memory",
  "监测仪表盘": "Monitoring Dashboard",
  "多智能体架构": "Multi-Agent Architecture",
  "发布版本": "Release Version",
  "监督型架构": "Supervised Architecture",
  "蜂群型架构": "Swarm Architecture",
  
  // AI Assistant
  "AI 助手": "AI Assistant",
  "命令": "Commands",
  "配置 AI 提供商": "Configure AI Provider",
  "角色": "Role",
  
  // Conversation
  "对话": "Conversation",
  "项目": "Projects",
  
  // Knowledge Base
  "知识库": "Knowledge Base",
  "API": "API",
  "连接外部知识库": "Connect External Knowledge Base",
  "知识库功能": "Knowledge Base Features",
  "维护文档": "Maintain Documents",
  "召回测试": "Recall Test",
  "知识库使用方式": "Ways to Use Knowledge Base",
  "通过流水线创建知识库": "Create Knowledge Base Via Pipeline",
  
  // Plugin Development
  "插件开发": "Plugin Development",
  "核心概念": "Core Concepts",
  "开发步骤": "Development Steps",
  "概述": "Overview",
  "权限设计指南": "Permission Design Guide",
  "发布和使用": "Publish and Use",
  "Schema UI 扩展": "Schema UI Extension",
  "飞书文档示例": "Feishu Document Example",
  
  // Toolset
  "工具集": "Toolset",
  "内置工具集": "Built-in Toolset",
  "自定义工具集": "Custom Toolset",
  "飞书": "Feishu",
  "规划任务": "Planning Tasks",
  "定时任务": "Scheduled Tasks",
  "BI 工具集": "BI Toolset",
  "ChatBI 工具集": "ChatBI Toolset",
  "MCP 工具": "MCP Tools",
  "虚拟环境": "Virtual Environment",
  
  // Troubleshooting
  "故障排查": "Troubleshooting",
  "错误": "Errors",
  
  // Tutorial
  "教程": "Tutorial",
  
  // Workflow
  "工作流": "Workflow",
};

/**
 * ⭐ Multilingual display name overrides (core)
 * key = directory name (slug)
 * value = display name in corresponding language
 */
const DISPLAY_NAME_OVERRIDES = {
  en: {
    ai: "AI",
    "agent-middleware": "Agent Middleware",
    "ai-assistant": "AI Assistant",
    conversation: "Conversation",
    "digital-expert": "Digital Expert",
    "knowledge-base": "Knowledge Base",
    "plugin-development": "Plugin Development",
    toolset: "Toolset",
    troubleshooting: "Troubleshooting",
    tutorial: "Tutorial",
    workflow: "Workflow",
    // Bi product
    bi: "BI",
    "indicator-management": "Indicator Management",
    "semantic-model": "Semantic Model",
    "story-dashboard": "Story Dashboard",
    "website-features": "Website Features",
    widget: "Widget",
  },

  "zh-Hans": {
    ai: "AI",
    "agent-middleware": "智能体中间件",
    "ai-assistant": "AI 助手",
    conversation: "对话",
    "digital-expert": "数字专家",
    "knowledge-base": "知识库",
    "plugin-development": "插件开发",
    toolset: "工具集",
    troubleshooting: "故障排查",
    tutorial: "教程",
    workflow: "工作流",
    // Bi product
    bi: "BI",
    "indicator-management": "指标管理",
    "semantic-model": "语义模型",
    "story-dashboard": "故事看板",
    "website-features": "网站功能",
    widget: "微件",
    // Group name mapping (directory name)
    "create-knowledge-base-via-pipeline": "通过流水线创建知识库",
    "bi-toolset": "BI 工具集",
    "chatbi-toolset": "ChatBI 工具集",
    "mcp-tools": "MCP 工具",
    "virtual-environment": "虚拟环境",
    "feishu-document-example": "飞书文档示例",
    errors: "错误",
    "analysis-card": "分析卡片",
    "analysis-table": "分析表格",
    "filter-bar": "筛选栏",
    "input-controller": "输入控制器",
    "dimension-designer": "维度设计器",
    "multidimensional-dataset-designer": "多维数据集设计器",
    "Sandbox": "沙箱",
  },
};

/**
 * ⭐ Tab order configuration (core)
 * key = product directory name (slug)
 * value = array of tab directory names (slug) in display order
 *
 * Tabs not in this config will be sorted alphabetically at the end.
 * When adding a new tab, add it here to control ordering.
 */
const TAB_ORDER_BY_PRODUCT = {
  ai: [
    "digital-expert",
    "conversation",
    "knowledge-base",
    "toolset",
    "workflow",
    "ai-assistant",
    "agent-middleware",
    "plugin-development",
    "chatkit",
    "troubleshooting",
    "tutorial",
  ],
  bi: [
    "semantic-model",
    "indicator-management",
    "story-dashboard",
    "widget",
    "website-features",
  ],
  code: [
    "web"
  ]
};

/* ===================== Navbar multilingual mapping ===================== */

// navbar inside language node (array format)
const NAVBAR_ARRAY_BY_LANGUAGE = {
  en: [
    { label: "GitHub", href: "https://github.com/xpert-ai/xpert" },
    { label: "Support", href: "mailto:service@xpertai.cn" },
    { label: "Try XpertAI", href: "https://app.xpertai.cn/" },
  ],
  "zh-Hans": [
    { label: "GitHub", href: "https://github.com/xpert-ai/xpert" },
    { label: "支持", href: "mailto:service@xpertai.cn" },
    { label: "试用 XpertAI", href: "https://app.xpertai.cn/" },
  ],
};

// top-level navbar (object format) — avoid crash if main() references undefined
const NAVBAR_BY_LANGUAGE = {
  en: {
    links: [
      { label: "GitHub", href: "https://github.com/xpert-ai/xpert" },
      { label: "Support", href: "mailto:service@xpertai.cn" },
    ],
    primary: {
      type: "button",
      label: "Try Chat-Kit",
      href: "https://xpertai.cn/docs/ai/",
    },
  },
  "zh-Hans": {
    links: [
      { label: "GitHub", href: "https://github.com/xpert-ai/xpert" },
      { label: "支持", href: "mailto:service@xpertai.cn" },
    ],
    primary: {
      type: "button",
      label: "试用 Chat-Kit",
      href: "https://xpertai.cn/zh-Hans/docs/ai/",
    },
  },
};



/* ===================== Utility functions ===================== */

function parseArgs(argv) {
  const args = {
    docs: "docs.json",
    contentRoot: ".",
    languages: null,
    dryRun: false,
    updateTitles: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === "--dry-run") {
      args.dryRun = true;
      continue;
    }
    if (t === "--update-titles") {
      args.updateTitles = true;
      continue;
    }
    const next = argv[i + 1];
    if (!next) throw new Error(`Missing value for ${t}`);
    if (t === "--docs") args.docs = next;
    else if (t === "--content-root") args.contentRoot = next;
    else if (t === "--languages") args.languages = next;
    i++;
  }
  return args;
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function pagePathFromFile(contentRootAbs, fileAbs) {
  const rel = path.relative(contentRootAbs, fileAbs);
  return toPosix(rel.slice(0, -path.extname(rel).length));
}

/**
 * Check if text contains Chinese characters
 */
function containsChinese(text) {
  return /[\u4e00-\u9fa5]/.test(text);
}

/**
 * Parse title from frontmatter
 */
function parseFrontmatterTitle(content) {
  if (!content.startsWith("---")) {
    return null;
  }

  const endIndex = content.indexOf("---", 3);
  if (endIndex === -1) {
    return null;
  }

  const frontmatterText = content.slice(3, endIndex).trim();
  const titleMatch = frontmatterText.match(/^title:\s*(.+)$/m);
  return titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, "") : null;
}

/**
 * Parse sidebar_position from frontmatter
 */
function parseFrontmatterSidebarPosition(content) {
  if (!content.startsWith("---")) {
    return null;
  }

  const endIndex = content.indexOf("---", 3);
  if (endIndex === -1) {
    return null;
  }

  const frontmatterText = content.slice(3, endIndex).trim();
  const positionMatch = frontmatterText.match(/^sidebar_position:\s*(.+)$/m);
  if (positionMatch) {
    const value = positionMatch[1].trim();
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  }
  return null;
}

/**
 * Generate an English title from filename
 */
function generateEnglishTitleFromFilename(filePath) {
  const basename = path.basename(filePath, path.extname(filePath));
  return basename
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Update title in frontmatter
 */
function updateFrontmatterTitle(content, newTitle) {
  if (!content.startsWith("---")) {
    return `---\ntitle: ${newTitle}\n---\n\n${content}`;
  }

  const endIndex = content.indexOf("---", 3);
  if (endIndex === -1) {
    return content;
  }

  const frontmatterText = content.slice(3, endIndex).trim();
  const body = content.slice(endIndex + 3).trimStart();

  const updatedFrontmatter = frontmatterText.replace(
    /^title:\s*.+$/m,
    `title: ${newTitle}`
  );

  return `---\n${updatedFrontmatter}\n---\n${body}`;
}

/**
 * Update English MDX file title if it contains Chinese
 */
async function updateEnglishPageTitle(filePath, updateTitles) {
  if (!updateTitles || !filePath.includes("/en/")) {
    return { updated: false };
  }

  try {
    const content = await fs.readFile(filePath, "utf8");
    const currentTitle = parseFrontmatterTitle(content);

    if (!currentTitle || !containsChinese(currentTitle)) {
      return { updated: false };
    }

    // lookup mapping
    let newTitle = PAGE_TITLE_MAPPING[currentTitle];

    // fallback: generate from filename if not in mapping
    if (!newTitle) {
      newTitle = generateEnglishTitleFromFilename(filePath);
    }

    const updatedContent = updateFrontmatterTitle(content, newTitle);
    await fs.writeFile(filePath, updatedContent, "utf8");

    return { updated: true, oldTitle: currentTitle, newTitle };
  } catch (error) {
    console.warn(`⚠️ Failed to update file title: ${filePath}`, error.message);
    return { updated: false, error: error.message };
  }
}

/**
 * ⭐ Language-aware display name
 */
function toDisplayName(slug, language) {
  if (!slug) return slug;

  const override = DISPLAY_NAME_OVERRIDES?.[language]?.[slug];
  if (override) return override;

  // fallback: Title Case from slug
  return slug
    .split(/[-_]+/g)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

async function listDir(dirAbs) {
  const entries = await fs.readdir(dirAbs, { withFileTypes: true });
  return entries.filter((e) => {
    if (e.name.startsWith(".")) return false;
    if (e.isDirectory()) return !IGNORE_DIR_NAMES.has(e.name);
    if (e.isFile())
      return !IGNORE_FILE_NAMES.has(e.name.toLowerCase());
    return false;
  });
}

/**
 * ⭐ Page sorting function
 * Sorting rules (priority high -> low):
 * 1. index files first
 * 2. files with sidebar_position sorted by number (smaller first)
 * 3. others sorted alphabetically by path
 */
async function sortPages(pages, contentRootAbs) {
  const isIndex = (p) => p.endsWith("/index");
  
  // read sidebar_position for each page
  const pagePositions = new Map();
  for (const pagePath of pages) {
    const filePath = path.join(contentRootAbs, pagePath + ".mdx");
    let altPath = path.join(contentRootAbs, pagePath + ".md");
    
    // try .mdx or .md
    let content = null;
    try {
      content = await fs.readFile(filePath, "utf8");
    } catch {
      try {
        content = await fs.readFile(altPath, "utf8");
      } catch {
        // file not found, skip
      }
    }
    
    if (content) {
      const position = parseFrontmatterSidebarPosition(content);
      if (position !== null) {
        pagePositions.set(pagePath, position);
      }
    }
  }
  
  return [...pages].sort((a, b) => {
    // 1. index files first
    if (isIndex(a) && !isIndex(b)) return -1;
    if (!isIndex(a) && isIndex(b)) return 1;
    
    // 2. sidebar_position numeric order
    const posA = pagePositions.get(a);
    const posB = pagePositions.get(b);
    
    if (posA !== undefined && posB !== undefined) {
      return posA - posB;
    }
    if (posA !== undefined) return -1; // A has position -> earlier
    if (posB !== undefined) return 1;  // B has position -> earlier
    
    // 3. alphabetic fallback
    return a.localeCompare(b);
  });
}

async function collectPagesRecursively(dirAbs, contentRootAbs, updateTitles = false) {
  const pages = [];
  const stack = [dirAbs];

  while (stack.length) {
    const cur = stack.pop();
    const entries = await listDir(cur);

    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (
        e.isFile() &&
        MARKDOWN_EXTS.has(path.extname(e.name).toLowerCase())
      ) {
        const pagePath = pagePathFromFile(contentRootAbs, full);
        pages.push(pagePath);
        
        // If updateTitles enabled, update English page title
        if (updateTitles) {
          await updateEnglishPageTitle(full, updateTitles);
        }
      }
    }
  }

  return sortPages(pages, contentRootAbs);
}

/* ===================== Core logic ===================== */

async function buildNavigationForLanguage(language, docs, contentRootAbs, updateTitles = false) {
  const langAbs = path.join(contentRootAbs, language);
  const products = [];

  const productDirs = (await listDir(langAbs)).filter((e) => e.isDirectory());

  for (const productDir of productDirs) {
    const productSlug = productDir.name;
    const productAbs = path.join(langAbs, productSlug);

    const productName = toDisplayName(productSlug, language);
    const tabs = [];

    const tabDirs = (await listDir(productAbs)).filter((e) =>
      e.isDirectory()
    );

    for (const tabDir of tabDirs) {
      const tabSlug = tabDir.name;
      const tabAbs = path.join(productAbs, tabSlug);

      const tabName = toDisplayName(tabSlug, language);
      const groups = [];
      const defaultPages = [];

      const children = await listDir(tabAbs);

      for (const child of children) {
        const childAbs = path.join(tabAbs, child.name);

        if (child.isDirectory()) {
          const groupName = toDisplayName(child.name, language);
          const pages = await collectPagesRecursively(
            childAbs,
            contentRootAbs,
            updateTitles
          );
          if (pages.length) groups.push({ group: groupName, pages });
        } else if (
          child.isFile() &&
          MARKDOWN_EXTS.has(path.extname(child.name).toLowerCase())
        ) {
          const filePath = pagePathFromFile(contentRootAbs, childAbs);
          defaultPages.push(filePath);
          
          // If updateTitles enabled, update English page title
          if (updateTitles) {
            await updateEnglishPageTitle(childAbs, updateTitles);
          }
        }
      }

      if (!groups.length && !defaultPages.length) continue;

      const tabNode = { tab: tabName, tabSlug: tabSlug, groups: [] };

      if (defaultPages.length) {
        tabNode.groups.push({
          group:
            DEFAULT_GROUP_NAME_BY_LANGUAGE[language] ?? "Default",
          pages: await sortPages(defaultPages, contentRootAbs),
        });
      }

      tabNode.groups.push(
        ...groups.sort((a, b) =>
          a.group.localeCompare(b.group)
        )
      );

      tabs.push(tabNode);
    }

    // ⭐ Sort tabs according to configuration
    if (tabs.length) {
      const tabOrder = TAB_ORDER_BY_PRODUCT[productSlug] || [];
      
      // create a map from tab slug to configured index
      const tabOrderMap = new Map();
      tabOrder.forEach((slug, index) => {
        tabOrderMap.set(slug, index);
      });

      tabs.sort((a, b) => {
        const orderA = tabOrderMap.get(a.tabSlug);
        const orderB = tabOrderMap.get(b.tabSlug);
        
        // if both configured, sort by configured order
        if (orderA !== undefined && orderB !== undefined) {
          return orderA - orderB;
        }
        // if only A configured, A first
        if (orderA !== undefined) {
          return -1;
        }
        // if only B configured, B first
        if (orderB !== undefined) {
          return 1;
        }
        // otherwise alphabetic by slug
        return a.tabSlug.localeCompare(b.tabSlug);
      });
      
      // After sorting, remove tabSlug, keep tab (display name) for output
      tabs.forEach(tab => delete tab.tabSlug);

      products.push({
        product: productName,
        tabs,
      });
    }
  }

  // Get existing config (if any), but exclude products and navbar which are generated by the script
  const existingConfig = docs.navigation?.languages?.find((l) => l.language === language) ?? {};
  const { products: _, navbar: __, ...restConfig } = existingConfig;
  
  return {
    ...restConfig, // keep other config (e.g., default)
    language,
    // add per-language navbar (array format)
    navbar: NAVBAR_ARRAY_BY_LANGUAGE[language] ?? NAVBAR_ARRAY_BY_LANGUAGE.en,
    products, // newly generated products with updated display names
  };
}

async function resolveLanguages({ docs, contentRootAbs, languagesArg }) {
  if (languagesArg) {
    return languagesArg.split(",").map((l) => l.trim());
  }

  const fromDocs =
    docs.navigation?.languages?.map((l) => l.language) ?? [];
  if (fromDocs.length) return fromDocs;

  const root = await listDir(contentRootAbs);
  return root.filter((e) => e.isDirectory()).map((e) => e.name);
}

/* ===================== main ===================== */

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const docsAbs = path.resolve(args.docs);
  const contentRootAbs = path.resolve(args.contentRoot);

  const docs = JSON.parse(await fs.readFile(docsAbs, "utf8"));
  const languages = await resolveLanguages({
    docs,
    contentRootAbs,
    languagesArg: args.languages,
  });

  const languageNodes = [];
  for (const lang of languages) {
    const stat = await fs
      .stat(path.join(contentRootAbs, lang))
      .catch(() => null);
    if (!stat?.isDirectory()) continue;

    languageNodes.push(
      await buildNavigationForLanguage(lang, docs, contentRootAbs, args.updateTitles)
    );
  }

  docs.navigation ??= {};
  docs.navigation.languages = languageNodes;

  // Note: navbar is configured per-language; if Mintlify doesn't support it,
  // fall back to global navbar (default language)
  if (!docs.navbar) {
    const defaultLang =
      languageNodes.find((l) => l.default)?.language ??
      languageNodes[0]?.language ??
      "en";
    docs.navbar = NAVBAR_BY_LANGUAGE[defaultLang] ?? NAVBAR_BY_LANGUAGE.en;
  }

  // ⭐ Site custom CSS entry (for fonts/sidebar emphasis etc)
  // If docs.json already configures css, do not override
  if (!docs.css) {
    // Note: this project's static assets path is /public/xxx (e.g., /public/styles.css)
    docs.css = "/public/styles.css";
  }

  if (args.dryRun) {
    console.log(JSON.stringify(languageNodes, null, 2));
    return;
  }

  await fs.writeFile(
    docsAbs,
    JSON.stringify(docs, null, 2) + "\n"
  );
  console.log(`✅ docs.json navigation updated`);
  
  if (args.updateTitles) {
    console.log(`✅ English page titles updated`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
