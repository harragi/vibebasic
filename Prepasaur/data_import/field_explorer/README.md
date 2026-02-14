# Field Explorer - IPEDS Mapping Portal

Browser-based portal to visualize and edit taxonomy field -> DDL column -> IPEDS source mappings.

## Quick Start

```bash
cd data_import/field_explorer

# Install Flask if needed
pip install flask

# Generate initial mappings (one-time)
python seed_mappings.py

# Start the server
python app.py
```

Open http://localhost:5555

## Features

- **Dashboard**: All 142 taxonomy fields grouped by 13 categories, with data source badges and mapping status
- **Schema view**: All `di_*` tables with columns, types, and taxonomy field associations
- **Edit mode**: Click "Edit" on any field to modify its IPEDS source, DDL target, transformation, or notes
- **Search**: Filter fields across all categories by name, IPEDS column, or DDL column
- **Export**: Download `field_mappings.json` with all modifications

## Files

| File | Purpose |
|------|---------|
| `app.py` | Flask server with API endpoints |
| `seed_mappings.py` | Generates `field_mappings.json` from existing sources |
| `field_mappings.json` | Persisted mapping state (generated, then user-edited) |
| `static/index.html` | Single-page HTML shell |
| `static/styles.css` | Styling |
| `static/app.js` | Vanilla JS - dashboard, schema view, edit drawer |

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Serve index.html |
| GET | `/api/taxonomy` | All fields from categories_v2.json by category |
| GET | `/api/schema` | All di_* tables + columns from DDL SQL files |
| GET | `/api/mappings` | Current field_mappings.json |
| PUT | `/api/mappings/<field_key>` | Update one field's mapping |
| GET | `/api/ipeds-tables` | Known IPEDS survey tables |
| GET | `/api/export` | Download field_mappings.json |
