// ============================================================================
// Field Explorer - app.js
// Vanilla JS single-page application
// ============================================================================

(function () {
    "use strict";

    // ---- State ----
    let mappings = {};        // field_mappings.json content
    let schema = {};          // DDL tables + columns
    let ipedsTables = {};     // IPEDS table name map
    let activeCategory = null;
    let activeFieldKey = null;
    let searchTerm = "";
    let filterModified = false;

    // ---- DOM refs ----
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // ---- Init ----
    async function init() {
        const [mappingsRes, schemaRes, ipedsRes] = await Promise.all([
            fetch("/api/mappings").then((r) => r.json()),
            fetch("/api/schema").then((r) => r.json()),
            fetch("/api/ipeds-tables").then((r) => r.json()),
        ]);

        mappings = mappingsRes;
        schema = schemaRes;
        ipedsTables = ipedsRes;

        renderSidebar();
        updateStats();
        setupEventListeners();

        // Select first category
        const cats = getCategories();
        if (cats.length > 0) {
            selectCategory(cats[0]);
        }
    }

    // ---- Helpers ----
    function getFields() {
        return mappings.fields || {};
    }

    function getCategories() {
        const cats = new Set();
        for (const f of Object.values(getFields())) {
            cats.add(f.category);
        }
        return [...cats].sort();
    }

    function getCategoryFields(cat) {
        return Object.entries(getFields()).filter(([, f]) => f.category === cat);
    }

    function formatCategoryName(name) {
        return name
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    }

    function getSourceBadgeClass(source) {
        const s = (source || "").toLowerCase();
        if (s === "ipeds") return "badge-ipeds";
        if (s === "cds") return "badge-cds";
        if (s.includes("llm")) return "badge-llm";
        if (s === "scorecard") return "badge-scorecard";
        if (s.includes("athletics")) return "badge-athletics";
        if (s === "safety") return "badge-safety";
        if (s === "smi") return "badge-smi";
        return "badge-llm";
    }

    function getStatusBadgeClass(status) {
        const s = (status || "").toLowerCase().replace(/\s+/g, "-");
        if (s === "fully-mapped") return "status-fully-mapped";
        if (s === "ddl-only") return "status-ddl-only";
        if (s === "unmapped") return "status-unmapped";
        if (s === "non-ipeds-source") return "status-non-ipeds";
        return "status-non-ipeds";
    }

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str || "";
        return div.innerHTML;
    }

    // ---- Sidebar ----
    function renderSidebar() {
        const list = $("#category-list");
        const cats = getCategories();
        const fields = getFields();

        // Count fields per category and coverage
        const catStats = {};
        for (const [, f] of Object.entries(fields)) {
            if (!catStats[f.category]) {
                catStats[f.category] = { total: 0, mapped: 0 };
            }
            catStats[f.category].total++;
            if (f.mapping_status === "Fully Mapped" || f.mapping_status === "DDL Only") {
                catStats[f.category].mapped++;
            }
        }

        list.innerHTML = cats
            .map((cat) => {
                const stats = catStats[cat] || { total: 0, mapped: 0 };
                return `<button class="cat-btn" data-category="${cat}">
                    <span class="cat-name">${formatCategoryName(cat)}</span>
                    <span class="cat-badge">${stats.total}</span>
                </button>`;
            })
            .join("");
    }

    function selectCategory(cat) {
        activeCategory = cat;

        // Update sidebar active state
        $$(".cat-btn").forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.category === cat);
        });

        // Update header
        $("#current-category-title").textContent = formatCategoryName(cat);

        renderFieldTable();
    }

    // ---- Field table ----
    function renderFieldTable() {
        if (!activeCategory) return;

        let entries = getCategoryFields(activeCategory);

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            entries = entries.filter(
                ([key, f]) =>
                    f.display_name.toLowerCase().includes(term) ||
                    f.field_name.toLowerCase().includes(term) ||
                    key.toLowerCase().includes(term) ||
                    (f.ipeds_column || "").toLowerCase().includes(term) ||
                    (f.ddl_column || "").toLowerCase().includes(term)
            );
        }

        // Apply modified filter
        if (filterModified) {
            entries = entries.filter(([, f]) => f.modified);
        }

        $("#field-count").textContent = `${entries.length} field${entries.length !== 1 ? "s" : ""}`;

        const tbody = $("#field-table-body");

        if (entries.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7">
                <div class="empty-state">
                    <h3>No fields found</h3>
                    <p>${filterModified ? "No modified fields in this category." : "Try a different search term."}</p>
                </div>
            </td></tr>`;
            return;
        }

        tbody.innerHTML = entries
            .map(([key, f]) => {
                const modified = f.modified ? " modified" : "";
                const statusClass = f.modified
                    ? "status-modified"
                    : getStatusBadgeClass(f.mapping_status);
                const statusText = f.modified ? "Modified" : f.mapping_status;

                return `<tr class="${modified}" data-key="${escapeHtml(key)}">
                    <td>
                        <div style="font-weight:500">${escapeHtml(f.display_name)}</div>
                        <div style="font-size:11px;color:var(--text-muted)">${escapeHtml(f.field_name)}</div>
                    </td>
                    <td><span class="badge ${getSourceBadgeClass(f.data_source)}">${escapeHtml(f.data_source)}</span></td>
                    <td class="ddl-target">${f.ddl_table ? escapeHtml(f.ddl_table) + "." + escapeHtml(f.ddl_column) : "<span style='color:var(--text-muted)'>--</span>"}</td>
                    <td class="ipeds-source">${f.ipeds_table ? escapeHtml(f.ipeds_table) + "." + escapeHtml(f.ipeds_column) : "<span style='color:var(--text-muted)'>--</span>"}</td>
                    <td><div class="transformation-text" title="${escapeHtml(f.transformation)}">${escapeHtml(f.transformation) || "--"}</div></td>
                    <td><span class="status-badge ${statusClass}">${escapeHtml(statusText)}</span></td>
                    <td><button class="btn-edit" data-key="${escapeHtml(key)}">Edit</button></td>
                </tr>`;
            })
            .join("");
    }

    // ---- Stats ----
    function updateStats() {
        const fields = getFields();
        const entries = Object.values(fields);
        const total = entries.length;
        const mapped = entries.filter(
            (f) => f.mapping_status === "Fully Mapped" || f.mapping_status === "DDL Only"
        ).length;
        const modified = entries.filter((f) => f.modified).length;
        const gaps = entries.filter(
            (f) => f.mapping_status === "Unmapped"
        ).length;

        $("#stat-total").textContent = `${total} fields`;
        $("#stat-mapped").textContent = `${mapped} mapped`;
        $("#stat-modified").textContent = `${modified} modified`;
        $("#stat-gaps").textContent = `${gaps} gaps`;
    }

    // ---- Edit drawer ----
    function openDrawer(fieldKey) {
        activeFieldKey = fieldKey;
        const field = getFields()[fieldKey];
        if (!field) return;

        const drawer = $("#edit-drawer");

        // Title
        $("#drawer-title").textContent = field.display_name;

        // Field info
        $("#drawer-field-info").innerHTML = `
            <div class="info-row"><span class="info-label">Key:</span> <span>${escapeHtml(fieldKey)}</span></div>
            <div class="info-row"><span class="info-label">Type:</span> <span>${escapeHtml(field.type)} (${escapeHtml(field.cardinality)})</span></div>
            <div class="info-row"><span class="info-label">Source:</span> <span>${escapeHtml(field.data_source)}</span></div>
            ${field.ddl_enum_type ? `<div class="info-row"><span class="info-label">Enum:</span> <span style="font-family:monospace;font-size:12px">${escapeHtml(field.ddl_enum_type)}</span></div>` : ""}
            ${field.values && field.values.length > 0 ? `<div class="info-row"><span class="info-label">Values:</span> <span style="font-size:12px">${field.values.length} options</span></div>` : ""}
        `;

        // Populate IPEDS table dropdown
        const ipedsSelect = $("#edit-ipeds-table");
        ipedsSelect.innerHTML =
            '<option value="">-- Select --</option>' +
            Object.entries(ipedsTables)
                .map(
                    ([code, name]) =>
                        `<option value="${code}" ${code === field.ipeds_table ? "selected" : ""}>${code} - ${name}</option>`
                )
                .join("");

        // IPEDS column
        $("#edit-ipeds-column").value = field.ipeds_column || "";

        // DDL table dropdown
        const ddlTableSelect = $("#edit-ddl-table");
        const tableNames = Object.keys(schema).sort();
        ddlTableSelect.innerHTML =
            '<option value="">-- Select --</option>' +
            tableNames
                .map(
                    (t) =>
                        `<option value="${t}" ${t === field.ddl_table ? "selected" : ""}>${t}</option>`
                )
                .join("");

        // DDL column dropdown (populated based on selected table)
        populateDdlColumns(field.ddl_table, field.ddl_column);

        // Transformation + notes
        $("#edit-transformation").value = field.transformation || "";
        $("#edit-notes").value = field.notes || "";

        drawer.classList.add("open");
    }

    function populateDdlColumns(tableName, selectedColumn) {
        const ddlColSelect = $("#edit-ddl-column");
        if (!tableName || !schema[tableName]) {
            ddlColSelect.innerHTML = '<option value="">-- Select table first --</option>';
            return;
        }
        const cols = schema[tableName];
        ddlColSelect.innerHTML =
            '<option value="">-- Select --</option>' +
            cols
                .map(
                    (c) =>
                        `<option value="${c.name}" ${c.name === selectedColumn ? "selected" : ""}>${c.name} (${c.type})</option>`
                )
                .join("");
    }

    function closeDrawer() {
        $("#edit-drawer").classList.remove("open");
        activeFieldKey = null;
    }

    async function saveField() {
        if (!activeFieldKey) return;

        const updates = {
            ipeds_table: $("#edit-ipeds-table").value,
            ipeds_column: $("#edit-ipeds-column").value,
            ddl_table: $("#edit-ddl-table").value,
            ddl_column: $("#edit-ddl-column").value,
            transformation: $("#edit-transformation").value,
            notes: $("#edit-notes").value,
        };

        // Determine new mapping status
        if (updates.ddl_table && updates.ipeds_column) {
            updates.mapping_status = "Fully Mapped";
        } else if (updates.ddl_table) {
            updates.mapping_status = "DDL Only";
        }

        const res = await fetch(`/api/mappings/${activeFieldKey}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });

        if (res.ok) {
            const updated = await res.json();
            mappings.fields[activeFieldKey] = updated;
            renderFieldTable();
            updateStats();
            closeDrawer();
        }
    }

    // ---- Schema view ----
    function renderSchema() {
        const content = $("#schema-content");
        const tables = Object.entries(schema).sort(([a], [b]) => a.localeCompare(b));

        const fields = getFields();
        // Build reverse map: table.column -> field key
        const colToField = {};
        for (const [key, f] of Object.entries(fields)) {
            if (f.ddl_table && f.ddl_column) {
                colToField[`${f.ddl_table}.${f.ddl_column}`] = key;
            }
        }

        content.innerHTML =
            `<h2>Database Schema (${tables.length} tables)</h2>` +
            tables
                .map(([tableName, cols]) => {
                    const mappedCount = cols.filter(
                        (c) => colToField[`${tableName}.${c.name}`]
                    ).length;

                    return `<div class="schema-table" data-table="${tableName}">
                        <div class="schema-table-header">
                            <div>
                                <h3>${tableName}</h3>
                                <span class="col-count">${cols.length} columns, ${mappedCount} mapped</span>
                            </div>
                            <span class="chevron">&#9654;</span>
                        </div>
                        <div class="schema-table-body">
                            ${cols
                                .map((c) => {
                                    const fieldKey = colToField[`${tableName}.${c.name}`];
                                    const fieldData = fieldKey ? fields[fieldKey] : null;

                                    let colClass = "raw";
                                    let tag = "";
                                    if (fieldData) {
                                        colClass = "mapped";
                                        tag = `<span class="badge badge-ipeds schema-col-tag">${escapeHtml(fieldData.display_name)}</span>`;
                                    } else if (
                                        c.name.endsWith("_at") ||
                                        c.name === "survey_year" ||
                                        c.name === "created_at" ||
                                        c.name === "updated_at" ||
                                        c.name === "id"
                                    ) {
                                        colClass = "metadata";
                                    }

                                    return `<div class="schema-col ${colClass}">
                                        <span class="schema-col-name">${escapeHtml(c.name)}</span>
                                        <span class="schema-col-type">${escapeHtml(c.type)}</span>
                                        <span class="schema-col-comment">${escapeHtml(c.comment)}</span>
                                        ${tag}
                                    </div>`;
                                })
                                .join("")}
                        </div>
                    </div>`;
                })
                .join("");
    }

    // ---- Event listeners ----
    function setupEventListeners() {
        // Tab switching
        $$(".tab-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const tab = btn.dataset.tab;
                $$(".tab-btn").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                $$(".view").forEach((v) => v.classList.remove("active"));
                $(`#view-${tab}`).classList.add("active");

                if (tab === "schema") {
                    renderSchema();
                }
            });
        });

        // Category selection
        $("#category-list").addEventListener("click", (e) => {
            const btn = e.target.closest(".cat-btn");
            if (btn) {
                selectCategory(btn.dataset.category);
            }
        });

        // Edit button click
        $("#field-table-body").addEventListener("click", (e) => {
            const btn = e.target.closest(".btn-edit");
            if (btn) {
                openDrawer(btn.dataset.key);
            }
        });

        // Drawer close
        $("#drawer-close").addEventListener("click", closeDrawer);
        $("#btn-cancel").addEventListener("click", closeDrawer);

        // Save
        $("#btn-save").addEventListener("click", saveField);

        // DDL table change -> repopulate columns
        $("#edit-ddl-table").addEventListener("change", (e) => {
            populateDdlColumns(e.target.value, "");
        });

        // Search
        let searchTimeout;
        $("#search-input").addEventListener("input", (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchTerm = e.target.value.trim();

                // If searching, find the best category or search across all
                if (searchTerm) {
                    // Search across all categories, show results in current category view
                    // or switch to the category with most hits
                    const allFields = Object.entries(getFields());
                    const term = searchTerm.toLowerCase();
                    const matches = allFields.filter(
                        ([key, f]) =>
                            f.display_name.toLowerCase().includes(term) ||
                            f.field_name.toLowerCase().includes(term) ||
                            key.toLowerCase().includes(term) ||
                            (f.ipeds_column || "").toLowerCase().includes(term) ||
                            (f.ddl_column || "").toLowerCase().includes(term)
                    );

                    if (matches.length > 0) {
                        // Find category with most matches
                        const catCounts = {};
                        for (const [, f] of matches) {
                            catCounts[f.category] = (catCounts[f.category] || 0) + 1;
                        }
                        const bestCat = Object.entries(catCounts).sort(
                            ([, a], [, b]) => b - a
                        )[0][0];

                        if (bestCat !== activeCategory) {
                            selectCategory(bestCat);
                        } else {
                            renderFieldTable();
                        }
                    } else {
                        renderFieldTable();
                    }
                } else {
                    renderFieldTable();
                }
            }, 200);
        });

        // Modified filter
        $("#filter-modified").addEventListener("change", (e) => {
            filterModified = e.target.checked;
            renderFieldTable();
        });

        // Export
        $("#btn-export").addEventListener("click", () => {
            window.location.href = "/api/export";
        });

        // Schema accordion
        $("#schema-content").addEventListener("click", (e) => {
            const header = e.target.closest(".schema-table-header");
            if (header) {
                header.parentElement.classList.toggle("open");
            }
        });

        // Close drawer on Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeDrawer();
        });
    }

    // ---- Start ----
    document.addEventListener("DOMContentLoaded", init);
})();
