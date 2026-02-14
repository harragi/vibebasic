#!/usr/bin/env python3
"""
Field Explorer - Browser-based IPEDS mapping portal.

A Flask app to visualize and edit taxonomy field -> DDL column -> IPEDS source mappings.

Run:
    python app.py
    Open http://localhost:5555
"""

import json
import re
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
APP_DIR = Path(__file__).resolve().parent
DATA_IMPORT_DIR = APP_DIR.parent
TAXONOMY_PATH = DATA_IMPORT_DIR / "reference" / "categories_v2.json"
SCHEMA_DIR = DATA_IMPORT_DIR / "schema"
MAPPINGS_PATH = APP_DIR / "field_mappings.json"
STATIC_DIR = APP_DIR / "static"

# ---------------------------------------------------------------------------
# Flask app
# ---------------------------------------------------------------------------
app = Flask(__name__, static_folder=str(STATIC_DIR))


# ---------------------------------------------------------------------------
# Data loading helpers
# ---------------------------------------------------------------------------

def load_taxonomy() -> dict:
    """Load categories_v2.json."""
    with open(TAXONOMY_PATH) as f:
        return json.load(f)


def load_mappings() -> dict:
    """Load field_mappings.json."""
    with open(MAPPINGS_PATH) as f:
        return json.load(f)


def save_mappings(data: dict) -> None:
    """Save field_mappings.json."""
    with open(MAPPINGS_PATH, "w") as f:
        json.dump(data, f, indent=2)


def parse_ddl_files() -> dict[str, list[dict]]:
    """Parse DDL SQL files and return {table_name: [{name, type, comment}, ...]}."""
    tables: dict[str, list[dict]] = {}
    sql_files = sorted(SCHEMA_DIR.glob("0[0-1][0-9]_*.sql"))

    table_re = re.compile(r"CREATE\s+TABLE\s+(\w+)\s*\(", re.IGNORECASE)
    # Match column: name, type (possibly with params), then optional comma and comment
    column_re = re.compile(
        r"^\s+(\w+)\s+((?:SERIAL|INTEGER|TEXT|BOOLEAN|NUMERIC|BIGINT|CHAR|TIMESTAMPTZ|di_\w+)"
        r"(?:\([^)]*\))?)",
        re.IGNORECASE,
    )
    comment_re = re.compile(r"--\s*(.*)")

    for sql_file in sql_files:
        content = sql_file.read_text()
        current_table: str | None = None

        for line in content.splitlines():
            table_match = table_re.search(line)
            if table_match:
                current_table = table_match.group(1).lower()
                tables.setdefault(current_table, [])
                continue

            if current_table and line.strip().startswith(")"):
                current_table = None
                continue

            if current_table:
                col_match = column_re.match(line)
                if col_match:
                    col_name = col_match.group(1).lower()
                    col_type = col_match.group(2).strip()
                    if col_name in ("unique", "primary", "foreign", "check",
                                    "constraint", "references", "default"):
                        continue

                    # Extract inline comment
                    comment = ""
                    cm = comment_re.search(line)
                    if cm:
                        comment = cm.group(1).strip()

                    tables[current_table].append({
                        "name": col_name,
                        "type": col_type,
                        "comment": comment,
                    })

    return tables


# ---------------------------------------------------------------------------
# IPEDS table names (from ipeds_schema.py)
# ---------------------------------------------------------------------------
IPEDS_TABLE_NAME_MAP = {
    "HD": "Institutional Characteristics Header",
    "IC": "Institutional Characteristics",
    "IC_AY": "Academic Year Charges",
    "DRVIC": "Derived Institutional Characteristics",
    "ADM": "Admissions",
    "DRVADM": "Derived Admissions",
    "EF": "Enrollment",
    "DRVEF": "Derived Enrollment",
    "EFDE": "Distance Education Enrollment",
    "GR": "Graduation Rates",
    "OM": "Outcome Measures",
    "DRVGR": "Derived Graduation Rates",
    "SFA": "Student Financial Aid",
    "SFAV": "Student Financial Aid Veterans",
    "DRVSFA": "Derived Student Financial Aid",
    "C": "Completions",
    "DRVC": "Derived Completions",
    "S": "Staff",
    "SAL": "Salaries",
    "HR": "Human Resources",
    "F": "Finance",
}


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/")
def index():
    """Serve index.html."""
    return send_from_directory(str(STATIC_DIR), "index.html")


@app.route("/api/taxonomy")
def api_taxonomy():
    """Return all taxonomy fields grouped by category."""
    taxonomy = load_taxonomy()
    categories = taxonomy.get("categories", {})

    result = {}
    for cat_name, fields in categories.items():
        result[cat_name] = {
            "field_count": len(fields),
            "fields": {},
        }
        for field_name, field_def in fields.items():
            result[cat_name]["fields"][field_name] = {
                "display_name": field_def.get("display_name", field_name),
                "type": field_def.get("type", ""),
                "cardinality": field_def.get("cardinality", ""),
                "data_source": field_def.get("data_source", ""),
                "nullable": field_def.get("nullable", True),
                "values": field_def.get("values", []),
            }

    return jsonify(result)


@app.route("/api/schema")
def api_schema():
    """Return all di_* tables and their columns parsed from DDL SQL files."""
    tables = parse_ddl_files()

    # Also build a reverse lookup: which taxonomy field maps to which column
    mappings = load_mappings()
    col_to_field: dict[str, str] = {}
    for field_key, field_data in mappings.get("fields", {}).items():
        if field_data.get("ddl_table") and field_data.get("ddl_column"):
            key = f"{field_data['ddl_table']}.{field_data['ddl_column']}"
            col_to_field[key] = field_key

    result = {}
    for table_name, columns in sorted(tables.items()):
        result[table_name] = []
        for col in columns:
            col_key = f"{table_name}.{col['name']}"
            result[table_name].append({
                **col,
                "taxonomy_field": col_to_field.get(col_key, ""),
            })

    return jsonify(result)


@app.route("/api/mappings")
def api_mappings():
    """Return current field_mappings.json."""
    return jsonify(load_mappings())


@app.route("/api/mappings/<path:field_key>", methods=["PUT"])
def api_update_mapping(field_key: str):
    """Update one field's mapping."""
    data = load_mappings()
    fields = data.get("fields", {})

    if field_key not in fields:
        return jsonify({"error": f"Field '{field_key}' not found"}), 404

    updates = request.get_json()
    if not updates:
        return jsonify({"error": "No JSON body"}), 400

    # Only allow updating specific fields
    allowed = {
        "ipeds_table", "ipeds_column", "ddl_table", "ddl_column",
        "transformation", "notes", "mapping_status",
    }
    for key, value in updates.items():
        if key in allowed:
            fields[field_key][key] = value

    fields[field_key]["modified"] = True
    save_mappings(data)

    return jsonify(fields[field_key])


@app.route("/api/ipeds-tables")
def api_ipeds_tables():
    """Return known IPEDS survey tables."""
    return jsonify(IPEDS_TABLE_NAME_MAP)


@app.route("/api/export")
def api_export():
    """Download field_mappings.json."""
    data = load_mappings()
    response = app.response_class(
        response=json.dumps(data, indent=2),
        mimetype="application/json",
        headers={"Content-Disposition": "attachment; filename=field_mappings.json"},
    )
    return response


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    if not MAPPINGS_PATH.exists():
        print("field_mappings.json not found. Run seed_mappings.py first.")
        print("  python seed_mappings.py")
        raise SystemExit(1)

    print(f"Field Explorer starting on http://localhost:5555")
    print(f"  Taxonomy: {TAXONOMY_PATH}")
    print(f"  Schema:   {SCHEMA_DIR}")
    print(f"  Mappings: {MAPPINGS_PATH}")
    app.run(host="127.0.0.1", port=5555, debug=True)
